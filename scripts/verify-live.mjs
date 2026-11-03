import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createClient,createAccount,generatePrivateKey} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {states,actions,title,trapped,repaired,uncertain} from '../src/fixtures.js';
import {success} from '../src/util.js';
fs.mkdirSync('.private',{recursive:true});const file='.private/network.json';
const s=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{key:generatePrivateKey(),steps:{},records:[]};
const account=createAccount(s.key), client=createClient({chain:studionet,account}),owner=account.address.toLowerCase();
const source=fs.readFileSync('contracts/exitline.py','utf8'),sourceSha256=createHash('sha256').update(source).digest('hex');
function save(){fs.writeFileSync(file,JSON.stringify(s));fs.writeFileSync('evidence/studionet.json',JSON.stringify({network:61999,protocol:'exitline-1',owner,address:s.address,sourceSha256,fixture:'Authored editorial workflow. One zero-balance temporary test signer. Abstract model; no real document processing.',steps:s.steps,records:s.records,journey:s.journey},null,2));}
async function step(label,method,args,expected=true){if(s.steps[label]?.done)return;let p=s.steps[label];if(!p){if(await client.getChainId()!==61999)throw Error('WRONG_CHAIN');if(BigInt(await client.request({method:'eth_gasPrice',params:[]}))!==0n)throw Error('NONZERO_GAS');s.steps[label]={sending:true,method,args};save();const hash=method==='deploy'?await client.deployContract({code:source,args:[],value:0n,leaderOnly:false}):await client.writeContract({address:s.address,functionName:method,args,value:0n,leaderOnly:false});p=s.steps[label]={hash,method,args};save();console.log(label,hash);}if(!p.hash)throw Error('Unknown original send outcome; inspect first');let tx;for(let i=0;i<12;i++){try{tx=await client.waitForTransactionReceipt({hash:p.hash,status:'FINALIZED',interval:4000,retries:10,fullTransaction:true});break;}catch(e){console.log(label,'tracking',i,e.shortMessage||e.message);}}if(!tx)throw Error('Pending hash; resume tracking');p.receipt=tx;save();if(success(tx)!==expected)throw Error('Unexpected execution '+label);if(method==='deploy'){s.address=tx.data?.contract_address||tx.contract_address;if(!s.address)throw Error('No contract');if(await client.getContractCode(s.address)!==source)throw Error('SOURCE_MISMATCH');}p.done=true;save();console.log(label,'verified');}
async function read(id){return JSON.parse(await client.readContract({address:s.address,functionName:'get_model',args:[owner,id],transactionHashVariant:'latest-final'}));}
const args=(id,rules)=>[id,title,JSON.stringify(states),JSON.stringify(actions),3,rules];
await step('01-deploy','deploy',[]);
await step('02-trapped-analysis','analyze',args('editorial-trap',trapped));let trap=await read('editorial-trap');if(trap.status!=='TRAPPED'||trap.analysis.witness.join(',')!=='0,1')throw Error('No correct trap witness');s.records=[trap];save();
await step('03-trapped-publication-denied','publish',[trap.id,trap.digest],false);
await step('04-repaired-analysis','analyze',args('editorial-open',repaired));let open=await read('editorial-open');if(open.status!=='NONBLOCKING')throw Error('Repair not nonblocking');s.records=[trap,open];save();
await step('05-publish','publish',[open.id,open.digest]);open=await read(open.id);s.records=[trap,open];save();
await step('06-forbidden-action-denied','advance',[owner,open.id,0,1],false);
await step('07-draft-to-review','advance',[owner,open.id,0,0]);
await step('08-review-to-done','advance',[owner,open.id,1,0]);
s.journey=JSON.parse(await client.readContract({address:s.address,functionName:'get_journey',args:[owner,open.id,owner],transactionHashVariant:'latest-final'}));if(!s.journey.complete||s.journey.state!==3)throw Error('Journey not complete');save();
await step('09-uncertain-analysis','analyze',args('editorial-unclear',uncertain));const review=await read('editorial-unclear');if(review.status!=='REVIEW')throw Error('Missing rule not REVIEW');s.records=[trap,open,review];save();
await step('10-uncertain-publication-denied','publish',[review.id,review.digest],false);
fs.writeFileSync('public/deployment.json',JSON.stringify({network:61999,address:s.address,owner,id:open.id,trapId:trap.id,reviewId:review.id,sourceSha256},null,2));console.log('COMPLETE',s.address);
