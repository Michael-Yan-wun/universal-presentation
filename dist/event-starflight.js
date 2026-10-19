import * as THREE from './vendor/three.module.js';

const clamp=t=>Math.max(0,Math.min(1,t));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const START=22.0,ACCEL=.7,CRUISE=2.0,BRAKE=1.3,DISTANCE=4200;
const MAX_SPEED=DISTANCE/(CRUISE+(ACCEL+BRAKE)/2);
const integralEase=t=>t*t*t-.5*t*t*t*t;

// The same finite travel curve drives star positions and any external handoff.
// Its velocity and acceleration are continuous at launch, cruise and arrival.
function travelAt(time){
  const t=time-START;if(t<=0)return 0;
  if(t<ACCEL)return MAX_SPEED*ACCEL*integralEase(t/ACCEL);
  if(t<ACCEL+CRUISE)return MAX_SPEED*(ACCEL/2+t-ACCEL);
  if(t<ACCEL+CRUISE+BRAKE){const u=(t-ACCEL-CRUISE)/BRAKE;
    return MAX_SPEED*(ACCEL/2+CRUISE+BRAKE*(u-integralEase(u)));
  }
  return DISTANCE;
}
function speedAt(time){
  const t=time-START;if(t<=0)return 0;
  if(t<ACCEL)return MAX_SPEED*ease(t/ACCEL);
  if(t<ACCEL+CRUISE)return MAX_SPEED;
  if(t<ACCEL+CRUISE+BRAKE)return MAX_SPEED*(1-ease((t-ACCEL-CRUISE)/BRAKE));
  return 0;
}

