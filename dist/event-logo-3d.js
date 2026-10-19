import {createCosmicTen} from './event-cosmic-ten.js?v=event-cinematic-passage-20261019-85';
import * as THREE from './vendor/three.module.js';

// A single, finite studio shot. The event controller owns its clock and replay.
export const LOGO_REVEAL_SECONDS=20;
let renderer,scene,camera,group,finishLight,cosmicTen,ready=false,failed=false,sceneDirty=true,previousHost;
const pieces=[],lights=[];
const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
const workingLight=new THREE.Vector3();

function studioEnvironment(){
  const room=new THREE.Scene();room.background=new THREE.Color('#101820');
  const panel=(w,h,color,pos,rot)=>{
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
    mesh.position.set(...pos);mesh.rotation.set(...rot);room.add(mesh);
  };
  panel(400,1000,0xcedae3,[-450,100,120],[0,Math.PI/2,0]);
  panel(125,900,0xffffff,[350,120,270],[0,-.75,0]);
  panel(700,90,0xb8c5cd,[0,400,100],[Math.PI/2,0,.12]);
  panel(550,130,0x526b80,[80,-350,30],[-Math.PI/2,0,-.25]);
  panel(430,650,0xb2c5d2,[-90,80,500],[0,Math.PI,0]);
  panel(90,800,0x182330,[180,0,470],[0,Math.PI,0]);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const target=pmrem.fromScene(room,.025,.1,1500);pmrem.dispose();
  room.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});
  return target.texture;
}
function satinTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;
  const ctx=c.getContext('2d'),pixels=ctx.createImageData(512,512);
  let seed=7241;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<512;y++){const grain=148+random()*14;for(let x=0;x<512;x++){const v=grain+random()*5;const i=(y*512+x)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}}
  ctx.putImageData(pixels,0,0);const texture=new THREE.CanvasTexture(c);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(.018,.018);texture.anisotropy=4;return texture;
}

