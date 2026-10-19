import * as THREE from './vendor/three.module.js';

const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;

// A camera-relative low-orbit Earth. The distant silhouette is actual geometry,
// so its thin atmosphere and the emerging sunlight share one physical horizon.
export function createOrbitDawn(scene){
  const root=new THREE.Group();root.name='anniversary-orbital-dawn';root.visible=false;scene.add(root);
  const radius=2800;
  const uniforms={
    dayMap:{value:null},nightMap:{value:null},hasDay:{value:0},hasNight:{value:0},
    opacity:{value:0},sunrise:{value:0},sunDirection:{value:new THREE.Vector3()},sunPosition:{value:new THREE.Vector3()},
  };
  const vertex=`varying vec2 vUv;varying vec3 vNormalWorld;varying vec3 vWorld;
    void main(){vUv=uv;vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;
      vNormalWorld=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*p;}`;
  const surface=new THREE.ShaderMaterial({
    transparent:true,depthWrite:true,toneMapped:true,uniforms,
    vertexShader:vertex,
    fragmentShader:`varying vec2 vUv;varying vec3 vNormalWorld;varying vec3 vWorld;
      uniform sampler2D dayMap;uniform sampler2D nightMap;uniform float hasDay;uniform float hasNight;
      uniform float opacity;uniform float sunrise;uniform vec3 sunDirection;
      void main(){
        vec3 n=normalize(vNormalWorld),eye=normalize(cameraPosition-vWorld);
        float facing=max(0.,dot(n,eye)),light=dot(n,sunDirection);
        float morning=smoothstep(-.12,.38,light)*sunrise;
        vec3 albedo=mix(vec3(.025,.06,.095),texture2D(dayMap,vUv).rgb,hasDay);
        vec3 night=texture2D(nightMap,vUv).rgb;
        float city=pow(smoothstep(.065,.46,max(night.r,max(night.g,night.b))),1.2)*hasNight;
        vec3 oceanNight=vec3(.0018,.005,.014)+albedo*vec3(.018,.033,.065);
        vec3 day=albedo*vec3(.19,.26,.34)+vec3(.006,.012,.022);
        vec3 color=mix(oceanNight,day,morning);
        color+=vec3(.48,.39,.22)*city*.33*(1.-morning*.82);
        float limb=pow(1.-facing,6.5);
        color+=vec3(.026,.13,.3)*limb*(.18+.45*morning);
        color*=.82+.18*smoothstep(-.7,.6,n.x);
        gl_FragColor=vec4(color,opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const geometry=new THREE.SphereGeometry(radius,192,128);
  const earth=new THREE.Mesh(geometry,surface);earth.name='orbital-earth-surface';root.add(earth);
  earth.rotation.set(1.0,-.35,-.105);

  const atmosphere=(scale,strength)=>{
    const mat=new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,toneMapped:true,
      uniforms:{opacity:uniforms.opacity,sunrise:uniforms.sunrise,sunDirection:uniforms.sunDirection,sunPosition:uniforms.sunPosition,strength:{value:strength}},
      vertexShader:vertex,
      fragmentShader:`varying vec3 vNormalWorld;varying vec3 vWorld;
        uniform float opacity;uniform float sunrise;uniform float strength;uniform vec3 sunDirection;uniform vec3 sunPosition;
        void main(){vec3 n=normalize(vNormalWorld),eye=normalize(cameraPosition-vWorld);
          float rim=pow(1.-abs(dot(n,eye)),5.7);
          float sunlight=smoothstep(-.28,.45,dot(n,sunDirection))*sunrise;
          vec3 color=mix(vec3(.05,.24,.7),vec3(.36,.67,1.),sunlight*.7);
          float halo=exp(-length(vWorld-sunPosition)/510.)*sunrise;
          color=mix(color,vec3(.72,.84,1.),halo*.72);
          float alpha=rim*strength*opacity*(.35+.65*sunlight)*(1.+halo*.7);
          gl_FragColor=vec4(color,alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    });
    const shell=new THREE.Mesh(geometry,mat);shell.scale.setScalar(scale);shell.renderOrder=2;root.add(shell);return shell;
  };
  const innerAir=atmosphere(1.0028,.66),outerAir=atmosphere(1.0095,.10);

  const sunMaterial=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:true,
    uniforms:{intensity:{value:0}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float intensity;
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);
        float halo=exp(-r*r*5.)*.20,corona=exp(-r*r*36.)*.29,core=exp(-r*r*180.)*.58;
        float alpha=(halo+corona+core)*intensity*(1.-smoothstep(.7,1.,r));
        vec3 color=mix(vec3(.38,.62,1.),vec3(1.,.96,.86),clamp(corona*2.3+core,0.,1.));
        gl_FragColor=vec4(color,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const sun=new THREE.Mesh(new THREE.PlaneGeometry(600,420),sunMaterial);sun.name='horizon-first-light';sun.renderOrder=3;root.add(sun);

  // Texture failure resolves to the procedural deep-blue base; it never gates
  // the logo clock or causes an unhandled promise rejection.
  const loader=new THREE.TextureLoader();
  const load=(url,map,flag)=>new Promise(resolve=>{
    loader.load(url,texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=THREE.RepeatWrapping;
      texture.anisotropy=4;uniforms[map].value=texture;uniforms[flag].value=1;resolve(true);
    },undefined,()=>resolve(false));
  });
  const ready=Promise.all([
    load('./assets/universe/earth-day.jpg','dayMap','hasDay'),
    load('./assets/universe/earth-night.png','nightMap','hasNight'),
  ]);
  // Valid transparent fallback samplers before either local image has loaded.
  const pixel=new THREE.DataTexture(new Uint8Array([3,8,17,255]),1,1);pixel.needsUpdate=true;
  uniforms.dayMap.value=uniforms.nightMap.value=pixel;
  const ray=new THREE.Vector3(),down=new THREE.Vector3(),center=new THREE.Vector3(),light=new THREE.Vector3();

  function update(time,view,camera){
    root.visible=time>=18.7;if(!root.visible)return;
    const arrival=ease((time-19)/3.3),dawn=ease((time-21.7)/3.7);
    const aspect=view.width/Math.max(1,view.height),tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    // Horizon apex arrives at x65%, y74%; on either aspect the left text zone
    // remains dark, while a genuinely curved Earth occupies the lower third.
    const apexY=lerp(-1.24,-.48,arrival);
    ray.set(.3*tangent*aspect,apexY*tangent,-1).normalize();
    down.set(0,-1,0).addScaledVector(ray,-down.dot(ray)).normalize();
    center.copy(ray).multiplyScalar(3000).addScaledVector(down,radius);
    root.position.copy(camera.position);root.quaternion.copy(camera.quaternion);
    earth.position.copy(center);innerAir.position.copy(center);outerAir.position.copy(center);
    // A restrained geographic drift makes the transition feel orbital, not a
    // flat background sliding upward. No additional stars or bright rings.
    earth.rotation.y=-.35+.018*ease((time-19)/8.5);
    uniforms.opacity.value=ease((time-19)/2.1);
    uniforms.sunrise.value=dawn;
    light.set(.61,lerp(.32,.62,dawn),lerp(-.79,-.50,dawn)).normalize().applyQuaternion(camera.quaternion);
    uniforms.sunDirection.value.copy(light);

    // Place the small sunrise exactly on the sphere's projected silhouette.
    // Solve the tangent-ray discriminant at the right-hand horizon longitude.
    const kx=.57*tangent*aspect,m=kx*center.x-center.z;
    const k=center.lengthSq()-radius*radius,a=center.y*center.y-k,b=2*center.y*m,c=m*m-k*(1+kx*kx);
    const determinant=Math.max(0,b*b-4*a*c);
    const ky=Math.min((-b+Math.sqrt(determinant))/(2*a),(-b-Math.sqrt(determinant))/(2*a));
    ray.set(kx,ky,-1);const distance=ray.dot(center)/ray.lengthSq();
    sun.position.copy(ray).multiplyScalar(distance*.996);
    sun.position.y+=lerp(-7,1,dawn);
    uniforms.sunPosition.value.copy(sun.position).applyQuaternion(camera.quaternion).add(camera.position);
    sunMaterial.uniforms.intensity.value=dawn*1.18*uniforms.opacity.value;
  }
  return {update,ready};
}