export function createStarflight(scene){
  const root=new THREE.Group();root.name='anniversary-starflight';root.visible=false;scene.add(root);
  let seed=20162026;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const flightCount=1900,farCount=220,count=flightCount+farCount;
  const position=new Float32Array(count*3),color=new Float32Array(count*3),size=new Float32Array(count),layer=new Float32Array(count);
  for(let i=0;i<count;i++){
    const far=i>=flightCount;
    const x=(random()-.5)*(far?6500:4300),y=(random()-.5)*(far?4200:2800);
    const z=far?6900+random()*900:140+random()*7060;
    position.set([x,y,z],i*3);layer[i]=far?1:0;
    const brilliance=.29+Math.pow(random(),2.4)*.65,temperature=random();
    color.set([brilliance*(.74+.2*temperature),brilliance*(.84+.12*temperature),brilliance],i*3);
    size[i]=far?.62+random()*.4:.72+random()*.6;
  }
  const uniforms={
    travel:{value:0},speed:{value:0},opacity:{value:0},pixelRatio:{value:1},
    viewport:{value:new THREE.Vector2(1,1)},
  };
  const depthSource=`
    float depthAt(float source,float distant){
      return distant>.5?source-travel*.14:140.+mod(source-140.-travel+14120.,7060.);
    }
    float edgeFade(float depth,float distant){
      return distant>.5?1.:smoothstep(145.,260.,depth)*(1.-smoothstep(6500.,7200.,depth));
    }
  `;
  const pointsGeometry=new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position',new THREE.BufferAttribute(position,3));
  pointsGeometry.setAttribute('color',new THREE.BufferAttribute(color,3));
  pointsGeometry.setAttribute('starSize',new THREE.BufferAttribute(size,1));
  pointsGeometry.setAttribute('distant',new THREE.BufferAttribute(layer,1));
  const pointsMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,vertexColors:true,toneMapped:true,
    vertexShader:`attribute float starSize;attribute float distant;
      varying vec3 vColor;varying float vOpacity;
      uniform float travel;uniform float opacity;uniform float pixelRatio;
      ${depthSource}
      void main(){float depth=depthAt(position.z,distant);
        gl_Position=projectionMatrix*vec4(position.xy,-depth,1.);
        gl_PointSize=pixelRatio*starSize*clamp(2400./depth,.82,2.6);
        vColor=color;vOpacity=opacity*edgeFade(depth,distant);
      }`,
    fragmentShader:`varying vec3 vColor;varying float vOpacity;
      void main(){float r=length(gl_PointCoord-.5);float core=exp(-r*r*17.);
        float coverage=(1.-smoothstep(.32,.5,r))*core;
        gl_FragColor=vec4(vColor,vOpacity*coverage);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const points=new THREE.Points(pointsGeometry,pointsMaterial);points.frustumCulled=false;points.renderOrder=1;root.add(points);

  // Each segment is the projection of a real head/tail pair along the Z path.
  // Shutter length follows speed. Only the very nearest stars acquire long
  // tails, and a screen-space cap prevents thick radial tunnel graphics.
  const tailPosition=new Float32Array(flightCount*6),tailColor=new Float32Array(flightCount*6),end=new Float32Array(flightCount*2),tailLimit=new Float32Array(flightCount*2);
  for(let i=0;i<flightCount;i++){
    const p=position.subarray(i*3,i*3+3),c=color.subarray(i*3,i*3+3);
    tailPosition.set(p,i*6);tailPosition.set(p,i*6+3);tailColor.set(c,i*6);tailColor.set(c,i*6+3);
    end[i*2]=0;end[i*2+1]=1;
    const cap=i%43===0?38:12+random()*18;tailLimit[i*2]=tailLimit[i*2+1]=cap;
  }
  const tailGeometry=new THREE.BufferGeometry();
  tailGeometry.setAttribute('position',new THREE.BufferAttribute(tailPosition,3));
  tailGeometry.setAttribute('color',new THREE.BufferAttribute(tailColor,3));
  tailGeometry.setAttribute('tailEnd',new THREE.BufferAttribute(end,1));
  tailGeometry.setAttribute('tailLimit',new THREE.BufferAttribute(tailLimit,1));
  const tailMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,vertexColors:true,toneMapped:true,
    vertexShader:`attribute float tailEnd;attribute float tailLimit;
      varying vec3 vColor;varying float vOpacity;varying float vTail;
      uniform float travel;uniform float speed;uniform float opacity;uniform vec2 viewport;
      ${depthSource}
      void main(){float depth=depthAt(position.z,0.);
        float trail=speed*.044;
        vec4 head=projectionMatrix*vec4(position.xy,-depth,1.);
        vec4 tail=projectionMatrix*vec4(position.xy,-depth-trail,1.);
        vec2 h=head.xy/head.w,t=tail.xy/tail.w;
        float pixels=length((t-h)*viewport*.5);
        vec2 clipped=h+(t-h)*min(1.,tailLimit/max(pixels,.001));
        vec4 result=mix(head,tail,tailEnd);result.xy=mix(h,clipped,tailEnd)*result.w;
        gl_Position=result;
        vColor=color;vTail=tailEnd;
        vOpacity=opacity*edgeFade(depth,0.)*smoothstep(80.,650.,speed)*smoothstep(.35,2.3,pixels)*.63;
      }`,
    fragmentShader:`varying vec3 vColor;varying float vOpacity;varying float vTail;
      void main(){float taper=pow(1.-vTail,1.7);
        gl_FragColor=vec4(vColor,vOpacity*taper);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const tails=new THREE.LineSegments(tailGeometry,tailMaterial);tails.frustumCulled=false;tails.renderOrder=0;root.add(tails);

  function update(time,view,camera){
    root.visible=time>=19.4;if(!root.visible)return;
    root.position.copy(camera.position);root.quaternion.copy(camera.quaternion);
    uniforms.travel.value=travelAt(time);uniforms.speed.value=speedAt(time);
    uniforms.opacity.value=ease((time-19.4)/1.0);
    uniforms.viewport.value.set(Math.max(1,view.width),Math.max(1,view.height));
    uniforms.pixelRatio.value=Math.min(globalThis.devicePixelRatio||1,2);
    // The shaders use camera-local coordinates directly. Retain the shared
    // projection matrix so wide and narrow screens keep identical true depth.
  }
  return {update,distanceAt:travelAt,root};
}
