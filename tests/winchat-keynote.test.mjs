import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {createProductJourney} from '../dist/product-journey.js';
import {winChatBeatCounts,winChatFinalBeats,winChatScript} from '../dist/winchat-script.js';
import {winChatUI} from '../dist/winchat-story.js';

function setup(id='chat'){
 let state;const models=new Map();
 const journey=createProductJourney({group:new THREE.Group(),brick(parent,options){const g=new THREE.Group();parent.add(g);g.position.fromArray(options.pos);models.set(options.name,g);return {g,home:g.position.clone()};},addLabel(){return {};},onStage(value){state=value;}});
 journey.reset(id);
 return {journey,models,state:()=>state,settle(){journey.update(10,true,2);}};
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
test('direct application entry cannot skip RAG and Skill; back follows individual beats',()=>{
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

test('detail beats explain Agent support with distinct data flows, not repeated brains or UI zooms',()=>{
 const seenAssets=new Set();
 for(const [selected,beats] of winChatScript.entries())for(const [beat,data] of beats.entries()){
  const ui=winChatUI({phase:'focus',selected,beat,visited:[]});
  assert.doesNotMatch(ui.detail,/wc-mind-scene|wc-skill-mind|undefined|MCP|Model Context Protocol/);
  if(data.scene==='screen'){
   assert.equal(seenAssets.has(data.asset),false,'each official product image appears once');seenAssets.add(data.asset);
  }else assert.match(ui.detail,/wc-flow-layout|wc-perception/);
 }
 const diagram=winChatUI({phase:'focus',selected:2,beat:3,visited:[]}).detail;
 for(const role of ['ORCHESTRATOR','Agent','RAG / 知識支援','SKILL / 工作能力','WORK OBJECTIVE'])assert.ok(diagram.includes(role));
});
test('NumOps keeps its original three-topic sequence',()=>{
 const {journey,state,settle}=setup('analytics');
 for(let i=0;i<3;i++){journey.action('next');settle();assert.equal(state().selected,i);assert.equal(state().beat,0);}
 assert.equal(state().canFuse,true);journey.action('next');settle();assert.equal(state().phase,'born');assert.equal(journey.action('next'),false);
});

test('WinChat bricks stay hidden until the final brain-to-product reveal',()=>{
 const {journey,models,settle}=setup();
 const topics=['RAG','SKILL','WORK'];
 const hidden=()=>topics.forEach(name=>assert.equal(models.get(name).visible,false));
 hidden();assert.equal(models.get('WinChat').visible,false);
 for(let topic=0;topic<3;topic++){
  journey.action('next');settle();hidden();
  for(let i=1;i<winChatBeatCounts[topic];i++)journey.action('next');
 }
 journey.action('next');journey.update(1,false,1);hidden();assert.equal(models.get('WinChat').visible,false);
 journey.update(4,false,2.6);hidden();assert.equal(models.get('WinChat').visible,true);
 settle();journey.action('back');settle();hidden();assert.equal(models.get('WinChat').visible,false);
 journey.reset('chat');hidden();assert.equal(models.get('WinChat').visible,false);
});

test('WinChat stage uses sequential controls without topic buttons or transient entry copy',()=>{
 const overview=winChatUI({phase:'overview',selected:0,beat:0,visited:[]});
 assert.doesNotMatch(overview.story+overview.detail,/<button|data-journey|data-winchat-next|↗/);
 for(let topic=0;topic<winChatBeatCounts.length;topic++){
  const entering=winChatUI({phase:'selecting',selected:topic,beat:0,visited:[]});
  const focused=winChatUI({phase:'focus',selected:topic,beat:0,visited:[]});
  assert.deepEqual(entering,focused,'finishing camera travel must not replace content or title');
  for(let beat=0;beat<winChatBeatCounts[topic];beat++){
   const ui=winChatUI({phase:'focus',selected:topic,beat,visited:[]});
   assert.doesNotMatch(ui.story+ui.detail,/<button|data-winchat-next|↗/);
  }
 }
 for(let beat=0;beat<winChatFinalBeats;beat++){
  const ui=winChatUI({phase:'born',selected:2,beat,visited:[0,1,2]});
  assert.doesNotMatch(ui.story+ui.detail,/<button|data-winchat-next|↗/);
 }
});
