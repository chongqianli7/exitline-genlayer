import sys,types,unittest,importlib.util,json,itertools
from pathlib import Path
class Error(Exception):pass
class Return:
 def __init__(self,x):self.calldata=x
sender=types.SimpleNamespace(sender_address='0x'+'1'*40)
answers=[]
last_validator=None
def nondet(leader,validator):
 global last_validator
 last_validator=validator
 value=leader()
 if not validator(Return(value)):raise Error('DISAGREEMENT')
 return value
host=types.SimpleNamespace(Contract=object,public=types.SimpleNamespace(write=lambda f:f,view=lambda f:f),vm=types.SimpleNamespace(UserError=Error,Return=Return,run_nondet_unsafe=nondet),message=sender,nondet=types.SimpleNamespace(exec_prompt=lambda *a,**k:answers.pop(0)))
sys.modules['genlayer']=types.SimpleNamespace(gl=host,TreeMap=dict)
spec=importlib.util.spec_from_file_location('contract',Path(__file__).parents[1]/'contracts/exitline.py');c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
A,B=['0x'+x*40 for x in '12']
S=['Draft','Review','Revision','Done'];ACT=['Forward','Return']
RULES='Draft Forward goes to Review; Draft Return is forbidden. Review Forward goes to Done; Review Return goes to Revision. Revision Forward goes to Review; Revision Return stays in Revision.'
OPEN=[[1,-1],[3,2],[1,2],[-1,-1]];TRAP=[[1,-1],[3,2],[2,2],[-1,-1]]
def output(matrix=OPEN):
 return {'cells':[dict(state=S[s],action=ACT[a],target='BLOCK' if matrix[s][a]==-1 else 'UNKNOWN' if matrix[s][a]==-2 else S[matrix[s][a]],quote=RULES) for s in range(3) for a in range(2)]}
