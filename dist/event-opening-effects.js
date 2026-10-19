// Quiet interstellar atmosphere; the numeral itself is revealed as polished metal.
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=(a,b,t)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
export function createEventOpeningEffects(){
  let dust=[],width=1,height=1;
  function prepare(svg,w,h){
    width=w;height=h;
    let seed=202610;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    dust=Array.from({length:170},()=>({u:random(),offset:random()+random()+random()-1.5,depth:random(),phase:random()*Math.PI*2,speed:.008+random()*.012}));
  }
  function draw(ctx,time){
    if(time<0)return;
    const reveal=smooth(.1,2.4,time);
    ctx.save();ctx.globalCompositeOperation='screen';
    // Carry the previous logo's cool reflection into the anniversary's metal light.
    const handoff=smooth(.05,.7,time)*(1-smooth(1.6,3.8,time));
    if(handoff>.001){
      const travel=smooth(.1,2.7,time),x=width*(.5+.24*travel),y=height*(.45+.02*travel),radius=width*.14;
      const light=ctx.createRadialGradient(x,y,0,x,y,radius);
      light.addColorStop(0,'rgba(205,228,255,.13)');light.addColorStop(.3,'rgba(141,190,237,.065)');light.addColorStop(1,'rgba(70,107,160,0)');
      ctx.globalAlpha=handoff;ctx.fillStyle=light;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
    }
    ctx.save();ctx.translate(width*.77,height*.43);ctx.rotate(-.48);ctx.scale(1,.19);
    const haze=ctx.createRadialGradient(0,0,0,0,0,width*.45);
    haze.addColorStop(0,'rgba(141,181,239,.075)');haze.addColorStop(.4,'rgba(83,129,197,.04)');haze.addColorStop(1,'rgba(54,83,145,0)');
    ctx.globalAlpha=reveal;ctx.fillStyle=haze;ctx.fillRect(-width*.5,-width*.5,width,width);ctx.restore();
    for(const point of dust){
      const u=(point.u+time*point.speed)%1,edge=Math.pow(Math.sin(u*Math.PI),1.4);
      const x=width*(.43+u*.63),y=height*(.82-u*.76+point.offset*.11*(.3+point.depth));
      const shimmer=.75+.25*Math.sin(time*(.3+point.depth*.3)+point.phase);
      ctx.globalAlpha=reveal*edge*(.09+point.depth*.3)*shimmer;ctx.fillStyle=point.depth>.88?'#e9f3ff':'#a9c6ec';
      ctx.beginPath();ctx.arc(x,y,.3+point.depth*.55,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  return {prepare,draw};
}
