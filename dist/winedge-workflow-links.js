// Port coordinates are in the untouched 2555 × 1288 workflow capture.
// Convert through both SVG coordinate systems so letterboxing and stage scaling cancel.
export const workflowLinks = [
 {id:'capture',from:['rtsp',1096,693],to:['model',1192,551],color:'#77c8ff',delay:0},
 {id:'result',from:['model',1553,655],to:['preview',1726,261],color:'#91e4c4',delay:1.8}
];

export function projectPort(point,source,inverse){
 const x=source.a*point[0]+source.c*point[1]+source.e;
 const y=source.b*point[0]+source.d*point[1]+source.f;
 return {x:inverse.a*x+inverse.c*y+inverse.e,y:inverse.b*x+inverse.d*y+inverse.f};
}
export function portCurve(from,to){
 const bend=Math.max(28,(to.x-from.x)*.52),n=value=>Number(value.toFixed(2));
 return `M${n(from.x)} ${n(from.y)} C${n(from.x+bend)} ${n(from.y)} ${n(to.x-bend)} ${n(to.y)} ${n(to.x)} ${n(to.y)}`;
}

export function mountWorkflowConnections(container){
 const stage=container.querySelector('.we-workflow'),overlay=stage?.querySelector('.we-wires');
 if(!overlay)return ()=>{};
 let disposed=false,frame=0;
 const screens=Object.fromEntries([...stage.querySelectorAll('[data-flow-node]')].map(node=>[node.dataset.flowNode,node.querySelector('.we-screen')]));
 overlay.innerHTML=workflowLinks.map(link=>`<g data-wire="${link.id}" style="--wire:${link.color};--delay:${link.delay}s"><path class="we-wire-track"/><path class="we-wire-light" pathLength="100"/><circle class="we-wire-port from" r="4"/><circle class="we-wire-port to" r="4"/></g>`).join('');
 function update(){
  frame=0;if(disposed||!overlay.isConnected)return;
  const matrix=overlay.getScreenCTM();if(!matrix)return;
  const inverse=matrix.inverse();
  for(const link of workflowLinks){
   const source=screens[link.from[0]]?.getScreenCTM(),target=screens[link.to[0]]?.getScreenCTM();
   if(!source||!target)continue;
   const from=projectPort(link.from.slice(1),source,inverse),to=projectPort(link.to.slice(1),target,inverse);
   const group=overlay.querySelector(`[data-wire="${link.id}"]`),d=portCurve(from,to);
   group.querySelectorAll('path').forEach(path=>path.setAttribute('d',d));
   for(const [name,point] of [['from',from],['to',to]]){
    const circle=group.querySelector(`.${name}`);circle.setAttribute('cx',point.x);circle.setAttribute('cy',point.y);
   }
  }
 }
 function schedule(){if(!disposed&&!frame)frame=requestAnimationFrame(update)}
 const observer=new ResizeObserver(schedule);
 observer.observe(overlay);Object.values(screens).forEach(screen=>observer.observe(screen));
 schedule();document.fonts?.ready.then(schedule);
 return ()=>{disposed=true;observer.disconnect();if(frame)cancelAnimationFrame(frame)};
}
