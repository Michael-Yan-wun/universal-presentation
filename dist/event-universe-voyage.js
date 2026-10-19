import * as THREE from './vendor/three.module.js';
const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,p)=>a+(b-a)*p;

// One camera-relative world: lettering, unobstructed starflight, then low Earth orbit.
export function createUniverseVoyage(scene,lettering,{letteringOnly=false}={}){
  const root=new THREE.Group();root.name='universe-voyage';scene.add(root);
  const word=new THREE.Group();root.add(word);
  const front=new THREE.MeshPhysicalMaterial({color:0x71858c,metalness:.88,roughness:.25,envMap:scene.environment,envMapIntensity:1.9,transparent:true});
  const edge=new THREE.MeshPhysicalMaterial({color:0x344958,metalness:.85,roughness:.31,envMap:scene.environment,envMapIntensity:1.4,transparent:true});
  front.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 vWordPosition;varying vec3 vWordX;varying vec3 vWordY;varying float vWordFace;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      vWordPosition=position;vWordX=normalMatrix*vec3(1.,0.,0.);vWordY=normalMatrix*vec3(0.,1.,0.);vWordFace=abs(normal.z);`);
    shader.fragmentShader='varying vec3 vWordPosition;varying vec3 vWordX;varying vec3 vWordY;varying float vWordFace;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec3 crown=normalize(vWordX)*vWordPosition.x*.00028+normalize(vWordY)*vWordPosition.y*.0011;
      normal=normalize(normal+crown*smoothstep(.9,.99,vWordFace));`);
  };
  front.customProgramCacheKey=()=> 'universe-sculpted-slate-v1';
  for(const letter of lettering.letters){
    const path=new THREE.ShapePath();
    for(const [op,...p] of letter){
      if(op==='M')path.moveTo(...p);else if(op==='L')path.lineTo(...p);
      else if(op==='C')path.bezierCurveTo(...p);else if(op==='Q')path.quadraticCurveTo(...p);
      else path.currentPath?.closePath();
    }
    for(const shape of path.toShapes()){
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:30,bevelEnabled:true,bevelSize:.95,bevelThickness:1.1,bevelSegments:10,curveSegments:24});
      geometry.translate(0,0,-15);word.add(new THREE.Mesh(geometry,[front,edge]));
    }
  }

  const globeVertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPoint;
    void main(){vUv=uv;vec4 p=modelMatrix*vec4(position,1.);vPoint=p.xyz;
      vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*p;}`;
  const sun={value:new THREE.Vector3()},alpha={value:0};
  const dark=new THREE.DataTexture(new Uint8Array([5,13,25,255]),1,1);dark.needsUpdate=true;
  const clear=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1);clear.needsUpdate=true;
  const dayMap={value:dark},nightMap={value:dark},cloudMap={value:clear};
  const cloudShift={value:0};
  const earthUniforms={dayMap,nightMap,cloudMap,cloudShift,sun,opacity:alpha};
  const earthMaterial=new THREE.ShaderMaterial({uniforms:earthUniforms,transparent:true,depthWrite:true,vertexShader:globeVertex,
    fragmentShader:`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPoint;
      uniform sampler2D dayMap;uniform sampler2D nightMap;uniform sampler2D cloudMap;uniform float cloudShift;
      uniform vec3 sun;uniform float opacity;
      void main(){vec3 n=normalize(vNormal),eye=normalize(cameraPosition-vPoint);
        float lit=dot(n,sun),daylight=smoothstep(-.12,.22,lit);
        vec3 albedo=texture2D(dayMap,vUv).rgb,cities=texture2D(nightMap,vUv).rgb;
        float shadow=texture2D(cloudMap,fract(vUv*vec2(5.,2.5)+vec2(cloudShift-.0018,.001))).r;
        vec3 diffuse=albedo*vec3(.65,.76,.9)*(.04+.68*max(lit,0.));
        diffuse*=1.-smoothstep(.12,.8,shadow)*.42;
        vec3 night=albedo*.01+vec3(.001,.002,.006)+cities*vec3(.8,.55,.28)*.38;
        float water=smoothstep(.015,.07,albedo.b-max(albedo.r,albedo.g));
        float reflection=pow(max(dot(reflect(-sun,n),eye),0.),85.)*water;
        vec3 color=mix(night,diffuse,daylight)+vec3(.2,.29,.35)*reflection*.22;
        float limb=pow(1.-max(dot(n,eye),0.),9.);
        color+=vec3(.012,.045,.09)*limb*daylight;
        gl_FragColor=vec4(color,opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const radius=6300,earthGeometry=new THREE.SphereGeometry(radius,256,160);
  const earth=new THREE.Mesh(earthGeometry,earthMaterial);earth.rotation.set(-.75,1.9,.12);root.add(earth);
  const cloudMaterial=new THREE.ShaderMaterial({uniforms:{cloudMap,cloudShift,sun,opacity:alpha},transparent:true,depthWrite:false,vertexShader:globeVertex,
    fragmentShader:`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPoint;
      uniform sampler2D cloudMap;uniform vec3 sun;uniform float cloudShift;uniform float opacity;
      void main(){vec3 n=normalize(vNormal),eye=normalize(cameraPosition-vPoint);
        float lit=dot(n,sun),daylight=smoothstep(-.14,.24,lit);
        vec2 uv=fract(vUv*vec2(5.,2.5)+vec2(cloudShift,0.));float density=texture2D(cloudMap,uv).r;
        float nearby=texture2D(cloudMap,uv+vec2(.0008,.0005)).r;
        float relief=clamp((density-nearby)*2.,-.18,.18);
        vec3 color=mix(vec3(.008,.013,.022),vec3(.78,.82,.86)*(.12+.88*max(lit,0.)),daylight);
        color*=1.+relief;
        float coverage=smoothstep(.06,.68,density)*.97;
        gl_FragColor=vec4(color,coverage*opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const clouds=new THREE.Mesh(earthGeometry,cloudMaterial);clouds.scale.setScalar(1.0025);clouds.rotation.copy(earth.rotation);clouds.renderOrder=2;root.add(clouds);
  const airMaterial=new THREE.ShaderMaterial({uniforms:{sun,opacity:alpha},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:globeVertex,
    fragmentShader:`varying vec3 vNormal;varying vec3 vPoint;uniform vec3 sun;uniform float opacity;
      void main(){vec3 n=normalize(vNormal),eye=normalize(cameraPosition-vPoint);
        float edge=pow(1.-max(dot(n,eye),0.),28.);
        float light=smoothstep(-.3,.7,dot(n,sun));
        gl_FragColor=vec4(mix(vec3(.04,.11,.25),vec3(.19,.36,.61),light),edge*opacity*(.07+.29*light));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const air=new THREE.Mesh(earthGeometry,airMaterial);air.scale.setScalar(1.004);air.renderOrder=3;root.add(air);
  // A detailed orbital matte avoids magnifying a whole-globe UV map at low altitude.
  // It remains a plane in the 3D flight, with a separate approach depth and alpha limb.
  let hasOrbitMatte=false;
  const orbitMaterial=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,depthTest:true,alphaTest:.025,toneMapped:false});
  const orbitImage=new THREE.Mesh(new THREE.PlaneGeometry(1,1),orbitMaterial);orbitImage.visible=false;orbitImage.renderOrder=4;root.add(orbitImage);
  const loader=new THREE.TextureLoader();
  const orbitReady=letteringOnly?Promise.resolve(false):new Promise(resolve=>loader.load('./assets/universe/earth-orbit-matte-v1.png',texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;orbitMaterial.map=texture;orbitMaterial.needsUpdate=true;hasOrbitMatte=true;resolve(true);
  },undefined,()=>resolve(false)));
  const load=(path,uniform,colorSpace=THREE.SRGBColorSpace)=>new Promise(resolve=>loader.load(path,texture=>{
    texture.colorSpace=colorSpace;texture.wrapS=THREE.RepeatWrapping;texture.anisotropy=8;uniform.value=texture;resolve(true);
  },undefined,()=>resolve(false)));
  const texturesReady=letteringOnly?Promise.resolve([]):Promise.all([
    load('./assets/universe/earth-day.jpg',dayMap),load('./assets/universe/earth-night.png',nightMap),
    load('./assets/universe/earth-cloud-density-v1.png',cloudMap,THREE.NoColorSpace),
    orbitReady
  ]);

  const ray=new THREE.Vector3(),down=new THREE.Vector3(),center=new THREE.Vector3();
  function update(time,view,camera,distance,totalDistance){
    root.visible=time>19.4;if(!root.visible)return;
    root.position.copy(camera.position);root.quaternion.copy(camera.quaternion);
    sun.value.set(.65,.48,.15).normalize().applyQuaternion(camera.quaternion);
    const wordIn=ease((time-19.7)/1.0),pass=ease((time-22.0)/3.8);
    word.visible=time<26.0;
    const span=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*1150*(view.width/view.height);
    word.scale.setScalar(Math.min(.95,span*.78/lettering.width));
    word.position.set(lerp(0,-span*.68,pass),Math.sin((time-19.7)*1.4)*6+pass*105,lerp(lerp(-1500,-1150,wordIn),-220,pass));
    word.rotation.set(.12+Math.sin((time-19.7)*1.1)*.04,lerp(-.58,.12,ease((time-19.7)/2.1))+pass*.6,Math.sin((time-19.7)*.8)*.024);
    front.opacity=edge.opacity=wordIn*(1-ease((time-25.55)/.45));
    front.depthWrite=edge.depthWrite=front.opacity>.98;
    front.envMapRotation.set(.04,lerp(-.15,.2,ease((time-19.7)/3.5)),0);
    if(letteringOnly){earth.visible=clouds.visible=air.visible=orbitImage.visible=false;return;}
    const arrival=ease((time-24)/3.3);
    earth.visible=clouds.visible=air.visible=time>=24&&!hasOrbitMatte;
    orbitImage.visible=time>=24&&hasOrbitMatte;
    if(orbitImage.visible){
      const pixelsWide=view.width*1.16,pixelsHigh=pixelsWide/2;
      const horizon=view.height*lerp(1.25,.73,arrival);
      const centerY=horizon+(0.5-.32)*pixelsHigh;
      const worldPerPixel=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*2200/view.height;
      orbitImage.scale.set(pixelsWide*worldPerPixel,pixelsHigh*worldPerPixel,1);
      orbitImage.position.set(view.width*.01*worldPerPixel,(view.height/2-centerY)*worldPerPixel,-2200-(totalDistance-distance)*.4);
      orbitImage.rotation.z=.006*(1-arrival);orbitMaterial.opacity=ease((time-24)/2.3);
    }
    if(earth.visible){
      const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      ray.set(.25*tangent*camera.aspect,lerp(-1.3,-.48,arrival)*tangent,-1).normalize();
      down.set(0,-1,0).addScaledVector(ray,-down.dot(ray)).normalize();
      center.copy(ray).multiplyScalar(2400).addScaledVector(down,radius);center.z+=(distance-totalDistance)*.65;
      earth.position.copy(center);clouds.position.copy(center);air.position.copy(center);
      earth.rotation.y=1.9+.018*arrival;clouds.rotation.copy(earth.rotation);cloudShift.value=.003*arrival;
      alpha.value=ease((time-24)/2.3);
    }
  }
  return {update,texturesReady};
}
