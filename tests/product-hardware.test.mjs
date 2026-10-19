import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {createProductJourney} from '../dist/product-journey.js';
import {createProductHardware} from '../dist/product-hardware.js';
import {numOpsUI} from '../dist/numops-keynote.js';
import {winChatKeynote} from '../dist/winchat-keynote.js';

function setup(){const group=new THREE.Group();const journey=createProductJourney({group,brick(parent,options){const g=new THREE.Group();parent.add(g);g.position.fromArray(options.pos);return {g,home:g.position.clone()};},addLabel(){return {};},onStage(){}});return {group,journey};}
test('hardware is tied to each final product and is cleared on back / restart',()=>{
 const {group,journey}=setup();
 for(const id of ['analytics','chat']){
  journey.reset(id);const hardware=group.getObjectByName(`${id}-hardware`);
  assert.equal(hardware.visible,false);assert.equal(journey.view(16/9),null);
  journey.reset(id,{atEnd:true});assert.equal(hardware.visible,true);assert.ok(Math.abs(hardware.position.y)<1e-8);assert.ok(journey.view(16/9));
  journey.action('back');assert.equal(hardware.visible,false);journey.update(2,true,2);assert.equal(journey.phase(),'focus');
  journey.action('next');assert.equal(journey.phase(),'fusing');journey.update(1,false,1);assert.equal(hardware.visible,false);
  journey.update(5,true,5);assert.equal(journey.phase(),'born');assert.equal(hardware.visible,true);assert.ok(Math.abs(hardware.position.y)<1e-8);
  journey.reset(id);assert.equal(hardware.visible,false);assert.equal(journey.frameOffset(),0);
 }
 assert.ok(group.getObjectByName('avs530'));assert.ok(group.getObjectByName('dgx-spark'));assert.ok(group.getObjectByName('rtx-pro-6000'));
 journey.dispose();
});
test('reduced motion stops hardware signals and every GPU resource is released once',()=>{
 const hardware=createProductHardware(new THREE.Group(),'chat');hardware.update(1,1,true);hardware.root.updateMatrixWorld(true);
 const positions=[];hardware.root.traverse(o=>positions.push(o.matrixWorld.toArray()));
 hardware.update(99,1,true);hardware.root.updateMatrixWorld(true);let i=0;hardware.root.traverse(o=>assert.deepEqual(o.matrixWorld.toArray(),positions[i++]));
 const resources=new Set();hardware.root.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);});
 const disposed=new Map();resources.forEach(r=>r.addEventListener('dispose',()=>disposed.set(r,(disposed.get(r)||0)+1)));
 hardware.dispose();resources.forEach(r=>assert.equal(disposed.get(r),1));
});
test('keynote hardware labels match the requested deployment options',()=>{
 const num=numOpsUI({phase:'born'}).html,chat=winChatKeynote({phase:'born',beat:0}).detail;
 assert.match(num,/APLEX AVS-530/);assert.doesNotMatch(num,/AVS-553/);
 assert.match(chat,/NVIDIA DGX Spark/);assert.match(chat,/RTX PRO 6000/);assert.match(chat,/小團隊/);assert.match(chat,/工作站外觀為配置示意/);
 assert.doesNotMatch(chat,/<button|MCP|\bSkill\b/);
});
