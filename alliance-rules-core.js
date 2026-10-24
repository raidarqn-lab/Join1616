export const allianceNames={NvSP:'Nova Sapphire',NvEM:'Nova Emerald',WaE:'WaE',DRoN:'DRoN',ECKO:'ECKO'};
export function rulesPath(alliance,lang='en'){
 if(!Object.hasOwn(allianceNames,alliance))return null;
 const selected=['en','es','pt','fr','de','ko','vi','ar'].includes(lang)?lang:'en';
 return (alliance==='NvSP'?'/alliances/nvsp/':'/alliance-rules.html?alliance='+encodeURIComponent(alliance))+(alliance==='NvSP'?'?':'&')+'lang='+selected;
}
// Deliberately supports only headings, lists, paragraphs, separators and bold text.
// HTML and Markdown links remain literal text; no content can execute or navigate.
export function parseRules(markdown=''){
 const blocks=[];let paragraph=[],list=[];
 const flush=()=>{if(paragraph.length){blocks.push({type:'p',text:paragraph.join(' ')});paragraph=[];}if(list.length){blocks.push({type:'ul',items:list});list=[];}};
 for(const line of markdown.replace(/\r/g,'').split('\n')){
  const heading=line.match(/^(#{1,3})\s+(.+)$/);
  if(heading){flush();blocks.push({type:'heading',level:heading[1].length,text:heading[2]});}
  else if(/^\s*---\s*$/.test(line)){flush();}
  else if(line.startsWith('- ')){if(paragraph.length)flush();list.push(line.slice(2));}
  else if(!line.trim()){flush();}
  else {if(list.length)flush();paragraph.push(line);}
 }
 flush();return blocks;
}
export function splitSummary(markdown,title){
 const blocks=parseRules(markdown);
 if(blocks[0]?.type==='heading'&&blocks[0].text===title&&blocks[1]?.type==='ul')return {summary:blocks[1].items,blocks:blocks.slice(2)};
 return {summary:[],blocks};
}
export function appendInline(node,text,doc=document){
 for(const [i,part]of text.split('**').entries()){
  const el=doc.createElement(i%2?'strong':'span');el.textContent=part;node.append(el);
 }
}
