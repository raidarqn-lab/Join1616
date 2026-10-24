import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assignedAlliance,localizedGuidelines,showApplicationStatus} from '../application-status.js';
test('each language selects its own published rules without silently substituting English',()=>{const translations=Object.fromEntries(['en','de','pt','fr','es','ko','vi','ar'].map(lang=>[lang,{introduction:lang,guidelines:'Rules '+lang}]));for(const lang of Object.keys(translations))assert.equal(localizedGuidelines({translations},lang),translations[lang]);assert.equal(localizedGuidelines({introduction:'English',guidelines:'English'},'de'),null);});
test('guidelines are linked only for a known selected destination and eligible status',()=>{
 for(const destinationAlliance of ['NvSP','NvEM','WaE','DRoN','ECKO'])assert.equal(assignedAlliance({destinationAlliance,applicationStatus:'Approved'}),destinationAlliance);
 for(const applicationStatus of ['Declined','Withdrawn','Unconfirmed'])assert.equal(assignedAlliance({destinationAlliance:'NvSP',applicationStatus}),null);
 for(const destinationAlliance of [null,'','unknown','<script>'])assert.equal(assignedAlliance({destinationAlliance,applicationStatus:'Approved'}),null);
});
test('published guidelines open as literal text and empty publications show a clear message',()=>{
 const nodes=[];
 class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.textContent='';nodes.push(this);}append(...n){this.children.push(...n);}replaceChildren(){this.children=[];}setAttribute(){}addEventListener(){}showModal(){this.open=true;}focus(){} }
 const root=new Element('section');globalThis.document={getElementById:()=>root,createElement:tag=>new Element(tag),body:new Element('body')};
 for(const published of [null,{introduction:'<img onerror=alert(1)>',guidelines:'Rule 1\nRule 2'}]){
  showApplicationStatus({applicationStatus:'Approved',approval:'approved',destinationAlliance:'NvSP',allianceGuidelines:published},'en');
  const link=nodes.filter(n=>n.tag==='button'&&n.textContent==='Please read alliance rules and guidelines.').at(-1);assert.ok(link);link.onclick();
  const dialog=nodes.filter(n=>n.tag==='dialog').at(-1);assert.equal(dialog.open,true);
  if(published){assert.ok(dialog.children.some(n=>n.textContent===published.introduction));assert.ok(dialog.children.some(n=>n.textContent===published.guidelines));assert.equal(dialog.children.some(n=>n.tag==='img'),false);}else assert.ok(dialog.children.some(n=>n.textContent.includes('not published')));
 }
 delete globalThis.document;
});
