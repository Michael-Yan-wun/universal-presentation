import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {createProductJourney} from '../dist/product-journey.js';
import {winChatBeatCounts,winChatFinalBeats} from '../dist/winchat-script.js';

function setup(id='chat'){
 let state;
 const journey=createProductJourney({group:new THREE.Group(),brick(parent,options){const g=new THREE.Group();parent.add(g);g.position.fromArray(options.pos);return {g,home:g.position.clone()};},addLabel(){return {};},onStage(value){state=value;}});
 journey.reset(id);
 return {journey,state:()=>state,settle(){journey.update(10,true,2);}};
}
test('all keynote beats are manual, with complete topics required before fusion',()=>{
 const {journey,state,settle}=setup();
 for(let topic=0;topic<winChatBeatCounts.length;topic++){
  assert.equal(journey.action('next'),true);settle();
  assert.equal(state().selected,topic);assert.equal(state().beat,0);
  assert.equal(state().visited.includes(topic),false);
  journey.update(200,false,200);
  assert.equal(state().beat,0,'time alone must not advance a speaking beat');
  for(let beat=1;beat<winChatBeatCounts[topic];beat++){
   journey.action('next');assert.equal(state().beat,beat);
   assert.equal(state().phase,'focus');
  }
  assert.ok(state().visited.includes(topic));
 }
 assert.equal(state().canFuse,true);journey.action('next');assert.equal(state().phase,'fusing');settle();
 assert.equal(state().phase,'born');assert.equal(state().beat,0);
 for(let beat=1;beat<winChatFinalBeats;beat++){assert.equal(journey.action('next'),true);assert.equal(state().beat,beat);}
 assert.equal(journey.action('next'),false,'the last product view lets the app leave this chapter');
});
test('direct Skill entry cannot skip RAG and Agent; back follows individual beats',()=>{
 const {journey,state,settle}=setup();
 journey.action('select',2);settle();
 for(let i=1;i<winChatBeatCounts[2];i++)journey.action('next');
 assert.equal(state().canFuse,false);journey.action('next');settle();
 assert.equal(state().selected,0);assert.equal(state().beat,0);
 journey.action('next');journey.action('next');journey.action('back');assert.equal(state().beat,1);
 journey.action('select',1);settle();journey.action('back');settle();
 assert.equal(state().selected,0);assert.equal(state().beat,winChatBeatCounts[0]-1);
 journey.reset('chat');assert.deepEqual(state().visited,[]);assert.equal(state().phase,'overview');assert.equal(state().beat,0);
});
test('NumOps keeps its original three-topic sequence',()=>{
 const {journey,state,settle}=setup('analytics');
 for(let i=0;i<3;i++){journey.action('next');settle();assert.equal(state().selected,i);assert.equal(state().beat,0);}
 assert.equal(state().canFuse,true);journey.action('next');settle();assert.equal(state().phase,'born');assert.equal(journey.action('next'),false);
});