class Tests(unittest.TestCase):
 def setUp(self):answers.clear();sender.sender_address=A;self.r=c.Exitline()
 def model(self,which=OPEN,id='test'):
  answers.extend([output(which),output(which)]);return json.loads(self.r.analyze(id,'Editorial loop',json.dumps(S),json.dumps(ACT),3,RULES))
 def publish(self):
  r=self.model();self.r.publish('test',r['digest']);return r
 def journey(self,participant=A):return json.loads(self.r.get_journey(A,'test',participant))
 def test_trap_has_shortest_replayable_witness(self):
  r=self.model(TRAP);self.assertEqual(r['analysis']['trapped'],[2]);self.assertEqual(r['analysis']['witness'],[0,1])
  with self.assertRaisesRegex(Error,'NOT_NONBLOCKING'):self.r.publish('test',r['digest'])
 def test_repair_certifies_each_reachable_exit(self):
  r=self.model();self.assertEqual(r['status'],'NONBLOCKING')
  for e in r['analysis']['exits']:
   s=e['state']
   for a in e['actions']:s=r['matrix'][s][a]
   self.assertEqual(s,3)
 def test_unknown_never_publishes(self):
  m=[row[:] for row in OPEN];m[2][0]=-2;r=self.model(m);self.assertEqual(r['status'],'REVIEW')
  with self.assertRaisesRegex(Error,'NOT_NONBLOCKING'):self.r.publish('test',r['digest'])
 def test_model_id_immutable(self):
  self.model()
  with self.assertRaisesRegex(Error,'ID_USED'):self.model()
 def test_owner_namespace_and_publish_permissions(self):
  r=self.model();sender.sender_address=B
  with self.assertRaisesRegex(Error,'NOT_FOUND'):self.r.publish('test',r['digest'])
 def test_digest_and_repeat_publication(self):
  r=self.model()
  with self.assertRaisesRegex(Error,'STALE_DIGEST'):self.r.publish('test','bad')
  self.r.publish('test',r['digest'])
  with self.assertRaisesRegex(Error,'ALREADY'):self.r.publish('test',r['digest'])
 def test_every_transition_must_agree_not_only_result(self):
  changed=[row[:] for row in OPEN];changed[2][1]=1;answers.extend([output(),output(changed)])
  with self.assertRaisesRegex(Error,'DISAGREEMENT'):self.r.analyze('test','Editorial loop',json.dumps(S),json.dumps(ACT),3,RULES)
  self.assertEqual(self.r.get_model(A,'test'),'')
 def test_quotes_and_cell_order_are_bound(self):
  for mutate in [lambda x:x['cells'].reverse(),lambda x:x['cells'][0].update(quote='not in the source'),lambda x:x['cells'][0].update(target='invented')]:
   x=output();mutate(x)
   with self.assertRaises(Error):c.cells(x,S,ACT,3,RULES)
 def test_unpublished_model_cannot_run(self):
  self.model()
  with self.assertRaisesRegex(Error,'NOT_PUBLISHED'):self.r.advance(A,'test',0,0)
 def test_blocked_action_and_stale_step_preserve_state(self):
  self.publish()
  with self.assertRaisesRegex(Error,'ACTION_BLOCKED'):self.r.advance(A,'test',0,1)
  self.assertEqual(self.r.get_journey(A,'test',A),'')
  self.r.advance(A,'test',0,0)
  with self.assertRaisesRegex(Error,'STALE_STEP'):self.r.advance(A,'test',0,0)
  self.assertEqual(self.journey()['state'],1)
 def test_complete_is_terminal_and_namespaces_independent(self):
  self.publish();self.r.advance(A,'test',0,0);self.r.advance(A,'test',1,0);self.assertTrue(self.journey()['complete'])
  with self.assertRaisesRegex(Error,'COMPLETE'):self.r.advance(A,'test',2,1)
  sender.sender_address=B;self.r.advance(A,'test',0,0);self.assertEqual(self.journey(B)['state'],1);self.assertEqual(self.journey(A)['state'],3)
 def test_loop_budget_always_reserves_a_shortest_exit(self):
  self.publish();self.r.advance(A,'test',0,0);self.r.advance(A,'test',1,1)
  for step in range(2,22):self.r.advance(A,'test',step,1)
  with self.assertRaisesRegex(Error,'EXHAUSTS_EXIT_BUDGET'):self.r.advance(A,'test',22,1)
  self.r.advance(A,'test',22,0);self.r.advance(A,'test',23,0);self.assertTrue(self.journey()['complete']);self.assertEqual(self.journey()['step'],24)
 def test_validator_nonreturn_or_malformed_cannot_approve(self):
  self.model();self.assertFalse(last_validator(None));self.assertFalse(last_validator(Return('{}')))
 def test_names_and_terminal_bounds(self):
  for states,terminal in [(['Draft','draft','Done'],2),(S,0),(S,True),(['Draft','BLOCK','Done'],2)]:
   with self.assertRaises(Error):self.r.analyze('invalid','Title',json.dumps(states),json.dumps(ACT),terminal,RULES)
 def test_graph_algorithm_exhaustively_matches_transitive_closure(self):
  n=4
  for entries in itertools.product(range(-1,n),repeat=6):
   matrix=[list(entries[i:i+2]) for i in range(0,6,2)]+[[-1,-1]]
   closure=[[i==j or j in matrix[i] for j in range(n)] for i in range(n)]
   for k in range(n):
    for i in range(n):
     for j in range(n):closure[i][j]=closure[i][j] or (closure[i][k] and closure[k][j])
   expected=[i for i in range(n) if closure[0][i] and not closure[i][3]]
   result=c.audit(S,ACT,3,matrix)
   self.assertEqual(sorted(result['trapped']),expected)
   self.assertEqual(result['status'],'TRAPPED' if expected else 'NONBLOCKING')
   if expected:
    at=0
    for action in result['witness']:at=matrix[at][action]
    self.assertIn(at,expected)
if __name__=='__main__':unittest.main()
