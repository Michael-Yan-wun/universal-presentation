import {createCastleScene} from './castle-scene.js?v=castle-living-2';
import { createEdgeHost } from './edge-host.js?v=winedge-detail-1';
import { createCompanyScene } from './company.js?v=company-five-products-20261019-87';
import * as THREE from './vendor/three.module.js';
import {stageView} from './stage-layout.js?v=winedge-launch-7';
import { products, chapters, agents, palette } from './content.js?v=keynote-flow-1';
import { createHistoryWall } from './history-wall.js?v=aiwinops-avs553-1';
import {createGrowthScene} from './growth-scene.js?v=keynote-flow-1';
import {createProductJourney} from './product-journey.js?v=winchat-integrated-1';
import { createAnniversary } from './anniversary.js?v=cosmic-opening-1';

export function createScene(container, labelLayer, onSelect, onHistoryStage=()=>{},onProductStage=()=>{},onSenseStage=()=>{}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.03;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,100);
  const rig=new THREE.Group();scene.add(rig);
  scene.add(new THREE.HemisphereLight(0xe7efff,0x253044,2.1));
  const key=new THREE.DirectionalLight(0xfff2e2,3.2);key.position.set(-6,12,10);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-12,right:12,top:12,bottom:-8,near:1,far:35});key.shadow.bias=-.0005;key.shadow.normalBias=.03;scene.add(key);
  const fill=new THREE.DirectionalLight(0xd9e6ff,1.8);fill.position.set(8,4,-6);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.ShadowMaterial({opacity:.3}));floor.rotation.x=-Math.PI/2;floor.position.y=-3.9;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(28,28,0x394657,0x202a38);grid.position.y=-3.91;grid.material.transparent=true;grid.material.opacity=.23;scene.add(grid);
  const ring=new THREE.Mesh(new THREE.RingGeometry(6.8,6.812,160),new THREE.MeshBasicMaterial({color:0x758296,transparent:true,opacity:.2,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-3.87;scene.add(ring);
  const groups={};for(const id of ['intro','company','growth','history','products','body','launch','castle','case']){groups[id]=new THREE.Group();rig.add(groups[id])}
  const mats=new Map(),geos=new Map(),bricks=[],hits=[],labels=[],brains=[];
  const temp=new THREE.Object3D(),v=new THREE.Vector3();
  const anniversary=createAnniversary(renderer);
  function material(color,finish='plastic'){if(finish!=='plastic')return anniversary.material(color,finish);if(!mats.has(color))mats.set(color,new THREE.MeshPhysicalMaterial({color,roughness:.34,metalness:0,clearcoat:.28,clearcoatRoughness:.3}));return mats.get(color)}
  function geometry(w,h,d,hero=false){const k=[w,h,d,hero].join(',');if(geos.has(k))return geos.get(k);const r=.065,s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d-.08,bevelEnabled:true,bevelSegments:hero?6:3,steps:1,bevelSize:.04,bevelThickness:.04,curveSegments:hero?16:5});g.translate(0,0,-(d-.08)/2);geos.set(k,g);return g}
  const studGeo=new THREE.CylinderGeometry(.31,.32,.22,32,1),lipGeo=new THREE.TorusGeometry(.244,.014,5,32);
  const heroStudGeo=new THREE.CylinderGeometry(.31,.32,.22,96,1),heroLipGeo=new THREE.TorusGeometry(.244,.014,12,96);
  function printTexture(title,sub,w,h){const c=document.createElement('canvas');c.width=2048;c.height=Math.round(2048*h/w);const x=c.getContext('2d');x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';let size=Math.min(c.height*.5,2048/(title.length*.66+2));x.font=`650 ${size}px Arial, sans-serif`;x.fillText(title,1024,c.height*(sub?.length?.41:.53));if(sub){x.font=`500 ${Math.min(c.height*.125,2048/(sub.length*.72+4))}px Arial, sans-serif`;x.fillStyle='#ffffffd9';x.fillText(sub,1024,c.height*.77)}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t}
  function brick(parent,{id,name='',sub='',color=palette.stone,finish='plastic',shine=false,cols=4,rows=2,h=1.1,pos=[0,0,0],scale=1,label=false,detail='standard'}){
    const w=cols*1.05-.06,d=rows*1.05-.06,g=new THREE.Group();parent.add(g);g.position.set(...pos);g.scale.setScalar(scale);
    const mat=material(color,finish),body=new THREE.Mesh(geometry(w,h,d,detail==='hero'),mat);body.castShadow=true;body.receiveShadow=true;g.add(body);if(id){body.userData.id=id;hits.push(body)}
    const studs=new THREE.InstancedMesh(detail==='hero'?heroStudGeo:studGeo,mat,cols*rows),lips=new THREE.InstancedMesh(detail==='hero'?heroLipGeo:lipGeo,mat,cols*rows);let k=0;
    for(let x=0;x<cols;x++)for(let z=0;z<rows;z++){temp.position.set((x-(cols-1)/2)*1.05,h/2+.13,(z-(rows-1)/2)*1.05);temp.rotation.set(0,0,0);temp.updateMatrix();studs.setMatrixAt(k,temp.matrix);temp.position.y+=.111;temp.rotation.x=Math.PI/2;temp.updateMatrix();lips.setMatrixAt(k++,temp.matrix)}studs.castShadow=true;studs.receiveShadow=true;g.add(studs,lips);
    if(name){const face=new THREE.Mesh(new THREE.PlaneGeometry(w*.88,h*.84),new THREE.MeshBasicMaterial({map:printTexture(name,sub,w*.88,h*.84),transparent:true,toneMapped:false,depthWrite:false}));face.position.set(0,0,d/2+.05);g.add(face)}
    const o={g,home:new THREE.Vector3(...pos),goal:new THREE.Vector3(...pos),targetScale:scale,id,name,w,h,d};bricks.push(o);
    if(label)addLabel(g,new THREE.Vector3(0,h/2+.8,0),name,id,color,'product-label');return o;
  }
  function addLabel(group,anchor,text,id,color,cls='',scope='castle'){const el=document.createElement(cls==='ct-domain-label'||scope==='body'?'div':'button');el.className='model-label '+cls;el.style.setProperty('--label-color',color);el.innerHTML=`<i></i><span>${text}</span>`;el.setAttribute('aria-label',scope==='body'?text:`探索 ${text}`);if(scope!=='body')el.onclick=()=>onSelect(id);labelLayer.appendChild(el);labels.push({group,anchor,el,parent:group.parent,scope});return el}
  const launchHost=createEdgeHost({parent:groups.launch,brick,addLabel:()=>{},id:'launch-core',detail:'hero',name:'WinEdge',subtitle:'VISION / DATA / AGENT',color:palette.unified,pos:[0,0,0]});
  // Match the reference: a stepped arch, close seams, solid warm gold and a physical deck.
  const ten=[],goldPalette=['#f3b93d','#f9cc68','#c88920','#dfa02a','#ebb137'];
  groups.intro.scale.setScalar(1);groups.intro.position.set(-.5,-1.8,0);
  const digits=[[-3.8,[[1,0],[0,1],[1,1],[1,2],[1,3],[1,4],[1,5],[0,6],[1,6],[2,6]]],[-.45,[[.5,1],[1.5,1],[2.5,1],[0,2],[3,2],[0,3],[3,3],[0,4],[3,4],[0,5],[3,5],[0,6],[1,6],[2,6],[3,6]]]];
  digits.forEach(([off,cells],digit)=>cells.forEach(([x,y],i)=>{const o=brick(groups.intro,{cols:1,rows:2,h:.7,color:goldPalette[(i*3+digit)%goldPalette.length],finish:'gold',pos:[off+x*1.05,2.04-y*.73,0]});o.introDelay=(6-y)*.12+digit*.13;o.introManaged=true;o.introStart=o.home.clone().add(new THREE.Vector3((x-1.5)*.65,2.5+digit*.4,-2.8));o.introTwist=(i%2?1:-1)*.18;ten.push(o)}));
  anniversary.station(groups.intro,geometry);
  const companyScene=createCompanyScene({group:groups.company,brick,addLabel,hits});
  const historyWall=createHistoryWall({group:groups.history,brick,renderer,geometry,addLabel,onStage:onHistoryStage});
  const growth=createGrowthScene({early:groups.growth,body:groups.body,brick,addLabel,onSenseStage});
  const productJourney=createProductJourney({group:groups.products,brick,addLabel,onStage:onProductStage});
  function makeBrain(parent,color,scale=1){const brain=new THREE.Group();parent.add(brain);brain.scale.setScalar(scale);const points=[],segments=[];
    for(const side of [-1,1])for(let i=0;i<70;i++){const phi=Math.acos(1-2*(i+.5)/70),theta=i*2.399963;const folds=1+.08*Math.sin(theta*5)*Math.sin(phi*6);points.push(new THREE.Vector3(side*.27+Math.sin(phi)*Math.cos(theta)*.37*folds,Math.cos(phi)*.57*folds,Math.sin(phi)*Math.sin(theta)*.46*folds))}
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const d=points[i].distanceTo(points[j]);if(d<.23&&d>.07)segments.push(...points[i].toArray(),...points[j].toArray())}
    const geo=new THREE.BufferGeometry().setFromPoints(points);const nodes=new THREE.Points(geo,new THREE.PointsMaterial({color:0xdfe7f5,size:.032,sizeAttenuation:true}));brain.add(nodes);
    const linesGeo=new THREE.BufferGeometry();linesGeo.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));const lines=new THREE.LineSegments(linesGeo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.66}));brain.add(lines);
    const shellMat=new THREE.MeshPhysicalMaterial({color,transparent:true,opacity:.16,roughness:.4,depthWrite:false});for(const side of [-1,1]){const shell=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),shellMat);shell.position.x=side*.27;shell.scale.set(.35,.55,.43);brain.add(shell)}
    brains.push({brain,nodes,lines});return brain;
  }
  const castle=createCastleScene({group:groups.castle,brick,geometry,makeBrain,addLabel,agents});
  const comboBricks=products.map(p=>brick(groups.case,{id:p.id,name:p.name,sub:p.role,color:p.color,cols:4,rows:2,h:1.25}));
  const agentBrick=brick(groups.case,{id:'ecosystem',name:'AI Agent',sub:'DOMAIN INTELLIGENCE',color:palette.stone,cols:4,rows:2,h:1.25});comboBricks.push(agentBrick);
  const caseBrain=makeBrain(groups.case,'#c2d3e7',.8);caseBrain.position.set(5.8,3.7,0);
  let introClock=null;
  let openingOccluded=false;
  let chapter=0,kind='intro',age=0,exploded=false,inspect=false,angle=0,angleGoal=0,drag=false,downX=0,downY=0,lastX=0,distance=0,last=0,raf,aspect=1,launchMode='hero',companyLayout='stage';
  const target=new THREE.Vector3(),look=new THREE.Vector3(),camGoal=new THREE.Vector3();
  function resize(){
    // Layout dimensions stay stable during CSS entrance transforms. Refresh density when the display changes.
    const width=container.clientWidth,height=container.clientHeight;if(width<=0||height<=0)return;
    const nativeRatio=window.devicePixelRatio||1;
    const desiredRatio=kind==='launch'?(launchMode==='summary'?4:Math.max(2,Math.min(nativeRatio,3))):(kind==='castle'||kind==='history'||kind==='product'&&['chat','analytics'].includes(chapters[chapter]?.product?.id))?Math.max(2,Math.min(nativeRatio,3)):Math.min(nativeRatio,2);
    const ratio=Math.min(desiredRatio,renderer.capabilities.maxTextureSize/Math.max(width,height));
    if(renderer.getPixelRatio()!==ratio)renderer.setPixelRatio(ratio);
    aspect=width/height;renderer.setSize(width,height,false);camera.aspect=aspect;camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(container);window.addEventListener('resize',resize);resize();
  function visible(obj){for(let p=obj;p;p=p.parent)if(!p.visible)return false;return true}
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function pick(e){const r=container.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(hits).find(h=>visible(h.object))?.object.userData.id}
  container.addEventListener('pointerdown',e=>{drag=true;downX=lastX=e.clientX;downY=e.clientY;distance=0;container.setPointerCapture(e.pointerId)});
  container.addEventListener('pointermove',e=>{if(drag){distance=Math.max(distance,Math.hypot(e.clientX-downX,e.clientY-downY));if(!['history','company','castle'].includes(kind))angleGoal+=(e.clientX-lastX)*.005;lastX=e.clientX}else{const id=['castle','body'].includes(kind)?null:pick(e);container.style.cursor=kind==='castle'?'default':id?'pointer':kind==='company'?'default':'grab';if(kind==='company')companyScene.setHovered(id)}});
  container.addEventListener('pointerup',e=>{if(drag&&distance<6&&!['castle','body'].includes(kind)){const id=pick(e);if(id)onSelect(id)}drag=false});container.addEventListener('pointercancel',()=>drag=false);
  container.addEventListener('pointerleave',()=>companyScene.setHovered(null));
  function setChapter(index,{atEnd=false}={}){if(kind==='history'&&chapters[index].kind!=='history'){camera.position.set(5,6,24);target.set(0,0,0)}chapter=index;kind=chapters[index].kind;age=0;introClock=null;angleGoal=0;inspect=false;exploded=false;for(const [id,g]of Object.entries(groups))g.visible=id===(kind==='product'?'products':kind);for(const o of bricks){o.goal.copy(o.home);o.targetScale=o.growthScale||1}groups.intro.visible=kind==='intro';
    grid.visible=ring.visible=floor.visible=kind!=='intro'&&kind!=='history'&&kind!=='company'&&kind!=='closing'&&kind!=='chronicle'&&kind!=='launch'&&!['chat','analytics'].includes(chapters[index].product?.id);key.position.set(...(kind==='intro'?[4,10,-3]:[-6,12,10]));key.intensity=kind==='intro'?4.1:3.2;
    if(kind==='intro'){angle=0;ten.forEach(o=>{o.g.position.copy(reduced?o.home:o.introStart);o.g.rotation.set(0,reduced?0:o.introTwist,0);o.targetScale=1});const view=stageView(kind,aspect);camera.position.set(view.x+(reduced?0:3),view.y+(reduced?0:1.5),view.z+(reduced?0:4));target.set(0,view.targetY,0);}
    if(kind==='company'){companyScene.reset();angle=0;const view=stageView(kind,aspect,{companyLayout});camera.position.set(view.x+(reduced?0:1.8),view.y+(reduced?0:.65),view.z+(reduced?0:1.5));target.set(0,view.targetY,0);}
    if(kind==='history')historyWall.restart({atEnd});
    if(kind==='growth')growth.reset();
    if(kind==='product')productJourney.reset(chapters[index].product.id,{atEnd});
    if(kind==='castle'){castle.reset();angle=0;const view=castle.view(aspect);camera.position.set(view.x+.8,view.y+.4,view.z+1);target.set(0,view.targetY,0);}
    if(kind==='launch'){angle=0;launchMode='hero';const view=stageView(kind,aspect);camera.position.set(view.x,view.y,view.z);target.set(0,view.targetY,0);}
    if(kind==='case'){const ids=chapters[index].combination.products;comboBricks.forEach((o,i)=>{const id=i<5?products[i].id:'domain',j=ids.indexOf(id);o.g.visible=j>=0;o.goal.set((j-(ids.length-1)/2)*5.8,2.1,0);o.targetScale=1.03;if(j>=0)o.g.position.set(o.goal.x,6,-3)});caseBrain.visible=ids.includes('domain')}
    labels.forEach(l=>l.el.hidden=kind!==l.scope);resize();
  }
  function setExploded(){} // Legacy hidden control; keynote focus is presenter-driven.

  function setInspect(on){inspect=on}
  function animate(ms){raf=requestAnimationFrame(animate);if(document.hidden||openingOccluded||kind==='closing'||kind==='chronicle'||kind==='launch'&&['feature','cases','ecosystem'].includes(launchMode)){last=ms;return;}const dt=Math.min((ms-last)/1000,.05)||.016;last=ms;age+=dt;const t=ms*.001,e=reduced?1:1-Math.exp(-dt*4.6);
    const view=(kind==='product'?productJourney.view(aspect):null)||(kind==='castle'?castle.view(aspect):stageView(kind,aspect,{phase:productJourney.phase(),exploded,inspect,companyLayout}));
    if(kind==='history'){historyWall.update(age,reduced,dt);camera.position.copy(historyWall.cameraPosition);target.copy(historyWall.cameraTarget);camera.lookAt(target);const w=container.clientWidth,h=container.clientHeight;camera.setViewOffset(w,h,-w*historyWall.frameOffset(),0,w,h);rig.rotation.y=0;}else{
    if(kind==='product'&&productJourney.frameOffset()){const w=container.clientWidth,h=container.clientHeight;camera.setViewOffset(w,h,-w*productJourney.frameOffset(),0,w,h);}else if(camera.view?.enabled)camera.clearViewOffset();
    const introTime=introClock??age;const openingDolly=kind==='intro'&&!reduced?1-THREE.MathUtils.smootherstep(introTime,0,3.5):0;
    const dolly=kind==='company'&&companyLayout==='stage'&&!reduced?companyScene.entrance():0;
    camGoal.set(view.x+1.8*dolly+3*openingDolly,view.y+.65*dolly+1.5*openingDolly,view.z+1.5*dolly+4*openingDolly);camera.position.lerp(camGoal,e);look.set(0,view.targetY,0);target.lerp(look,e);camera.lookAt(target);angle+=(angleGoal-angle)*e;rig.rotation.y=angle+(reduced||kind==='company'?0:Math.sin(t*.2)*(kind==='intro'?.012:.035));}
    for(const o of bricks){if(!visible(o.g)||o.historyManaged||o.companyManaged||o.journeyManaged||o.senseManaged||o.introManaged||o.castleManaged)continue;o.g.position.lerp(o.goal,e);o.g.scale.lerp(v.setScalar(o.targetScale),e)}
    if(!reduced){brains.forEach(({brain,nodes},i)=>{if(visible(brain)){brain.rotation.y=Math.sin(t*.45+i)*.18;nodes.material.opacity=.65+.35*Math.sin(t*1.6+i)}})}
    if(kind==='castle')castle.update(dt,t,reduced);
    if(kind==='company')companyScene.update(age,reduced);
    if(kind==='launch'){launchHost.update(age,reduced?1:Math.min(1,age/1.6),reduced);if(launchMode==='summary')launchHost.root.scale.multiplyScalar(2.15);}
    if(kind==='intro'){
      const introTime=introClock??age;
      ten.forEach(o=>{const p=reduced?1:THREE.MathUtils.clamp((introTime-o.introDelay)/1.65,0,1),ease=1-Math.pow(1-p,4);o.g.position.lerpVectors(o.introStart,o.home,ease);o.g.rotation.y=o.introTwist*(1-ease);});
      anniversary.update(introTime,!reduced);
    }
    if(kind==='growth'||kind==='body')growth.update(kind,age,reduced);
    if(kind==='product')productJourney.update(age,reduced,dt);
    if(kind!=='history'||historyWall.shouldRender())renderer.render(scene,camera);
    const r=container.getBoundingClientRect(),lr=labelLayer.getBoundingClientRect();labels.forEach(l=>{l.el.hidden=kind!==l.scope||!visible(l.group)||(l.scope==='history'&&!historyWall.labelsVisible())||(l.scope==='product'&&!productJourney.labelsVisible());if(l.el.hidden)return;v.copy(l.anchor);l.group.localToWorld(v);v.project(camera);l.el.style.left=`${(v.x*.5+.5)*r.width+r.left-lr.left}px`;l.el.style.top=`${(-v.y*.5+.5)*r.height+r.top-lr.top}px`});
  }
  camera.position.set(5,6,24);setChapter(0);raf=requestAnimationFrame(animate);
  return {setOpeningOccluded(value){openingOccluded=value;},setIntroTime(time){introClock=time;if(time>=20){age=4;introClock=null;}},setChapter,setExploded,setCastleStep(value){castle.setStep(value);},setInspect,setLaunchMode(mode){launchMode=mode;resize();},setCompanyLayout(id){companyLayout=id;angleGoal=0;companyScene.setLayout(id);},senseAction:growth.action,productAction:productJourney.action,productPhase:productJourney.phase,historyAction:historyWall.action,historyAdvance:historyWall.advance,historyPrevious:historyWall.previous,dispose(){cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',resize);anniversary.dispose();companyScene.dispose();historyWall.dispose();productJourney.dispose();castle.dispose();renderer.dispose()}};
}
