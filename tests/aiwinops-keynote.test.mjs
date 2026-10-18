import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from '../dist/vendor/three.module.js';
import {createHistoryWall} from '../dist/history-wall.js';
import {visionCurriculum,visionLessonHTML,visionHardwareHTML} from '../dist/aiwinops-keynote.js';

test('five case and hardware pairs precede every manual lesson and the AIWinOps reveal',t=>{
 const saved=globalThis.document;
 globalThis.document={createElementNS:()=>({addEventListener(){},removeEventListener(){}})};
 t.after(()=>{globalThis.document=saved;});
 let state;const models=[];
 const wall=createHistoryWall({group:new THREE.Group(),renderer:{capabilities:{getMaxAnisotropy:()=>1}},geometry:(w,h,d)=>new THREE.BoxGeometry(w,h,d),brick(parent,o){const g=new THREE.Group();parent.add(g);g.position.fromArray(o.pos);const item={g,home:g.position.clone(),w:o.cols*1.05,h:o.h,d:o.rows*1.05};if(o.name==='AIWinOps')models.push(item);return item;},addLabel:()=>({classList:{toggle(){}},setAttribute(){}}),onStage:s=>state=s});
 const settle=()=>wall.update(20,true,10);
 wall.restart();wall.advance();settle();assert.equal(state.phase,'room');assert.equal(wall.action('fuse'),false);
 for(let i=0;i<5;i++){
  wall.action('select',i);settle();assert.equal(state.caseOpen,true);assert.equal(state.selected,i);
  wall.advance();assert.equal(state.phase,'hardware');assert.equal(state.visited.length,i+1);
  assert.equal(models.at(-1).g.visible,false);
 }
 wall.advance();assert.equal(state.phase,'learning');assert.equal(state.learningStep,0);
 wall.update(400,false,400);assert.equal(state.learningStep,0);
 for(let i=1;i<visionCurriculum.length;i++){wall.advance();assert.equal(state.learningStep,i);assert.equal(state.phase,'learning');}
 wall.previous();assert.equal(state.learningStep,visionCurriculum.length-2);wall.advance();wall.advance();assert.equal(state.phase,'fusing');
 settle();assert.equal(state.phase,'product');assert.equal(models.at(-1).g.visible,true);
 wall.previous();assert.equal(state.phase,'learning');assert.equal(state.learningStep,visionCurriculum.length-1);assert.equal(models.at(-1).g.visible,false);
 for(let i=0;i<visionCurriculum.length;i++)wall.previous();assert.equal(state.phase,'hardware');assert.equal(state.selected,4);
 wall.restart();assert.equal(state.learningStep,0);assert.equal(state.canFuse,false);assert.deepEqual(state.visited,[]);wall.dispose();
});

test('every lesson and case diagram has real local assets and no extra stage controls',()=>{
 const htmls=[...visionCurriculum.map((_,i)=>visionLessonHTML(i)),...Array.from({length:5},(_,i)=>visionHardwareHTML(i))];
 for(const html of htmls){
  assert.doesNotMatch(html,/undefined|<button|data-next|下一步/);
  for(const [,src]of html.matchAll(/src="\.\/(assets\/[^\"]+)"/g))assert.ok(existsSync(new URL('../dist/'+src,import.meta.url)),src);
 }
 assert.equal(visionCurriculum.length,7);
 assert.match(visionLessonHTML(6),/WinEdge-V/);
});
