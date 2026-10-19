import * as THREE from './vendor/three.module.js';
import {createStarflight} from './event-starflight.js?v=starflight-20261019-45';
import {createAnniversaryMetal} from './event-anniversary-metal.js?v=starflight-20261019-45';
const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;

// The numeral is a destination in the same depth journey as the stars.
export function createCosmicTen(scene,data,renderer){
  const flight=createStarflight(scene),metal=createAnniversaryMetal(renderer);
  const number=new THREE.Group();scene.add(number);
  const points=data.components.flatMap(c=>c.points);
  const centerX=(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2;
  const centerY=(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2;
  for(const component of data.components){
    const shape=new THREE.Shape(component.points.map(([x,y])=>new THREE.Vector2(x-centerX,centerY-y)));
    for(const hole of component.holes??[])shape.holes.push(new THREE.Path(hole.map(([x,y])=>new THREE.Vector2(x-centerX,centerY-y))));
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:30,bevelEnabled:true,bevelSize:1.35,bevelThickness:1.55,bevelSegments:12,steps:1,curveSegments:32});
    geometry.translate(0,0,-15);number.add(new THREE.Mesh(geometry,[metal.face,metal.edge]));
  }
  const totalDistance=flight.distanceAt(30);
  function update(time,view,camera,svg,pixelRatio){
    flight.update(time,view,camera);
    const distance=flight.distanceAt(time),travel=distance/totalDistance;
    const root=svg?.closest('#event-prelude');
    root?.style.setProperty('--event-space-scale',String(1+travel*.045));
    number.visible=time>=19.7;
    if(!number.visible||!svg)return;
    const compose=ease((time-24.3)/2.0),arrival=ease((time-19.7)/3.1);
    const rect=svg.getBoundingClientRect(),scale=Math.min(rect.width/660,rect.height/570);
    const left=rect.left+(rect.width-660*scale)/2,top=rect.top+(rect.height-570*scale)/2;
    const planeHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
    const worldPerPixel=planeHeight/view.height,nativeScale=scale*worldPerPixel;
    const targetX=(left+centerX*scale-view.width/2)*worldPerPixel;
    const targetY=camera.position.y-(top+centerY*scale-view.height/2)*worldPerPixel;
    const heroY=camera.position.y+view.height*.025*worldPerPixel;
    number.position.set(lerp(0,targetX,compose),lerp(heroY,targetY,compose),distance-totalDistance);
    // Keep world size fixed during the journey: approach creates the growth.
    number.scale.setScalar(nativeScale*lerp(1.65,1,compose));
    number.rotation.set(lerp(.04,.015,arrival),lerp(-.24,-.12,arrival),0);
    const discovery=ease((time-19.7)/.6);
    for(const material of [metal.face,metal.edge]){material.transparent=true;material.opacity=discovery;material.depthWrite=discovery>.98;}
    metal.update(arrival,time);
  }
  return {update,number};
}
