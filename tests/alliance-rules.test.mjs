import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {rulesPath,parseRules,splitSummary,appendInline} from '../alliance-rules-core.js';
import {rulesCopy,languages} from '../alliance-rules-copy.js';
const publication=JSON.parse(await readFile(new URL('../content/alliance-rules/nvsp/publication.json',import.meta.url)));
test('all eight full translations retain twelve numbered rules and meet storage limits',()=>{
 assert.deepEqual(Object.keys(publication.translations).sort(),Object.keys(languages).sort());
 for(const [lang,copy]of Object.entries(publication.translations)){
  assert.ok(copy.introduction.length<=2000);assert.ok(copy.guidelines.length<=12000);
  const {summary,blocks}=splitSummary(copy.guidelines,rulesCopy(lang).quick);assert.equal(summary.length,4,lang);
  for(let n=1;n<=12;n++)assert.ok(blocks.some(b=>b.type==='heading'&&b.text.startsWith(n+'. ')),lang+' '+n);
  assert.ok(blocks.some(b=>b.type==='ul'&&b.items.length===7),lang+' consequences');
 }
});
test('English policy retains the supplied introduction and all full rules',async()=>{
 const source=await readFile(new URL('../content/alliance-rules/nvsp/en.md',import.meta.url),'utf8');const [intro,body]=source.trim().split('\n---\n',2);
 assert.ok(source.includes('7.2 million'));assert.ok(publication.translations.en.introduction===intro.split('\n\n').slice(2).join('\n\n').trim());
 const full=source.slice(source.indexOf('\n---\n')+5).trim();assert.ok(publication.translations.en.guidelines.endsWith(full));assert.ok(!source.includes('Clarify the daily requirements'));
});
test('only approved alliance and language values become links',()=>{
 assert.equal(rulesPath('NvSP','ar'),'/alliances/nvsp/?lang=ar');assert.equal(rulesPath('NvEM','fr'),'/alliance-rules.html?alliance=NvEM&lang=fr');assert.equal(rulesPath('__proto__'),null);assert.equal(rulesPath('NvSP','<script>'),'/alliances/nvsp/?lang=en');
});
test('content rendering cannot interpret HTML or unsafe links',()=>{
 const doc={createElement:tag=>({tag,textContent:''})};const node={children:[],append(el){this.children.push(el);}};appendInline(node,'**Rule** <img onerror=alert(1)> [link](javascript:alert(1))',doc);
 assert.equal(node.children[1].tag,'strong');assert.ok(node.children.every(n=>['span','strong'].includes(n.tag)));assert.ok(node.children.at(-1).textContent.includes('<img'));
 assert.equal(parseRules('## Heading\n\n- One\n- Two')[1].items.length,2);
});
