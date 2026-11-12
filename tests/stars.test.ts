import {test} from 'node:test';
import assert from 'node:assert/strict';
import {starsFor} from '../src/game/stars';
test('stars: par gives 3, 4x par or more gives 1, otherwise 2',()=>{
  assert.equal(starsFor(5,5),3);
  assert.equal(starsFor(6,5),2);
  assert.equal(starsFor(19,5),2);
  assert.equal(starsFor(20,5),1);
  assert.equal(starsFor(40,5),1);
});
