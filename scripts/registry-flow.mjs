import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createClient,createAccount,generatePrivateKey} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {states,actions,title,trapped,repaired,supportStates,supportActions,supportTitle,supportTrapped,supportRepaired} from '../src/fixtures.js';
import {audit} from '../src/graph.js';
import {success} from '../src/util.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const CHECKPOINT=process.env.EXITLINE_CHECKPOINT||path.join(root,'..','exitline-evidence-work','registry.json');
fs.mkdirSync(path.dirname(CHECKPOINT),{recursive:true});
const s=fs.existsSync(CHECKPOINT)?JSON.parse(fs.readFileSync(CHECKPOINT)):{keyA:generatePrivateKey(),keyB:generatePrivateKey(),steps:{},records:[],registry:[],journeys:{}};
const accountA=createAccount(s.keyA),accountB=createAccount(s.keyB);
const clientA=createClient({chain:studionet,account:accountA}),clientB=createClient({chain:studionet,account:accountB});
const owner=accountA.address.toLowerCase(),walker=accountB.address.toLowerCase();
const source=fs.readFileSync(path.join(root,'contracts','exitline.py'),'utf8'),sourceSha256=createHash('sha256').update(source).digest('hex');
function save(){fs.writeFileSync(CHECKPOINT,JSON.stringify(s),{mode:0o600});}
function slim(tx,label,method,args){
 const raw=tx.consensus_data?.leader_receipt,ls=Array.isArray(raw)?raw:[raw];
 return {label,hash:tx.hash,method,args,status:tx.status,result:tx.result,
  execution_result:ls.filter(Boolean).map(x=>({mode:x.mode,execution_result:x.execution_result})),
  votes:tx.consensus_data?.votes};
}
async function step(label,method,args,expected=true,client=clientA){
 if(s.steps[label]?.done)return s.steps[label];
 let p=s.steps[label];
 if(!p){
  if(await client.getChainId()!==61999)throw Error('WRONG_CHAIN');
  if(BigInt(await client.request({method:'eth_gasPrice',params:[]}))!==0n)throw Error('NONZERO_GAS');
  s.steps[label]={sending:true,method,args};save();
  const hash=method==='deploy'?await client.deployContract({code:source,args:[],value:0n,leaderOnly:false}):await client.writeContract({address:s.address,functionName:method,args,value:0n,leaderOnly:false});
  p=s.steps[label]={hash,method,args};save();console.log(label,hash);
 }
 if(!p.hash)throw Error('Unknown original send outcome; inspect first');
 let tx;
 for(let i=0;i<120;i++){try{tx=await client.waitForTransactionReceipt({hash:p.hash,status:'FINALIZED',interval:5000,retries:10,fullTransaction:true});break;}catch(e){console.log(label,'tracking',i,e.shortMessage||e.message);}}
 if(!tx)throw Error('Pending hash; resume tracking');
 p.receipt=slim(tx,label,method,args);save();
 if(success(tx)!==expected)throw Error('Unexpected execution '+label);
 if(method==='deploy'){s.address=tx.data?.contract_address||tx.contract_address;if(!s.address)throw Error('No contract');if(await client.getContractCode(s.address)!==source)throw Error('SOURCE_MISMATCH');}
 p.done=true;save();console.log(label,'verified');return p;
}
async function readModel(client,id){return JSON.parse(await client.readContract({address:s.address,functionName:'get_model',args:[owner,id],transactionHashVariant:'latest-final'}));}
async function readList(client){return JSON.parse(await client.readContract({address:s.address,functionName:'list_registry',args:[],transactionHashVariant:'latest-final'}));}
async function readJourney(client,id,participant){const raw=await client.readContract({address:s.address,functionName:'get_journey',args:[owner,id,participant],transactionHashVariant:'latest-final'});return raw?JSON.parse(raw):null;}
const edArgs=(id,rules)=>[id,title,JSON.stringify(states),JSON.stringify(actions),3,rules];
const suArgs=(id,rules)=>[id,supportTitle,JSON.stringify(supportStates),JSON.stringify(supportActions),4,rules];
function exitsReplay(record){const a=audit(record.matrix,record.terminal);for(const e of a.exits){let st=e.state;for(const act of e.actions)st=record.matrix[st][act];if(st!==record.terminal)throw Error('Exit does not replay to terminal');}return a;}
await step('01-deploy','deploy',[]);
await step('02-trapped-analysis','analyze',edArgs('editorial-trap',trapped));
let trap=await readModel(clientA,'editorial-trap');if(trap.status!=='TRAPPED'||trap.analysis.witness.join(',')!=='0,1')throw Error('No correct trap witness');s.records=[trap];save();
await step('03-trapped-publication-denied','publish',[trap.id,trap.digest],false);
await step('04-repaired-analysis','analyze',edArgs('editorial-open',repaired));
let open=await readModel(clientA,'editorial-open');if(open.status!=='NONBLOCKING')throw Error('Repair not nonblocking');exitsReplay(open);s.records=[trap,open];save();
await step('05-publish','publish',[open.id,open.digest]);open=await readModel(clientA,'editorial-open');if(!open.published)throw Error('Not published');s.records=[trap,open];save();
await step('06-forbidden-action-denied','advance',[owner,open.id,0,1],false);
await step('07-support-trap-analysis','analyze',suArgs('support-trap',supportTrapped));
let strap=await readModel(clientA,'support-trap');if(strap.status!=='TRAPPED'||strap.analysis.trapped.join(',')!=='3'||strap.analysis.witness.join(',')!=='0,0,1')throw Error('No correct support trap witness');save();
await step('08-support-trap-publication-denied','publish',[strap.id,strap.digest],false);
await step('09-support-analysis','analyze',suArgs('support-open',supportRepaired));
let sopen=await readModel(clientA,'support-open');if(sopen.status!=='NONBLOCKING')throw Error('Support repair not nonblocking');exitsReplay(sopen);save();
await step('10-support-publish','publish',[sopen.id,sopen.digest]);sopen=await readModel(clientA,'support-open');if(!sopen.published)throw Error('Support not published');s.records=[trap,open,strap,sopen];save();
await step('11-register-editorial','register_model',[owner,'editorial-open']);
await step('12-register-support','register_model',[owner,'support-open']);
let list=await readList(clientA);if(list.length!==2||list[0].id!=='editorial-open'||list[1].id!=='support-open')throw Error('Registry list wrong after registration');s.registry=list;save();
await step('13-register-unpublished-denied','register_model',[owner,'support-trap'],false);
await step('14-register-nonowner-denied','register_model',[owner,'editorial-open'],false,clientB);
await step('15-register-again-noop','register_model',[owner,'editorial-open']);
let list2=await readList(clientA);if(JSON.stringify(list2)!==JSON.stringify(list))throw Error('Re-registration changed the registry');save();
await step('16-walk-support-1','advance',[owner,'support-open',0,0],true,clientB);
await step('17-walk-support-2','advance',[owner,'support-open',1,0],true,clientB);
await step('18-walk-support-3','advance',[owner,'support-open',2,0],true,clientB);
let js=await readJourney(clientB,'support-open',walker);if(!js||!js.complete||js.state!==4||js.step!==3)throw Error('Support journey not complete');s.journeys['support-open']=js;save();
await step('19-walk-editorial-1','advance',[owner,'editorial-open',0,0],true,clientB);
await step('20-walk-editorial-2','advance',[owner,'editorial-open',1,0],true,clientB);
let je=await readJourney(clientB,'editorial-open',walker);if(!je||!je.complete||je.state!==3||je.step!==2)throw Error('Editorial journey not complete');s.journeys['editorial-open']=je;save();
const txs=Object.values(s.steps).filter(x=>x.done).map(x=>x.receipt);
const byLabel=l=>txs.filter(t=>t.label===l);
const base={protocol:'exitline-1',network:61999,owner,walker,address:s.address,sourceSha256,fixture:'Authored editorial + support-ticket workflows. Two zero-balance temporary test signers. Abstract models; no real document or ticket processing.'};
const evDir=path.join(root,'evidence');fs.mkdirSync(evDir,{recursive:true});
const write=(name,obj)=>fs.writeFileSync(path.join(evDir,name),JSON.stringify(obj,null,2));
write('registry-regression.json',{...base,records:[trap,open],transactions:[...byLabel('02-trapped-analysis'),...byLabel('03-trapped-publication-denied'),...byLabel('04-repaired-analysis'),...byLabel('05-publish'),...byLabel('06-forbidden-action-denied')]});
write('registry-publish-second.json',{...base,records:[strap,sopen],transactions:[...byLabel('07-support-trap-analysis'),...byLabel('08-support-trap-publication-denied'),...byLabel('09-support-analysis'),...byLabel('10-support-publish')]});
write('registry-register.json',{...base,registry:list,transactions:[...byLabel('11-register-editorial'),...byLabel('12-register-support')]});
write('registry-walk-new.json',{...base,model:sopen,journey:js,transactions:[...byLabel('16-walk-support-1'),...byLabel('17-walk-support-2'),...byLabel('18-walk-support-3')]});
write('registry-walk-editorial.json',{...base,model:open,journey:je,transactions:[...byLabel('19-walk-editorial-1'),...byLabel('20-walk-editorial-2')]});
write('registry-negative-cases.json',{...base,registry:list2,transactions:[...byLabel('13-register-unpublished-denied'),...byLabel('14-register-nonowner-denied'),...byLabel('15-register-again-noop')]});
write('registry-evidence.json',{...base,records:s.records,registry:list,journeys:s.journeys,transactions:txs});
fs.writeFileSync(path.join(root,'public','deployment.json'),JSON.stringify({network:61999,address:s.address,owner,id:open.id,trapId:trap.id,supportId:sopen.id,supportTrapId:strap.id,sourceSha256},null,2));
fs.unlinkSync(CHECKPOINT);
console.log('COMPLETE',s.address);
