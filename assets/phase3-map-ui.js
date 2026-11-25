/* Shared progressive map interaction; no location collection or storage. */
(function(){
  'use strict';
  const byId = id => document.getElementById(id);
  const spanish = () => { if(document.documentElement.lang==='es')return true; try{return window.localStorage.getItem('ssf-language')==='es';}catch{return false;} };
  const tr = (en,es) => spanish()?es:en;
  const countLabel = n => spanish()?`${n} ${n===1?'guía local publicada':'guías locales publicadas'}`:n === 1 ? '1 published local guide' : `${n} published local guides`;
  const noteLabel = note => ({'County ZIP list not available':tr(note,'No está disponible una lista de códigos postales del condado'),'Atlanta city guide only; not county-wide coverage':tr(note,'Solo guía de la ciudad de Atlanta; no cubre todo el condado')})[note]||note;
  function controller(prefix, svg, bounds) {
    const preview = byId(prefix+'-preview'), selection = byId(prefix+'-selection'), action = byId(prefix+'-action');
    const clear = byId(prefix+'-clear'), zoom = byId(prefix+'-zoom'), reset = byId(prefix+'-zoom-reset');
    const details=byId(prefix+'-guides'), guideList=byId(prefix+'-guide-list');
    const shapes=[]; let current=null, scale=1;
    function viewBox(){
      const [x,y,w,h]=bounds; let cx=x+w/2, cy=y+h/2;
      if(current?.shape.getBBox){try{const b=current.shape.getBBox();cx=b.x+b.width/2;cy=b.y+b.height/2;}catch{}}
      const nw=w/scale,nh=h/scale;
      const left=Math.max(x,Math.min(x+w-nw,cx-nw/2)), top=Math.max(y,Math.min(y+h-nh,cy-nh/2));
      svg.setAttribute('viewBox',`${left} ${top} ${nw} ${nh}`);
    }
    function resetSelection(){
      current=null; for(const entry of shapes)entry.shape.setAttribute('aria-pressed','false');
      selection.textContent=tr('Choose a place to see its guide coverage.','Elige un lugar para ver sus guías disponibles.');action.hidden=true;clear.hidden=true;preview.textContent=''; if(details)details.hidden=true; if(guideList)guideList.replaceChildren();
    }
    function choose(entry){
      current=entry;for(const item of shapes)item.shape.setAttribute('aria-pressed',String(item===entry));
      selection.textContent=entry.label+' — '+countLabel(entry.count)+(entry.parent?' · '+entry.parent:'')+(entry.note?' · '+noteLabel(entry.note):'')+'. '+(entry.count?tr('Confirm service area with each provider.','Confirma el área de servicio con cada organización.'):tr('Assistance may still exist.','Aún podría haber ayuda disponible.'));
      action.href=entry.href; action.hidden=false;clear.hidden=false;entry.onChoose?.();
      if(details && guideList){const guides=entry.guides||[];details.hidden=!guides.length;guideList.replaceChildren(...guides.map(([id,label])=>{const li=document.createElement('li'),a=document.createElement('a');a.href='find-help.html?area='+encodeURIComponent(id);a.textContent=label;li.append(a);return li;}));}

    }
    function register(shape, data){
      const entry={shape,...data};shapes.push(entry);
      shape.setAttribute('role','button');shape.setAttribute('tabindex','0');shape.setAttribute('aria-label',entry.label+' — '+countLabel(entry.count));shape.setAttribute('aria-pressed','false');
      const show=()=>{preview.textContent=entry.label+' — '+countLabel(entry.count);};
      const hide=()=>{preview.textContent='';};
      shape.addEventListener('pointerenter',show);shape.addEventListener('pointerleave',hide);
      shape.addEventListener('focus',show);shape.addEventListener('blur',hide);
      shape.addEventListener('click',event=>{event?.preventDefault();choose(entry);});
      shape.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(entry);action.focus();}});
      return entry;
    }
    clear.onclick=()=>{const old=current;resetSelection();old?.shape.focus();};
    zoom.onclick=()=>{scale=scale===1?1.7:scale===1.7?2.5:2.5;viewBox();};
    reset.onclick=()=>{scale=1;viewBox();};
    resetSelection();const controls=byId(prefix+'-controls');if(controls)controls.hidden=false;
    return {register,choose,reset:resetSelection};
  }
  window.SSFMapUI={controller,countLabel,tr,spanish};
})();
