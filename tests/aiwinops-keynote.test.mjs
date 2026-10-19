import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from '../dist/vendor/three.module.js';
import {createHistoryWall} from '../dist/history-wall.js';
import {visionCurriculum,visionLessonHTML,visionCaseHardwareHTML} from '../dist/aiwinops-keynote.js';

test('five films include field context and lead directly to five lessons before fusion',t=>{
 const saved=globalThis.document;
 globalThis.document={createElementNS:()=>({addEventListener(){},removeEventListener(){}})};
 t.after(()=>{globalThis.document=saved;});
 let state;const models=[],group=new THREE.Group();
 const wall=createHistoryWall({group,renderer:{capabilities:{getMaxAnisotropy:()=>1}},geometry:(w,h,d)=>new THREE.BoxGeometry(w,h,d),brick(parent,o){const g=new THREE.Group();parent.add(g);g.position.fromArray(o.pos);const item={g,home:g.position.clone(),w:o.cols*1.05,h:o.h,d:o.rows*1.05};if(o.name==='AIWinOps')models.push(item);return item;},addLabel:()=>({classList:{toggle(){}},setAttribute(){}}),onStage:s=>state=s});
 const settle=()=>wall.update(20,true,10);
 wall.restart();assert.equal(state.phase,'room');assert.equal(wall.action('fuse'),false);
 assert.equal(wall.previous(),false,'gallery returns directly to the preceding chapter');
 for(let i=0;i<5;i++){
  wall.advance();settle();assert.equal(state.caseOpen,true);assert.equal(state.selected,i);
  assert.equal(state.visited.length,i+1);assert.equal(state.phase,'room');
  assert.equal(models.at(-1).g.visible,false);
 }
 wall.advance();assert.equal(state.phase,'learning');assert.equal(state.learningStep,0);
 wall.update(400,false,400);assert.equal(state.learningStep,0);
 for(let i=1;i<visionCurriculum.length;i++){wall.advance();assert.equal(state.learningStep,i);assert.equal(state.phase,'learning');}
 wall.previous();assert.equal(state.learningStep,visionCurriculum.length-2);wall.advance();wall.advance();assert.equal(state.phase,'fusing');
 const host=group.getObjectByName('avs553');assert.equal(host.visible,false,'hardware stays hidden until the reveal');
 wall.update(20,false,4.1);assert.equal(state.phase,'fusing');assert.equal(state.revealing,true);assert.equal(host.visible,true);
 const movingFrame=wall.frameOffset();assert.ok(movingFrame>0&&movingFrame<.215,'camera pans during assembly');
 wall.update(20,false,.25);assert.ok(wall.frameOffset()>movingFrame);
 settle();assert.equal(state.phase,'product');assert.equal(models.at(-1).g.visible,true);assert.equal(host.visible,true);assert.equal(wall.frameOffset(),.215);
 assert.ok(models.at(-1).g.position.y>host.getObjectByName('avs553-chassis').position.y,'product sits above the compute layer');
 wall.previous();assert.equal(state.phase,'learning');assert.equal(state.learningStep,visionCurriculum.length-1);assert.equal(models.at(-1).g.visible,false);
 wall.update(21,false,.016);assert.equal(host.visible,false);assert.equal(wall.frameOffset(),0);
 for(let i=0;i<visionCurriculum.length;i++)wall.previous();settle();assert.equal(state.phase,'room');assert.equal(state.caseOpen,true);assert.equal(state.selected,4);
 wall.restart();assert.equal(state.revealing,false);assert.equal(host.visible,false);assert.equal(state.learningStep,0);assert.equal(state.canFuse,false);assert.deepEqual(state.visited,[]);wall.restart({atEnd:true});settle();assert.equal(state.phase,'product');assert.equal(state.canFuse,true);wall.previous();assert.equal(state.learningStep,visionCurriculum.length-1);wall.dispose();
});

test('every lesson and case diagram has real local assets and no extra stage controls',()=>{
 const htmls=[...visionCurriculum.map((_,i)=>visionLessonHTML(i)),...Array.from({length:5},(_,i)=>visionCaseHardwareHTML(i))];
 for(const html of htmls){
  assert.doesNotMatch(html,/undefined|<button|data-next|下一步/);
  for(const [,src]of html.matchAll(/src="\.\/(assets\/[^\"]+)"/g))assert.ok(existsSync(new URL('../dist/'+src,import.meta.url)),src);
 }
 for(let i=0;i<5;i++){const html=visionCaseHardwareHTML(i);assert.match(html,/WinEdge-V/);assert.match(html,/Edge 硬體/);}
 assert.equal(visionCurriculum.length,5);
 assert.match(visionLessonHTML(4),/WinEdge-V/);
});
