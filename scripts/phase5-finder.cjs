'use strict';
// Exercise actual guide renderer and urgent classifier with real original edition records.
// Small DOM simulation: no browser layout, native print, AT or human acceptance.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');process.chdir(require('node:path').resolve(__dirname,'..'));
const source=vm.createContext({window:{}});const read=f=>fs.readFileSync(f,'utf8');const run=(f,c)=>vm.runInContext(read(f),c,{filename:f});
for(const f of ['colorado-resources','massachusetts-resources','new-york-resources','illinois-resources','city-resources','expanded-editions','resources']) run('assets/'+f+'.js',source);
const areas=source.window.SSF_RESOURCE_AREAS;
function walk(n){return [n,...n.children.flatMap(walk)];}
function matches(n,s){if(s==='[data-filter]'||s==='.filter-chip')return Object.hasOwn(n.dataset,'filter');if(s==='[data-query]')return Object.hasOwn(n.dataset,'query');if(s==='[data-query], .filter-chip')return matches(n,'[data-query]')||matches(n,'.filter-chip');if(s==='button[type="submit"]')return n.tag==='button'&&n.type==='submit';const m=s.match(/^\[data-filter="(.*)"\]$/);if(m)return n.dataset.filter===m[1];return false;}
class El{
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.attrs={};this.handlers={};this.hidden=false;this.className='';this.open=false;this.value='';this.classes=new Set();this.classList={toggle:(k,v)=>v?this.classes.add(k):this.classes.delete(k),remove:k=>this.classes.delete(k)};}
 get textContent(){return this._text||this.children.map(x=>x.textContent).join(' ');}set textContent(v){this._text=String(v);this.children=[];}
 setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];if(k==='disabled')this.disabled=false;}
 append(...nodes){for(const n of nodes){if(n.tag==='#fragment'){this.append(...n.children);continue;}n.parentElement=this;this.children.push(n);}}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}get childElementCount(){return this.children.length;}
 addEventListener(k,f){this.handlers[k]=f;}remove(){this.parentElement.children=this.parentElement.children.filter(x=>x!==this);}
 focus(){this.focused=true;}scrollIntoView(){this.scrolled=true;}querySelectorAll(s){return walk(this).filter(n=>matches(n,s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}closest(s){return matches(this,s)?this:null;}
}
function boot(area, need='', missingUrgency=false){
 const nodes={},get=id=>nodes[id]??=new El(),filter=get('filter-list'),form=get('help-search'),submit=new El('button');submit.type='submit';submit.disabled=true;form.append(submit);
 for(const c of ['all','food','housing','health','mental-health','safety','work','education','family','animals','recovery','veterans','tax','legal','transportation','weather','volunteer']){let b=new El('button');b.dataset.filter=c;filter.append(b);}
 const query=get('help-query'),grid=get('resource-grid');const selections=new Set();const history=[];const location=new URL('https://demo.invalid/project/find-help.html?area='+ (area?.id||'invalid')+(need?'&need='+need:''));
 const w={SSF_CURRENT_AREA:area,location,history:{replaceState(_,__,url){history.push(String(url));}},SSFHandout:{choice(a,r){let n=new El('input');n.checked=selections.has(r.id);n.dataset.sheetKey=r.id;n.addEventListener('change',()=>n.checked?selections.add(r.id):selections.delete(r.id));return n;}},print(){}};
 const doc={querySelector:s=>s.startsWith('#')?get(s.slice(1)):null,querySelectorAll:s=>walk(filter).filter(n=>matches(n,s)),createElement:t=>new El(t),createTextNode:t=>Object.assign(new El('#text'),{textContent:t}),createDocumentFragment:()=>new El('#fragment')};
 const c=vm.createContext({window:w,document:doc,URL,URLSearchParams});for(const f of ['urgent','phase5-vocabulary','guide'])if(!(missingUrgency&&f==='urgent'))run('assets/'+f+'.js',c);
 return {get,query,grid,filter,submit,selections,history,search(q){query.value=q;form.handlers.submit({preventDefault(){}});},click(cat){filter.handlers.click({target:filter.querySelector('[data-filter="'+cat+'"]')});},cards(){return grid.children.filter(n=>n.tag==='article');},ids(){return this.cards().map(n=>n.dataset.resourceId);}};
}
const idsFor=(area,kind)=>area.routing[kind].filter(id=>area.resources.some(r=>r.id===id));
let cases=0;for(const area of Object.values(areas)){
 const t=boot(area);assert.equal(t.cards().length,area.resources.length,area.id);
 for(const [q,kind] of [['I cannot breathe and need groceries','emergency'],['I want to die and need a power bill paid','suicide'],['domestic violence and rent','violence'],['quiero morir, no puedo respirar y comida','emergency']]){
  t.search(q);assert.deepEqual(t.ids(),Array.from(idsFor(area,kind)),area.id+' '+kind);assert(t.get('guide-answer').classes.has('urgent-answer'));assert.match(t.get('phase5-filter-summary').textContent,/Urgent/);assert(!t.history.some(u=>u.includes(encodeURIComponent(q))));
  if(kind==='emergency')assert(t.get('answer-title').textContent.includes(area.emergency?.callLabel||'Call 911'),area.id);
  if(!['US','PR'].includes(area.country)&&kind!=='violence')assert(!/\b911\b|\b988\b/.test(t.get('answer-title').textContent),area.id);
  cases++;
 }
}
const a=areas.liberty,t=boot(a,'mental-health');assert(t.ids().every(id=>a.resources.find(r=>r.id===id).categories.includes('mental-health')));t.get('clear-filters').handlers.click();assert.equal(t.cards().length,a.resources.length);assert(t.filter.querySelector('[data-filter="all"]').focused);
const card=t.cards()[0],resource=a.resources.find(r=>r.id===card.dataset.resourceId),details=card.children.find(n=>n.tag==='details'),choice=card.children.find(n=>n.tag==='input');assert(!details.open);assert(card.children.some(n=>n.className==='resource-next'&&n.textContent.includes(resource.next)));assert(card.children.some(n=>n.className==='resource-summary'&&n.textContent===resource.summary));assert(card.children.some(n=>n.className==='resource-check'&&n.textContent.includes(a.reviewed)));assert(walk(card).some(n=>n.href===resource.url));choice.checked=true;choice.handlers.change();t.get('phase5-expand').handlers.click();assert(t.cards().every(n=>n.children.find(x=>x.tag==='details').open));t.get('phase5-collapse').handlers.click();assert(t.cards().every(n=>!n.children.find(x=>x.tag==='details').open));details.open=true;details.handlers.toggle();
const cats=resource.categories;t.click(cats[0]);assert(t.ids().includes(resource.id));assert(t.cards().find(n=>n.dataset.resourceId===resource.id).children.find(n=>n.tag==='details').open);assert(t.cards().find(n=>n.dataset.resourceId===resource.id).children.find(n=>n.tag==='input').checked);
const second=cats[0]==='housing'?'food':'housing';t.click(second);assert.equal(t.ids().length,a.resources.filter(r=>r.categories.includes(cats[0])||r.categories.includes(second)).length);const remove=t.get('phase5-filter-summary').children.find(n=>n.tag==='button');remove.handlers.click();assert(t.filter.querySelector('[data-filter="'+cats[0]+'"]').focused);assert(t.ids().every(id=>a.resources.find(r=>r.id===id).categories.includes(second)));t.get('clear-filters').handlers.click();assert(t.selections.has(resource.id));
t.get('phase5-layout').handlers.click();assert(t.grid.classes.has('phase5-list'));assert.equal(t.get('phase5-layout').getAttribute('aria-pressed'),'true');t.get('phase5-layout').handlers.click();assert(!t.grid.classes.has('phase5-list'));
for(const [q,cat] of [['groceres','food'],['electricity bill','housing'],['dentle','health'],['ride to appointment','transportation']]){t.search(q);assert(t.ids().slice(0,3).some(id=>a.resources.find(r=>r.id===id).categories.includes(cat)),q);}
t.search('qzxvkjwqz');assert.match(t.get('results-count').textContent,/0 close matches/);assert.match(t.get('answer-title').textContent,/not seeing a close match/);t.get('reset-guide').handlers.click();assert(t.query.focused);assert(t.selections.has(resource.id));assert(t.history.every(u=>u.includes('area=liberty')&&!u.includes('qzxvkjwqz')));
const unknown=boot(undefined);assert(unknown.submit.disabled);assert.match(unknown.get('results-count').textContent,/emergency services where you are/);assert(!unknown.cards().length);
for(const page of ['find-help.html','assets/find-help.html','find-help/find-help.html']){const html=read(page);assert.match(html,/<textarea id="help-query" autocomplete="off"/);assert.match(html,/type="submit" disabled>Find a next step/);assert(!/<textarea[^>]*name="help-query"/.test(html));}
for(const page of ['index.html','explore-map.html'])assert(!/src="assets\/(?:resources|city-resources|expanded-editions)\.js/.test(read(page)));
console.log(`Phase 5 finder: ${cases} actual guide/urgent-priority combinations across ${Object.keys(areas).length} guides; actual resource cards, details, OR filters, individual removal/focus, list mode, selection-interface preservation, aliases, zero-match, private query/unknown route, no-heavy-data assertions. DOM simulation; handout integration separately tested by Phase 4.`);

// Phase 7: simulate an unavailable urgency asset, leaving ordinary category browsing operational.
const failedUrgency=boot(areas.liberty,'',true);assert(failedUrgency.submit.disabled);assert(failedUrgency.query.disabled);assert(!failedUrgency.get('situation-unavailable').hidden);const beforeFailure=failedUrgency.ids();failedUrgency.search('I cannot breathe and need groceries');assert.deepEqual(failedUrgency.ids(),beforeFailure);failedUrgency.click('food');assert(failedUrgency.ids().length);assert(failedUrgency.ids().every(id=>areas.liberty.resources.find(r=>r.id===id).categories.includes('food')));console.log('Phase 7: failed urgency asset disables situation matching; direct submit cannot bypass; topic browsing remains operational (simulation).');
