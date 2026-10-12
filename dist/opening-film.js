import * as THREE from './vendor/three.module.js';
import { openingCues as cues } from './opening-cues.js?v=refined-logo-22';

const smooth=(a,b,t)=>THREE.MathUtils.smoothstep(t,a,b);

// A light aperture reveals a volumetric star flight, then a sunlit Earth.
// Stars are drawn at the canvas resolution; no enlarged images or blur passes.
export function createOpeningFilm(canvas) {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setClearColor('#01030a');
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,1400);
  const maps=[],geometries=[],materials=[],pending=[];
  const loader=new THREE.TextureLoader();
  function load(path){
    let resolve,reject;
    pending.push(new Promise((yes,no)=>{resolve=yes;reject=no;}));
    const texture=loader.load(path,resolve,undefined,reject);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    maps.push(texture);return texture;
  }
  const dayMap=load('./assets/universe/earth-day.jpg'),nightMap=load('./assets/universe/earth-night.png');
  function mesh(geometry,material,parent=scene){const object=new THREE.Mesh(geometry,material);parent.add(object);geometries.push(geometry);materials.push(material);return object;}
  const screenVertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
  const backdrop=mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({depthTest:false,depthWrite:false,
    vertexShader:screenVertex,fragmentShader:`varying vec2 vUv;void main(){
      float glow=exp(-length((vUv-vec2(.5,.52))*vec2(1.,1.5))*4.);
      gl_FragColor=vec4(vec3(.002,.005,.012)+vec3(.014,.028,.052)*glow,1.);
    }`}));
  backdrop.frustumCulled=false;backdrop.renderOrder=-20;

  let seed=27491;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const starsPosition=[],starsColor=[],starSize=[];
  for(let i=0;i<1600;i++){
    starsPosition.push((random()-.5)*1550,(random()-.5)*950,-700-random()*250);
    const c=.35+random()*.65;starsColor.push(c*.91,c*.96,c);starSize.push(.55+Math.pow(random(),5)*1.5);
  }
  const starGeometry=new THREE.BufferGeometry();
  starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starsPosition,3));
  starGeometry.setAttribute('color',new THREE.Float32BufferAttribute(starsColor,3));
  starGeometry.setAttribute('size',new THREE.Float32BufferAttribute(starSize,1));
  const pixels={value:2},skyOpacity={value:1};
  const starMaterial=new THREE.ShaderMaterial({uniforms:{pixels,opacity:skyOpacity},transparent:true,depthWrite:false,
    vertexShader:'attribute vec3 color;attribute float size;uniform float pixels;varying vec3 tint;void main(){tint=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size*pixels;}',
    fragmentShader:'uniform float opacity;varying vec3 tint;void main(){float d=length(gl_PointCoord-.5);float a=1.-smoothstep(.15,.5,d);gl_FragColor=vec4(tint,a*opacity);}' });
  const stars=new THREE.Points(starGeometry,starMaterial);scene.add(stars);geometries.push(starGeometry);materials.push(starMaterial);

  // Individual stars occupy different depths. Screen-space quads retain fine,
  // anti-aliased trails at high resolution, including on GPUs with 1px line limits.
  const base=new THREE.PlaneGeometry(1,1),flightGeometry=new THREE.InstancedBufferGeometry();
  flightGeometry.index=base.index;flightGeometry.attributes.position=base.attributes.position;flightGeometry.attributes.uv=base.attributes.uv;
  const origins=[],weights=[],tints=[];
  const count=matchMedia('(max-width: 760px)').matches?1800:3200;
  for(let i=0;i<count;i++){
    const angle=random()*Math.PI*2,r=3+Math.sqrt(random())*175;
    origins.push(Math.cos(angle)*r,Math.sin(angle)*r*.7,12+random()*600);
    weights.push(.65+Math.pow(random(),3)*1.85,.55+random()*.45);
    const hue=random();
    tints.push(...(hue>.97?[1,.87,.7]:hue>.84?[.62,.79,1]:[.88,.94,1]));
  }
  flightGeometry.setAttribute('origin',new THREE.InstancedBufferAttribute(new Float32Array(origins),3));
  flightGeometry.setAttribute('weight',new THREE.InstancedBufferAttribute(new Float32Array(weights),2));
  flightGeometry.setAttribute('tint',new THREE.InstancedBufferAttribute(new Float32Array(tints),3));
  flightGeometry.instanceCount=count;
  const flightUniforms={travel:{value:0},speed:{value:0},opacity:{value:0},viewport:{value:new THREE.Vector2(1280,720)}};
  const flightMaterial=new THREE.ShaderMaterial({uniforms:flightUniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
    vertexShader:`attribute vec3 origin;attribute vec2 weight;attribute vec3 tint;
      uniform float travel;uniform float speed;uniform vec2 viewport;
      varying vec2 vUv;varying float alpha;varying vec3 color;
      void main(){
        float depth=mod(origin.z-travel,600.)+2.;
        float exposure=(.012+speed*.055)*(1.+weight.x);
        vec4 head=projectionMatrix*modelViewMatrix*vec4(origin.xy,-depth,1.);
        vec4 tail=projectionMatrix*modelViewMatrix*vec4(origin.xy,-depth-exposure,1.);
        vec2 a=head.xy/head.w,b=tail.xy/tail.w;
        vec2 delta=(a-b)*viewport;
        vec2 direction=length(delta)>.0001?normalize(delta):vec2(0.,1.);
        float width=clamp(weight.x*(.42+48./depth),.7,2.5);
        // Also give a stationary star enough length to form a small point.
        b-=direction/viewport*max(0.,width-length(delta));
        vec2 side=vec2(-direction.y,direction.x)*2.*width/viewport;
        vec2 pos=mix(b,a,uv.y)+side*position.x;
        gl_Position=vec4(pos,head.z/head.w,1.);
        vUv=uv;color=tint;
        alpha=weight.y*smoothstep(2.,12.,depth)*(1.-smoothstep(460.,602.,depth))*(.38+min(1.,100./depth));
      }`,
    fragmentShader:`uniform float opacity;varying vec2 vUv;varying float alpha;varying vec3 color;
      void main(){float edge=1.-smoothstep(.16,.5,abs(vUv.x-.5));
      float tail=smoothstep(0.,.75,vUv.y)*(1.-smoothstep(.91,1.,vUv.y));
      gl_FragColor=vec4(color,edge*tail*alpha*opacity);}` });
  const flight=mesh(flightGeometry,flightMaterial);flight.frustumCulled=false;flight.renderOrder=1;

  const sun=mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({uniforms:{opacity:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform float opacity;void main(){vec2 p=(vUv-.5)*2.;float r=length(p);
      float core=.8*exp(-r*r*650.);float halo=.075*exp(-r*r*14.);
      float rays=(exp(-abs(p.x)*280.)+exp(-abs(p.y)*280.))*.1*exp(-r*7.);
      gl_FragColor=vec4(1.,.92,.79,(core+halo+rays)*opacity*(1.-smoothstep(.8,1.,r)));}` }));
  sun.position.z=-14;sun.renderOrder=3;
  const earth=new THREE.Group();scene.add(earth);
  const earthVertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
  const earthMaterial=new THREE.ShaderMaterial({uniforms:{dayMap:{value:dayMap},nightMap:{value:nightMap}},
    vertexShader:earthVertex,fragmentShader:`uniform sampler2D dayMap;uniform sampler2D nightMap;varying vec2 vUv;varying vec3 vNormal;varying vec3 vWorld;
      void main(){vec3 n=normalize(vNormal),view=normalize(cameraPosition-vWorld);float light=dot(n,normalize(vec3(.45,.72,.4)));
        float day=smoothstep(-.18,.22,light);vec3 ground=texture2D(dayMap,vUv).rgb;
        vec3 city=texture2D(nightMap,vUv).rgb;
        float rim=pow(1.-max(dot(n,view),0.),4.);
        vec3 color=ground*(.025+day*max(light,.07)*1.6)+city*(1.-day)*vec3(1.5,.95,.5)+vec3(.04,.19,.4)*rim;
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }`});
  const globe=mesh(new THREE.SphereGeometry(1,128,96),earthMaterial,earth);globe.rotation.set(.13,2.1,-.2);
  mesh(new THREE.SphereGeometry(1.014,96,64),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,
    vertexShader:earthVertex,fragmentShader:'varying vec3 vNormal;varying vec3 vWorld;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld))),3.);gl_FragColor=vec4(.17,.45,.88,rim*.55);}'}),earth);


  const apertureUniforms={time:{value:0},aspect:{value:1},height:{value:720}};
  const aperture=mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:apertureUniforms,transparent:true,depthTest:false,depthWrite:false,
    vertexShader:screenVertex,fragmentShader:`varying vec2 vUv;uniform float time;uniform float aspect;uniform float height;
      void main(){
        vec2 p=vUv-.5;
        float stretch=smoothstep(.08,.95,time);
        float opening=smoothstep(1.05,2.3,time);
        float halfWidth=mix(.012,.59,stretch);
        float halfHeight=.0005+pow(opening,1.5)*.67;
        float widthMask=1.-smoothstep(halfWidth-.04,halfWidth,abs(p.x));
        float feather=1.2/height;
        float inside=(1.-smoothstep(halfHeight-feather,halfHeight+feather,abs(p.y)))*widthMask;
        float edge=exp(-abs(abs(p.y)-halfHeight)*height*.75)*widthMask;
        float glow=exp(-abs(abs(p.y)-halfHeight)*height*.065)*widthMask*.1;
        float pulse=smoothstep(0.,.3,time)*(1.-smoothstep(1.4,2.15,time));
        vec3 color=vec3(.002,.004,.01)+vec3(.67,.81,1.)*(edge+glow)*pulse;
        float alpha=max(1.-inside,(edge+glow)*pulse);
        gl_FragColor=vec4(color,clamp(alpha,0.,1.));
      }` }));
  aperture.frustumCulled=false;aperture.renderOrder=10;

  let aspect=1,lastTime=0,travel=0;
  function resize(){
    const width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight);
    const ratio=Math.min(2,Math.sqrt(8294400/(width*height)));
    renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
    aspect=width/height;camera.aspect=aspect;camera.updateProjectionMatrix();
    pixels.value=ratio;flightUniforms.viewport.value.set(width,height);
    apertureUniforms.aspect.value=aspect;apertureUniforms.height.value=height;
    canvas.dataset.renderResolution=`${canvas.width} × ${canvas.height}`;
  }
  function render(t){
    if(t<lastTime){travel=0;lastTime=0;}
    const dt=Math.max(0,Math.min(t-lastTime,.06));lastTime=t;
    const acceleration=smooth(1.3,3.4,t),deceleration=1-smooth(5.1,6.45,t);
    const cruise=acceleration*deceleration,speed=3+230*cruise;
    travel+=speed*dt;
    camera.fov=48+30*smooth(1.4,3.5,t)-26*smooth(5.2,6.6,t);
    camera.position.set(Math.sin(t*.8)*1.35*cruise,Math.sin(t*.55)*.42*cruise,0);
    camera.rotation.set(Math.sin(t*.4)*.005*cruise,Math.sin(t*.37)*.012*cruise,Math.sin(t*.5)*.012*cruise);
    camera.updateProjectionMatrix();
    flightUniforms.travel.value=travel;flightUniforms.speed.value=speed;
    flightUniforms.opacity.value=(.14+.95*smooth(1.2,2.7,t))*(1-smooth(6.,6.7,t));
    flight.visible=t<6.75;skyOpacity.value=.6-.3*cruise;
    apertureUniforms.time.value=t;aperture.visible=t<2.35;

    const approach=smooth(6.,8.6,t),unit=28*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    // A narrow preview panel needs a lower horizon so the brand stays on dark sky.
    const compact=1-smooth(1.1,1.45,aspect);
    earth.visible=t>6.;earth.position.set((.04+aspect*.59*approach)*unit,(-.1-(.57+.33*compact)*approach)*unit,-28);
    earth.scale.setScalar((.006+(1.02-.42*compact)*Math.pow(approach,2.2))*unit);
    globe.rotation.y=2.1+Math.max(0,t-6.)*.045;
    const sunUnit=14*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    sun.position.set((-.05+aspect*.94*approach)*sunUnit,(.51-.23*approach)*sunUnit,-14);
    sun.scale.setScalar(1.5*sunUnit);sun.material.uniforms.opacity.value=smooth(5.9,6.8,t)*2.1*(1-smooth(cues.sunEnd-.6,cues.sunEnd,t));
    canvas.dataset.filmPhase=t<5.9?'flight':t<cues.sunEnd?'sunrise':'settled';
    canvas.dataset.sunOpacity=sun.material.uniforms.opacity.value.toFixed(3);
    renderer.render(scene,camera);
  }
  return {ready:Promise.all(pending),resize,render,dispose(){
    geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());
    maps.forEach(texture=>texture.dispose());renderer.dispose();
  }};
}
