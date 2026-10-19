import * as THREE from './vendor/three.module.js';

const clamp=value=>Math.max(0,Math.min(1,value));
const ease=value=>{const p=clamp(value);return p*p*(3-2*p);};
const lerp=(a,b,p)=>a+(b-a)*p;

// The anniversary has its own reflection room, independent of the logo's lights.
export function createAnniversaryMetal(renderer){
  const room=new THREE.Scene();room.background=new THREE.Color('#1b222b');
  const softCanvas=document.createElement('canvas');softCanvas.width=256;softCanvas.height=32;
  const context=softCanvas.getContext('2d'),pixels=context.createImageData(256,32);
  for(let y=0;y<32;y++)for(let x=0;x<256;x++){
    const u=x/255,v=y/31;
    const softness=ease(u/.25)*ease((1-u)/.25)*ease(v/.2)*ease((1-v)/.2),i=(y*256+x)*4;
    pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;pixels.data[i+3]=Math.round(255*softness);
  }
  context.putImageData(pixels,0,0);
  const softTexture=new THREE.CanvasTexture(softCanvas);softTexture.colorSpace=THREE.SRGBColorSpace;
  const addPanel=(w,h,color,position,rotation,soft=true)=>{
    const material=new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(...color),map:soft?softTexture:null,transparent:soft,side:THREE.DoubleSide,toneMapped:false});
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(...position);mesh.rotation.set(...rotation);room.add(mesh);
  };

  // A broad soft reflection, a slim silver return, and dark flags between them.
  addPanel(410,1380,[1.0,1.03,1.08],[-290,20,535],[0,.27,-.075]);
  addPanel(110,1400,[1.6,2.0,3.3],[-42,45,575],[0,.08,-.07]);
  addPanel(70,1260,[.045,.052,.065],[79,20,610],[0,-.12,-.06],false);
  addPanel(290,1320,[1.20,1.26,1.36],[295,10,540],[0,-.34,-.075]);
  addPanel(430,105,[1.05,1.05,1.02],[-65,400,310],[.62,0,-.12]);
  addPanel(680,220,[.25,.27,.31],[0,-430,220],[-.82,0,.07]);
  addPanel(125,940,[.40,.43,.49],[-520,30,-120],[0,1.3,0]);
  addPanel(180,980,[.25,.27,.30],[500,-30,-230],[0,-1.15,.025]);
  addPanel(700,1050,[.12,.14,.18],[0,50,-540],[0,Math.PI,0]);
  const generator=new THREE.PMREMGenerator(renderer);
  const environment=generator.fromScene(room,.018,.1,1800);
  generator.dispose();softTexture.dispose();
  room.traverse(object=>{object.geometry?.dispose();object.material?.dispose();});

  const presence={value:.90},activation={value:0},sweep={value:-1000},polish={value:0};
  const makeMaterial=side=>{
    const material=new THREE.MeshPhysicalMaterial({
      color:side?0x82705a:0xb39a6b,
      metalness:.985,
      roughness:side?.24:.22,
      envMap:environment.texture,
      envMapIntensity:side?.96:1.05,
      clearcoat:0,
      dithering:true
    });
    material.onBeforeCompile=shader=>{
      shader.uniforms.uAnniversaryPresence=presence;shader.uniforms.uAnniversaryActivation=activation;shader.uniforms.uAnniversarySweep=sweep;shader.uniforms.uAnniversaryPolish=polish;
      shader.vertexShader=`varying vec3 vAnniversaryPosition;
        varying vec3 vAnniversaryAxisX;
        varying vec3 vAnniversaryAxisY;
        varying float vAnniversaryFace;
        `+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        vAnniversaryPosition=position;
        vAnniversaryAxisX=normalMatrix*vec3(1.,0.,0.);
        vAnniversaryAxisY=normalMatrix*vec3(0.,1.,0.);
        vAnniversaryFace=abs(normal.z);
      `);
      shader.fragmentShader=`uniform float uAnniversaryPresence;
        uniform float uAnniversaryActivation;
        uniform float uAnniversarySweep;
        uniform float uAnniversaryPolish;
        varying vec3 vAnniversaryPosition;
        varying vec3 vAnniversaryAxisX;
        varying vec3 vAnniversaryAxisY;
        varying float vAnniversaryFace;
        `+shader.fragmentShader;
      if(!side)shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        float crown=smoothstep(.75,.98,vAnniversaryFace);
        vec3 crownOffset=normalize(vAnniversaryAxisX)*(vAnniversaryPosition.x+vAnniversaryPosition.y*.24)*.00115
          +normalize(vAnniversaryAxisY)*vAnniversaryPosition.y*.00042;
        normal=normalize(normal+crownOffset*crown);
      `);
      shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        reflectedLight.directDiffuse=vec3(0.);
        reflectedLight.directSpecular=vec3(0.);
      `);
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
        outgoingLight=outgoingLight*uAnniversaryPresence+diffuseColor.rgb*.045;
        float bevel=smoothstep(.08,.4,vAnniversaryFace)*(1.-smoothstep(.88,.99,vAnniversaryFace));
        float ignited=smoothstep(-.1,.13,uAnniversaryActivation-(.5-vAnniversaryPosition.y/440.));
        outgoingLight+=vec3(.28,.24,.17)*bevel*ignited;
        float ribbon=exp(-pow((vAnniversaryPosition.x+vAnniversaryPosition.y*.16-uAnniversarySweep)/38.,2.));
        outgoingLight+=vec3(.9,.85,.72)*ribbon*uAnniversaryPolish*.25*smoothstep(.9,.99,vAnniversaryFace);
        #include <opaque_fragment>
      `);
    };
    material.customProgramCacheKey=()=>`anniversary-neutral-metal-${side?'edge':'face'}-v4`;
    return material;
  };
  const face=makeMaterial(false),edge=makeMaterial(true);
  function update(progress,time){
    const finish=ease(progress);
    // Keep the distant face legible; polish comes from reflection movement.
    presence.value=lerp(.94,1.20,finish);
    activation.value=ease((time-25.0)/1.7);
    const pass=clamp((time-27.0)/2.3);
    sweep.value=lerp(-410,410,pass);polish.value=Math.pow(Math.sin(Math.PI*pass),1.5);
    face.envMapIntensity=lerp(1.30,1.70,finish);edge.envMapIntensity=lerp(1.10,1.27,finish);
    face.envMapRotation.set(lerp(.055,-.018,finish),lerp(-.24,.075,finish),.025);
    edge.envMapRotation.copy(face.envMapRotation);
  }
  update(0,0);
  return {face,edge,update};
}


