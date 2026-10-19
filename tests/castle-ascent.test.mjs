import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {ascentStages,ascentDuration,createCastleAscent} from '../dist/castle-ascent.js';
function fixture(){
 const group=new THREE.Group(),castleGroup=new THREE.Group();group.add(castleGroup);
 const products=[],labels=[],phases=[];let reveal=1;
 const shared=new THREE.MeshPhysicalMaterial({color:'#546d82'});
 const model=createCastleAscent({group,castleGroup,
  castle:{reset(){},setReveal(value){reveal=value;},view(){return {x:1.8,y:4.8,z:23.1,targetY:1.15};}},
  geometry:(w,h,d)=>new THREE.BoxGeometry(w,h,d),
  brick(parent,options){const g=new THREE.Group();g.position.fromArray(options.pos);g.add(new THREE.Mesh(new THREE.BoxGeometry(3,options.h,2),shared));parent.add(g);if(options.name)products.push(g);return {g};},
  makeBrain(parent,color,scale){const g=new THREE.Group();g.scale.setScalar(scale);g.add(new THREE.Mesh(new THREE.SphereGeometry(.5),new THREE.MeshBasicMaterial({color})));parent.add(g);return g;},
  addLabel(){const el={style:{},setAttribute(){},innerHTML:''};labels.push(el);return el;},
  onPhase:phase=>phases.push(phase)
 });
 return {model,products,labels,phases,castleGroup,shared,get reveal(){return reveal;}};
}
test('capabilities arrive in sequence, then hold without advancing to the castle',()=>{
 const f=fixture();assert.equal(ascentStages.length,5);
 f.model.update(1,1,false);assert.equal(f.products.filter(p=>p.visible).length,1);
 f.model.update(2,3,false);assert.equal(f.products.filter(p=>p.visible).length,2);
 f.model.update(ascentDuration,20,false);assert.ok(f.products.every(p=>p.visible));assert.ok(f.model.ready);assert.equal(f.model.phase,'ascent');assert.equal(f.castleGroup.visible,false);
 const poses=f.products.map(p=>p.position.clone()),view=f.model.view(16/9);
 f.model.update(60,80,false);f.products.forEach((p,i)=>assert.ok(p.position.equals(poses[i])));assert.deepEqual(f.model.view(16/9),view);assert.equal(f.phases.length,0);
 f.model.dispose();
});
test('assembly is manual, can finish early, and restarting clears the previous reveal',()=>{
 const f=fixture();assert.equal(f.model.advance(),true);assert.equal(f.model.phase,'assembling');assert.equal(f.castleGroup.visible,true);
 f.model.update(.8,.8,false);assert.ok(f.reveal>0&&f.reveal<1);
 f.model.advance();assert.equal(f.model.phase,'castle');assert.equal(f.reveal,1);assert.equal(f.model.advance(),false);
 f.model.reset();assert.equal(f.model.phase,'ascent');assert.equal(f.castleGroup.visible,false);assert.equal(f.reveal,0);assert.ok(f.products.every(p=>!p.visible));
 f.model.advance();f.model.update(3,3,false);assert.equal(f.model.phase,'castle');assert.deepEqual(f.phases,['assembling','castle','assembling','castle']);
 f.model.dispose();
});
test('reduced motion shows all steps and immediately assembles; GPU ownership is isolated',()=>{
 const f=fixture(),color=f.shared.color.clone();
 f.model.update(0,0,true);assert.ok(f.products.every(p=>p.visible));assert.ok(f.labels.every(l=>l.style.opacity==='1'));assert.ok(f.model.ready);
 f.model.advance(true);assert.equal(f.model.phase,'castle');assert.equal(f.reveal,1);
 f.model.reset({atEnd:true});assert.equal(f.model.phase,'castle');assert.equal(f.castleGroup.visible,true);
 for(const aspect of [16/9,3,1.2])for(const n of Object.values(f.model.view(aspect)))assert.ok(Number.isFinite(n));
 assert.ok(f.shared.color.equals(color));f.model.dispose();assert.equal(f.shared.opacity,1);assert.equal(f.shared.transparent,false);
});