function craftedMaterial(color,side=false,textFace=false){
  // Keep both lines of lettering on one stable brand gray-blue; their physical sides retain depth.
  const material=textFace?new THREE.MeshBasicMaterial({color,toneMapped:false}):new THREE.MeshPhysicalMaterial({color,metalness:side?.83:.78,roughness:side?.34:.29,envMapIntensity:side?1.1:1.9,clearcoat:.12,clearcoatRoughness:.4});
  const uniforms={cut:{value:300},finished:{value:0},lightPoint:{value:new THREE.Vector3()},glint:{value:0}};
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,{uCraftCut:uniforms.cut,uCraftFinish:uniforms.finished,uCraftPoint:uniforms.lightPoint,uCraftGlint:uniforms.glint});
    shader.vertexShader='varying vec3 vSculpturePosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSculpturePosition=position;');
    shader.fragmentShader='varying vec3 vSculpturePosition;\nuniform float uCraftCut;\nuniform float uCraftFinish;\nuniform vec3 uCraftPoint;\nuniform float uCraftGlint;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
      float worked=smoothstep(-1.4,.8,vSculpturePosition.y-uCraftCut);
    `).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
      roughnessFactor=mix(.84,roughnessFactor,worked);
    `).replace('#include <opaque_fragment>',`
      float edgeLight=exp(-pow((vSculpturePosition.y-uCraftCut)/.42,2.0));
      outgoingLight*=mix(.025,1.0,worked);
      float contact=exp(-length(vSculpturePosition.xy-uCraftPoint.xy)/16.0);
      outgoingLight+=vec3(.55,.72,.86)*edgeLight*(.015+contact*.36)*uCraftGlint;
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey=()=> textFace?'aiwin-precision-carving-text-v2':'aiwin-precision-carving-v1';
  material.userData.craft=uniforms;return material;
}
async function init(){
  const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),6500);
  try{
    const [data,tenData,lettering]=await Promise.all([fetch('./assets/aiwin-logo-smooth.json?v=starflight-20261019-45',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Logo unavailable');return r.json();}),fetch('./assets/anniversary-ten-contours.json?v=starflight-20261019-45',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Anniversary unavailable');return r.json();}),fetch('./assets/ai-universe-lettering-bold.json?v=universe-celebration-20261019-60',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Universe lettering unavailable');return r.json();})]);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(0x000000,0);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    renderer.domElement.setAttribute('aria-hidden','true');
    renderer.domElement.addEventListener('webglcontextlost',()=>{failed=true;});
    scene=new THREE.Scene();scene.environment=studioEnvironment();
    camera=new THREE.PerspectiveCamera(31,1,.5,9000);group=new THREE.Group();scene.add(group);
    scene.add(new THREE.HemisphereLight(0xd9e4ef,0x0a101a,1.0));
    finishLight=new THREE.DirectionalLight(0xf1f6ff,1.4);finishLight.position.set(-60,100,360);scene.add(finishLight);
    const key=new THREE.PointLight(0xe5edf6,65000,1200,2);key.position.set(-130,260,200);scene.add(key);lights.push(key);
    const rim=new THREE.PointLight(0xc8dfff,23000,1000,2);rim.position.set(180,30,120);scene.add(rim);
    const tool=new THREE.PointLight(0xe7f2ff,1700,150,2);scene.add(tool);lights.push(tool);
    const brush=satinTexture();
    for(const component of data.components){
      const p=component.points,ys=p.map(v=>v[1]);
      const bounds={top:Math.min(...ys),bottom:Math.max(...ys)};
      const shape=new THREE.Shape(p.map(([x,y])=>new THREE.Vector2(x-168,224-y)));
      for(const hole of component.holes??[])shape.holes.push(new THREE.Path(hole.map(([x,y])=>new THREE.Vector2(x-168,224-y))));
      const isTagline=component.kind==='tagline'||bounds.top>410;
      const isLetter=bounds.top>300,isFoot=bounds.top>170&&component.material==='slate';
      const start=isLetter?15:isFoot?12:component.material==='orange'?(bounds.bottom<160?6.9:5.1):0;
      const duration=isLetter?2.8:isFoot?3.4:component.material==='orange'?(bounds.bottom<160?6.4:8.9):8.7;
      const face=craftedMaterial(component.material==='orange'?0xe97700:0x71858c,false,isLetter);
      const side=craftedMaterial(component.material==='orange'?0x96500e:0x3b4c58,true);
      if(!isLetter)face.roughnessMap=brush;
      const bevel=isTagline?.025:isLetter?.55:.95;
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:isTagline?.25:isLetter?4.2:component.material==='orange'?10.5:9.5,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:isTagline?2:12,steps:1,curveSegments:24});
      const mesh=new THREE.Mesh(geometry,[face,side]);group.add(mesh);
      pieces.push({mesh,face,side,start,duration,material:component.material,top:224-bounds.top+bevel,bottom:224-bounds.bottom-bevel});
    }
    cosmicTen=createCosmicTen(scene,tenData,renderer,lettering);
    cosmicTen.texturesReady.then(()=>{sceneDirty=true;});
    ready=true;
  }catch(error){failed=true;console.warn('Logo reveal uses still fallback',error);}
  finally{clearTimeout(timeout);}
}
init();
export const logo3DSettled=()=>ready||failed;

function grayShot(time){
  const p=ease(time/8.7),cut=224-180*p;
  return {x:180*p*.45,y:cut+9,z:lerp(103,147,p),side:lerp(48,42,p),up:15};
}
function cameraBridge(a,b,velocityA,velocityB,t,duration){
  const t2=t*t,t3=t2*t,result={};
  for(const key of ['x','y','z','side','up'])result[key]=(2*t3-3*t2+1)*a[key]+(t3-2*t2+t)*duration*velocityA[key]+(-2*t3+3*t2)*b[key]+(t3-t2)*duration*velocityB[key];
  return result;
}
function composition(time){
  // One continuous handoff: hold both materials in view before entering the W.
  if(time<6.4)return grayShot(time);
  const shoulder={x:77,y:78,z:167,side:40,up:13};
  const shoulderVelocity={x:-18,y:-18,z:9,side:-2,up:-.6};
  const wEnd={x:-48,y:-28,z:205,side:30,up:12};
  const zero={x:0,y:0,z:0,side:0,up:0};
  if(time<9.4){
    const u=6.4/8.7,derivative=6*u*(1-u)/8.7;
    const incoming={x:81*derivative,y:-180*derivative,z:44*derivative,side:-6*derivative,up:0};
    return cameraBridge(grayShot(6.4),shoulder,incoming,shoulderVelocity,(time-6.4)/3,3);
  }
  if(time<14)return cameraBridge(shoulder,wEnd,shoulderVelocity,zero,(time-9.4)/4.6,4.6);
  const p=ease((time-14)/5.5);
  return {x:lerp(-48,0,p),y:lerp(-28,-3,p),z:lerp(205,1030,p),side:lerp(30,0,p),up:lerp(12,0,p)};
}
export function drawLogo3D(host,time){
  if(!host)return;
  if(failed){host.classList.add('logo-3d-fallback');delete host.closest('#event-prelude').dataset.cosmicTen;host.parentElement.style.opacity=time>LOGO_REVEAL_SECONDS?'0':'1';return;}
  if(!ready)return;
  if(previousHost!==host){host.append(renderer.domElement);previousHost=host;}
  const root=host.closest('#event-prelude');root.dataset.cosmicTen='true';
  const backdrop=host.parentElement.querySelector('.event-logo-stage-backdrop');if(backdrop)backdrop.style.opacity=String(1-ease((time-18.7)/1.3));
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  const size=renderer.getSize(new THREE.Vector2());
  const resized=size.x!==w||size.y!==h;
  if(time>39.5&&!resized&&!sceneDirty)return;
  if(resized){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  time=Math.min(time,39.5);
  // Keep the original broad carving composition; carry the lens ahead a little.
  const sculptTime=time*1.08,shot=composition(time*1.12);
  const passage=ease((time-18.7)/1.5),logoFade=1-ease((time-19.1)/1.0);
  const portalAim=145*ease((time-18.7)/1.3);
  group.scale.setScalar(1);
  const wideCorrection=camera.aspect>1.45?1:1.12;
  camera.position.set(shot.x+shot.side,shot.y+shot.up+portalAim,shot.z*wideCorrection);
  camera.lookAt(shot.x,shot.y+portalAim,4);
  group.position.z=camera.position.z*1.08*passage;
  // The tool glow follows the working edge; only completed material is rendered.
  const grayCut=224-180*ease(sculptTime/8.7),orangeCut=lerp(93.25,-58.95,ease((sculptTime-5.1)/8.9));
  const handoff=ease((sculptTime-6.4)/3);
  workingLight.set(shot.x,lerp(grayCut,orangeCut,handoff),22);
  lights[1].position.copy(workingLight);
  lights[1].intensity=lerp(1700,500,handoff)*(1-ease((time-14)/2));
  finishLight.intensity=1.4+2.6*ease((time-14)/4.5);
  finishLight.position.x=lerp(-120,90,ease((time-13)/6));
  lights[0].position.x=-130+Math.sin(time*.14)*65;
  for(const piece of pieces){
    const progress=ease((sculptTime-piece.start)/piece.duration);
    piece.mesh.visible=true;
    const materialArrival=piece.material==='orange'?ease((sculptTime-5.1)/2.8):1;
    const boundary=lerp(piece.top+2,piece.bottom-2,progress);
    for(const material of [piece.face,piece.side]){
      material.transparent=true;material.opacity=materialArrival*logoFade;
      const u=material.userData.craft;u.cut.value=boundary;u.finished.value=progress;
      u.lightPoint.value.set(shot.x,boundary,8);u.glint.value=(1-ease((progress-.86)/.14));
    }
  }
  group.visible=logoFade>.001;
  cosmicTen.configureCamera(time,camera);
  cosmicTen.update(time,{width:w,height:h},camera,root.querySelector('.event-ten'),renderer.getPixelRatio());
  const passageRendered=cosmicTen.renderPassage(time,{width:w,height:h});
  const autoClear=renderer.autoClear;
  if(passageRendered){renderer.autoClear=false;renderer.clearDepth();}
  renderer.render(scene,camera);renderer.autoClear=autoClear;sceneDirty=false;
}
