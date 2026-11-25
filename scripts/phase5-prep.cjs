'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');process.chdir(require('node:path').resolve(__dirname,'..'));
const code=fs.readFileSync('assets/phase5-prep.js','utf8');
async function test(clipboard,lang){
 const button={hidden:true,dataset:{phase5Copy:'phase5-script'},addEventListener(k,f){this.click=f;}},status={textContent:''},target={textContent:'Hi, I’m calling about ___. I live in ___. Do you help people in my area? What’s the first step?',querySelectorAll(){return [];}};
 const document={documentElement:{lang},querySelectorAll:()=>[button],getElementById:k=>k==='phase5-script'?target:status};
 vm.runInNewContext(code,{document,navigator:{clipboard}});assert.equal(button.hidden,false);assert.equal(status.textContent,'');await button.click();return status.textContent;
}
(async()=>{let copied=[];assert.equal(await test({writeText:async t=>copied.push(t)},'en'),'Text copied.');assert.equal(copied.length,1);assert.match(copied[0],/Do you help people in my area/);assert.match(await test(undefined,'en'),/manually/);assert.match(await test({writeText:async()=>{throw Error('Denied')}},'es'),/manualmente/);for(const p of ['before-you-call.html','before-you-travel.html']){const html=fs.readFileSync(p,'utf8');assert.match(html,/data-phase5-copy="phase5-script" hidden/);assert.match(html,/data-phase5-copy="phase5-questions" hidden/);assert.match(html,/id="phase5-script"/);assert.match(html,/id="phase5-questions"/);}console.log('Phase 5 preparation: deliberate static text copy, missing/denied clipboard fallback, static no-JS text, English/Spanish status simulation.');})().catch(e=>{console.error(e);process.exitCode=1;});
