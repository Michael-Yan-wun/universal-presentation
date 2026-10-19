import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {productBeats,productTourHTML,productScreens} from '../dist/winedge-product-tour.js';
import {createWinEdgeLaunch,launchChapters,launchLastStep} from '../dist/winedge-launch.js';

function harness(t){
 const media=globalThis.matchMedia,observer=globalThis.ResizeObserver;
 globalThis.matchMedia=()=>({matches:true});globalThis.ResizeObserver=class{observe(){}};
 t.after(()=>{globalThis.matchMedia=media;globalThis.ResizeObserver=observer});
 const container={innerHTML:'',addEventListener(){},querySelectorAll(){return[]},querySelector(){return null}};
 const launch=createWinEdgeLaunch({container});return {container,launch};
}
test('three stories hold six real-product scenes with reversible previous/next navigation',t=>{
 const {container,launch}=harness(t);launch.start();
 const expected=['workflow','libraries','timing','preview','dashboard','extensions'];
 for(const id of expected){assert.equal(launch.next(),true);assert.match(container.innerHTML,new RegExp(`data-beat="${id}"`));}
 for(const id of expected.slice(0,-1).reverse()){assert.equal(launch.previous(),true);assert.match(container.innerHTML,new RegExp(`data-beat="${id}"`));}
 launch.previous();assert.equal(launch.state().current,0);assert.equal(launch.previous(),false);
 launch.next();launch.next();launch.stop();assert.equal(launch.next(),false);launch.start();assert.equal(launch.state().beat,0);
 launch.start({atEnd:true});assert.equal(launch.state().current,launchLastStep);assert.equal(launch.next(),false);
});
test('all ten unchanged original captures appear in the tour without extra UI controls',()=>{
 let html='';for(const [i,c] of launchChapters.entries())for(let b=0;b<productBeats[c.id].length;b++)html+=productTourHTML(c,i+1,b,'');
 for(const name of productScreens){
  assert.ok(html.includes(`/${name}.png`),name);
  const buffer=readFileSync(new URL(`../dist/assets/winedge/${name}.png`,import.meta.url));
  assert.equal(buffer.readUInt32BE(16),2555);assert.equal(buffer.readUInt32BE(20),1288);
 }
 assert.doesNotMatch(html,/<button|<a |SAM3|SAM 3|MCP/);
 assert.match(html,/產品實際介面/);assert.match(html,/整合概念動畫/);
 // Every crop remains inside the captured UI and keeps its native aspect ratio.
 for(const match of html.matchAll(/class="we-screen" viewBox="([\d ]+)"/g)){
  const [x,y,w,h]=match[1].split(' ').map(Number);assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=2555&&y+h<=1288);
 }
});
test('leaving during an animated transition cannot paint an obsolete product screen',async t=>{
 const media=globalThis.matchMedia,observer=globalThis.ResizeObserver;
 globalThis.matchMedia=()=>({matches:false});globalThis.ResizeObserver=class{observe(){}};
 t.after(()=>{globalThis.matchMedia=media;globalThis.ResizeObserver=observer});
 let release;const animation={finished:new Promise(r=>release=r),cancel(){release()}};
 const container={innerHTML:'',addEventListener(){},querySelectorAll(){return[]},querySelector(selector){return selector==='.wl-content'?{animate(){return animation}}:null}};
 const launch=createWinEdgeLaunch({container});launch.start();launch.next();assert.equal(launch.state().busy,true);
 launch.stop();container.innerHTML='next chapter';release();await new Promise(r=>setImmediate(r));
 assert.equal(container.innerHTML,'next chapter');assert.equal(launch.state().active,false);assert.equal(launch.state().busy,false);
});
