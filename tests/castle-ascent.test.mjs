import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {ascentStages,ascentStoryHTML,assemblyDuration,createCastleAscent} from '../dist/castle-ascent.js';
function fixture(){
 const group=new THREE.Group(),castleGroup=new THREE.Group();group.add(castleGroup);
 const parts=[],phases=[];let reveal=1,assemblyMode=false;
 function part(kind,role,shape,pos,extra={}){
  const root=new THREE.Group();root.position.fromArray(pos);castleGroup.add(root);
  const body=new THREE.Mesh(new THREE.BoxGeometry(...shape),new THREE.MeshPhysicalMaterial({color:'#54728b'}));root.add(body);
  if(role){const front=new THREE.Mesh(new THREE.PlaneGeometry(2,1),new THREE.MeshBasicMaterial({map:new THREE.Texture(),transparent:true}));front.position.z=shape[2]/2+.01;root.add(front);}
  const p={root,home:root.position.clone(),scale:root.scale.clone(),kind,role,shape,...extra};parts.push(p);return p;
 }
 ['ON-SITE','EDGE AI FOUNDATION','FIELD I/O'].forEach((r,i)=>part('brick',r,[3.09,.5,3.09],[(i-1)*3.15,-3.35,.1]));
 part('brick','WinEdge',[8.34,1,2.04],[0,-.88,0]);part('brick','AIWinOps',[4.14,1.12,2.04],[-2.1,.48,0]);part('brick','NumOps',[4.14,1.12,2.04],[2.1,.48,0]);part('brick','WinChat',[6.24,1.03,2.04],[0,1.87,0]);
 for(const side of [-1,1]){for(let i=0;i<4;i++)part('brick','',[.99,.83,2.04],[side*4.72,-2.94+i*1.05,-.35]);for(const z of[-.87,.18])part('brick','',[.99,.35,.99],[side*4.72,.81,z]);}
 part('hardware','',[8,1.5,2.4],[0,-2.3,0]);part('deck','',[12,.12,5],[0,-3.76,0]);
 for(let i=0;i<5;i++)part('brain','',[1,1,1],[(i-2)*2.72,4.5,-.3],{brainIndex:i});
 const castle={getAssemblyParts:()=>parts,setAssemblyMode:v=>assemblyMode=v,setAssemblyDecorations(){},reset(){for(const p of parts){p.root.position.copy(p.home);p.root.scale.copy(p.scale);}},setReveal:v=>reveal=v,view:()=>({x:1.8,y:4.8,z:23.1,targetY:1.15})};
 const model=createCastleAscent({group,castleGroup,castle,geometry:(w,h,d)=>new THREE.BoxGeometry(w,h,d),makeTitleTexture:()=>new THREE.Texture(),onPhase:p=>phases.push(p)});
 return {model,parts,phases,castleGroup,get reveal(){return reveal;},get assemblyMode(){return assemblyMode;}};
}
test('the complete staircase is visible immediately, with no product-name labels or timed construction',()=>{
 const f=fixture(),bricks=f.parts.filter(p=>p.kind==='brick');
 assert.equal(ascentStages.length,5);assert.ok(f.model.ready);assert.ok(bricks.every(p=>p.root.visible));assert.equal(f.model.phase,'ascent');assert.equal(f.assemblyMode,true);
 const poses=bricks.map(p=>p.root.matrixWorld.clone());f.castleGroup.updateMatrixWorld(true);const matrices=bricks.map(p=>p.root.matrixWorld.clone());
 f.model.update(60,60,false);f.castleGroup.updateMatrixWorld(true);bricks.forEach((p,i)=>assert.ok(p.root.matrixWorld.equals(matrices[i])));assert.deepEqual(f.phases,[]);
 assert.match(ascentStoryHTML(),/企業 AI<em>不用一次到位/);assert.doesNotMatch(ascentStoryHTML(),/WinEdge|WinChat|AIWinOps|NumOps|Domain AI|一步步累積/);
 f.model.dispose();
});
test('the SAME opaque physical bricks travel to their native castle poses instead of fading to a second scene',()=>{
 const f=fixture(),bricks=f.parts.filter(p=>p.kind==='brick'),ids=bricks.map(p=>p.root.uuid);f.castleGroup.updateMatrixWorld(true);const start=bricks.map(p=>p.root.matrixWorld.clone());
 f.model.advance();assert.equal(f.model.phase,'assembling');f.model.update(2.5,2.5,false);f.castleGroup.updateMatrixWorld(true);
 assert.ok(bricks.some((p,i)=>!p.root.matrixWorld.equals(start[i])));assert.ok(bricks.every(p=>p.root.visible));assert.ok(bricks.every(p=>p.root.children[0].material.opacity===1));assert.equal(f.reveal,1);
 f.model.update(assemblyDuration,10,false);assert.equal(f.model.phase,'castle');assert.equal(f.assemblyMode,false);assert.deepEqual(bricks.map(p=>p.root.uuid),ids);
 for(const p of bricks){assert.ok(p.root.parent.position.length()<1e-9);assert.ok(p.root.parent.scale.distanceTo(new THREE.Vector3(1,1,1))<1e-9);assert.ok(p.root.position.equals(p.home));}
 assert.deepEqual(f.phases,['assembling','docking','castle']);f.model.dispose();
});
test('assembly can finish early or restart; reduced motion restores exactly the native castle',()=>{
 const f=fixture();f.model.advance();f.model.update(.7,.7,false);f.model.advance();assert.equal(f.model.phase,'castle');
 f.model.reset();assert.equal(f.model.phase,'ascent');assert.ok(f.parts.filter(p=>p.kind==='brick').every(p=>p.root.visible));
 f.model.advance(true);assert.equal(f.model.phase,'castle');assert.equal(f.model.advance(),false);
 f.model.reset({atEnd:true});assert.equal(f.model.phase,'castle');assert.equal(f.castleGroup.visible,true);
 for(const aspect of [16/9,3,1.2])for(const n of Object.values(f.model.view(aspect)))assert.ok(Number.isFinite(n));
 f.model.dispose();assert.ok(f.parts.every(p=>p.root.parent===f.castleGroup));
});
