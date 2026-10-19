import {createOpeningFilm} from './opening-film.js?v=event-cinematic-passage-20261019-85';
import * as THREE from './vendor/three.module.js';
import {createStarflight} from './event-starflight.js?v=event-cinematic-passage-20261019-85';
import {createUniverseVoyage} from './event-universe-voyage.js?v=event-cinematic-passage-20261019-85';
import {createAnniversaryMetal,createCelebrationStarlight} from './event-anniversary-metal.js?v=universe-celebration-20261019-60';
const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;

// The numeral is a destination in the same depth journey as the stars.
export function createCosmicTen(scene,data,renderer,lettering){
  const flight=createStarflight(scene),metal=createAnniversaryMetal(renderer),voyage=createUniverseVoyage(scene,lettering,{letteringOnly:true});
  const film=createOpeningFilm(renderer.domElement,{sharedRenderer:renderer,showAperture:false,showSun:false,showBackdrop:false,showEarth:false,deterministic:true});
  let filmWidth=0,filmHeight=0;
  const basePose={position:new THREE.Vector3(),quaternion:new THREE.Quaternion()};
  // One fixed destination in world space: a broad orbital horizon underneath the numeral.
  const groundGeometry=new THREE.PlaneGeometry(1,1);
  const groundPosition=groundGeometry.getAttribute('position'),groundUV=groundGeometry.getAttribute('uv');
  for(let i=0;i<groundPosition.count;i++)if(groundPosition.getY(i)<0){groundPosition.setY(i,-4.5);groundUV.setY(i,-4);}
  const groundMaterial=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,alphaTest:.04,toneMapped:false,color:0xcad6e4});
  const ground=new THREE.Mesh(groundGeometry,groundMaterial);ground.visible=false;ground.renderOrder=0;scene.add(ground);
  const groundReady=new Promise(resolve=>new THREE.TextureLoader().load('./assets/universe/earth-orbit-matte-v1.png',texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;groundMaterial.map=texture;groundMaterial.needsUpdate=true;resolve(true);
  },undefined,()=>resolve(false)));
  function configureCamera(time,camera){
    basePose.position.copy(camera.position);basePose.quaternion.copy(camera.quaternion);
    if(time<28.8)return;
    const arrival=ease((time-28.8)/5.7),remaining=1-arrival;
    camera.position.set(basePose.position.x-150*remaining,basePose.position.y+70*remaining,basePose.position.z+1200*remaining);
    camera.lookAt(basePose.position.x,basePose.position.y,0);
  }
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
  const starlight=createCelebrationStarlight(number,points.map(([x,y])=>[x-centerX,centerY-y]));
  const totalDistance=flight.distanceAt(34);
  function update(time,view,camera,svg,pixelRatio){
    flight.update(Math.min(time,21),view,camera);flight.root.visible=time>=19.4&&time<25.15;
    const distance=flight.distanceAt(time),travel=distance/totalDistance;
    voyage.update(time,view,camera,distance,totalDistance);
    const root=svg?.closest('#event-prelude');
    root?.style.setProperty('--event-space-scale',String(1+travel*.045));
    number.visible=time>=29.45;
    if(!svg)return;
    const arrival=ease((time-29.45)/5.05);
    const rect=svg.getBoundingClientRect(),scale=Math.min(rect.width/660,rect.height/570);
    const left=rect.left+(rect.width-660*scale)/2,top=rect.top+(rect.height-570*scale)/2;
    const planeHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*basePose.position.z;
    const worldPerPixel=planeHeight/view.height,nativeScale=scale*worldPerPixel;
    const targetX=(left+centerX*scale-view.width/2)*worldPerPixel;
    const targetY=basePose.position.y-(top+centerY*scale-view.height/2)*worldPerPixel;
    number.position.set(targetX,targetY,0);
    number.scale.setScalar(nativeScale);
    number.rotation.set(.015,-.12,0);
    ground.visible=time>=31.3;
    const groundZ=-500,groundWorldPerPixel=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*(basePose.position.z-groundZ)/view.height;
    const groundWidth=view.width*2.4,groundHeight=groundWidth/2;
    const horizon=view.height*.735;
    const groundCenterY=horizon+(.5-.32)*groundHeight;
    ground.scale.set(groundWidth*groundWorldPerPixel,groundHeight*groundWorldPerPixel,1);
    ground.position.set((left+centerX*scale-.13*groundWidth-view.width/2)*groundWorldPerPixel,basePose.position.y-(groundCenterY-view.height/2)*groundWorldPerPixel,groundZ);
    groundMaterial.opacity=ease((time-31.3)/.9);
    if(!number.visible)return;
    const discovery=ease((time-29.45)/.5);
    for(const material of [metal.face,metal.edge]){material.transparent=true;material.opacity=discovery;material.depthWrite=discovery>.98;}
    metal.update(arrival,time);starlight.update(time,pixelRatio);
  }
  function renderPassage(time,view){
    if(time<25.15)return false;
    if(view.width!==filmWidth||view.height!==filmHeight){film.resize();filmWidth=view.width;filmHeight=view.height;}
    // Let every letter pass before launching. Reveal the shared destination while still coasting.
    const launch=Math.max(0,time-25.15);
    const filmTime=Math.min(8.7,launch<.8?2.3+.65*launch+.25*launch*launch:2.98+1.05*(launch-.8));
    film.render(filmTime,{opacity:ease(launch/.35)});
    return true;
  }
  return {update,configureCamera,renderPassage,number,texturesReady:Promise.all([voyage.texturesReady,film.ready,groundReady])};
}
