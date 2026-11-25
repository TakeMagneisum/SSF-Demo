#!/usr/bin/env node
'use strict';
// Exercise the real area.js in a deliberately minimal DOM model, not a browser.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(require('node:path').resolve(__dirname,'..'));
const read=p=>fs.readFileSync(p,'utf8');
const data={window:{}};vm.runInNewContext(read('assets/coverage-index.js'),data);
const guides=data.window.SSF_COVERAGE.guides;
const markup=read('index.html');
const options=[...markup.match(/<select id="area-select-home"[\s\S]*?<\/select>/)[0].matchAll(/<option value="([^"]*)"[^>]*>([^<]*)<\/option>/g)].map(m=>[m[1],m[2]]);
assert.equal(options.length,107);assert.deepEqual(options.slice(1).map(x=>x[0]).sort(),Object.keys(guides).sort());
class Option {constructor(text,value){this.textContent=text;this.text=text;this.value=value;}cloneNode(){return new Option(this.text,this.value);}}
function run({query='',stored={},missing=false}={}){
 const store=new Map(Object.entries(stored));let assigned;
 const status={hidden:true};
 const button={disabled:true,attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this[k]=v;}};
 const country={value:'US',label:{dataset:{}},get selectedOptions(){return [new Option(this.value,this.value)]},closest(){return this.label;},addEventListener(k,v){this[k]=v;}};
 const select={options:options.map(([value,text])=>new Option(text,value)),value:'',closest(){return picker;},hasAttribute(){return true;},replaceChildren(...n){this.options=n;},add(o){this.options.push(o);},addEventListener(k,v){this[k]=v;}};
 const picker={querySelector(s){return s==='[data-area-open]'?button:country;}};
 const doc={body:{classList:{contains(){return false;}}},readyState:'complete',querySelectorAll(s){return s==='[data-area-select]'?[select]:[];},getElementById(){return status;}};
 const window={...(missing?{}:{SSF_COVERAGE:data.window.SSF_COVERAGE}),localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},location:{href:'https://example.invalid/demo/index.html'+query,search:query,assign(v){assigned=v;}}};
 vm.runInNewContext(read('assets/area.js'),{window,document:doc,URLSearchParams,URL,Option});
 return {country,select,button,status,store,window,assigned:()=>assigned};
}
for(const [id,g] of Object.entries(guides)){
 const x=run();x.country.value=g.country;x.country.change();assert(x.select.options.some(o=>o.value===id),id);x.select.value=id;x.select.change();assert(!x.button.disabled,id);assert.match(x.button.attrs['aria-label'],/Open the /);x.button.click();assert.equal(x.assigned(),'https://example.invalid/demo/find-help.html?area='+id);assert.equal(x.store.get('ssf-selected-area'),id);assert.equal(x.store.get('ssf-selected-country'),g.country);assert.equal(x.window.SSF_RESOURCES.length,0);
}
const stored=run({stored:{'ssf-selected-country':'GB'}});assert.equal(stored.country.value,'GB');assert.equal(stored.select.value,'');assert(stored.button.disabled);
const requested=run({query:'?area=london-enfield'});assert.equal(requested.country.value,'GB');assert(requested.button.disabled);
const failed=run({missing:true});assert(!failed.status.hidden);assert(failed.button.disabled);
console.log('Phase 2 picker: all 106 metadata-only guide routes under project subpath, country filters, neutral initial state, stored choice, failed-index fallback passed (simulated DOM).');
