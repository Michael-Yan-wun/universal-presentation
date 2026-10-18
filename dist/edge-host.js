import * as THREE from './vendor/three.module.js';

// A generic industrial edge computer physically carries the software building block.
export function createEdgeHost({parent,brick,addLabel,id,name,color,subtitle,pos=[0,-3.05,.4]}){
 const root=new THREE.Group();root.name=`${id}-edge-host`;root.position.set(...pos);parent.add(root);
 const metal=new THREE.MeshStandardMaterial({color:'#9babb6',metalness:.7,roughness:.3}),shell=new THREE.MeshStandardMaterial({color:'#324556',metalness:.55,roughness:.35}),black=new THREE.MeshStandardMaterial({color:'#0c1620',roughness:.48});
 const indicator=new THREE.MeshStandardMaterial({color:'#9fceb8',emissive:'#4f9e79',emissiveIntensity:.45,roughness:.3});
 function box(w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m}
 box(5.15,.83,2.18,shell,0,0,0);box(5.3,.10,2.3,metal,0,-.49,0);box(4.92,.65,.075,black,0,-.015,1.12);
 for(let i=0;i<25;i++)box(.09,.18,2.12,metal,-2.42+i*.202,.51,0);
 for(const side of[-1,1]){box(.23,.16,2.35,metal,side*2.7,-.52,0);for(const z of[-.9,.9]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.02,16),black);screw.position.set(side*2.7,-.428,z);root.add(screw)}}
 for(const x of[-1.48,-.73]){box(.48,.36,.07,metal,x,-.03,1.17);box(.35,.25,.035,black,x,-.01,1.22);for(let j=0;j<6;j++)box(.025,.055,.025,metal,x-.135+j*.054,.074,1.246);box(.04,.035,.027,indicator,x+.14,-.115,1.245)}
 for(const x of[.1,.53]){box(.29,.18,.07,metal,x,-.035,1.17);box(.21,.085,.027,black,x,-.02,1.218)}
 box(.63,.24,.075,metal,1.28,-.05,1.17);box(.49,.13,.025,black,1.28,-.05,1.222);
 for(let j=0;j<5;j++)box(.032,.032,.028,metal,1.1+j*.09,-.045,1.241);
 for(let j=0;j<3;j++)box(.047,.047,.03,indicator,2.02,.13-j*.12,1.175);
 const o=brick(root,{id,name,sub:subtitle||(id==='numeric'?'CONNECT / UNDERSTAND / INFER':'CAPTURE / PIPELINE / INFERENCE'),color,cols:4,rows:2,h:.83,pos:[0,1.07,0],scale:1.06});o.senseManaged=true;
 addLabel(root,new THREE.Vector3(0,-1.08,.65),'Edge 硬體 · 現場運算',id,'#c4d1dc','edge-host-label','growth');
 return {root,brick:o,update(time,progress,reduced){const p=THREE.MathUtils.clamp(progress,0,1),k=1-Math.pow(1-p,3);root.visible=p>0;root.position.y=pos[1]-(1-k)*.65;root.scale.setScalar(.88+.12*k);o.g.position.y=1.07+(1-k)*1.35;indicator.emissiveIntensity=reduced?.5:.40+Math.sin(time*1.5)*.13}};
}
