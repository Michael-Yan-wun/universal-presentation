import { brandTypography } from './text-color-preview.js?v=brand-text-5';
import { productColors } from './product-colors.js?v=product-colors-1';
import * as THREE from './vendor/three.module.js';

// Company facts and lockup supplied by AIWin for the anniversary introduction.
export const companyProducts = [
  { id:'aiwinops', name:'AIWinOps', label:'AI 影像辨識', color:productColors.aiwinops.main, ink:productColors.aiwinops.text, size:[1506,1045], crop:[140,65,1363,1000], description:'從影像中辨識關鍵資訊，讓 AI 理解看見的世界。' },
  { id:'numops', name:'NumOps', label:'智慧數據 AI', color:productColors.numops.main, ink:productColors.numops.text, size:[1539,1022], crop:[160,44,1380,1003], description:'探索資料中的規律，讓數據成為企業決策的依據。' },
  { id:'winchat', name:'WinChat', label:'企業知識中樞', color:productColors.winchat.main, ink:productColors.winchat.text, size:[1672,941], crop:[267,47,1405,931], description:'串聯企業知識，透過對話取得資訊、理解問題。' },
  { id:'winedge-n', name:'WinEdge-N', label:'數據邊緣 AI', color:productColors.winedge.main, ink:productColors.winedge.text, size:[446,297], crop:[0,0,446,297], image:'winedge-n-interface.png', description:'在現場接收與分析設備數據，連接監控、AI 推論與回饋。' },
  { id:'winedge-v', name:'WinEdge-V', label:'影像邊緣 AI', color:productColors.winedge.main, ink:productColors.winedge.text, size:[587,358], crop:[0,0,587,358], image:'winedge-v-interface.png', description:'在現場管理影像任務，串接取像、AI 推論與檢測應用。' },
];
const capabilities = companyProducts;
const asset = (id,kind='cutout-v1') => `./assets/company-products/${companyProducts.find(item=>item.id===id)?.image||`${id}-${kind}.png`}`;

export const companyLayouts = [
  { id: 'stage', name: '品牌展台', tagline: 'ONE PLATFORM. FIVE POSSIBILITIES.' },
  { id: 'orbit', name: '懸浮星軌', tagline: 'CONNECTED BY INTELLIGENCE.' },
  { id: 'steps', name: '進化階梯', tagline: 'BUILDING THE NEXT POSSIBILITY.' },
];

export function companyHTML() {
  return `<p class="eyebrow"><span class="eyebrow-line"></span>ABOUT AIWIN / BUILT FROM EXPERIENCE</p>
    <h1>慧穩科技<span>AIWin<em>.</em></span></h1>
    <div class="story-copy"><h2>企業 AI 導入專家</h2>
      <p>深耕智慧製造、半導體與企業 AI 應用，<br>協助企業加速數位轉型，創造營運價值。</p></div>
    <dl class="company-metrics" aria-label="公司實績">
      <div><dt>AI 落地案例</dt><dd>200<span>+</span></dd></div>
      <div><dt>產業服務經驗</dt><dd>30<span>+</span></dd></div>
      <div><dt>項國家專利</dt><dd>6</dd></div>
    </dl>
    <div class="company-markets"><span>跨足海外市場</span><strong>越南<i>·</i>韓國<i>·</i>泰國<i>·</i>日本</strong></div>`;
}

