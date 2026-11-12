import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeProgress} from '../src/game/progressMerge';
import {emptyProgress} from '../src/game/state';
test('merge keeps furthest stage, best wins and local resume',()=>{
  const local={...emptyProgress(),nextStage:5,wins:{'campaign-1':7,'campaign-2':4}};
  const merged=mergeProgress(local,{nextStage:9,wins:{'campaign-1':5,'campaign-8':3},swipeLearned:true});
  assert.equal(merged.nextStage,9);
  assert.deepEqual(merged.wins,{'campaign-1':5,'campaign-2':4,'campaign-8':3});
  assert.equal(merged.swipeLearned,true);
  assert.equal(merged.resume,local.resume);
  assert.strictEqual(mergeProgress(local,null),local);
});
