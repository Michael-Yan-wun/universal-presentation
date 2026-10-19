import test from 'node:test';
import assert from 'node:assert/strict';
import {projectPort,portCurve,mountWorkflowConnections} from '../dist/winedge-workflow-links.js';

test('screenshot ports stay aligned through letterboxing, resizing and shared entrance transforms',()=>{
 // Non-zero viewBox crop: meet scale .8 plus 20px letterboxing, inside a 1.25x stage.
 const port=[1096,693],source={a:1,b:0,c:0,d:1,e:-796+200,f:-630+150};
 const inverse={a:.8,b:0,c:0,d:.8,e:-.8*100,f:-.8*50};
 const projected=projectPort(port,source,inverse);
 assert.deepEqual(projected,{x:320,y:130.4});
 // A second viewport halves the local layout; camera scaling is independent.
 const small={a:.4,b:0,c:0,d:.4,e:-796*.4+60,f:-630*.4+70};
 assert.deepEqual(projectPort(port,small,{a:1,b:0,c:0,d:1,e:-10,f:-20}),{x:170,y:75.19999999999999});
 const curve=portCurve(projected,{x:450,y:90});
 assert.match(curve,/^M320 130\.4 C/);assert.match(curve,/450 90$/);
});

test('leaving the workflow disconnects resize and cancels pending geometry work',async t=>{
 const original={requestAnimationFrame:globalThis.requestAnimationFrame,cancelAnimationFrame:globalThis.cancelAnimationFrame,ResizeObserver:globalThis.ResizeObserver,document:globalThis.document};
 t.after(()=>Object.assign(globalThis,original));
 let scheduled=0,cancelled=0,disconnected=0,resolveFonts;
 globalThis.requestAnimationFrame=()=>++scheduled;globalThis.cancelAnimationFrame=id=>cancelled=id;
 globalThis.ResizeObserver=class{observe(){}disconnect(){disconnected++}};
 globalThis.document={fonts:{ready:new Promise(resolve=>resolveFonts=resolve)}};
 const overlay={innerHTML:'',isConnected:true};
 const stage={querySelector:()=>overlay,querySelectorAll:()=>[]};
 const dispose=mountWorkflowConnections({querySelector:()=>stage});
 assert.equal(scheduled,1);dispose();assert.equal(cancelled,1);assert.equal(disconnected,1);
 resolveFonts();await Promise.resolve();assert.equal(scheduled,1);
 assert.doesNotThrow(()=>mountWorkflowConnections({querySelector:()=>null})());
});
