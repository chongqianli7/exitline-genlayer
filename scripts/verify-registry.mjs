import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {success} from '../src/util.js';
// Read-only reviewer check for the public-registry milestone. No account, no writes, no keys.
const dep=JSON.parse(fs.readFileSync('public/deployment.json'));
const ev=JSON.parse(fs.readFileSync('evidence/registry-evidence.json'));
const source=fs.readFileSync('contracts/exitline.py','utf8');
const client=createClient({chain:studionet});
let pass=0,fail=0;
function check(name,ok){console.log((ok?'PASS ':'FAIL ')+name);if(ok)pass++;else fail++;}
const deployed=await client.getContractCode(dep.address);
check('byte parity: deployed code == local contracts/exitline.py',deployed===source);
check('source SHA == deployment.json',createHash('sha256').update(source).digest('hex')===dep.sourceSha256);
check('protocol exitline-1',await client.readContract({address:dep.address,functionName:'get_protocol',args:[],transactionHashVariant:'latest-final'})==='exitline-1');
for(const t of ev.transactions){
 const tx=await client.waitForTransactionReceipt({hash:t.hash,status:'FINALIZED',interval:5000,retries:10,fullTransaction:true});
 const expected=t.execution_result.every(e=>e.execution_result==='SUCCESS');
 check(t.label+' '+t.hash.slice(0,10)+'… FINALIZED + expected execution',success(tx)===expected);
}
for(const id of ['editorial-open','support-open']){
 const m=JSON.parse(await client.readContract({address:dep.address,functionName:'get_model',args:[ev.owner,id],transactionHashVariant:'latest-final'}));
 check('model '+id+' published NONBLOCKING',m.published===true&&m.status==='NONBLOCKING');
}
const list=JSON.parse(await client.readContract({address:dep.address,functionName:'list_registry',args:[],transactionHashVariant:'latest-final'}));
check('registry lists 2 models in order',list.length===2&&list[0].id==='editorial-open'&&list[1].id==='support-open');
check('registry entries match evidence',JSON.stringify(list)===JSON.stringify(ev.registry));
for(const [id,j] of Object.entries(ev.journeys)){
 const raw=await client.readContract({address:dep.address,functionName:'get_journey',args:[ev.owner,id,ev.walker],transactionHashVariant:'latest-final'});
 const live=JSON.parse(raw);
 check('journey '+id+' complete at terminal',live.complete===true&&live.state===j.state&&live.step===j.step);
}
console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
