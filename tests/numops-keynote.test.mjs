import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {createProductJourney} from '../dist/product-journey.js';
import {numOpsScript,numOpsBeatCounts} from '../dist/numops-script.js';
import {numOpsUI,createNumOpsStage} from '../dist/numops-keynote.js';
function setup(){let state;const models=new Map();const journey=createProductJourney({group:new THREE.Group(),brick(parent,o){const g=new THREE.Group();parent.add(g);g.position.fromArray(o.pos);models.set(o.name,g);return {g,home:g.position.clone()};},addLabel(){return {};},onStage(s){state=s;}});journey.reset('analytics');return {journey,models,state:()=>state,settle(){journey.update(10,true,2);}};}
test('NumOps manually visits every beat before the product reveal',()=>{
 const {journey,state,settle,models}=setup();
 assert.equal(models.get('NumOps').visible,false);
 for(let topic=0;topic<numOpsBeatCounts.length;topic++){
  journey.action('next');settle();assert.equal(state().selected,topic);assert.equal(state().beat,0);assert.equal(state().visited.includes(topic),false);
  journey.update(200,false,200);assert.equal(state().beat,0);
  for(let beat=1;beat<numOpsBeatCounts[topic];beat++){journey.action('next');assert.equal(state().beat,beat);assert.equal(models.get('NumOps').visible,false);}
  assert.ok(state().visited.includes(topic));
 }
 assert.equal(state().canFuse,true);journey.action('next');assert.equal(state().phase,'fusing');journey.update(1,false,1);assert.equal(models.get('NumOps').visible,false);settle();assert.equal(state().phase,'born');assert.equal(models.get('NumOps').visible,true);assert.equal(journey.action('next'),false);
 journey.action('back');settle();assert.equal(state().selected,2);assert.equal(state().beat,3);assert.equal(models.get('NumOps').visible,false);
 journey.reset('analytics');assert.equal(state().phase,'overview');assert.deepEqual(state().visited,[]);
});
test('NumOps prevents skipped topics and navigates backwards through individual beats',()=>{
 const {journey,state,settle}=setup();journey.action('select',2);settle();for(let i=1;i<numOpsBeatCounts[2];i++)journey.action('next');
 assert.equal(state().canFuse,false);journey.action('next');settle();assert.equal(state().selected,0);
 journey.action('select',1);settle();journey.action('back');settle();assert.equal(state().selected,0);assert.equal(state().beat,numOpsBeatCounts[0]-1);
 journey.action('back');assert.equal(state().beat,numOpsBeatCounts[0]-2);
});
test('NumOps has distinct product-sized scenes and credits the WaterOps partnership',()=>{
 const assets=new Set();
 for(const [selected,beats] of numOpsScript.entries())for(const [beat,b] of beats.entries()){
  const state={phase:'focus',selected,beat,visited:[]};const ui=numOpsUI(state);
  assert.equal(numOpsUI({...state,phase:'selecting'}).html,ui.html);
  assert.doesNotMatch(ui.html,/<button|data-journey|MCP|undefined|↗/);
  if(b.scene==='screen'){assert.equal(assets.has(b.asset),false);assets.add(b.asset);assert.match(ui.html,/官方產品介面/);}
 }
 const water=numOpsUI({phase:'focus',selected:2,beat:1});assert.match(water.html,/GSD 基士德/);assert.match(water.html,/AIWin/);assert.match(water.html,/數據 AutoML/);
 const deploy=numOpsUI({phase:'focus',selected:2,beat:3});assert.match(deploy.html,/WinEdge-N/);assert.match(deploy.html,/no-edge-host/);
 assert.equal(numOpsScript.flat().length,11);
});
test('reduced-motion navigation replaces the previous scene without stacked content',t=>{
 const originalDocument=globalThis.document,originalMatchMedia=globalThis.matchMedia;
 t.after(()=>{globalThis.document=originalDocument;globalThis.matchMedia=originalMatchMedia;});
 const element=()=>({childNodes:[],append(...nodes){this.childNodes.push(...nodes);},replaceChildren(...nodes){this.childNodes=nodes;},get firstElementChild(){return this.childNodes[0];}});
 globalThis.document={createElement:element};globalThis.matchMedia=()=>({matches:true});
 const root={dataset:{}},story={},detail=element(),stage=createNumOpsStage({root,story,detail});
 for(const state of [{phase:'overview'},{phase:'focus',selected:0,beat:0},{phase:'focus',selected:0,beat:1},{phase:'focus',selected:0,beat:0}]){
  const ui=numOpsUI(state);stage.render(state,ui);
  assert.equal(detail.childNodes.length,1);assert.equal(detail.firstElementChild.innerHTML,ui.html);
 }
 assert.equal(story.hidden,true);stage.reset();assert.equal(root.dataset.numopsLayout,undefined);
});
