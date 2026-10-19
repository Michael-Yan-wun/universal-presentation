import {visionCurriculum} from './aiwinops-keynote.js?v=castle-first-1';
import * as THREE from './vendor/three.module.js';
import {createFieldKit} from './field-kit.js?v=learning-life-1';
import {createLearningLife} from './learning-life.js?v=learning-life-1';
import { historyCases, visionCases, palette } from './content.js?v=castle-first-1';

// A presenter-controlled journey. The moat is reserved until all disciplines have stories.
export function createHistoryWall({group, brick, renderer, geometry, addLabel, onStage}) {
  const overview=new THREE.Group(),room=new THREE.Group();group.add(overview,room);
  room.position.z=-32;
  const pieces=[], exhibits=[], textures=[], loader=new THREE.TextureLoader();
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const clamp=t=>THREE.MathUtils.clamp(t,0,1);
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  let phase='overview',clock=0,selected=-1,completed=false,entryAge=0,caseOpen=false,learningStep=0;
  let transitionStarts=[];
  const captureExhibits=()=>{transitionStarts=exhibits.map(({o})=>({position:o.g.position.clone(),scale:o.g.scale.x,rotation:o.g.rotation.y}))};
  const visited=new Set();
  const canFuse=()=>visited.size===visionCases.length;
  const overviewCamera=V(5,6,26),overviewTarget=V(-2,0,0),roomCamera=V(0,4.8,-12),roomTarget=V(0,-.15,-32);
  const cameraPosition=overviewCamera.clone(),cameraTarget=overviewTarget.clone(),returnCamera=roomCamera.clone();
  function notify(){onStage({phase,selected,completed,caseOpen,learningStep,visited:[...visited],canFuse:canFuse()})}
  function change(next){phase=next;clock=0;notify()}
  function managed(parent,options){const o=brick(parent,{detail:'hero',...options});o.historyManaged=true;return o}
  function piece(options,delay){const o=managed(overview,options);pieces.push({o,delay});return o}
  function screen(o,c,full=false){
    const width=o.w-.22,height=o.h-.2;
    const tex=loader.load('./assets/'+c.image,t=>{const a=t.image.width/t.image.height*(!full&&c.crop?c.crop[2]/c.crop[3]:1);const h=Math.min(height,width/a);mesh.scale.set(h*a,h,1)});textures.push(tex);
    tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
    if(!full&&c.crop){const [x,y,w,h]=c.crop;tex.repeat.set(w,h);tex.offset.set(x,1-y-h)}
    const recess=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({color:'#101c2d',toneMapped:false}));recess.position.set(0,0,o.d/2+.05);o.g.add(recess);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));mesh.position.set(0,0,o.d/2+.051);o.g.add(mesh);
  }
  // Preserve the falling-brick entrance, but hold before the wall closes.
  historyCases.forEach((c,i)=>{
    const x=(i-1)*4.2+3,start=i*.5,id=i===0?'history-vision':c.caseId;
    piece({id,cols:4,rows:3,h:.62,color:c.color,pos:[x,-2.8,0],name:['VISION','DATA','LLM'][i]},start);
    const hero=piece({id,cols:4,rows:2,h:2.25,color:c.color,pos:[x,-1.11,.51]},start+.3);
    screen(hero,i===0?visionCases[0]:c,i!==0);
    piece({id,cols:4,rows:2,h:.84,color:c.color,pos:[x,.655,.51],name:['VISION','DATA','LLM'][i],sub:['IMAGE INTELLIGENCE','DATA INTELLIGENCE','LANGUAGE INTELLIGENCE'][i]},start+1);
    for(let j=0;j<2;j++)piece({id,cols:2,rows:2,h:.5,color:c.color,pos:[x+(j-.5)*2.1,1.575,.51]},start+1.5+j*.15);
  });
  const earned=managed(overview,{id:'history-vision',name:'AIWinOps',sub:'VISION INTELLIGENCE',cols:4,rows:2,h:1.25,color:palette.vision,pos:[-1.2,2.5,.51]});
  earned.g.visible=false;
  const learner=createLearningLife(overview);
  // A physical room beneath the source brick: modular floor, structural ribs, a field of projects and five featured exhibits.
  const architecture=new THREE.Group();room.add(architecture);
  const floorGeo=new THREE.BoxGeometry(1.94,.18,1.94);
  const floorMat=new THREE.MeshStandardMaterial({color:'#101d2c',roughness:.36,metalness:.42});
  const tiles=new THREE.InstancedMesh(floorGeo,floorMat,12*11),dummy=new THREE.Object3D();let n=0;
  for(let x=0;x<12;x++)for(let z=0;z<11;z++){dummy.position.set((x-5.5)*2,-2.9,(z-5)*2);dummy.updateMatrix();tiles.setMatrixAt(n++,dummy.matrix)}architecture.add(tiles);
  const structure=new THREE.LineBasicMaterial({color:'#6488b7',transparent:true,opacity:.19});
  for(const z of [-6,-2,3,8]){
    const points=[[-11,-2.8,z],[-11,5,z],[11,5,z],[11,-2.8,z]].map(p=>V(...p));
    architecture.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),structure));
  }
  const railPoints=[];for(const x of [-10,10])railPoints.push(x,-2.79,-10,x,-2.79,10);
  const railGeo=new THREE.BufferGeometry();railGeo.setAttribute('position',new THREE.Float32BufferAttribute(railPoints,3));architecture.add(new THREE.LineSegments(railGeo,structure));
  const roomLight=new THREE.PointLight('#c8b5a2',18,20,2);roomLight.position.set(0,4,2);room.add(roomLight);
  visionCases.forEach((c,i)=>{
    const pos=[(i-2)*4.45,-.05,Math.abs(i-2)>1?.5:-.8];
    const stand=managed(room,{cols:3,rows:3,h:.45,color:'#23384e',pos:[pos[0],-2.48,pos[2]]});
    const o=managed(room,{id:'history-case-'+i,cols:3,rows:2,h:2.25,color:palette.vision,pos});screen(o,c);
    const label=addLabel(o.g,V(0,-1.75,1.2),c.title,'history-case-'+i,palette.vision,'vision-case-label','history');
    label.innerHTML=`<small>0${i+1} / ${c.category}</small><strong>${c.title}</strong><span>${c.industry} · ${c.ability}</span>`;
    label.setAttribute('aria-label','探索'+c.title);
    const footGeo=new THREE.RingGeometry(.95,1.015,48),foot=new THREE.Mesh(footGeo,new THREE.MeshBasicMaterial({color:'#7c9bc8',transparent:true,opacity:.28,side:THREE.DoubleSide}));foot.rotation.x=-Math.PI/2;foot.scale.set(1.5,1.05,1);foot.position.set(pos[0],-2.23,pos[2]);room.add(foot);
    exhibits.push({o,stand,label,foot,from:V((i-2)*4.5,-1.5+(i%2)*.6,-8-(i%3)*2)});
  });
  // Project archive: quiet, grounded terraces of interlocking bricks, not floating debris.
  const cloud=new THREE.Group();room.add(cloud);
  const cloudMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.32,metalness:.32});
  const count=144,bodies=new THREE.InstancedMesh(geometry(1.12,.4,.64),cloudMat,count),studs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.15,.155,.12,18),cloudMat,count*2),lips=new THREE.InstancedMesh(new THREE.TorusGeometry(.115,.01,4,18),cloudMat,count*2);
  cloud.add(bodies,studs,lips);const cloudRoot=new THREE.Object3D(),part=new THREE.Object3D(),matrix=new THREE.Matrix4(),color=new THREE.Color(),archive=[];
  const random=i=>{const n=Math.sin(i*78.233+31.41)*43758.5453;return n-Math.floor(n)};
  function writeArchive(i){
    cloudRoot.updateMatrix();bodies.setMatrixAt(i,cloudRoot.matrix);
    for(let j=0;j<2;j++){part.position.set((j-.5)*.55,.27,0);part.rotation.set(0,0,0);part.updateMatrix();matrix.multiplyMatrices(cloudRoot.matrix,part.matrix);studs.setMatrixAt(i*2+j,matrix);part.position.y=.334;part.rotation.x=Math.PI/2;part.updateMatrix();matrix.multiplyMatrices(cloudRoot.matrix,part.matrix);lips.setMatrixAt(i*2+j,matrix)}
  }
  for(let i=0;i<count;i++){
    const row=Math.floor(i/18),col=i%18,x=(col-8.5)*1.27+(row%2)*.18;
    cloudRoot.position.set(x,-2.53+row*.18,-4.7-row*.94);cloudRoot.rotation.set(0,0,0);cloudRoot.scale.setScalar(1);writeArchive(i);
    archive.push({position:cloudRoot.position.clone(),angle:Math.atan2(cloudRoot.position.z,cloudRoot.position.x),radius:Math.hypot(cloudRoot.position.x,cloudRoot.position.z),seed:random(i)});
    color.set(['#172b40','#1d344b','#213b53','#193147'][i%4]);bodies.setColorAt(i,color);for(let j=0;j<2;j++){studs.setColorAt(i*2+j,color);lips.setColorAt(i*2+j,color)}
  }
  function archiveDirty(){bodies.instanceMatrix.needsUpdate=studs.instanceMatrix.needsUpdate=lips.instanceMatrix.needsUpdate=true}
  function resetArchive(){cloud.visible=true;archive.forEach((a,i)=>{cloudRoot.position.copy(a.position);cloudRoot.rotation.set(0,0,0);cloudRoot.scale.setScalar(1);writeArchive(i)});archiveDirty()}
  // Fine orbital trails describe the funnel without hiding the physical bricks.
  const vortex=new THREE.Group();room.add(vortex);const trails=[];
  for(let i=0;i<7;i++){
    const points=[];for(let j=0;j<=90;j++){const t=j/90,y=-2.1+t*5.8,r=1.1+t*4.4,a=t*Math.PI*3+i*Math.PI*2/7;points.push(V(Math.cos(a)*r,y,Math.sin(a)*r))}
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:i%2?'#87a9d2':'#d2e5ff',transparent:true,opacity:0}));vortex.add(line);trails.push(line);
  }
  const birthLight=new THREE.PointLight('#bfdcff',0,27,2);birthLight.position.set(0,2,0);room.add(birthLight);
  const field=createFieldKit(room);field.group.visible=false;
  const product=managed(room,{name:'AIWinOps',sub:'AI VISION PLATFORM',color:palette.vision,cols:5,rows:3,h:1.6,pos:[0,-.5,0]});
  const pulse=new THREE.Mesh(new THREE.RingGeometry(1,1.03,100),new THREE.MeshBasicMaterial({color:'#adc9ee',transparent:true,opacity:0,side:THREE.DoubleSide}));pulse.rotation.x=-Math.PI/2;pulse.position.y=-2.7;room.add(pulse);
  const particles=[];
  for(let i=0;i<24;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.1),new THREE.MeshBasicMaterial({color:i%3?'#7c9bc8':'#d7e5f7'}));room.add(m);particles.push(m)}
  function restoreExhibits(){field.group.visible=false;field.layoutMode=false;field.group.position.set(0,0,0);field.layout(false);resetArchive();vortex.visible=false;birthLight.intensity=0;for(const {o,stand,foot} of exhibits){o.g.position.copy(o.home);o.g.scale.setScalar(1);o.g.rotation.set(0,0,0);o.g.visible=stand.g.visible=foot.visible=true;stand.g.position.copy(stand.home);stand.g.rotation.set(0,0,0);stand.g.scale.setScalar(1)}product.g.visible=false;particles.forEach(p=>p.visible=false);pulse.material.opacity=0}
  function resetRound(){learningStep=0;selected=-1;completed=false;caseOpen=false;visited.clear();earned.g.visible=false;restoreExhibits()}
  function restart(){resetRound();phase='overview';clock=entryAge=0;overview.visible=true;room.visible=false;cameraPosition.copy(overviewCamera);cameraTarget.copy(overviewTarget);notify()}
  function action(type,index){
    if(type==='enter'&&phase==='overview'){resetRound();change('entering');return true}
    if(type==='select'&&['room','hardware'].includes(phase)&&Number.isInteger(index)&&index>=0&&index<exhibits.length){if(caseOpen&&selected===index)return true;captureExhibits();exhibits.forEach(({o,stand,foot})=>o.g.visible=stand.g.visible=foot.visible=true);field.group.visible=false;selected=index;caseOpen=false;change('selecting');return true}
    if(type==='close'&&phase==='room'&&caseOpen){captureExhibits();caseOpen=false;change('settling');return true}
    if(type==='hardware'&&phase==='room'&&caseOpen){caseOpen=false;visited.add(selected);field.layout(false);change('hardware');return true}
    if(type==='fuse'&&['room','hardware'].includes(phase)&&canFuse()){learningStep=0;caseOpen=false;field.layout(true);exhibits.forEach(({o,stand})=>{o.g.visible=true;stand.g.visible=false});change('learning');return true}
    if(type==='train'&&phase==='learning'){if(learningStep<visionCurriculum.length-1){learningStep++;notify();return true}captureExhibits();field.group.visible=false;change('fusing');return true}
    if(type==='back'&&['room','hardware','learning','product'].includes(phase)){caseOpen=false;returnCamera.copy(cameraPosition);change('returning');return true}
    if(type==='restart'&&phase==='product'){resetRound();change('room');return true}
    return false;
  }
  function advance(){
    if(phase==='overview')action('enter');
    else if(phase==='hardware'){if(canFuse()&&selected===visionCases.length-1)action('fuse');else action('select',selected<visionCases.length-1?selected+1:visionCases.findIndex((_,i)=>!visited.has(i)))}
    else if(phase==='learning')action('train');
    else if(phase==='room'){
      if(caseOpen){action('hardware');return}
      if(canFuse()&&(!caseOpen||selected===visionCases.length-1))action('fuse');
      else if(caseOpen&&selected<visionCases.length-1)action('select',selected+1);
      else action('select',visionCases.findIndex((_,i)=>!visited.has(i)));
    }else if(phase==='product')action('back');
  }
  function previous(){
    if(phase==='overview')return false;
    if(phase==='room'&&caseOpen){if(selected>0)action('select',selected-1);else action('close')}
    else if(phase==='learning'){if(learningStep>0){learningStep--;notify()}else{selected=visionCases.length-1;field.layout(false);change('hardware')}}
    else if(phase==='product'){product.g.visible=false;field.group.visible=false;learningStep=visionCurriculum.length-1;change('learning')}
    else if(phase==='hardware')action('select',selected);else if(phase==='room')action('back');return true;
  }
  function update(age,reduced,dt){
    clock+=dt;entryAge+=dt;const duration=d=>reduced?.01:d;
    earned.g.visible=completed;architecture.visible=phase!=='product';if(phase!=='fusing')cloud.visible=false;
    learner.hide();
    if(phase==='overview'){
      overview.visible=true;room.visible=false;cameraPosition.copy(overviewCamera);cameraTarget.copy(overviewTarget);
      learner.show(overview,'overview');learner.update(age,reduced,reduced?1:clamp((entryAge-2.8)/1.6),completed?1:clamp((entryAge-4)/11));
      for(const {o,delay} of pieces){const p=reduced?1:clamp((entryAge-delay)/1.25);o.g.visible=entryAge>=delay||reduced;o.g.position.copy(o.home);o.g.position.y+=Math.pow(1-p,3)*7;o.g.rotation.z=Math.sin(p*Math.PI)*.035;o.g.scale.setScalar(1)}
    }else if(phase==='entering'){
      const time=reduced?8.8:clock;
      // Enter the face, hold the metallic VISION title, then bring five projects forward.
      if(time<1.5){const k=ease(clamp(time/1.5));cameraPosition.lerpVectors(overviewCamera,V(-1.2,-.4,1.1),k);cameraTarget.lerpVectors(overviewTarget,V(-1.2,-.4,-20),k)}
      else{const k=ease(clamp((time-4.6)/1.8));cameraPosition.lerpVectors(V(-1.2,-.4,1.1),roomCamera,k);cameraTarget.lerpVectors(V(-1.2,-.4,-20),roomTarget,k)}
      overview.visible=time<1.5;room.visible=time>=1.5;
      if(time<1.5){learner.show(overview,'overview');learner.update(age,reduced,1-clamp(time/.8),1)}
      exhibits.forEach(({o,stand,foot,from},i)=>{const k=ease(clamp((time-5.9-i*.18)/1.9));o.g.position.lerpVectors(from,o.home,k);o.g.position.y+=Math.sin(k*Math.PI)*1.7;o.g.scale.setScalar(.27+.73*k);o.g.rotation.y=(1-k)*.25*(i-2);stand.g.visible=foot.visible=time>6.2;});
      if(time>=8.8)change('room');
    }else if(phase==='selecting'||phase==='settling'){
      const selecting=phase==='selecting',p=clamp(clock/duration(selecting?1.85:1.15)),k=ease(p);
      exhibits.forEach(({o},i)=>{const active=selecting&&i===selected,start=transitionStarts[i],end=active?V(0,.1,4.4):o.home;o.g.position.lerpVectors(start.position,end,k);o.g.position.y+=Math.sin(p*Math.PI)*(active?1.7:.4);o.g.scale.setScalar(THREE.MathUtils.lerp(start.scale,active?1.55:1,k));o.g.rotation.y=THREE.MathUtils.lerp(start.rotation,0,k)+Math.sin(p*Math.PI)*(active?-.22:.05)});
      if(p===1){caseOpen=selecting;change('room')}
    }else if(phase==='room'){
      overview.visible=false;room.visible=true;cameraPosition.copy(roomCamera);cameraTarget.copy(roomTarget);
      exhibits.forEach(({o,label,foot},i)=>{const y=(caseOpen&&selected===i?.1:o.home.y)+(reduced?0:Math.sin(age*.6+i)*.025);o.g.position.y+=(y-o.g.position.y)*(reduced?1:1-Math.exp(-dt*5));label.classList.toggle('selected',i===selected);label.setAttribute('aria-pressed',String(i===selected));label.classList.toggle('visited',visited.has(i));foot.material.opacity=i===selected?.55:.14});
    }else if(phase==='hardware'){
      cameraPosition.copy(roomCamera);cameraTarget.copy(roomTarget);field.update(reduced?0:age,reduced?1:ease(clamp(clock/1.4)));
      exhibits.forEach(({o,stand,foot},i)=>{o.g.visible=i===selected;stand.g.visible=foot.visible=false;if(i===selected){o.g.position.lerp(V(0,1.35,-2.5),1-Math.exp(-dt*5));o.g.scale.lerp(V(.7,.7,.7),1-Math.exp(-dt*5))}});
    }else if(phase==='learning'){
      cameraPosition.copy(roomCamera);cameraTarget.copy(roomTarget);field.group.visible=false;
      learner.show(room,'training');learner.update(age,reduced,reduced?1:clamp(clock/1.4),reduced?1:clamp(clock/10));
      exhibits.forEach(({o,foot},i)=>{o.g.visible=true;foot.visible=false;o.g.position.lerp(V((i-2)*3.5,-.55,.6),reduced?1:1-Math.exp(-dt*4));o.g.scale.lerp(V(.62,.62,.62),reduced?1:1-Math.exp(-dt*4));o.g.rotation.y=0});
    }else if(phase==='fusing'){
      const time=reduced?8.2:clock,p=clamp(time/8.2),lift=ease(clamp(time/1.7)),collapse=ease(clamp((time-4.1)/1.25));
      const stormCamera=V(2.5,6.2,-8.6),stormTarget=V(0,.75,-32),landing=ease(clamp((time-5.25)/1.75));
      cameraPosition.lerpVectors(roomCamera,stormCamera,ease(clamp(time/1.7)));cameraPosition.lerp(V(3.7,4.6,-14),landing);cameraTarget.lerpVectors(roomTarget,stormTarget,lift*(1-landing));
      cloud.visible=time<5.5;field.group.visible=false;
      if(cloud.visible){archive.forEach((a,i)=>{
        const h=(i%24)/23,angle=a.angle+time*(1.7+h*.6),radius=(.9+h*4.4)*(1-collapse),y=-2.05+h*5.7;
        const orbit=V(Math.cos(angle)*radius,y,Math.sin(angle)*radius);orbit.lerp(V(0,1.4,0),collapse);cloudRoot.position.lerpVectors(a.position,orbit,lift);
        cloudRoot.rotation.set(Math.sin(angle)*.24*lift,angle*lift,Math.cos(angle)*.16*lift);cloudRoot.scale.setScalar((1-.22*lift)*(1-collapse));writeArchive(i)
      });archiveDirty()}
      exhibits.forEach(({o,stand,foot},i)=>{
        const start=transitionStarts[i],angle=i*Math.PI*2/5+time*1.65,r=(3.2+i*.25)*(1-collapse),orbit=V(Math.cos(angle)*r,.25+i*.5,Math.sin(angle)*r);orbit.lerp(V(0,1.4,0),collapse);
        o.g.visible=time<5.5;o.g.position.lerpVectors(start.position,orbit,lift);o.g.rotation.set(Math.sin(angle)*.13,angle*lift,Math.cos(angle)*.11);o.g.scale.setScalar(THREE.MathUtils.lerp(start.scale,.38,lift)*(1-collapse));
        stand.g.visible=time<5.5;const sa=angle+.6,sr=(1.8+i*.3)*(1-collapse);stand.g.position.lerpVectors(stand.home,V(Math.cos(sa)*sr,-.8+i*.4,Math.sin(sa)*sr),lift);stand.g.rotation.y=sa*lift;stand.g.scale.setScalar((1-.65*lift)*(1-collapse));foot.visible=false;
      });
      vortex.visible=time>.4&&time<5.4;vortex.rotation.y=time*1.2;vortex.scale.setScalar(1-collapse);trails.forEach(l=>l.material.opacity=Math.sin(clamp((time-.4)/5)*Math.PI)*.19);
      birthLight.intensity=time>4.5&&time<6.7?Math.sin(clamp((time-4.5)/2.2)*Math.PI)*55:time<4.5?Math.sin(clamp(time/5.3)*Math.PI)*16:0;
      particles.forEach((m,i)=>{m.visible=time>4.65&&time<5.8;const a=i*2.399+time*4,r=(1-collapse)*(3+i%4);m.position.set(Math.cos(a)*r,1.4+Math.sin(a)*r*.25,Math.sin(a)*r);m.scale.setScalar(.8*(1-collapse))});
      product.g.visible=time>=5.25;product.g.scale.setScalar(1.5);product.g.rotation.set(0,0,0);
      const fall=clamp((time-5.25)/.95),after=time-6.2;product.g.position.set(0,6.6-8.21*fall*fall+(after>0?Math.sin(after*12)*Math.exp(-after*5)*.18:0),0);
      const impact=clamp(after/1.5);pulse.material.opacity=after>0?Math.pow(1-impact,2)*.7:0;pulse.scale.setScalar(1+impact*12);
      if(after>0&&after<.6&&!reduced){const shake=Math.exp(-after*9)*.07;cameraPosition.x+=Math.sin(after*60)*shake;cameraPosition.y+=Math.cos(after*50)*shake}
      if(p===1){cloud.visible=vortex.visible=false;birthLight.intensity=0;product.g.position.y=-1.61;completed=true;change('product')}
    }else if(phase==='product'){
      field.group.visible=false;
      cameraPosition.set(3.7,4.6,-14);cameraTarget.copy(roomTarget);product.g.visible=true;product.g.scale.setScalar(1.5);product.g.rotation.y=reduced?0:Math.sin(age*.35)*.035;
    }else if(phase==='returning'){
      const p=clamp(clock/duration(2.6));overview.visible=p>.4;room.visible=p<.65;
      cameraPosition.lerpVectors(returnCamera,overviewCamera,ease(p));cameraTarget.lerpVectors(roomTarget,overviewTarget,ease(p));
      if(p===1){entryAge=10;change('overview')}
    }
  }
  return {restart,update,action,advance,previous,cameraPosition,cameraTarget,shouldRender:()=>!(['hardware','learning'].includes(phase)||caseOpen),labelsVisible:()=>phase==='room'&&!caseOpen,dispose(){textures.forEach(t=>t.dispose())}};
}
