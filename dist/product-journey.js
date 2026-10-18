import {winChatBeatCounts,winChatFinalBeats,winChatTravelSeconds} from './winchat-script.js?v=winchat-skills-3';
import * as THREE from './vendor/three.module.js';
import {journeyStage as layout} from './stage-layout.js?v=company-stage-2';
import {products} from './content.js?v=company-history-15';
import {createFieldKit} from './field-kit.js?v=learning-life-1';
export const productStories={
 analytics:{title:'經驗多了，<br>開始找出規律。',bridge:'像在學校學會推理，把訊號與經驗整理成方法。',topics:[
  {tag:'CONTEXT',title:'先把資料放對位置',question:'相同的數字，未必是相同的問題。',copy:'先理解設備、製程和量測的情境，將資料放回對應的專案與工作問題。',points:['區分場域與資料來源。','觀察時間序列與變化。','確認要回答的製程問題。'],image:'pitch-oven-temperature.png',source:'AIWin Pitch v5 · P.34 製程數據'},
  {tag:'PATTERNS',title:'把經驗變成規律',question:'老師傅知道的事，如何留下來？',copy:'透過資料分析與專家規則，把經驗整理成可被使用的數據能力。',points:['分析趨勢與影響因素。','建立專家規則與模型。','以既有經驗解釋新的狀態。'],image:'pitch-oven-temperature.png',source:'AIWin Pitch v5 · P.34 專家系統案例'},
  {tag:'VALIDATE',title:'讓規律接受現場驗證',question:'學會一個方法，還要能用得上。',copy:'將分析與模型交給 WinEdge-N，在設備旁運作，再根據現場回饋修正。',points:['確認模型與規則適用的情境。','部署到現場數據推論平台。','用運轉結果持續驗證與改善。'],image:'winedge-n.png',source:'WinEdge-N 官方邊緣推論介面'}]},
 chat:{title:'不只累積知識，<br>開始知道怎麼做。',bridge:'像逐漸成熟的大腦，連起記憶、思考與行動。',topics:[
  {tag:'RAG',title:'找回企業的記憶',question:'答案散在文件裡，如何用得到？',copy:'把企業文件整理成可檢索的知識，回答問題時帶回相關來源與脈絡。',points:['解析 PDF、Word、Excel 等文件。','檢索相關企業知識。','保留來源引用與助理權限。'],image:'pitch-winchat.png',source:'AIWin Pitch v5 · P.19、38 知識庫與 RAG'},
  {tag:'SKILL',title:'使用方法與工具',question:'專業做法如何成為可使用的能力？',copy:'讓 Agent 依工作需要使用 SKILL 的方法與工具能力。',points:['定義工作步驟與輸出要求。','依任務調用資料與分析工具。','由 Agent 整理與檢視結果。'],source:'本次產品敘事依使用者提供'},
  {tag:'WORK',title:'組合成工作成果',question:'知識與工作能力如何一起發揮？',copy:'Agent 結合 RAG 與 SKILL，形成客服維修、新人培訓與現場巡檢等應用。',points:['理解工作目標。','使用知識、方法與工具。','輸出有依據的結果。'],source:'應用流程為演講示意'}
]}
};
export function createProductJourney({group,brick,addLabel,onStage}){
 const roots={},V=(...a)=>new THREE.Vector3(...a),ease=t=>1-Math.pow(1-t,3),clamp=t=>Math.max(0,Math.min(1,t));let id='analytics',phase='overview',selected=-1,beat=0,clock=0,from=[],visited=new Set();
 for(const p of products.filter(p=>productStories[p.id])){const root=new THREE.Group();group.add(root);const pieces=productStories[p.id].topics.map((t,i)=>{const o=brick(root,{id:'journey-'+i,name:t.tag,color:p.id==='chat'?['#755695','#8366a6','#67508e'][i]:p.color,cols:3,rows:2,h:1.15,pos:[(i-1)*layout.spread,p.id==='chat'?-2.3:layout.overviewY,0],scale:layout.overviewScale,detail:p.id==='chat'?'hero':'standard'});o.journeyManaged=true;const label=addLabel(o.g,V(0,-1.58,1),t.title,'journey-'+i,p.uiColor,'journey-label','product');return {o,label}});const born=brick(root,{id:p.id,name:p.name,sub:p.role,color:p.id==='chat'?'#80619e':p.color,cols:5,rows:3,h:1.45,detail:p.id==='chat'?'hero':'standard',pos:[0,layout.bornY,0]});born.journeyManaged=true;const kit=createFieldKit(root,{scale:.77,input:['numeric','analytics'].includes(p.id)?'sensor':'camera'});kit.group.position.z=-2;roots[p.id]={root,pieces,born,kit}}
 const state=()=>({id,phase,selected,beat,visited:[...visited],canFuse:visited.size===3});const notify=()=>onStage(state());const change=p=>{phase=p;clock=0;notify()};
 function reset(product){id=product;phase='overview';clock=0;selected=-1;beat=0;visited=new Set();for(const[k,v]of Object.entries(roots))v.root.visible=k===id;const r=roots[id];r.born.g.visible=false;r.kit.group.visible=false;r.pieces.forEach(({o})=>{o.g.visible=id!=='chat';o.g.position.copy(o.home);o.g.rotation.set(0,0,0);o.g.scale.setScalar(layout.overviewScale)});notify()}
 function selectTopic(index,startBeat=0){
  const r=roots[id];from=r.pieces.map(({o})=>o.g.position.clone());selected=index;beat=startBeat;change('selecting');return true;
 }
 function action(type,index){
  const r=roots[id];
  if(type==='select'&&['overview','focus'].includes(phase)&&index>=0&&index<3)return selectTopic(index);
  if(type==='next'){
   if(phase==='overview')return selectTopic(0);
   if(phase==='born'&&id==='chat'&&beat<winChatFinalBeats-1){beat++;notify();return true;}
   if(phase==='focus'){
    if(id==='chat'&&beat<winChatBeatCounts[selected]-1){beat++;if(beat===winChatBeatCounts[selected]-1)visited.add(selected);notify();return true;}
    if(selected<2)return selectTopic(selected+1);
    if(visited.size<3)return selectTopic([0,1,2].find(i=>!visited.has(i)));
    from=r.pieces.map(({o})=>o.g.position.clone());beat=0;change('fusing');return true;
   }
  }
  if(type==='back'){
   if(phase==='born'&&id==='chat'){
    if(beat>0){beat--;notify();return true;}
    r.born.g.visible=false;r.pieces.forEach(({o})=>o.g.visible=false);return selectTopic(2,winChatBeatCounts[2]-1);
   }
   if(phase==='focus'){
    if(id==='chat'&&beat>0){beat--;notify();return true;}
    if(selected>0)return selectTopic(selected-1,id==='chat'?winChatBeatCounts[selected-1]-1:0);
    reset(id);return true;
   }
  }
  if(type==='restart'){reset(id);return true;}
  return false;
 }

 function update(age,reduced,dt){clock+=dt;const r=roots[id];if(!r)return;
 if(phase==='selecting'){const p=reduced?1:clamp(clock/(id==='chat'?winChatTravelSeconds:1.65)),k=ease(p);r.pieces.forEach(({o},i)=>{const target=i===selected?V(0,layout.focusY,2.0):V((i-1)*layout.spread,-.95,-2.6);o.g.position.lerpVectors(from[i],target,k);o.g.position.y+=Math.sin(p*Math.PI)*.8;o.g.scale.setScalar(i===selected?layout.overviewScale+k*(layout.focusScale-layout.overviewScale):layout.overviewScale-k*.46)});if(p===1){if(id!=='chat'||beat===winChatBeatCounts[selected]-1)visited.add(selected);change('focus')}}
 if(phase==='fusing'){const p=reduced?1:clamp(clock/4.6),k=ease(clamp(p/.76));r.pieces.forEach(({o},i)=>{const a=i*2.09+p*6.2,rad=(1-k)*3.5;o.g.visible=id!=='chat'&&p<.8;o.g.position.lerpVectors(from[i],V(Math.cos(a)*rad,Math.sin(p*Math.PI)*2,Math.sin(a)*rad),ease(clamp(p/.3)));o.g.scale.setScalar((1-k)*1.2+.05);o.g.rotation.y=a});r.born.g.visible=p>.73;r.born.g.scale.setScalar(.1+((id==='chat'?2.05:layout.bornScale)-.1)*ease(clamp((p-.73)/.27)));if(p===1)change('born')}
 if(phase==='born'){r.born.g.visible=true;r.born.g.scale.setScalar(id==='chat'?2.05:layout.bornScale);r.born.g.rotation.y=reduced?0:Math.sin(age*.25)*.04;if(id==='chat'){r.kit.group.visible=false;r.pieces.forEach(({o})=>o.g.visible=false)}else{r.kit.layoutMode??(r.kit.layoutMode=true,r.kit.layout(true));r.kit.update(reduced?0:age,reduced?1:ease(clamp(clock/1.5)));r.kit.group.position.z=.75}}else r.kit.group.visible=false;
 }
 return {reset,action,update,phase:()=>phase,labelsVisible:()=>phase==='overview'};
}
