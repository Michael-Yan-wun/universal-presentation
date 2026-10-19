// Each operator command reveals one company in its final, fixed photo position.
export function createPartnerStage(stage,{reducedMotion=false}={}){
  const slots=[...stage.querySelectorAll('[data-partner-index]')],root=stage.closest('#event-prelude');
  let current=-1,animations=[];
  function settle(){for(const animation of animations)animation.cancel();animations=[];}
  function show(index,{animate=true}={}){
    const previous=current;settle();current=index;
    root.dataset.partnerAll=String(index>=slots.length-1);
    for(const [i,slot] of slots.entries()){
      const visible=i<=index;
      slot.classList.toggle('is-present',visible);
      slot.classList.remove('is-current');
      slot.setAttribute('aria-hidden',String(!visible));slot.inert=!visible;
      if(visible&&i>previous&&animate&&!reducedMotion){
        animations.push(slot.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:700,easing:'cubic-bezier(.16,.8,.2,1)'}));
      }
    }
  }
  return {show,settle,resize:settle};
}
