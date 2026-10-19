// Scale the overview within the existing slide shell; reveal once, then hold still.
export function animateCompanyHistory(root){
  const overview=root.querySelector('.heritage-overview');
  if(!overview)return ()=>{};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const elements=[...overview.querySelectorAll('[data-heritage-reveal]')];
  // Header, first stage + achievements, bridge, second stage + achievements, summary.
  const delays=[0,300,600,800,1000,1300,1600,1900,2100,2300,2900];
  let animations=[];
  const resize=()=>{
    const scale=Math.min(root.clientWidth/1708,root.clientHeight/800);
    overview.style.setProperty('--heritage-scale',String(scale));
  };
  const settle=()=>{
    animations.forEach(animation=>animation.cancel());
    animations=[];
  };
  const respectMotion=()=>{if(reduced.matches)settle();};
  const observer=new ResizeObserver(resize);
  observer.observe(root);resize();
  if(!reduced.matches){
    animations=elements.map((element,index)=>element.animate(
      [{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:600,delay:delays[index],easing:'cubic-bezier(.2,.65,.3,1)',fill:'backwards'}
    ));
    // Remove finished animation objects; the underlying content is already visible.
    Promise.all(animations.map(animation=>animation.finished)).then(settle).catch(()=>{});
  }
  reduced.addEventListener('change',respectMotion);
  return ()=>{settle();observer.disconnect();reduced.removeEventListener('change',respectMotion);};
}
