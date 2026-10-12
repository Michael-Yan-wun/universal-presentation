// Desktop keynote framing: keep generous separation inside a larger visual stage.
export const cameraStage={eyeY:4.55,spread:4.65,modelScale:1.38,outputY:-3.05};
export const journeyStage={spread:4.8,overviewY:.8,overviewScale:1.10,focusY:1.75,focusScale:1.72,bornY:1.20,bornScale:1.36};

export function stageView(kind,aspect,{phase='overview',exploded=false,inspect=false,companyLayout='stage'}={}){
 const views={
  company:companyLayout==='steps'?{x:2,y:5.7,z:20.7,targetY:-.6}:companyLayout==='orbit'?{x:.4,y:3.6,z:20.4,targetY:0}:{x:.6,y:5.6,z:18.5,targetY:.1},
  growth:{x:1.25,y:2.55,z:20.8,targetY:.45},
  product:{x:2.25,y:3.65,z:21.2,targetY:.70},
  body:{x:1.6,y:3.7,z:21.8,targetY:.8},
  castle:{x:3,y:5.4,z:exploded?23.5:22.5,targetY:.8},
  case:{x:2.0,y:4.8,z:22.5,targetY:1.4},
  reveal:{x:2.7,y:5.2,z:19.2,targetY:.4},
  intro:{x:7,y:5.7,z:22,targetY:0}
 };
 const view={...(views[kind]||views.product)};
 // Topic overviews need width; a focused object can be more prominent above its evidence.
 if(kind==='product'&&phase==='focus')view.z=20.5;
 view.z*=Math.max(1,(kind==='intro'?1.22:1.36)/aspect);
 if(inspect)view.z*=.76;
 return view;
}
