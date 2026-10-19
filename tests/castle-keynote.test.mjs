import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {castleBeats,createCastleProgress,castleStoryHTML,castleDetailHTML} from '../dist/castle-keynote.js';
import {createCastleScene} from '../dist/castle-scene.js';

test('castle progression stops at every layer and can reverse or re-enter from either chapter',()=>{
 const progress=createCastleProgress();
 assert.equal(progress.index,0);
 assert.equal(progress.previous(),false);
 for(let i=1;i<castleBeats.length;i++){assert.equal(progress.next(),true);assert.equal(progress.index,i);}
 assert.equal(progress.next(),false);
 for(let i=2;i>=0;i--){assert.equal(progress.previous(),true);assert.equal(progress.index,i);}
 assert.equal(progress.previous(),false);
 assert.equal(progress.reset(castleBeats.length-1),3);
 assert.equal(progress.reset(),0);
 assert.equal(progress.reset(99),3);
 assert.equal(progress.reset(-1),0);
});

test('castle keeps the Agent hierarchy and offers no extra on-stage controls',()=>{
 const html=castleStoryHTML()+castleDetailHTML();
 assert.match(html,/WinChat Agent/);
 assert.match(html,/RAG 多模態知識 × SKILL 工作能力/);
 assert.match(html,/AIWinOps × NumOps/);
 assert.doesNotMatch(html,/<button|MCP|Skill|展開城堡|下一步/);
});

test('castle focus preserves assembled geometry and never recolors shared product materials',()=>{
 const group=new THREE.Group(),bricks=[],labels=[];
 const shared=new THREE.MeshPhysicalMaterial({color:'#009f86'}),original=shared.color.clone();
 const geometry=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
 const castle=createCastleScene({group,geometry,
  brick(parent,o){const g=new THREE.Group();g.name=o.name||'';g.position.fromArray(o.pos);g.add(new THREE.Mesh(geometry(o.cols,o.h,o.rows),shared));parent.add(g);const item={g,home:g.position.clone()};bricks.push(item);return item;},
  makeBrain(parent,color,scale){const brain=new THREE.Group();brain.add(new THREE.Mesh(new THREE.SphereGeometry(.5),new THREE.MeshBasicMaterial({color})));brain.scale.setScalar(scale);parent.add(brain);return brain;},
  addLabel(...args){labels.push(args[2]);return {setAttribute(){}};},
  agents:Array.from({length:5},(_,i)=>({zh:'Domain '+i,id:String(i)}))
 });
 const main=['WinEdge','AIWinOps','NumOps','WinChat'].map(name=>bricks.find(b=>b.g.name===name));
 assert.ok(main.every(Boolean));
 assert.ok(main[0].home.y<main[1].home.y&&main[1].home.y===main[2].home.y&&main[2].home.y<main[3].home.y);
 assert.equal(labels.length,5);
 assert.ok(group.getObjectByName('castle-hardware-edge-host').children.length>50,'computer has modeled ports and cooling fins');
 castle.reset();
 castle.update(30,30,false);
 assert.equal(castle.step,0,'elapsed animation time never advances the presenter state');
 for(let step=1;step<=3;step++){
  castle.setStep(step);castle.update(5,50,true);
  assert.equal(castle.step,step);
  for(const item of main){assert.ok(item.g.visible);assert.ok(item.g.position.distanceTo(item.home)<=.101);}
  assert.ok(shared.color.equals(original),'focus is isolated from other scenes');
  for(const value of Object.values(castle.view(16/9)))assert.ok(Number.isFinite(value));
 }
 castle.reset();castle.update(0,0,true);
 for(const item of main)assert.ok(item.g.position.distanceTo(item.home)<1e-9,'reduced motion restores assembled pose immediately');
 castle.dispose();
});
