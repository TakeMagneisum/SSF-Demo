/* SSF Phase 4: local, allow-listed appearance/reading preferences. No requests. */
(function () {
  'use strict';
  const KEY = 'ssf-display-preferences-v1';
  const choices = Object.freeze({ appearance:['system','light','dark'], text:['standard','large','larger'], spacing:['standard','relaxed'], contrast:['system','high'], motion:['system','reduced'], density:['comfortable','compact'] });
  const defaults = Object.freeze(Object.fromEntries(Object.entries(choices).map(([key,values])=>[key,values[0]])));
  const root = document.documentElement;
  let storageAvailable=true;
  function read(){let raw;try{raw=window.localStorage.getItem(KEY);}catch{storageAvailable=false;return {...defaults};}try{return normalize(JSON.parse(raw||'null'));}catch{return {...defaults};}}
  function normalize(raw){return Object.fromEntries(Object.entries(choices).map(([key,values])=>[key,values.includes(raw?.[key])?raw[key]:defaults[key]]));}
  function media(query){try{return window.matchMedia(query);}catch{return {matches:false};}}
  const dark=media('(prefers-color-scheme: dark)'),forced=media('(forced-colors: active)'),contrast=media('(prefers-contrast: more)'),motion=media('(prefers-reduced-motion: reduce)');
  let state=read();
  let calm=false;try{calm=window.localStorage.getItem('ssf-calm-view')==='true';}catch{}
  let controls=[], status=null, panel=null, summary=null;
  const spanish=()=>root.lang==='es';
  function apply(){
    const effective=calm||state.appearance==='dark'||(state.appearance==='system'&&dark.matches)?'dark':'light';
    root.dataset.ssfTheme=effective;
    root.dataset.ssfText=state.text;
    root.dataset.ssfSpacing=state.spacing;
    root.dataset.ssfContrast=state.contrast==='high'||contrast.matches?'high':'standard';
    root.dataset.ssfMotion=state.motion==='reduced'||motion.matches||calm?'reduced':'system';
    root.dataset.ssfDensity=state.density;
    controls.forEach(el=>{el.value=state[el.dataset.ssfPreference];});
    if(status){
      const es=spanish();
      const parts=[forced.matches?(es?'Colores del sistema activos.':'System forced colors active.'):calm?(es?'Vista tranquila usa colores oscuros y menos movimiento.':'Calm View uses dark colors and reduced motion.'):(effective==='dark'?(es?'Apariencia oscura activa.':'Dark appearance active.'):(es?'Apariencia clara activa.':'Light appearance active.'))];
      if(!storageAvailable)parts.push(es?'Los cambios solo se aplican a esta página.':'Changes apply on this page only.');
      const message=parts.join(' ');if(status.textContent!==message)status.textContent=message;
    }
  }
  function save(){try{window.localStorage.setItem(KEY,JSON.stringify(state));storageAvailable=true;}catch{storageAvailable=false;}apply();}
  function reset(){state={...defaults};try{window.localStorage.removeItem(KEY);storageAvailable=true;}catch{storageAvailable=false;}apply();}
  function close(){if(panel?.open){panel.open=false;summary?.focus();}}
  function init(){
    const ui=document.querySelector('[data-ssf-display]');if(!ui)return;
    controls=[...ui.querySelectorAll('[data-ssf-preference]')];status=ui.querySelector('[data-ssf-pref-status]');panel=ui.querySelector('details');summary=panel?.querySelector('summary');
    for(const el of controls)el.addEventListener('change',()=>{const k=el.dataset.ssfPreference;if(choices[k]?.includes(el.value)){state={...state,[k]:el.value};save();}else apply();});
    ui.querySelector('[data-ssf-pref-reset]')?.addEventListener('click',reset);
    ui.querySelector('[data-ssf-pref-close]')?.addEventListener('click',close);
    panel?.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.open){event.preventDefault();event.stopPropagation();close();}});
    // Native disclosures do not trap focus. Menu and settings are separate controls.
    document.querySelector('.menu-toggle')?.addEventListener('click',()=>{if(panel)panel.open=false;});
    ui.hidden=false;
    if(root.dataset.calm!==undefined)calm=root.dataset.calm==='true';
    apply();
  }
  function refreshCalm(){calm=root.dataset.calm==='true';apply();}
  // First paint uses stored/system choice; no-JS keeps readable original light layout.
  apply();
  for(const m of [dark,forced,contrast,motion]){if(m.addEventListener)m.addEventListener('change',apply);else m.addListener?.(apply);}
  document.addEventListener('ssf-calm-change',refreshCalm);
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null){state=read();apply();}});
  window.addEventListener('pageshow',event=>{if(event.persisted&&storageAvailable){state=read();apply();}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
