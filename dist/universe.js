import * as THREE from './vendor/three.module.js';

// Independent, non-interactive scenery. Earth rotates around its axis; stars rotate at a separate rate.
export function createUniverse(container) {
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setClearColor('#020817',1);container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-2,2,1,-1,.1,50);camera.position.z=12;
  let seed=34108;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const loader=new THREE.TextureLoader(),maps=[];
  const load=name=>{const t=loader.load('./assets/universe/'+name,()=>render());t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());maps.push(t);return t};
  function softMap(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(225,244,255,1)');g.addColorStop(.08,'rgba(110,194,255,.9)');g.addColorStop(.3,'rgba(29,100,235,.22)');g.addColorStop(1,'rgba(0,28,120,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);maps.push(t);return t}
  const glowMap=softMap(),starLayers=[],starTime={value:0},starPulse={value:0};
  for(let layer=0;layer<3;layer++){
    const count=[2200,800,90][layer],positions=[],colors=[],phases=[];
    for(let i=0;i<count;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*6;positions.push(Math.cos(a)*r,Math.sin(a)*r,-6+layer*.4);const c=new THREE.Color().setRGB(.36+random()*.5,.5+random()*.45,.78+random()*.22);colors.push(c.r,c.g,c.b);phases.push(random()*Math.PI*2)}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setAttribute('aPhase',new THREE.Float32BufferAttribute(phases,1));
    const mat=new THREE.PointsMaterial({size:[1.4,2,7][layer],sizeAttenuation:false,map:layer===2?glowMap:null,vertexColors:true,transparent:true,opacity:[.8,.8,.85][layer],depthWrite:false,blending:THREE.AdditiveBlending});
    mat.onBeforeCompile=shader=>{shader.uniforms.uStarTime=starTime;shader.uniforms.uStarPulse=starPulse;shader.vertexShader='uniform float uStarTime;uniform float uStarPulse;attribute float aPhase;varying float vStarPulse;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvStarPulse=1.-uStarPulse*(.5+.5*sin(uStarTime*(.38+.12*sin(aPhase))+aPhase));');shader.fragmentShader='varying float vStarPulse;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb*=vStarPulse;')};mat.customProgramCacheKey=()=> 'intro-star-twinkle';
    const points=new THREE.Points(geo,mat);points.position.set(-.35,.3,0);scene.add(points);starLayers.push(points);
  }
  // One occasional meteor at a time, confined to the sky to the right of the title.
  const meteor=new THREE.Group();meteor.visible=false;scene.add(meteor);
  const meteorFade={value:0},meteorColor={value:new THREE.Color('#b9deff')};
  const trail=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({uniforms:{fade:meteorFade,tint:meteorColor},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float fade;uniform vec3 tint;varying vec2 vUv;void main(){float core=exp(-pow((vUv.y-.5)*9.,2.));float halo=exp(-pow((vUv.y-.5)*2.4,2.))*.12;gl_FragColor=vec4(tint,(core+halo)*pow(vUv.x,1.8)*fade);}',transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));meteor.add(trail);
  const meteorHead=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:'#e7f5ff',transparent:true,opacity:0,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));meteorHead.scale.set(.085,.085,1);meteor.add(meteorHead);
  const meteorPaths=[[.87,.105,.61,.265],[.96,.17,.73,.32],[.72,.115,.54,.255],[.91,.09,.66,.23]];
  let introTime=0,nextMeteor=5,meteorStart=-1,meteorDuration=2.3,meteorCount=0,meteorPath=meteorPaths[0];
  function updateMeteor(dt){
    if(layoutGoal!==1||motion.matches){meteor.visible=false;return}introTime+=dt;
    if(meteorStart<0&&introTime>=nextMeteor){meteorStart=introTime;meteorDuration=2.1+random()*.6;meteorPath=meteorPaths[meteorCount%meteorPaths.length];meteorColor.value.set(meteorCount%3===2?'#ffe2a5':'#b9deff');meteorCount++}
    if(meteorStart<0)return;
    const p=(introTime-meteorStart)/meteorDuration;
    if(p>=1){meteor.visible=false;meteorStart=-1;nextMeteor=introTime+10+random()*8;return}
    const [sx,sy,ex,ey]=meteorPath,dx=(ex-sx)*2*aspect,dy=-(ey-sy)*2,opacity=Math.sin(Math.PI*p)*.75,len=Math.min(.52,Math.hypot(dx,dy)*p);
    meteor.visible=true;meteor.position.set((sx*2-1)*aspect+dx*p,1-sy*2+dy*p,5);meteor.rotation.z=Math.atan2(dy,dx);trail.position.x=-len/2;trail.scale.set(len,.018,1);meteorFade.value=opacity;meteorHead.material.opacity=opacity;
  }
  const galaxy=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:load('milky-way.jpg'),color:'#508bd7',transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));galaxy.position.set(0,-.34,-8);galaxy.rotation.z=-.24;scene.add(galaxy);
  const planet=new THREE.Group();scene.add(planet);
  const axis=new THREE.Group();axis.rotation.z=-.28;axis.rotation.x=.08;planet.add(axis);
  const earthGroup=new THREE.Group();axis.add(earthGroup);
  const strength={value:.9};
  const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
  const surface=new THREE.ShaderMaterial({uniforms:{dayMap:{value:load('earth-day.jpg')},nightMap:{value:load('earth-night.png')},strength},vertexShader:vertex,fragmentShader:`
    uniform sampler2D dayMap;uniform sampler2D nightMap;uniform float strength;varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;
    void main(){
      vec3 n=normalize(vNormal),view=normalize(cameraPosition-vWorld);float facing=max(dot(n,view),0.);
      vec3 day=texture2D(dayMap,vUv).rgb,night=texture2D(nightMap,vUv).rgb;
      float illumination=max(dot(n,normalize(vec3(-.6,.7,.35))),0.);
      float lights=max(dot(night,vec3(.2126,.7152,.0722))-.018,0.);
      vec3 ground=vec3(.006,.016,.045)+day*vec3(.10,.22,.40)*(.35+.8*illumination);
      vec3 cities=vec3(1.,.56,.19)*pow(lights,.84)*2.8;
      float rim=pow(1.-facing,4.5);vec3 atmosphere=vec3(.025,.19,.62)*rim*(.7+.6*illumination);
      vec3 color=(ground+cities+atmosphere)*strength;
      gl_FragColor=vec4(color,1.);
      #include <colorspace_fragment>
    }`});
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),surface);earthGroup.add(sphere);
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.008,80,48),new THREE.ShaderMaterial({uniforms:{strength},vertexShader:vertex,fragmentShader:`uniform float strength;varying vec3 vNormal;varying vec3 vWorld;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld))),4.);gl_FragColor=vec4(vec3(.07,.38,1.)*strength,rim*.66*strength);}`,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));planet.add(atmosphere);
  const network=new THREE.Group();earthGroup.add(network);
  const cities=[[25.03,121.56],[35.68,139.69],[31.23,121.47],[37.56,126.98],[22.32,114.17],[1.35,103.82],[13.76,100.50],[10.82,106.63],[28.61,77.21],[19.08,72.88],[25.20,55.27],[-33.87,151.21],[51.50,-.12],[48.86,2.35],[37.77,-122.42],[40.71,-74.01]];
  const geoPoint=([lat,lon],radius=1.006)=>{const a=THREE.MathUtils.degToRad(lat),b=THREE.MathUtils.degToRad(lon);return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b)).multiplyScalar(radius)};
  const dots=new THREE.InstancedMesh(new THREE.SphereGeometry(.005,8,6),new THREE.MeshBasicMaterial({color:'#ffcd89'}),cities.length),dummy=new THREE.Object3D();
  cities.forEach((c,i)=>{dummy.position.copy(geoPoint(c));dummy.updateMatrix();dots.setMatrixAt(i,dummy.matrix)});network.add(dots);
  const links=[],pairs=[[0,1],[0,2],[0,4],[0,5],[0,6],[0,7],[2,3],[5,6],[5,7],[5,8],[8,9],[8,10],[5,11],[10,12],[12,13],[1,14],[14,15]];
  const lineMat=new THREE.LineBasicMaterial({color:'#d9a666',transparent:true,opacity:.28,depthWrite:false});
  pairs.forEach(([a,b])=>{const start=geoPoint(cities[a]),end=geoPoint(cities[b]),points=[];for(let j=0;j<=32;j++){const p=j/32;points.push(start.clone().lerp(end,p).normalize().multiplyScalar(1.008+Math.sin(p*Math.PI)*.018))}const curve=new THREE.CatmullRomCurve3(points);network.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),lineMat));links.push(curve)});
  const orbitGroup=new THREE.Group();planet.add(orbitGroup);const orbitMaterials=[];
  for(let i=0;i<2;i++){const points=[];for(let j=0;j<=180;j++){const a=j/180*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*1.1,Math.sin(a)*1.1,0))}const mat=new THREE.LineBasicMaterial({color:'#4bafff',transparent:true,opacity:i?.17:.3,depthWrite:false});const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),mat);line.rotation.set(i?1.1:.45,i?.3:.7,i?-.5:.3);orbitGroup.add(line);orbitMaterials.push(mat)}
  const sunCanvas=document.createElement('canvas');sunCanvas.width=sunCanvas.height=256;const sx=sunCanvas.getContext('2d'),sg=sx.createRadialGradient(128,128,0,128,128,128);sg.addColorStop(0,'rgba(255,255,246,1)');sg.addColorStop(.07,'rgba(255,250,213,1)');sg.addColorStop(.2,'rgba(255,218,126,.8)');sg.addColorStop(.45,'rgba(255,177,63,.2)');sg.addColorStop(1,'rgba(255,154,38,0)');sx.fillStyle=sg;sx.fillRect(0,0,256,256);const sunMap=new THREE.CanvasTexture(sunCanvas);maps.push(sunMap);
  const sunrise=new THREE.Sprite(new THREE.SpriteMaterial({map:sunMap,color:'#fff4d2',transparent:true,opacity:1,depthWrite:false,blending:THREE.AdditiveBlending}));sunrise.scale.set(.5,.5,1);planet.add(sunrise);
  let goal=.9,elapsed=0,last=0,raf=0,disposed=false,layout=1,layoutGoal=1,aspect=1,mobile=false;
  function placePlanet(){planet.scale.setScalar(mobile?1.45:1.8-.18*layout);planet.position.set(aspect*(mobile?1.43:1.04-.47*layout),mobile?-1.16:-1.12+.04*layout,0);sunrise.position.set(-.49+.77*layout,.87+.087*layout,.25);galaxy.material.opacity=.7-.35*layout}
  function resize(){const width=container.clientWidth,height=container.clientHeight;aspect=width/height;mobile=width<=800;camera.left=-aspect;camera.right=aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);placePlanet();galaxy.scale.set(aspect*3.2,aspect*1.6,1);render()}
  function render(){if(!disposed)renderer.render(scene,camera)}
  function animate(ms){raf=0;if(disposed||document.hidden)return;const dt=Math.min((ms-last)/1000,.05)||0;last=ms;if(!motion.matches)elapsed+=dt;strength.value+=(goal-strength.value)*Math.min(1,dt*2);layout+=(layoutGoal-layout)*Math.min(1,dt*2);placePlanet();earthGroup.rotation.y=2.1+elapsed*Math.PI*2/720;starLayers.forEach((layer,i)=>layer.rotation.z=elapsed*[.0015,-.0018,.0022][i]);starTime.value=elapsed;starPulse.value=motion.matches?0:layout*.6;updateMeteor(dt);galaxy.rotation.z=-.24+elapsed*.0015;orbitGroup.rotation.z=elapsed*.003;lineMat.opacity=.28*strength.value;sunrise.material.opacity=1.15*strength.value*(1+Math.sin(elapsed*.24)*layout*.045);orbitMaterials.forEach((m,i)=>m.opacity=(i?.17:.3)*strength.value*(1-.8*layout));render();if(!motion.matches||Math.abs(goal-strength.value)>.005||Math.abs(layoutGoal-layout)>.005)raf=requestAnimationFrame(animate)}
  function start(){if(!raf&&!disposed){last=performance.now();raf=requestAnimationFrame(animate)}}
  function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()}
  function changedMotion(){start()}
  const observer=new ResizeObserver(resize);observer.observe(container);document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',changedMotion);resize();start();
  return {setChapter(kind){goal=({intro:.9,history:.36,product:.32,castle:.3,reveal:.48,case:.25})[kind]??.35;if(kind==='intro'&&container.dataset.chapter!=='intro'){introTime=0;nextMeteor=5;meteorStart=-1;meteorCount=0}layoutGoal=kind==='intro'?1:0;if(!layoutGoal)meteor.visible=false;container.dataset.chapter=kind;start()},dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',changedMotion);scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}});maps.forEach(t=>t.dispose());renderer.dispose()}};
}
