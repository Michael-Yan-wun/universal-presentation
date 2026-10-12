// One shared clock keeps the walker, footsteps and milestone arrivals together.
// Motion is decorative: copy remains in the DOM and navigation never waits for it.
export function animateCompanyHistory(root){
  const panel=root.querySelector('.heritage-panel');
  const milestones=[...root.querySelectorAll('.heritage-milestone')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const narrow=matchMedia('(max-width: 800px)');
  if(!panel||reduced.matches||narrow.matches)return ()=>{};

  const svg=panel.querySelector('.heritage-walkway');
  const traveler=svg.querySelector('.heritage-traveler');
  const person=svg.querySelector('.heritage-person');
  const progress=svg.querySelector('.heritage-progress');
  const stars=svg.querySelector('.heritage-arrival-stars');
  const footprints=svg.querySelector('.heritage-footprints');
  const jacket=svg.querySelector('.heritage-jacket');
  const collar=svg.querySelector('.heritage-collar');
  const head=svg.querySelector('.heritage-head');
  const hair=svg.querySelector('.heritage-hair');
  const eye=svg.querySelector('.heritage-eye');
  const smile=svg.querySelector('.heritage-smile');
  const ground=svg.querySelector('.heritage-ground-light');
  const joy=[...svg.querySelectorAll('.heritage-joy-ray')];
  const years=milestones.map(item=>Number(item.querySelector('time').dateTime));
  const firstYear=years[0];
  const clamp=value=>Math.max(0,Math.min(1,value));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=(a,b,value)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  const point=(x,y)=>({x,y});
  const blend=(a,b,t)=>point(mix(a.x,b.x,t),mix(a.y,b.y,t));
  const coords=p=>`${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const line=points=>'M'+points.map(coords).join('L');
  const parts=Object.fromEntries(['back-arm','front-arm','back-leg','front-leg','back-shoe','front-shoe'].map(name=>[name,svg.querySelector('.heritage-'+name)]));
  let frame=0,lastTime=null,elapsed=0,cancelled=false,finished=false,points=[],prints=[],arrived=-1;
  // The early years take time to find their feet. Later strides become quicker.
  const lead=800,hold=350;
  const journeys=years.slice(0,-1).map(year=>mix(2300,1300,clamp((year-2016)/8)));
  const arrivals=[lead];
  for(const duration of journeys)arrivals.push(arrivals.at(-1)+hold+duration);
  const finishAt=arrivals.at(-1)+(years.at(-1)===2025?1600:700);
  const ns='http://www.w3.org/2000/svg';
  panel.dataset.walk='running';

  function measure(){
    const rect=panel.getBoundingClientRect();
    points=milestones.map(item=>{
      const node=item.querySelector('.heritage-node').getBoundingClientRect();
      return {x:node.left+node.width/2-rect.left,y:node.top+node.height/2-rect.top};
    });
    // Space the two alternating rows of footprints like real steps, not a dotted rule.
    prints=[];footprints.replaceChildren();
    for(let x=points[0].x+14,i=0;x<points.at(-1).x-5;x+=22,i++){
      const mark=document.createElementNS(ns,'ellipse');
      mark.setAttribute('cx',x);mark.setAttribute('cy',points[0].y+(i%2?5:2));
      const growth=clamp((firstYear-2016+(x-points[0].x)/(points.at(-1).x-points[0].x)*4)/9);
      mark.setAttribute('rx',mix(1,3.1,growth));mark.setAttribute('ry',mix(.8,1.1,growth));
      mark.setAttribute('transform',`rotate(-12 ${x} ${points[0].y})`);
      mark.style.opacity=0;footprints.append(mark);prints.push({x,mark});
    }
    paint(elapsed);
  }

  function pose(cycle,amount,year,celebrate){
    const grown=clamp((year-2018.4)/6.6),happy=smooth(2020,2025,year);
    const stand=smooth(2017.6,2018.4,year);
    // Hold the baby proportions through the first two years. Growing the entire
    // figure, as well as its skeleton, makes the adult visibly larger at a glance.
    const size=.56+.44*Math.pow(clamp((year-2016)/9),1.15);
    const height=38+24*Math.pow(grown,1.1),radius=mix(7.2,5.7,grown);
    const s=Math.sin(cycle)*amount,other=-s;
    const hop=Math.abs(Math.sin(cycle))*(.65+happy*3.2)*amount+Math.sin(Math.PI*celebrate)*3;
    person.setAttribute('transform',`translate(24 ${(65-hop).toFixed(2)}) scale(${size.toFixed(4)}) translate(-24 -65)`);
    ground.setAttribute('rx',((mix(12,21,stand)-hop*.8)*size).toFixed(2));
    ground.style.opacity=(.22-hop*.014).toFixed(2);

    // Interpolate the skeleton itself: horizontal crawling becomes upright walking.
    // All joints share one grounded coordinate system, so growth never slides upward.
    const hip=blend(point(13,47),point(23,65-height*(.34+grown*.09)),stand);
    const shoulder=blend(point(32,45),point(26,65-height+radius*2+2+grown*3),stand);
    const center=blend(point(42,36),point(28,65-height+radius),stand);
    const r=mix(8,radius,stand);
    head.setAttribute('cx',center.x);head.setAttribute('cy',center.y);head.setAttribute('r',r);
    eye.setAttribute('cx',center.x+r*.48);eye.setAttribute('cy',center.y-r*.1);
    eye.setAttribute('r',mix(.8,.7,grown));
    smile.setAttribute('d',`M${center.x+r*.24} ${center.y+r*.38}q${r*.3} ${r*(.16+happy*.12)} ${r*.48} ${-r*.14}`);
    hair.setAttribute('d',`M${center.x-r*.3} ${center.y-r*.88}q${-r*.18} ${-r*.48} ${r*.2} ${-r*.36}`);
    hair.style.opacity=(1-grown*.9).toFixed(2);
    collar.setAttribute('d',line([shoulder,blend(shoulder,center,.54)]));
    const dx=shoulder.x-hip.x,dy=shoulder.y-hip.y,length=Math.hypot(dx,dy);
    const normal=point(-dy/length,dx/length);
    const edge=(p,width)=>point(p.x+normal.x*width,p.y+normal.y*width);
    jacket.setAttribute('d',`M${coords(edge(hip,5))}Q${coords(edge(blend(hip,shoulder,.5),6))} ${coords(edge(shoulder,4))}Q${coords(blend(shoulder,center,.18))} ${coords(edge(shoulder,-4))}L${coords(edge(hip,-5))}Q${coords(point(hip.x,hip.y+3))} ${coords(edge(hip,5))}Z`);

    function leg(name,swing){
      const lift=Math.max(0,-swing)*(4+grown*4);
      const crawlKnee=point(14+swing*4,59-Math.max(0,-swing)*2);
      const crawlFoot=point(3+swing*4,63-Math.max(0,-swing)*3);
      const walkKnee=point(24+swing*(3+grown*3),mix(hip.y,63,.57)-lift*.4);
      const walkFoot=point(24+swing*(7+grown*8)+(name==='back'?-2:0),63-lift);
      const knee=blend(crawlKnee,walkKnee,stand),foot=blend(crawlFoot,walkFoot,stand);
      parts[name+'-leg'].setAttribute('d',line([hip,knee,foot]));
      parts[name+'-shoe'].setAttribute('d',`M${foot.x-1} ${foot.y+1}h${mix(3,5,grown)}`);
    }
    function arm(name,swing){
      const balance=1-smooth(0,.28,grown);
      const crawlElbow=point(34+swing*3,55-Math.max(0,-swing)*2);
      const crawlHand=point(38+swing*6,63-Math.max(0,-swing)*6);
      let elbow=point(shoulder.x+balance*7-swing*(5+grown*5),shoulder.y+height*.14);
      let hand=point(shoulder.x+balance*12+3-swing*(6+grown*8),shoulder.y+height*.24-Math.abs(swing)*(2+happy*3));
      // A cheerful raised arm and little wave at the last year, after the final skip.
      const cheer=smooth(0,.35,celebrate);
      if(name==='front'){
        elbow=blend(elbow,point(37,shoulder.y-5),cheer);
        hand=blend(hand,point(40+Math.sin(celebrate*Math.PI*5)*3*(1-celebrate),shoulder.y-16),cheer);
      }else{
        elbow=blend(elbow,point(17,shoulder.y+8),cheer);
        hand=blend(hand,point(23,hip.y-2),cheer);
      }
      parts[name+'-arm'].setAttribute('d',line([shoulder,blend(crawlElbow,elbow,stand),blend(crawlHand,hand,stand)]));
    }
    leg('back',other);leg('front',s);arm('back',other);arm('front',s);
    const stage=year<2017.6?'crawl':year<2018.4?'standing-up':year<2021.5?'child':year<2023.5?'teen':celebrate>0?'celebrate':'adult';
    if(panel.dataset.lifeStage!==stage)panel.dataset.lifeStage=stage;
    // A small fan of warm sparks opens behind the grown-up, then settles completely.
    joy.forEach((ray,i)=>{
      const angle=(-150+i*25)*Math.PI/180,spread=15+celebrate*20;
      const x=25+Math.cos(angle)*spread,y=28+Math.sin(angle)*spread;
      ray.setAttribute('d',`M${x} ${y}l${Math.cos(angle)*3} ${Math.sin(angle)*3}`);
      ray.style.opacity=celebrate>0?Math.sin(celebrate*Math.PI)*(i%2?.55:.9):0;
    });
  }

  function arrive(index){
    for(let i=arrived+1;i<=index;i++)milestones[i].classList.add('is-reached');
    if(index!==arrived){
      milestones.forEach((item,i)=>item.classList.toggle('is-current',i===index));
      arrived=index;
      panel.dataset.walkYear=milestones[index].querySelector('time').dateTime;
    }
  }

  function paint(time){
    if(!points.length)return;
    let segment=0;
    while(segment<points.length-1&&time>=arrivals[segment+1])segment++;
    const local=Math.max(0,time-arrivals[segment]);
    const fraction=segment===points.length-1?0:clamp((local-hold)/journeys[segment]);
    const a=points[segment],b=points[Math.min(segment+1,points.length-1)];
    const x=mix(a.x,b.x,fraction),year=mix(years[segment],years[Math.min(segment+1,years.length-1)],fraction);
    const moving=fraction>0&&fraction<1;
    const edge=Math.min(fraction*9,(1-fraction)*9,1);
    const celebrate=year===2025?clamp(local/1400):0;
    pose((x-points[0].x)/12,moving?Math.max(0,edge):0,year,celebrate);
    traveler.setAttribute('transform',`translate(${(x-24).toFixed(2)} ${(a.y-65).toFixed(2)})`);
    traveler.style.opacity=Math.min(1,time/350);
    progress.setAttribute('d',`M${points[0].x} ${a.y}H${x.toFixed(2)}`);
    const pulse=1-Math.min(1,local/450);
    stars.style.opacity=time<lead?0:pulse*.8;
    for(const {x:printX,mark} of prints){
      const distance=x-printX;
      mark.style.opacity=distance>4?Math.max(.08,.5-distance/300):0;
    }
    if(time>=lead)arrive(segment);
  }

  function tick(now){
    if(cancelled||finished)return;
    if(lastTime!==null)elapsed+=Math.min(now-lastTime,64);
    lastTime=now;paint(elapsed);
    if(elapsed>=finishAt){
      finished=true;panel.dataset.walk='complete';stars.style.opacity=0;
      return;
    }
    frame=requestAnimationFrame(tick);
  }

  function visibility(){
    cancelAnimationFrame(frame);lastTime=null;
    if(!document.hidden&&!finished&&!cancelled)frame=requestAnimationFrame(tick);
  }
  function stopMotion(){
    if(!reduced.matches&&!narrow.matches)return;
    finished=true;cancelAnimationFrame(frame);
    panel.dataset.walk='static';
    milestones.forEach(item=>item.classList.add('is-reached'));
  }
  const observer=new ResizeObserver(measure);
  observer.observe(panel);
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',stopMotion);narrow.addEventListener('change',stopMotion);
  measure();if(!document.hidden)frame=requestAnimationFrame(tick);
  return ()=>{
    cancelled=true;cancelAnimationFrame(frame);observer.disconnect();
    document.removeEventListener('visibilitychange',visibility);
    reduced.removeEventListener('change',stopMotion);narrow.removeEventListener('change',stopMotion);
  };
}
