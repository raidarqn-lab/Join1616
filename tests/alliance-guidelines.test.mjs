import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assignedAlliance,localizedGuidelines,showApplicationStatus} from '../application-status.js';
test('each language selects its own published rules without silently substituting English',()=>{const translations=Object.fromEntries(['en','de','pt','fr','es','ko','vi','ar'].map(lang=>[lang,{introduction:lang,guidelines:'Rules '+lang}]));for(const lang of Object.keys(translations))assert.equal(localizedGuidelines({translations},lang),translations[lang]);assert.equal(localizedGuidelines({introduction:'English',guidelines:'English'},'de'),null);});
test('guidelines are linked only for a known selected destination and eligible status',()=>{
 for(const destinationAlliance of ['NvSP','NvEM','WaE','DRoN','ECKO'])assert.equal(assignedAlliance({destinationAlliance,applicationStatus:'Approved'}),destinationAlliance);
 for(const applicationStatus of ['Declined','Withdrawn','Unconfirmed'])assert.equal(assignedAlliance({destinationAlliance:'NvSP',applicationStatus}),null);
 for(const destinationAlliance of [null,'','unknown','<script>'])assert.equal(assignedAlliance({destinationAlliance,applicationStatus:'Approved'}),null);
});
test('assigned applicants get a shareable page link in their selected language without application credentials',()=>{
 const nodes=[];
 class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.textContent='';nodes.push(this);}append(...n){this.children.push(...n);}replaceChildren(){this.children=[];}setAttribute(){} }
 const root=new Element('section');globalThis.document={getElementById:()=>root,createElement:tag=>new Element(tag)};
 showApplicationStatus({applicationStatus:'Approved',approval:'approved',destinationAlliance:'NvSP'},'de');
 const link=nodes.filter(n=>n.tag==='a').at(-1);assert.equal(link.href,'/alliances/nvsp/?lang=de');assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener');
 delete globalThis.document;
});
