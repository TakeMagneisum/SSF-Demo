'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(require('node:path').resolve(__dirname,'..'));
const source=fs.readFileSync('assets/phase4-preferences.js','utf8');
const KEY='ssf-display-preferences-v1';
class Target {
 constructor(){this.handlers={};this.dataset={};this.hidden=true;this.value='';this.open=false;this.attrs={};}
 addEventListener(k,f){(this.handlers[k]??=[]).push(f);}
 emit(k,e={}){for(const f of this.handlers[k]||[])f(e);}
 focus(){this.focused=true;}
 setAttribute(k,v){this.attrs[k]=v;}
 getAttribute(k){return this.attrs[k];}
 contains(){return false;}
}
function setup({values={},denied=false,dark=false,forced=false,contrast=false,reduced=false,lang='en',noUI=false}={}){
 const saved={...values},writes=[],root={dataset:{},lang,classList:{add(){}}};
 const media={},makeMedia=(q,v)=>{const m=new Target();m.matches=v;media[q]=m;};
 makeMedia('(prefers-color-scheme: dark)',dark);makeMedia('(forced-colors: active)',forced);makeMedia('(prefers-contrast: more)',contrast);makeMedia('(prefers-reduced-motion: reduce)',reduced);makeMedia('(max-width: 1100px)',false);
 const window=new Target(),document=new Target();window.matchMedia=q=>media[q];window.localStorage={getItem:k=>{if(denied)throw Error('blocked');return saved[k]??null;},setItem:(k,v)=>{writes.push(['set',k]);if(denied)throw Error('blocked');saved[k]=v;},removeItem:k=>{writes.push(['remove',k]);if(denied)throw Error('blocked');delete saved[k];}};
 const ui=new Target(),panel=new Target(),summary=new Target(),reset=new Target(),close=new Target(),status=new Target(),menu=new Target(),nav=new Target(),calm=new Target();
 menu.setAttribute('aria-controls','main-navigation');menu.setAttribute('aria-expanded','false');
 const fields=Object.fromEntries(['appearance','text','spacing','contrast','motion','density'].map(k=>{const e=new Target();e.dataset.ssfPreference=k;return [k,e];}));
 ui.querySelectorAll=()=>Object.values(fields);ui.querySelector=s=>({'details':panel,'[data-ssf-pref-status]':status,'[data-ssf-pref-reset]':reset,'[data-ssf-pref-close]':close})[s];panel.querySelector=()=>summary;
 Object.assign(document,{documentElement:root,readyState:'complete',querySelector:s=>s==='[data-ssf-display]'?(noUI?null:ui):s==='.menu-toggle'?menu:null,querySelectorAll:s=>s==='[data-calm-toggle]'?[calm]:[],getElementById:()=>nav,dispatchEvent:event=>document.emit(event.type,event)});
 const ctx=vm.createContext({document,window,Event:class{constructor(type){this.type=type;}}});
 vm.runInContext(source,ctx);vm.runInContext(fs.readFileSync('assets/calm.js','utf8'),ctx);
 return {saved,writes,root,media,fields,ui,panel,summary,reset,close,status,menu,calm,document,window,change:(k,v)=>{fields[k].value=v;fields[k].emit('change');}};
}
let s=setup({dark:true,reduced:true,contrast:true,values:{'ssf-selected-area':'liberty','ssf-selected-country':'US','ssf-language':'es','ssf-print-selection-v1':'protected'}});
assert.equal(s.root.dataset.ssfTheme,'dark');assert.equal(s.root.dataset.ssfMotion,'reduced');assert.equal(s.root.dataset.ssfContrast,'high');assert.equal(s.fields.appearance.value,'system');assert.equal(s.ui.hidden,false);assert.equal(s.writes.length,0);
s.change('appearance','light');assert.equal(s.root.dataset.ssfTheme,'light');s.change('text','larger');s.change('spacing','relaxed');s.change('contrast','high');s.change('motion','reduced');s.change('density','compact');assert.equal(s.root.dataset.ssfText,'larger');assert.equal(s.root.dataset.ssfSpacing,'relaxed');assert.equal(s.root.dataset.ssfDensity,'compact');
let r=setup({values:s.saved,dark:true});assert.equal(r.root.dataset.ssfTheme,'light');assert.equal(r.root.dataset.ssfText,'larger');assert.equal(r.root.dataset.ssfDensity,'compact');r.calm.emit('click');assert.equal(r.root.dataset.calm,'true');assert.equal(r.root.dataset.ssfTheme,'dark');assert.match(r.status.textContent,/Calm View/);r.reset.emit('click');assert.equal(r.saved['ssf-calm-view'],'true');assert.equal(r.saved['ssf-selected-area'],'liberty');assert.equal(r.saved['ssf-language'],'es');assert.equal(r.saved['ssf-print-selection-v1'],'protected');assert.equal(r.saved[KEY],undefined);assert.equal(r.root.dataset.ssfText,'standard');r.calm.emit('click');assert.equal(r.root.dataset.ssfTheme,'dark');
r.media['(prefers-color-scheme: dark)'].matches=false;r.media['(prefers-color-scheme: dark)'].emit('change');assert.equal(r.root.dataset.ssfTheme,'light');r.media['(forced-colors: active)'].matches=true;r.media['(forced-colors: active)'].emit('change');assert.match(r.status.textContent,/forced colors/);r.media['(prefers-reduced-motion: reduce)'].matches=true;r.media['(prefers-reduced-motion: reduce)'].emit('change');assert.equal(r.root.dataset.ssfMotion,'reduced');
r.panel.open=true;let prevented=false,stopped=false;r.panel.emit('keydown',{key:'Escape',preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});assert(prevented&&stopped&&r.summary.focused&&!r.panel.open);r.panel.open=true;r.close.emit('click');assert(!r.panel.open);r.panel.open=true;r.menu.emit('click');assert(!r.panel.open);assert.equal(r.menu.getAttribute('aria-expanded'),'true');r.document.emit('keydown',{key:'Escape'});assert.equal(r.menu.getAttribute('aria-expanded'),'false');assert(r.menu.focused);
r.saved[KEY]=JSON.stringify({appearance:'dark',text:'large'});r.window.emit('pageshow',{persisted:true});assert.equal(r.root.dataset.ssfText,'large');assert.equal(r.root.dataset.ssfTheme,'dark');
s=setup({denied:true,lang:'es'});assert.match(s.status.textContent,/solo se aplican/);s.change('appearance','dark');s.change('text','large');assert.equal(s.root.dataset.ssfTheme,'dark');assert.equal(s.root.dataset.ssfText,'large');s.window.emit('pageshow',{persisted:true});assert.equal(s.root.dataset.ssfText,'large');s.reset.emit('click');assert.equal(s.root.dataset.ssfText,'standard');assert.equal(s.root.dataset.ssfTheme,'light');
for(const raw of ['{broken', 'null', '42', JSON.stringify({appearance:'javascript:',text:'999',density:{x:1},arbitrary:'secret'})]){s=setup({values:{[KEY]:raw}});assert.equal(s.fields.appearance.value,'system');assert.equal(s.root.dataset.ssfText,'standard');s.change('text','bad');assert.equal(s.fields.text.value,'standard');s.change('text','large');assert.deepEqual(Object.keys(JSON.parse(s.saved[KEY])).sort(),['appearance','contrast','density','motion','spacing','text']);assert(!s.saved[KEY].includes('secret'));}
assert.equal(setup({noUI:true}).ui.hidden,true);
assert(!/\b(fetch|XMLHttpRequest|sendBeacon|geolocation|sessionStorage)\b/.test(source));
const css=fs.readFileSync('assets/phase4.css','utf8');assert.match(css,/@media \(forced-colors:active\)/);assert.match(css,/outline:3px solid Highlight/);assert.match(css,/max-width:640px/);assert.match(css,/max-height:none;overflow:visible/);assert.match(css,/@media print/);
const i18n=fs.readFileSync('assets/i18n.js','utf8');assert(i18n.includes('"Accessibility settings":"Ajustes de accesibilidad"'));
const mapWindow={localStorage:{getItem:()=> 'es'}},mapDocument={documentElement:{lang:'en'}};vm.runInNewContext(fs.readFileSync('assets/phase3-map-ui.js','utf8'),{window:mapWindow,document:mapDocument});assert.equal(mapWindow.SSFMapUI.countLabel(2),'2 guías locales publicadas');assert.equal(mapWindow.SSFMapUI.countLabel(1),'1 guía local publicada');
const handout=fs.readFileSync('assets/handout.js','utf8');assert.match(handout,/review\.addEventListener\("click",\(\)=>openSheet\(review\)\)/);assert.match(handout,/previousFocus\?\.isConnected/);assert.match(handout,/ssf-print-selection-v1/);assert.match(handout,/SSFQrEncoder/);
console.log('Phase 4 preference DOM simulation: system/light/dark, text/spacing/density, OS contrast/motion/forced-colors, Calm override, reset isolation, invalid input, blocked storage, reload/history, keyboard disclosure/menu and focus, Spanish guide counts. Static print/QR and forced-color CSS checks.');