// One entrance timeline, replayed on chapter entry and cancelled on chapter exit.
// The product motion in createCompanyScene follows the same staggered timing.
export function animateCompanyIntro(root) {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
  const animations=[];
  const reveal=(selector,delay,duration=850,rise=14)=>{
    root.querySelectorAll(selector).forEach((el,i)=>animations.push(el.animate([
      {opacity:0,transform:`translateY(${rise}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration,delay:delay+i*130,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})));
  };
  reveal('.company-story .eyebrow',60,700,8);
  reveal('.company-story h1',170,1000,20);
  reveal('.company-story .story-copy',420,900,16);
  reveal('.company-metrics',700,900,0);
  reveal('.company-metrics>div',810,1000,15);
  reveal('.company-markets',1250,850,10);
  reveal('.company-lighting',80,1700,0);
  reveal('.company-identity img',230,1550,24);
  reveal('#scene canvas',430,1000,0);
  reveal('.company-platform-lockup',2320,1000,14);
  reveal('.company-explore-hint',2750,750,5);
  return ()=>animations.forEach(animation=>animation.cancel());
}

export function companyPreviewHTML(layout) {
  return `<div class="company-design-tools" aria-label="公司介紹版型預覽"><span>公司介紹 · 版型比較</span><div>${companyLayouts.map((item,i)=>`<button data-company-layout="${item.id}" aria-pressed="${item.id===layout}"><small>0${i+1}</small>${item.name}</button>`).join('')}</div></div>`;
}

export function companyStageHTML() {
  return `<div class="company-lighting" aria-hidden="true"><i></i><i></i></div>
    <div class="company-identity">
      <img src="./assets/aiwin-company-logo.png" alt="AIWin — Be your IPartner!" width="1024" height="1024">
    </div>
    <div class="company-platform">
      <button class="company-platform-lockup" data-company-product="winhub" aria-label="查看 WinHub.AI 平台全貌">
        <span class="company-platform-logo" role="img" aria-label="WinHub.AI">
          <img class="company-platform-symbol" src="${asset('winhub')}" alt="" aria-hidden="true" width="1491" height="1055">
          <img class="company-platform-wordmark" src="${asset('winhub')}" alt="" aria-hidden="true" width="1491" height="1055">
        </span>
        <span class="company-platform-description"><strong>融合式 AI 平台</strong><small>五項產品 · 一個完整平台 <b>↗</b></small></span>
      </button>
      <small class="company-explore-hint">點選產品，探索更多</small>
    </div>`;
}

export function companyProductHTML(id) {
  const p=companyProducts.find(item=>item.id===id),overview=id==='winhub';
  if(!p&&!overview)return '';
  return `<div class="company-product-detail" style="--product-color:${p?.color||brandTypography.platform};--product-ink:${p?.ink||brandTypography.platform}">
    <div class="company-product-heading"><p class="eyebrow">${overview?'WINHUB.AI / PRODUCT PLATFORM':'WINHUB.AI / '+p.name.toUpperCase()}</p>
      <h2 id="case-heading">${overview?'WinHub.AI':p.name}<span>${overview?'融合式 AI 平台':p.label}</span></h2>
      <p>${overview?'視覺辨識、數據分析、知識中樞與邊緣運算，串起企業 AI 的完整應用。':p.description}</p></div>
    <div class="company-product-visual ${overview?'is-overview':''}">${overview?`<div class="company-product-overview" aria-label="WinHub.AI 五項產品">${companyProducts.map(item=>`<article style="--product-color:${item.color};--product-ink:${item.ink}"><img src="${asset(item.id)}" alt="${item.name} 產品介面"><strong>${item.name}</strong><span>${item.label}</span></article>`).join('')}</div>`:`<img src="${asset(id)}" alt="${p.name} 產品展示">`}</div>
    <nav class="company-product-tabs" aria-label="產品圖片">${[{id:'winhub',name:'平台全貌'},...companyProducts].map(item=>`<button data-company-product="${item.id}" aria-pressed="${item.id===id}">${item.name}</button>`).join('')}</nav>
    <a class="company-original-link" href="${asset(id,'original')}" target="_blank" rel="noopener">查看原始素材 ↗</a>
  </div>`;
}

export function createCompanyScene({ group, brick, addLabel, hits }) {
  const variants = new Map();
  const resources = new Set();
  const keep = object => { resources.add(object); return object; };
  let hovered=null,focused=null;
  const clamp01=value=>Math.max(0,Math.min(1,value));
  const easeOut=value=>1-Math.pow(1-clamp01(value),3);
  const smooth=value=>{const p=clamp01(value);return p*p*(3-2*p);};
  const metal = keep(new THREE.MeshPhysicalMaterial({ color: '#25354a', roughness: .34, metalness: .28, clearcoat: .6 }));
  const satin = keep(new THREE.MeshPhysicalMaterial({ color: '#24354b', roughness: .42, metalness: .5 }));
  const gold = keep(new THREE.MeshBasicMaterial({ color: '#ddac66', transparent: true, opacity: .7 }));
  const blue = keep(new THREE.MeshBasicMaterial({ color: '#9bccf7', transparent: true, opacity: .55 }));

  const mesh = (parent, geometry, material, pos) => {
    const m = new THREE.Mesh(keep(geometry), material); parent.add(m); m.position.set(...pos);
    m.receiveShadow=true; m.castShadow=true; return m;
  };
  function ring(parent, radius, y, material, thickness = .018) {
    const r = mesh(parent,new THREE.TorusGeometry(radius,thickness,8,120),material,[0,y,0]);
    r.rotation.x=-Math.PI/2; return r;
  }
  function line(parent, points, color, opacity=.5) {
    const material = keep(new THREE.LineBasicMaterial({color,transparent:true,opacity}));
    const l = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(points)),material);
    parent.add(l); return l;
  }
  function label(parent, text, sub, pos, width=4, color=brandTypography.primary) {
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=200;
    const ctx=canvas.getContext('2d');ctx.textAlign='center';ctx.fillStyle=color;
    ctx.font='500 72px Arial';ctx.fillText(text,512,90);ctx.fillStyle=brandTypography.secondary;ctx.font='24px Arial';ctx.fillText(sub,512,145);
    const map=keep(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;
    const mat=keep(new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,toneMapped:false}));
    return mesh(parent,new THREE.PlaneGeometry(width,width*200/1024),mat,pos);
  }
  function newVariant(id, poses) {
    const stage=new THREE.Group();group.add(stage);
    const blocks=id==='stage'?[]:capabilities.map((c,i)=>{
      const b=brick(stage,{name:c.name,sub:c.label,color:c.color,cols:3,rows:2,h:1.08,pos:poses[i].pos});
      b.companyManaged=true;b.g.rotation.y=poses[i].angle||0;return b;
    });
    const variant={stage,blocks,poses,pulses:[]};variants.set(id,variant);return variant;
  }

  // Selected design: a machined oval deck, beveled plinths and recessed edge lighting.
  const stage=newVariant('stage',[
    {pos:[-6.4,.12,.62],angle:.055}, {pos:[-3.2,.36,-.08],angle:.025},
    {pos:[0,.46,-.32],angle:0}, {pos:[3.2,.36,-.08],angle:-.025},
    {pos:[6.4,.12,.62],angle:-.055},
  ]);
  const deckFinish=keep(new THREE.MeshPhysicalMaterial({color:'#24344b',metalness:.36,roughness:.38,clearcoat:.4}));
  const wallFinish=keep(new THREE.MeshPhysicalMaterial({color:'#304154',metalness:.56,roughness:.3,clearcoat:.35}));
  const footFinish=keep(new THREE.MeshPhysicalMaterial({color:'#101927',metalness:.32,roughness:.46}));
  const champagne=keep(new THREE.MeshPhysicalMaterial({color:'#c0a06e',metalness:.66,roughness:.3}));
  const warmStrip=keep(new THREE.MeshBasicMaterial({color:'#ffe0a4',toneMapped:false}));
  const coolStrip=keep(new THREE.MeshBasicMaterial({color:'#b7d7ed',toneMapped:false}));
  const diffuseWarm=keep(new THREE.MeshBasicMaterial({color:'#ffc985',transparent:true,opacity:.12,depthWrite:false,toneMapped:false}));

  function ovalShell(profile, squash, material) {
    const shape=profile.map(([r,y])=>new THREE.Vector2(r,y));
    const shell=mesh(stage.stage,new THREE.LatheGeometry(shape,144),material,[0,0,0]);shell.scale.z=squash;return shell;
  }
  function roundedPlinth(w,d,h,r=.22) {
    const shape=new THREE.Shape();
    shape.moveTo(-w/2+r,-d/2);shape.lineTo(w/2-r,-d/2);shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);
    shape.lineTo(w/2,d/2-r);shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);shape.lineTo(-w/2+r,d/2);
    shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);shape.lineTo(-w/2,-d/2+r);shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:h-.06,bevelEnabled:true,bevelSize:.035,bevelThickness:.03,bevelSegments:3,steps:1,curveSegments:8});
    geo.translate(0,0,-(h-.06)/2);geo.rotateX(-Math.PI/2);return geo;
  }
  function frontArc(rx,rz,y,material,radius=.022,start=.04,end=Math.PI-.04) {
    const points=Array.from({length:81},(_,i)=>{const a=start+(end-start)*i/80;return new THREE.Vector3(rx*Math.cos(a),y,rz*Math.sin(a));});
    return mesh(stage.stage,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),120,radius,8,false),material,[0,0,0]);
  }

  // The deck has a separate foot, reveal gap, curved fascia and chamfered top.
  ovalShell([[0,-2.36],[7.98,-2.36],[8.13,-2.27],[8.13,-2.15],[7.97,-2.10],[0,-2.10]],.50,footFinish);
  ovalShell([[0,-2.07],[8.17,-2.07],[8.43,-1.97],[8.43,-1.56],[8.34,-1.48],[0,-1.48]],.50,wallFinish);
  ovalShell([[0,-1.49],[8.35,-1.49],[8.50,-1.40],[8.45,-1.29],[8.28,-1.24],[0,-1.24]],.50,deckFinish);
  frontArc(8.43,4.215,-1.98,warmStrip,.025);
  frontArc(8.44,4.22,-1.99,diffuseWarm,.105);
  frontArc(8.31,4.155,-1.25,champagne,.016);
  frontArc(8.07,4.035,-2.20,coolStrip,.012,.13,1.13);
  frontArc(8.07,4.035,-2.20,coolStrip,.012,Math.PI-1.13,Math.PI-.13);
  const sweepMaterial=keep(new THREE.MeshBasicMaterial({color:'#fff4db',transparent:true,opacity:0,depthWrite:false,toneMapped:false}));
  const sweep=frontArc(8.46,4.23,-1.965,sweepMaterial,.036);
  sweep.castShadow=sweep.receiveShadow=false;

  // A soft contact shadow grounds the lower deck without adding another visible ring.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;
  const shadowCtx=shadowCanvas.getContext('2d'),shadowGradient=shadowCtx.createRadialGradient(128,128,35,128,128,128);
  shadowGradient.addColorStop(0,'rgba(0,0,0,.65)');shadowGradient.addColorStop(.58,'rgba(0,0,0,.34)');shadowGradient.addColorStop(1,'rgba(0,0,0,0)');
  shadowCtx.fillStyle=shadowGradient;shadowCtx.fillRect(0,0,256,256);
  const shadowMap=keep(new THREE.CanvasTexture(shadowCanvas));
  const shadowMat=keep(new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));
  const shadow=mesh(stage.stage,new THREE.PlaneGeometry(21,12),shadowMat,[0,-2.4,0]);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;

  stage.poses.forEach((p,i)=>{
    const product=companyProducts[i];
    const plinth=new THREE.Group();stage.stage.add(plinth);plinth.position.set(p.pos[0],0,p.pos[2]);plinth.rotation.y=p.angle;
    const top=p.pos[1]-.58,h=top+1.24;
    mesh(plinth,roundedPlinth(2.84,2.85,h),satin,[0,-1.24+h/2,0]);
    mesh(plinth,roundedPlinth(2.89,2.90,.09),wallFinish,[0,top,0]);
    const trim=keep(new THREE.MeshBasicMaterial({color:capabilities[i].color,toneMapped:false}));
    const trimMesh=mesh(plinth,new THREE.BoxGeometry(1.95,.035,.018),trim,[0,top-.14,1.46]);
    // Alpha cutouts preserve a quiet, open stage; the texture crop removes transparent padding.
    const [iw,ih]=product.size,[left,upper,right,lower]=product.crop;
    const w=2.78,monitorHeight=w*(lower-upper)/(right-left);
    const texture=keep(new THREE.TextureLoader().load(asset(product.id)));
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.offset.set(left/iw,1-lower/ih);texture.repeat.set((right-left)/iw,(lower-upper)/ih);
    const material=keep(new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.55,side:THREE.DoubleSide,toneMapped:false}));
    const monitorGroup=new THREE.Group();stage.stage.add(monitorGroup);monitorGroup.position.set(...p.pos);
    // User-supplied interface captures sit in a physical screen bezel like the existing product displays.
    if(product.image){
      const frame=mesh(monitorGroup,new THREE.BoxGeometry(w+.12,monitorHeight+.12,.12),footFinish,[0,monitorHeight/2-.49,-.035]);
      frame.castShadow=true;
      mesh(monitorGroup,new THREE.BoxGeometry(.13,.2,.1),satin,[0,-.62,0]);
      mesh(monitorGroup,new THREE.BoxGeometry(.85,.05,.38),satin,[0,-.72,0]);
    }
    const monitor=mesh(monitorGroup,new THREE.PlaneGeometry(w,monitorHeight),material,[0,monitorHeight/2-.49,product.image?.035:0]);
    monitor.castShadow=monitor.receiveShadow=false;monitor.userData.id='company-'+product.id;hits.push(monitor);
    const button=addLabel(plinth,new THREE.Vector3(0,top-.27,1.6),product.name,'company-'+product.id,product.ink,'company-product-label','company');
    button.innerHTML=`<strong>${product.name}</strong><small>${product.label}</small>`;
    button.setAttribute('aria-label',`查看 ${product.name}：${product.label}`);
    button.addEventListener('pointerenter',()=>hovered=product.id);
    button.addEventListener('pointerleave',()=>{if(hovered===product.id)hovered=null;});
    button.addEventListener('focus',()=>focused=product.id);
    button.addEventListener('blur',()=>{if(focused===product.id)focused=null;});
    const traceCurve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(p.pos[0],-1.22,p.pos[2]+1.57),
      new THREE.Vector3(p.pos[0]*.86,-1.22,2.6),
      new THREE.Vector3(p.pos[0]*.31,-1.22,3.55)
    ]);
    const traceMaterial=keep(new THREE.MeshBasicMaterial({color:product.color,transparent:true,opacity:0,depthWrite:false,toneMapped:false}));
    const trace=mesh(stage.stage,new THREE.TubeGeometry(traceCurve,48,.025,6,false),traceMaterial,[0,0,0]);
    trace.castShadow=trace.receiveShadow=false;
    stage.blocks.push({g:monitorGroup,id:product.id,plinth,material,button,trimMesh,trim,trace,traceMaterial,hover:0});
    // Quiet etched traces lead each capability toward the shared platform.
    line(stage.stage,[new THREE.Vector3(p.pos[0],-1.235,p.pos[2]+1.57),new THREE.Vector3(p.pos[0]*.86,-1.235,2.6),new THREE.Vector3(p.pos[0]*.31,-1.235,3.55)],'#748495',.26);
  });

  // 02: independent capabilities float on orbital paths around one central hub.
  const orbit=newVariant('orbit',[
    {pos:[-5.4,1,-.7],angle:.2}, {pos:[0,2,-1.3],angle:0}, {pos:[5.4,1,-.7],angle:-.2},
    {pos:[-3.6,-1.22,1.3],angle:.12}, {pos:[3.6,-1.22,1.3],angle:-.12},
  ]);
  mesh(orbit.stage,new THREE.CylinderGeometry(1.8,2,.38,72),metal,[0,-.45,0]);
  ring(orbit.stage,1.82,-.24,gold,.025);
  label(orbit.stage,'WinHub.AI','CONNECTED INTELLIGENCE',[0,.3,1],3.45,brandTypography.platform);
  for(let j=0;j<2;j++){
    const points=Array.from({length:181},(_,i)=>{const a=i/180*Math.PI*2;return new THREE.Vector3(Math.cos(a)*(6.7-j*.65),Math.sin(a)*(.9+j*.4)-.15,Math.sin(a)*(2.3-j*.4));});
    line(orbit.stage,points,j?'#ae8b54':'#6893b4',j?.27:.4);
  }
  orbit.poses.forEach((p,i)=>{
    const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(...p.pos),new THREE.Vector3(p.pos[0]*.48,1.3,p.pos[2]+.3),new THREE.Vector3(0,-.1,.4));
    line(orbit.stage,curve.getPoints(36),'#b2c8d9',.35);
    const bead=mesh(orbit.stage,new THREE.SphereGeometry(.055,10,8),i%2?blue:gold,[0,0,0]);orbit.pulses.push({bead,curve,offset:i*.25});
  });

  // 03: five product plinths rise diagonally; each capability has its own space.
  const steps=newVariant('steps',[
    {pos:[-6.4,-1.45,1.2],angle:.03}, {pos:[-3.2,-.85,.6],angle:.03},
    {pos:[0,-.25,0],angle:.03}, {pos:[3.2,.35,-.6],angle:.03}, {pos:[6.4,.95,-1.2],angle:.03},
  ]);
  steps.poses.forEach((p,i)=>{
    const top=p.pos[1]-.65,h=top+2.65;
    mesh(steps.stage,new THREE.BoxGeometry(3.05,h,3.1),metal,[p.pos[0],-2.65+h/2,p.pos[2]]);
    mesh(steps.stage,new THREE.BoxGeometry(3.08,.035,3.13),i%2?blue:gold,[p.pos[0],top-.02,p.pos[2]]);
    label(steps.stage,`0${i+1}`,'',[p.pos[0],top-.33,p.pos[2]+1.58],.75);
  });
  line(steps.stage,steps.poses.map(p=>new THREE.Vector3(p.pos[0],p.pos[1]-1.0,p.pos[2]+1.65)),'#d8ad73',.55);

  const warm=new THREE.PointLight('#ffdab0',35,22,2);warm.position.set(-5,6,5);group.add(warm);
  const cool=new THREE.PointLight('#afd6ff',30,22,2);cool.position.set(6,5,1);group.add(cool);
  let current='stage',elapsed=0,lastAge=0;
  function setLayout(id) {
    current=variants.has(id)?id:'stage';elapsed=0;
    for(const [key,v] of variants)v.stage.visible=key===current;
    hovered=focused=null;
    stage.blocks.forEach(b=>b.hover=0);
    update(lastAge,matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function reset() {
    elapsed=0;lastAge=0;
    hovered=focused=null;
    for(const v of variants.values())v.blocks.forEach(b=>b.g.scale.setScalar(1));
  }
  function update(age, reduced) {
    const dt=Math.max(0,Math.min(age-lastAge,.05));elapsed+=dt;lastAge=age;
    const v=variants.get(current);
    if(current==='stage'){
      const deck=reduced?1:easeOut((elapsed-.32)/1.65);
      v.stage.position.y=-.7*(1-deck);
      v.stage.scale.setScalar(.96+.04*deck);
      warm.intensity=reduced?35:21+14*smooth((elapsed-.1)/1.8)+Math.sin(elapsed*.45)*1.2;
      cool.intensity=reduced?30:18+12*smooth((elapsed-.25)/1.8);
      warm.position.x=reduced?-5:-5+Math.sin(elapsed*.22)*.65;
      v.blocks.forEach((b,i)=>{
        const progress=reduced?1:clamp01((elapsed-.82-i*.22)/1.15),reveal=easeOut(progress);
        const plinth=reduced?1:easeOut((elapsed-.50-i*.13)/1.05);
        const active=hovered===b.id||focused===b.id;
        b.hover=reduced?Number(active):THREE.MathUtils.lerp(b.hover,Number(active),1-Math.exp(-dt*7));
        b.plinth.position.y=-.3*(1-plinth)+b.hover*.06;
        b.g.visible=progress>0;
        b.g.position.set(...v.poses[i].pos);
        b.g.position.y-=.62*(1-reveal);
        b.g.position.y+=b.hover*.16;
        b.g.scale.setScalar(.92+.08*reveal+.018*b.hover);
        b.g.rotation.y=v.poses[i].angle+(i-(companyProducts.length-1)/2)*.075*(1-reveal);
        b.material.opacity=smooth(progress/.6);
        b.material.alphaTest=Math.max(.0001,.55*b.material.opacity);
        b.trimMesh.scale.x=.08+.92*reveal;
        b.trim.color.set(companyProducts[i].color).multiplyScalar(.55+.45*reveal+.4*b.hover);
        const labelOpacity=reduced?1:smooth((progress-.30)/.55);
        b.button.style.opacity=String(labelOpacity);
        b.button.disabled=labelOpacity<.75;
        b.button.classList.toggle('is-highlighted',active);
        const flow=reduced?1:clamp01((elapsed-1.68-i*.22)/1.15);
        b.trace.geometry.setDrawRange(0,Math.floor(flow*48)*36);
        b.traceMaterial.opacity=reduced?.12:.12*smooth(flow*3)+Math.sin(flow*Math.PI)*.55+b.hover*.32;
      });
      // A single arrival highlight; later passes are slower and much softer.
      const first=elapsed<4.4,travel=first?(elapsed-1.05)/2.75:((elapsed-4.4)%12-7)/4.5;
      const head=Math.floor(clamp01(travel)*132),start=Math.max(0,head-12),end=Math.min(120,head);
      sweep.visible=!reduced&&travel>0&&travel<1;
      sweep.geometry.setDrawRange(start*48,Math.max(0,end-start)*48);
      sweepMaterial.opacity=(first?.8:.28)*Math.sin(clamp01(travel)*Math.PI);
      return;
    }
    v.blocks.forEach((b,i)=>{
      const p = reduced ? 1 : Math.max(0,Math.min(1,(elapsed-i*.13)/1.35));
      const eased = 1-Math.pow(1-p,4);
      b.g.position.set(...v.poses[i].pos);
      b.g.position.y+=2.8*(1-eased)+(current==='orbit'&&!reduced?Math.sin(elapsed*.8+i)*.09:0);
      b.g.rotation.y=(v.poses[i].angle||0)+(1-eased)*.12;
    });
    v.pulses.forEach(({bead,curve,offset})=>bead.position.copy(curve.getPoint(reduced?.5:(elapsed*.14+offset)%1)));
  }
  setLayout(current);
  return {reset,update,setLayout,setHovered(id){hovered=id?.startsWith('company-')?id.slice(8):null;},entrance(){return 1-easeOut(elapsed/3.2);},dispose(){resources.forEach(r=>r.dispose());}};
}
