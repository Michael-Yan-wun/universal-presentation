import test from 'node:test';
import assert from 'node:assert/strict';
import {createWinEdgeLaunch,launchFeatures,launchCaseStep,launchSummaryStep,launchLastStep} from '../dist/winedge-launch.js';
import {ecosystemHTML,ecosystemNote} from '../dist/winedge-ecosystem.js';

test('the keynote closes with a partner invitation after cases and the full bento',t=>{
 const media=globalThis.matchMedia,observer=globalThis.ResizeObserver;
 globalThis.matchMedia=()=>({matches:true});globalThis.ResizeObserver=class{observe(){}};
 t.after(()=>{globalThis.matchMedia=media;globalThis.ResizeObserver=observer;});
 const container={innerHTML:'',addEventListener(){},querySelectorAll(){return[];},querySelector(selector){return selector==='.wl-video-play'?{}:null;}};
 let state;const launch=createWinEdgeLaunch({container,onChange:s=>state=s});launch.start();assert.equal(state.mode,'hero');
 for(let i=1;i<=launchLastStep;i++){
  assert.equal(launch.next(),true);assert.equal(state.step,i);
  if(i===launchCaseStep)assert.equal(state.mode,'cases');
  if(i===launchSummaryStep){assert.equal(state.mode,'summary');assert.equal((container.innerHTML.match(/<article class="wl-tile /g)||[]).length,launchFeatures.length);}
 }
 assert.equal(state.mode,'ecosystem');assert.equal(launch.next(),false);assert.equal(state.feature.note,ecosystemNote);
 launch.previous();assert.equal(state.mode,'summary');launch.next();assert.equal(state.mode,'ecosystem');
 launch.stop();launch.start();assert.equal(state.step,0);
});
test('the partnership page has a single clear invitation and no extra navigation',()=>{
 const html=ecosystemHTML();assert.match(html,/讓能力可以複製/);assert.match(html,/讓價值真正落地/);assert.match(html,/共建 AI 生態圈/);assert.doesNotMatch(html,/<button|<a |立即|申請|報價/);
 assert.match(ecosystemNote,/只有產品/);assert.match(ecosystemNote,/只有服務/);
});
