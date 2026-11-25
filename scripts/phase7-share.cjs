'use strict';
// Actual discovery script with isolated fake clipboard/share; no external calls.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(require('node:path').resolve(__dirname,'../assets/discovery.js'),'utf8');
async function test({clipboard,share,legacy}){
 const status={textContent:''},button={textContent:'Share',dataset:{shareUrl:'https://singlestepforward.com/',statusTarget:'#share-status'},addEventListener(_,fn){this.click=fn;}};
 let created=0,removed=0,attempts=0;
 const doc={readyState:'complete',body:{classList:{contains:()=>false},append(){created++;}},querySelectorAll:s=>s==='[data-share-page]'?[button]:[],querySelector:()=>status,createElement:()=>({style:{},setAttribute(){},select(){},remove(){removed++;}}),execCommand(){attempts++;if(legacy instanceof Error)throw legacy;return legacy;}};
 vm.runInNewContext(code,{document:doc,navigator:{clipboard,share}});assert.equal(created,0);await button.click();assert.equal(created,removed);return {button,status,attempts};
}
(async()=>{
 let writes=[];let x=await test({clipboard:{writeText:async t=>writes.push(t)}});assert.equal(x.button.textContent,'Link copied');assert.deepEqual(writes,['https://singlestepforward.com/']);
 for(const legacy of [false,new Error('blocked')]){x=await test({legacy});assert.equal(x.button.textContent,'Copy unavailable');assert.match(x.status.textContent,/Copy unavailable.*https:\/\/singlestepforward\.com\//);assert.equal(x.attempts,1);}
 x=await test({legacy:true});assert.equal(x.button.textContent,'Link copied');
 x=await test({share:async()=>{const e=new Error();e.name='AbortError';throw e;}});assert.equal(x.attempts,0);assert.equal(x.status.textContent,'');
 x=await test({share:async d=>assert.equal(d.url,'https://singlestepforward.com/')});assert.match(x.status.textContent,/Share options opened/);
 console.log('Phase 7 share: actual discovery handler; successful copy, denied/missing clipboard, false/throw legacy fallback, cleanup, cancellation and deliberate public URL only (simulation).');
})().catch(e=>{console.error(e);process.exitCode=1;});
