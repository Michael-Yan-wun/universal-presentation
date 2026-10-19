import * as THREE from './vendor/three.module.js';
import {createEdgeHost} from './edge-host.js?v=winedge-detail-1';
import {palette} from './product-colors.js?v=product-colors-1';

// A physical architecture: real edge-computer geometry carries the software layers.
export function createCastleScene({group,brick,geometry,makeBrain,addLabel,agents}){
 const units=[],surfaces=[],traces=[];
 const colors={sense:new THREE.Color('#63d8c5'),learn:new THREE.Color('#a4bbfa'),act:new THREE.Color('#c8a7f4')};
 const spareGeo=new Set(),spareMat=new Set();
 const ownGeo=g=>(spareGeo.add(g),g),ownMat=m=>(spareMat.add(m),m);
 let step=0,elapsed=0,focus=0,reveal=1,assemblyMode=false;const shade=new THREE.Color(),dimColor=new THREE.Color('#0b1420');
 const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
 function register(root,layer,{moving=false,delay=0}={}){
  const unit={root,layer,home:root.position.clone(),scale:root.scale.clone(),moving,delay};units.push(unit);
  root.traverse(o=>{if(!o.material||Array.isArray(o.material))return;const source=o.material;o.material=ownMat(source.clone());const m=o.material;
   if(m.isMeshPhysicalMaterial){m.roughness=.27;m.metalness=.12;m.clearcoat=.48;m.clearcoatRoughness=.22;}
   surfaces.push({material:m,layer,transparent:m.transparent,depthWrite:m.depthWrite,color:m.color?.clone(),opacity:m.opacity,emissive:m.emissive?.clone(),emissiveIntensity:m.emissiveIntensity||0});
  });return unit;
 }
 function block(options,layer,delay=0){const o=brick(group,{detail:'hero',...options});o.castleManaged=true;const part=register(o.g,layer,{moving:true,delay});Object.assign(part,{kind:'brick',role:options.name||'',shape:[options.cols*1.05-.06,options.h,options.rows*1.05-.06]});return o;}
 // A visible, interlocking foundation supports the industrial computer.
 for(let i=0;i<3;i++)block({name:['ON-SITE','EDGE AI FOUNDATION','FIELD I/O'][i],cols:3,rows:3,h:.50,color:'#56677c',pos:[(i-1)*3.15,-3.35,.1]},'sense',i*.08);
 const host=createEdgeHost({parent:group,brick,addLabel:()=>{},id:'castle-hardware',name:'',detail:'hero',color:palette.unified,pos:[0,-2.30,0]});
 host.brick.g.visible=false;host.brick.castleManaged=true;host.root.scale.setScalar(1.45);Object.assign(register(host.root,'sense',{moving:true,delay:.25}),{kind:'hardware'});
 block({name:'WinEdge',sub:'VISION + DATA / FIELD INTELLIGENCE',cols:8,rows:2,h:1.0,color:palette.unified,pos:[0,-.88,0]},'sense',.48);
 block({name:'AIWinOps',sub:'VISION / TRAIN & VALIDATE',cols:4,rows:2,h:1.12,color:palette.vision,pos:[-2.1,.48,0]},'learn',.74);
 block({name:'NumOps',sub:'AUTOML + EXPERT SYSTEM',cols:4,rows:2,h:1.12,color:palette.analytics,pos:[2.1,.48,0]},'learn',.88);
 block({name:'WinChat',sub:'AGENT / RAG + SKILL',cols:6,rows:2,h:1.03,color:palette.chat,pos:[0,1.87,0]},'act',1.12);
 // Low stone wings retain the castle silhouette without dominating the products.
 for(const side of [-1,1]){
  for(let y=0;y<4;y++)block({cols:1,rows:2,h:.83,color:y===3?'#8293a6':'#495a70',pos:[side*4.72,-2.94+y*1.05,-.35]},'structure',.15+y*.08);
  for(const z of[-.87,.18])block({cols:1,rows:1,h:.35,color:'#8d9bad',pos:[side*4.72,.81,z]},'structure',.55);
 }
 // Modular station deck, with machined panel edges and quiet perimeter lighting.
 const deck=new THREE.Group();group.add(deck);
 const tile=ownMat(new THREE.MeshStandardMaterial({color:'#172638',metalness:.65,roughness:.36}));
 for(let x=-3;x<=3;x++)for(let z=-1;z<=1;z++){
  const m=new THREE.Mesh(geometry(1.62,.12,1.6,true),tile);m.position.set(x*1.68,-3.76,z*1.66);m.receiveShadow=true;m.castShadow=true;deck.add(m);
  if((x+z)%3===0){const strip=new THREE.Mesh(ownGeo(new THREE.BoxGeometry(.5,.008,.025)),ownMat(new THREE.MeshBasicMaterial({color:'#718da0',transparent:true,opacity:.45})));strip.position.set(x*1.68+.43,-3.692,z*1.66+.63);deck.add(strip);}
 }
 Object.assign(register(deck,'structure'),{kind:'deck'});
 function trace(points,layer,{radius=.016,beads=2,offset=0}={}){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
  const mat=ownMat(new THREE.MeshBasicMaterial({color:colors[layer],transparent:true,opacity:.26,depthWrite:false}));
  const path=new THREE.Mesh(ownGeo(new THREE.TubeGeometry(curve,72,radius,6,false)),mat);group.add(path);
  const dots=Array.from({length:beads},()=>{const dot=new THREE.Mesh(ownGeo(new THREE.SphereGeometry(.044,12,8)),ownMat(new THREE.MeshBasicMaterial({color:colors[layer]})));group.add(dot);return dot;});traces.push({curve,mat,path,dots,layer,offset});return curve;
 }
 const rails=[-4.30,4.30];
 rails.forEach((x,i)=>trace([[x,-3.4,1.35],[x,-2.2,1.35],[x,-.9,1.35],[x,1.18,.8],[x*.78,1.7,.5]],'sense',{offset:i*.4}));
 const rig=new THREE.Group();group.add(rig);
 agents.forEach((a,i)=>{
  const x=(i-2)*2.72,y=4.35+(2-Math.abs(i-2))*.22;
  const brain=makeBrain(rig,['#83c9bd','#dca272','#ba9cde','#7faccd','#a3b7c9'][i],.96);brain.position.set(x,y,-.3);
  Object.assign(register(brain,'act',{moving:true,delay:1.3+i*.08}),{kind:'brain',brainIndex:i});
  const label=addLabel(brain,new THREE.Vector3(0,.94,0),a.zh,a.id,'#d8c5a7','ct-domain-label','castle');
  label.setAttribute('tabindex','-1');label.setAttribute('aria-label',a.zh);label.onclick=null;
  trace([[(i-2)*.38,2.52,0],[x*.52,3.23,-.1],[x,y-.54,-.3]],'act',{radius:.011,offset:i*.18});
 });
 // The outside path returns intelligence to the devices instead of ending at a brain.
 trace([[2.95,1.8,.65],[5.55,1.8,.75],[5.85,-.9,.95],[5.9,-3.27,1.42],[3.8,-3.60,1.42],[1.7,-3.60,1.42]],'act',{radius:.021,beads:3,offset:.25});
 trace([[-2.1,1.15,1.2],[0,1.15,1.2],[2.1,1.15,1.2]],'learn',{radius:.015,offset:.15});
 const arrow=new THREE.Mesh(ownGeo(new THREE.ConeGeometry(.085,.22,16)),ownMat(new THREE.MeshBasicMaterial({color:'#c8a7f4'})));arrow.rotation.z=Math.PI/2;arrow.position.set(1.7,-3.60,1.42);group.add(arrow);
 const halo=new THREE.Mesh(ownGeo(new THREE.RingGeometry(5.75,5.77,128)),ownMat(new THREE.MeshBasicMaterial({color:'#a2cbbb',transparent:true,opacity:.22,side:THREE.DoubleSide})));halo.rotation.x=-Math.PI/2;halo.scale.y=.55;halo.position.set(0,-3.68,0);group.add(halo);
 function strength(layer){if(layer==='structure')return .72;if(step===0)return 1;if(step===1)return layer==='sense'?1:.28;if(step===2)return layer==='learn'?1:layer==='sense'?.6:.28;return layer==='act'?1:.83;}
 return {
  get step(){return step;},
  getAssemblyParts(){return units;},
  setAssemblyMode(value){assemblyMode=value;},
  setAssemblyDecorations(value){for(const route of traces){route.path.visible=value>0;route.mat.opacity=.3*value;route.dots.forEach(dot=>{dot.visible=value>.2;dot.material.transparent=true;dot.material.opacity=value;});}halo.visible=arrow.visible=value>0;halo.material.opacity=.18*value;arrow.material.transparent=true;arrow.material.opacity=value;},
  reset(value=0,{assembled=false}={}){step=Math.max(0,Math.min(3,value));focus=step;elapsed=assembled?10:0;units.forEach(u=>{u.root.position.copy(u.home);if(u.moving&&!assembled)u.root.position.y+=2.2;u.root.scale.copy(u.scale);});},
  setReveal(value){reveal=THREE.MathUtils.clamp(value,0,1);for(const s of surfaces){s.material.opacity=s.opacity*reveal;s.material.transparent=s.transparent||reveal<.999;s.material.depthWrite=s.depthWrite&&reveal>=.999;}},
  setStep(value){step=Math.max(0,Math.min(3,value));},
  view(aspect=1.5){const f=focus;return {x:1.8-.4*Math.sin(f*Math.PI/3),y:4.8-.6*Math.sin(f*Math.PI/3),z:(23.1-(step===1||step===2?1.0:0))*Math.max(1,1.36/aspect),targetY:step===1?.4:step===2?.9:1.15};},
  update(dt,time,reduced){
   if(assemblyMode)return;
   elapsed+=dt;const ease=reduced?1:1-Math.exp(-dt*2.8);focus+=(step-focus)*ease;
   for(const u of units){
    const p=reduced?1:smooth((elapsed-u.delay)/1.3);const active=step>0&&u.layer===['whole','sense','learn','act'][step];
    const lift=active&&u.layer!=='sense'&&u.layer!=='structure'?.10:0;
    u.root.position.x=u.home.x;u.root.position.z=u.home.z;u.root.position.y+=(u.home.y+lift+(u.moving?(1-p)*2.2:0)-u.root.position.y)*ease;
    const k=u.moving?.92+.08*p:1;u.root.scale.copy(u.scale).multiplyScalar(k);
   }
   for(const s of surfaces){const k=strength(s.layer);if(s.color)s.material.color.lerp(shade.copy(s.color).lerp(dimColor,1-k),ease);s.material.opacity+=(s.opacity*(s.transparent?k:1)*reveal-s.material.opacity)*ease;if(s.emissive){s.material.emissive.copy(s.emissive);s.material.emissiveIntensity=s.emissiveIntensity;if(s.material.isMeshPhysicalMaterial&&s.layer!=='structure'){s.material.emissive.copy(s.color);s.material.emissiveIntensity=step>0&&k===1?.09:.015;}}}
   for(const route of traces){const k=strength(route.layer);route.mat.opacity=(.12+.24*k)*reveal;route.dots.forEach((dot,i)=>{dot.material.opacity=k*reveal;dot.material.transparent=true;dot.position.copy(route.curve.getPoint((time*(reduced?0:.14)+i/route.dots.length+route.offset)%1));dot.visible=k>.4;});}
   halo.material.opacity=(reduced?.2:.16+Math.sin(time*.55)*.035)*reveal;arrow.material.transparent=reveal<1;arrow.material.opacity=reveal;
  },
  dispose(){for(const geo of spareGeo)geo.dispose();for(const mat of spareMat)mat.dispose();}
 };
}