// A finite handful of gold-white photons arrives at the existing solid rim.
// They vanish on contact; they never assemble or replace the numeral itself.
export function createCelebrationStarlight(parent,outline){
  const count=72,position=new Float32Array(count*3),alpha=new Float32Array(count),color=new Float32Array(count*3),size=new Float32Array(count);
  let seed=102026;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const paths=[];
  for(let i=0;i<count;i++){
    const target=outline[Math.floor(random()*outline.length)],angle=random()*Math.PI*2,radius=240+random()*400;
    paths.push({x:target[0],y:target[1],sx:target[0]+Math.cos(angle)*radius,sy:target[1]+Math.sin(angle)*radius,sz:100+random()*220,start:25+random()*.85,duration:.85+random()*.75});
    const cool=random()>.5;color.set(cool?[.84,.91,1.]:[1.,.86,.59],i*3);size[i]=.9+random()*1.05;
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(position,3));geometry.setAttribute('alpha',new THREE.BufferAttribute(alpha,1));geometry.setAttribute('color',new THREE.BufferAttribute(color,3));geometry.setAttribute('starSize',new THREE.BufferAttribute(size,1));
  const material=new THREE.ShaderMaterial({uniforms:{pixelRatio:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true,
    vertexShader:`attribute float alpha;attribute float starSize;varying float vAlpha;varying vec3 vColor;uniform float pixelRatio;
      void main(){vAlpha=alpha;vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*pixelRatio*2.1;}`,
    fragmentShader:`varying float vAlpha;varying vec3 vColor;
      void main(){float r=length(gl_PointCoord-.5);float core=exp(-r*r*24.)*(1.-smoothstep(.3,.5,r));gl_FragColor=vec4(vColor,vAlpha*core);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const stars=new THREE.Points(geometry,material);stars.frustumCulled=false;stars.visible=false;stars.renderOrder=3;parent.add(stars);
  function update(time,pixelRatio){
    stars.visible=time>=25&&time<28.4;if(!stars.visible)return;
    material.uniforms.pixelRatio.value=pixelRatio;
    for(let i=0;i<count;i++){
      const path=paths[i],p=clamp((time-path.start)/path.duration),q=ease(p);
      position.set([lerp(path.sx,path.x,q),lerp(path.sy,path.y,q),lerp(path.sz,18,q)],i*3);
      alpha[i]=ease(p/.18)*(1-ease((p-.68)/.32))*.8;
    }
    geometry.attributes.position.needsUpdate=true;geometry.attributes.alpha.needsUpdate=true;
  }
  return {update};
}
