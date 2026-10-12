import * as THREE from './vendor/three.module.js';
import { Reflector } from './vendor/Reflector.js';

// The opening is a physical sculpture on a modular station deck.
export function createAnniversary(renderer) {
  const studio=new THREE.Scene();studio.background=new THREE.Color('#1c2028');
  const cards=[{p:[-3,5,4],s:[3,7],c:[5,4.2,2.7]},{p:[5,7,-3],s:[5,3],c:[10,7.6,3.5]},{p:[5,2,2],s:[1.2,6],c:[2,2.4,3]},{p:[0,1,6],s:[5,4],c:[2,1.6,.85]}];
  for(const {p,s,c}of cards){const card=new THREE.Mesh(new THREE.PlaneGeometry(...s),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(...c),side:THREE.DoubleSide}));card.position.set(...p);card.lookAt(0,0,0);studio.add(card)}
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.02,.1,40);pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
  const materials=new Map(),extraMaterials=[],extraGeometries=[],beacons=[];let reflector,backLight;
  function material(color){
    if(!materials.has(color))materials.set(color,new THREE.MeshPhysicalMaterial({color,roughness:.235,metalness:.62,clearcoat:.65,clearcoatRoughness:.18,envMap:environment.texture,envMapIntensity:1.35,emissive:'#4a2d08',emissiveIntensity:.055}));return materials.get(color);
  }
  function station(group,geometry){
    const deck=new THREE.Group();group.add(deck);const y=-2.78,positions=[],uvs=[],tones=[],bolts=[];
    const shades=['#101c28','#142330','#1d2c38','#0d1722','#26343d'];
    const panelMaterials=shades.map(color=>new THREE.MeshPhysicalMaterial({color,roughness:.35,metalness:.42,clearcoat:.4,envMap:environment.texture,envMapIntensity:.55}));extraMaterials.push(...panelMaterials);
    for(let row=0;row<8;row++)for(let col=-3;col<13;col++){
      // The ragged perimeter and lowered outer plates keep the platform modular.
      if((row===0&&(col<3||col>11))||(row===7&&(col<2||col>10))||(row===1&&col===0)||(col<0&&(row<3||row>6))||(col===-3&&(row<4||row>5)))continue;
      const x=(col-6)*1.36,z=(row-3.5)*1.18,edge=row===0||row===7||col<=0||col===12,drop=edge?.1+((col+row+30)%3)*.09:0,thickness=.43+((col*3+row+40)%4)*.1,w=1.315,d=1.135;
      const tile=new THREE.Mesh(geometry(w,thickness,d),panelMaterials[(col+row*3+30)%5]);tile.position.set(x,y-drop-thickness/2,z);tile.castShadow=tile.receiveShadow=true;deck.add(tile);
      if(!edge){
        const corners=[[x-w/2,-z-d/2],[x+w/2,-z-d/2],[x+w/2,-z+d/2],[x-w/2,-z+d/2]],order=[0,1,2,0,2,3],tex=[[0,0],[1,0],[1,1],[0,1]],tone=.8+((col*7+row)%5)*.1;
        for(const i of order){positions.push(...corners[i],0);uvs.push(...tex[i]);tones.push(tone)}
      }
      if((col+row)%3===0)for(const sign of [-1,1])bolts.push([x+sign*.52,y-drop+.012,z+.52]);
      if((col*3+row)%13===0){const strip=new THREE.Mesh(new THREE.BoxGeometry(.23,.012,.027),new THREE.MeshBasicMaterial({color:'#c08e3b'}));strip.position.set(x-.42,y-drop+.014,z-.5);deck.add(strip);extraGeometries.push(strip.geometry);extraMaterials.push(strip.material);beacons.push(strip.material)}
    }
    const boltGeo=new THREE.CylinderGeometry(.026,.026,.015,8),boltMat=new THREE.MeshStandardMaterial({color:'#78838b',metalness:.85,roughness:.35}),boltMesh=new THREE.InstancedMesh(boltGeo,boltMat,bolts.length),dummy=new THREE.Object3D();bolts.forEach((p,i)=>{dummy.position.set(...p);dummy.updateMatrix();boltMesh.setMatrixAt(i,dummy.matrix)});deck.add(boltMesh);extraGeometries.push(boltGeo);extraMaterials.push(boltMat);
    const top=new THREE.BufferGeometry();top.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));top.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));top.setAttribute('panelTone',new THREE.Float32BufferAttribute(tones,1));top.computeVertexNormals();extraGeometries.push(top);
    const shader={...Reflector.ReflectorShader,uniforms:{...Reflector.ReflectorShader.uniforms,uDeckTime:{value:0},uDeckActivity:{value:0}},name:'StationDeckReflection',vertexShader:`uniform mat4 textureMatrix;attribute float panelTone;varying vec4 vReflect;varying vec2 vTile;varying vec2 vPoint;varying float vTone;void main(){vReflect=textureMatrix*vec4(position,1.);vTile=uv;vPoint=position.xy;vTone=panelTone;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float uDeckTime;uniform float uDeckActivity;uniform vec3 color;uniform sampler2D tDiffuse;varying vec4 vReflect;varying vec2 vTile;varying vec2 vPoint;varying float vTone;void main(){vec2 p=vReflect.xy/vReflect.w;vec3 reflection=texture2D(tDiffuse,p).rgb*.4;reflection+=(texture2D(tDiffuse,p+vec2(.0025,0.)).rgb+texture2D(tDiffuse,p-vec2(.0025,0.)).rgb+texture2D(tDiffuse,p+vec2(0.,.0025)).rgb+texture2D(tDiffuse,p-vec2(0.,.0025)).rgb)*.15;float edge=smoothstep(0.,.023,min(min(vTile.x,1.-vTile.x),min(vTile.y,1.-vTile.y)));float sunlight=exp(-length((vPoint-vec2(4.5,1.5))*vec2(.28,.5)));vec3 steel=color*vTone+vec3(.20,.125,.042)*sunlight;float cycle=mod(uDeckTime+3.,28.);float sweep=exp(-pow((vPoint.x-(-10.+cycle*2.))*.85,2.))*(1.-smoothstep(10.,12.,cycle))*uDeckActivity;float seam=1.-smoothstep(.018,.055,min(min(vTile.x,1.-vTile.x),min(vTile.y,1.-vTile.y)));vec3 energy=vec3(.62,.30,.052)*sweep*(seam*.75+.025);gl_FragColor=vec4(mix(steel*.45,steel+reflection*.26,edge)+energy,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`};
    reflector=new Reflector(top,{textureWidth:1024,textureHeight:1024,multisample:2,clipBias:.003,color:'#111d29',shader});reflector.rotation.x=-Math.PI/2;reflector.position.y=y+.046;deck.add(reflector);
    // A separate shadow receiver preserves contact shadows on the reflected plates.
    const shadowMat=new THREE.ShadowMaterial({opacity:.38,depthWrite:false}),shadow=new THREE.Mesh(top,shadowMat);shadow.rotation.x=-Math.PI/2;shadow.position.y=y+.05;shadow.receiveShadow=true;deck.add(shadow);extraMaterials.push(shadowMat);
    backLight=new THREE.PointLight('#ffcf72',38,17,2);backLight.position.set(5,4,-3);deck.add(backLight);
    return deck;
  }
  function update(time,enabled){if(reflector){reflector.material.uniforms.uDeckTime.value=time;reflector.material.uniforms.uDeckActivity.value=enabled?1:0}beacons.forEach((mat,i)=>{const p=enabled?.3+.7*Math.pow(.5+.5*Math.sin(time*.5-i*.75),4):1;mat.color.setRGB(.53*p,.27*p,.045*p)});if(backLight){const entrance=enabled?THREE.MathUtils.smootherstep(time,0,3.5):1;backLight.position.set(-4+9*entrance,4,-3);backLight.intensity=(24+14*entrance)*(1+(enabled?Math.sin(time*.22)*.065:0))}}
  return {material,station,update,dispose(){reflector?.dispose();environment.dispose();materials.forEach(m=>m.dispose());extraMaterials.forEach(m=>m.dispose());extraGeometries.forEach(g=>g.dispose())}};
}
