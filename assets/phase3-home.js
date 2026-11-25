(function(){
  'use strict';
  const get=id=>document.getElementById(id);
  const data=window.SSFWorldOverview, coverage=window.SSF_COVERAGE, ui=window.SSFMapUI;
  const tr=(en,es)=>ui?.tr?ui.tr(en,es):en;
  const count=n=>ui?.countLabel?ui.countLabel(n):n+' published local guides';
  const status=get('home-map-status'), input=get('home-country-search'), results=get('home-country-results');
  if(!coverage){status.textContent=tr("Guide coverage could not load. Browse the complete guide list instead.","No se pudo cargar la cobertura de las guías. Consulta la lista completa de guías.");return;}
  const svg=get('home-world-svg');
  const countries={...(data?.islandNames||{}),...Object.fromEntries(Object.entries(data?.places||{}).map(([code,p])=>[code,p.name]))};
  for(const code of Object.keys(coverage.countries)) if(!countries[code]) countries[code]=new Intl.DisplayNames(['en'],{type:'region',fallback:'code'}).of(code);
  const ns='http://www.w3.org/2000/svg', path=value=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',value);return p;};
  const url=code=>'explore-map.html?country='+encodeURIComponent(code);
  if(data && ui){
  const controller=ui.controller('home-map',svg,[0,0,900,365]);
  if(data.background)svg.append(path(data.background));
  for(const [code,p] of Object.entries(data.places)){
    const link=document.createElementNS(ns,'a'), href=code==='PR'?'explore-map.html?region=caribbean':url(code), count=coverage.countries[code]?.length||0;
    link.setAttribute('href',href);link.setAttribute('class',count?'has-guides':'no-guides');
    controller.register(link,{label:p.name,count,href,guides:(coverage.countries[code]||[]).map(id=>[id,coverage.guides[id].label])});link.append(path(p.path));svg.append(link);
  }
  svg.hidden=false;svg.removeAttribute('hidden');get('home-map-controls').hidden=false;status.textContent=tr("Select a country or territory on the map, or use the place search.","Selecciona un país o territorio en el mapa o usa la búsqueda de lugares.");
  }else status.textContent=tr("Map geometry or interaction could not load. Search available guide countries or browse the complete guide list instead.","No se pudo cargar el mapa interactivo. Busca países con guías disponibles o consulta la lista completa.");
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function search(){
    const q=normalize(input.value), rows=[];
    for(const [code,name] of Object.entries(countries).sort((a,b)=>a[1].localeCompare(b[1])))if(q?normalize(name+' '+code).includes(q):coverage.countries[code]?.length)rows.push([name,url(code),count(coverage.countries[code]?.length||0)]);
    const regionIndex=window.SSF_REGION_SEARCH;
    if(q && regionIndex){
      for(const [code,name] of Object.entries(regionIndex.states))if(normalize(name).includes(q)||normalize(code)===q)rows.push([name+', United States','explore-map.html?country=US&state='+code,count(coverage.regions['US:'+code]?.length||0)]);
      for(const [code,name] of Object.entries(regionIndex.counties))if(normalize(name+' county').includes(q))rows.push([name+' County, Georgia','explore-map.html?country=US&state=GA&county='+code,tr("County map","Mapa del condado")]);
    }
    if(q)for(const [id,g] of Object.entries(coverage.guides))if(normalize(g.label+' '+g.state+' '+g.stateCode).includes(q))rows.push([g.label,'find-help.html?area='+encodeURIComponent(id),tr("Local guide","Guía local")]);
    results.replaceChildren(...rows.slice(0,24).map(([label,href,description])=>{const li=document.createElement('li'),a=document.createElement('a'),small=document.createElement('small');a.href=href;a.textContent=label;small.textContent=description;li.append(a,small);return li;}));
    get('home-country-status').textContent=rows.length?(rows.length>24?tr(`${rows.length} starting points; showing the first 24. Refine your search for more specific matches.`,`${rows.length} puntos de partida; se muestran los primeros 24. Afina tu búsqueda.`):tr(`${rows.length} starting points`,`${rows.length} puntos de partida`)):tr("No matching places. Try a broader name or browse types of help.","No se encontraron lugares. Prueba un nombre más general o explora los tipos de ayuda.");
  }
  input.disabled=false;input.addEventListener('input',search);search();
})();
