import {languages,rulesCopy} from './alliance-rules-copy.js?v=1';
import {allianceNames,rulesPath,parseRules,splitSummary,appendInline} from './alliance-rules-core.js?v=1';
const params=new URLSearchParams(location.search);
const alliance=location.pathname.includes('/alliances/nvsp')?'NvSP':params.get('alliance');
let lang=Object.hasOwn(languages,params.get('lang'))?params.get('lang'):'en',publication=null,failed=false;
const $=id=>document.getElementById(id),element=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
for(const [code,label]of Object.entries(languages)){const option=element('option',label);option.value=code;$('rules-language').append(option);}
function renderBlocks(blocks,container,prefix,toc){
 let index=0;
 for(const block of blocks){
  if(block.type==='heading'){
   const heading=element('h2',block.text);heading.id=prefix+'-'+index++;container.append(heading);
   if(toc){const a=element('a',block.text);a.href='#'+heading.id;toc.append(a);}
  }else if(block.type==='ul'){
   const list=element('ul');for(const item of block.items){const li=element('li');appendInline(li,item);list.append(li);}container.append(list);
  }else {const p=element('p');appendInline(p,block.text);container.append(p);}
 }
}
function render(){
 const copy=rulesCopy(lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';$('rules-language').value=lang;
 for(const el of document.querySelectorAll('[data-copy]'))el.textContent=copy[el.dataset.copy];
 $('rules-language').setAttribute('aria-label',copy.language);document.querySelector('article').setAttribute('aria-label',copy.title);$('toc-links').setAttribute('aria-label',copy.contents);
 $('alliance-tag').textContent=Object.hasOwn(allianceNames,alliance)?alliance:'1616';$('alliance-name').textContent=allianceNames[alliance]||'Alliance';document.title=(allianceNames[alliance]||'Alliance')+' · '+copy.title;
 for(const id of ['rules-introduction','rules-body','toc-links','summary-cards'])$(id).replaceChildren();
 const text=publication?.translations?.[lang];$('document').hidden=!text;$('quick-reference').hidden=true;$('rules-status').hidden=!!text;
 $('rules-status-text').textContent=failed?copy.error:publication===null?copy.loading:copy.empty;$('retry').hidden=!failed;$('published-date').textContent='';
 if(!text)return;
 renderBlocks(parseRules(text.introduction),$('rules-introduction'),'purpose',$('toc-links'));
 const {summary,blocks}=splitSummary(text.guidelines,copy.quick);
 if(summary.length){$('quick-reference').hidden=false;for(const item of summary){const card=element('li');appendInline(card,item);$('summary-cards').append(card);}}
 renderBlocks(blocks,$('rules-body'),'rule',$('toc-links'));
 const date=new Date(publication.publishedAt);if(!Number.isNaN(date.getTime()))$('published-date').textContent=copy.updated+' · '+new Intl.DateTimeFormat(lang,{dateStyle:'long'}).format(date);
 if(location.hash){const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView();}
}
async function load(){
 failed=false;publication=null;render();
 if(!Object.hasOwn(allianceNames,alliance)){publication={};render();return;}
 try{
  const response=await fetch('https://dycbjythqwumyzseskfh.supabase.co/rest/v1/rpc/published_alliance_rules',{method:'POST',headers:{'Content-Type':'application/json',apikey:'sb_publishable_DPRrMoxgV0zEFoH9SKNZFQ_jde16Nzk'},body:JSON.stringify({alliance_tag:alliance}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Rules unavailable');const data=await response.json();publication=data?.published||{};
 }catch{failed=true;publication={};}
 render();
}
$('rules-language').onchange=()=>{lang=$('rules-language').value;history.replaceState(null,'',rulesPath(alliance,lang)||location.pathname);$('share-fallback').hidden=true;render();};
$('copy-link').onclick=async()=>{const url=new URL(rulesPath(alliance,lang)||location.pathname,location.origin).href;try{await navigator.clipboard.writeText(url);$('copy-link').textContent=rulesCopy(lang).copied;}catch{$('share-fallback').hidden=false;$('share-url').value=url;$('share-url').select();}};
$('retry').onclick=load;
if(matchMedia('(max-width:760px)').matches)document.querySelector('.contents').open=false;
load();
