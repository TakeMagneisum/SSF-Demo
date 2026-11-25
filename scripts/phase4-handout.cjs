'use strict';
// Actual existing handout script and QR encoder with a small DOM simulation; not print rendering.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');process.chdir(require('node:path').resolve(__dirname,'..'));
class El {
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.attrs={};this.handlers={};this.hidden=false;this.checked=false;this.isConnected=true;this.className='';}
 setAttribute(k,v){this.attrs[k]=String(v);}
 addEventListener(k,f){this.handlers[k]=f;}
 append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 focus(){this.focused=true;}
 querySelector(selector){return walk(this).find(n=>matches(n,selector))||null;}
}
function walk(n){return [n,...n.children.flatMap(walk)];}
function matches(n,s){if(s==='input[data-sheet-key]')return n.tag==='input'&&Object.hasOwn(n.dataset,'sheetKey');if(s==='[data-sheet-review-shortcut]')return Object.hasOwn(n.dataset,'sheetReviewShortcut');if(s==='button')return n.tag==='button';return false;}
const nodes={},get=id=>nodes[id]??=new El();const cards=new El();const classes=new Set();const body=new El('body');body.classList={toggle:(k,v)=>v?classes.add(k):classes.delete(k),add:k=>classes.add(k),remove:k=>classes.delete(k)};const handlers={};
const document={documentElement:{lang:'en'},body,title:'Directory',getElementById:get,createElement:t=>new El(t),createElementNS:(_,t)=>new El(t),createTextNode:t=>Object.assign(new El('#text'),{textContent:t}),querySelectorAll:s=>walk(cards).filter(n=>matches(n,s)),querySelector:s=>walk(cards).find(n=>matches(n,s==='.sheet-choice input'?'input[data-sheet-key]':s)),addEventListener:(k,f)=>handlers[k]=f};
const window={scrollY:345,scrollTo(){},print(){window.printed=true;}};const saved={unrelated:'retain'},sessionStorage={getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v,removeItem:k=>delete saved[k]};
const ctx=vm.createContext({window,document,sessionStorage,URL});const load=p=>vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:p});for(const f of ['colorado-resources','massachusetts-resources','new-york-resources','illinois-resources','city-resources','expanded-editions','resources'])load('assets/'+f+'.js');load('assets/vendor/qr.js');load('assets/handout.js');
const area=window.SSF_RESOURCE_AREAS.liberty;assert(area.resources.length>=2);for(const resource of area.resources.slice(0,2))cards.append(window.SSFHandout.choice(area,resource));const boxes=document.querySelectorAll('input[data-sheet-key]'),shortcuts=document.querySelectorAll('[data-sheet-review-shortcut]');assert(shortcuts.every(x=>x.hidden));assert(get('sheet-tray').hidden);
boxes[0].checked=true;boxes[0].handlers.change();assert.equal(shortcuts[0].hidden,false);assert.equal(shortcuts[1].hidden,true);assert.equal(JSON.parse(saved['ssf-print-selection-v1']).length,1);assert.equal(get('sheet-tray').hidden,false);
shortcuts[0].handlers.click();assert.equal(get('sheet-preview').hidden,false);assert(classes.has('reviewing-sheet'));assert.equal(get('sheet-items').children.length,1);const article=get('sheet-items').children[0],qr=article.children[1];assert.equal(qr.href,new URL(area.resources[0].url).href);assert(qr.children[0].children[0].attrs.d.length>50);assert(get('sheet-title').focused);
get('sheet-print').handlers.click();assert(window.printed);get('sheet-back').handlers.click();assert.equal(get('sheet-preview').hidden,true);assert(shortcuts[0].focused);assert(!classes.has('reviewing-sheet'));assert.equal(JSON.parse(saved['ssf-print-selection-v1']).length,1);
shortcuts[0].handlers.click();get('sheet-clear').handlers.click();assert.equal(saved['ssf-print-selection-v1'],undefined);assert.equal(saved.unrelated,'retain');assert(shortcuts.every(x=>x.hidden));assert(boxes[0].focused);assert(get('sheet-tray').hidden);
console.log('Phase 4 handout simulation: real Liberty resource IDs, selected-card review, original QR encoder/official URL, print-handler call, selection persistence, focus return, clear isolation. No native print/PDF rendering tested.');
