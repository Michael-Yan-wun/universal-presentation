import * as THREE from './vendor/three.module.js';

const clamp=value=>Math.max(0,Math.min(1,value));
const ease=value=>{const p=clamp(value);return p*p*(3-2*p);};
const lerp=(a,b,p)=>a+(b-a)*p;

// The anniversary has its own reflection room, independent of the logo's lights.
export function createAnniversaryMetal(renderer){
  const room=new THREE.Scene();room.background=new THREE.Color('#0a0e15');
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
  addPanel(410,1380,[.72,.74,.79],[-290,20,535],[0,.27,-.075]);
  addPanel(110,1400,[1.6,2.0,3.3],[-42,45,575],[0,.08,-.07]);
  addPanel(92,1260,[.008,.012,.019],[79,20,610],[0,-.12,-.06],false);
  addPanel(290,1320,[.93,1.04,1.32],[295,10,540],[0,-.34,-.075]);
  addPanel(430,105,[.65,.67,.69],[-65,400,310],[.62,0,-.12]);
  addPanel(680,220,[.25,.27,.31],[0,-430,220],[-.82,0,.07]);
  addPanel(125,940,[.40,.43,.49],[-520,30,-120],[0,1.3,0]);
  addPanel(180,980,[.25,.27,.30],[500,-30,-230],[0,-1.15,.025]);
  addPanel(700,1050,[.12,.14,.18],[0,50,-540],[0,Math.PI,0]);
  const generator=new THREE.PMREMGenerator(renderer);
  const environment=generator.fromScene(room,.018,.1,1800);
  generator.dispose();softTexture.dispose();
  room.traverse(object=>{object.geometry?.dispose();object.material?.dispose();});

  const presence={value:.76};
  const makeMaterial=side=>{
    const material=new THREE.MeshPhysicalMaterial({
      color:side?0x82705a:0xb39a6b,
      metalness:.985,
      roughness:side?.24:.19,
      envMap:environment.texture,
      envMapIntensity:side?.96:1.05,
      clearcoat:0,
      dithering:true
    });
    material.onBeforeCompile=shader=>{
      shader.uniforms.uAnniversaryPresence=presence;
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
        outgoingLight=outgoingLight*uAnniversaryPresence+diffuseColor.rgb*.012;
        #include <opaque_fragment>
      `);
    };
    material.customProgramCacheKey=()=>`anniversary-neutral-metal-${side?'edge':'face'}-v2`;
    return material;
  };
  const face=makeMaterial(false),edge=makeMaterial(true);
  function update(progress,time){
    const finish=ease(progress);
    // Keep the distant face legible; polish comes from reflection movement.
    presence.value=lerp(.76,.98,finish);
    face.envMapIntensity=lerp(.98,1.12,finish);edge.envMapIntensity=lerp(.98,1.02,finish);
    face.envMapRotation.set(lerp(.055,-.018,finish),lerp(-.24,.075,finish),.025);
    edge.envMapRotation.copy(face.envMapRotation);
  }
  update(0,0);
  return {face,edge,update};
}
