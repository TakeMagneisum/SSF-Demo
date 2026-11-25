/* Build from the public text and QR symbols already displayed in the preview. */
async function buildSheetPDF(sheet) {
  if (!sheet.entries.length) throw Error("empty sheet");
  const P = window.PDFLib, assets = window.SSFPdfAssets;
  const doc = await P.PDFDocument.load(assets.template);
  const fonts = doc.getPage(0).node.Resources().lookup(P.PDFName.of("Font"));
  doc.removePage(0);
  doc.setTitle(sheet.title);
  doc.setAuthor("Single Step Forward");
  doc.setSubject("Public resource information; confirm directly with providers.");
  let page, y;
  const margin = 40, width = 532;
  const bodySize = sheet.large ? 14 : 11;
  function newPage() {
    page = doc.addPage([612, 792]);
    page.node.set(P.PDFName.of("Resources"), doc.context.obj({Font: fonts}));
    y = 752;
  }
  function glyph(c) {
    const value = assets.chars[c];
    if (!value) throw Error("Unsupported print character");
    return value;
  }
  function lines(text, size, limit) {
    const result = [];
    let line = "", used = 0;
    for (const word of text.normalize("NFC").trim().split(/\s+/)) {
      const wordWidth = Array.from(word).reduce((n,c) => n + glyph(c)[2]*size/1000, 0);
      if (line && used + glyph(" ")[2]*size/1000 + wordWidth > limit) {result.push(line); line=""; used=0;}
      if (line) {line+=" "; used+=glyph(" ")[2]*size/1000;}
      for (const c of word) {
        const advance = glyph(c)[2]*size/1000;
        if (line && used+advance>limit) {result.push(line);line="";used=0;}
        line+=c;used+=advance;
      }
    }
    if (line) result.push(line);
    return result;
  }
  function write(line,size,url) {
    if (y-size < margin) newPage();
    const ops=[P.beginText(),P.moveText(margin,y-size)];
    let font="", bytes="",length=0;
    const flush=()=>{if(bytes) ops.push(P.showText(P.PDFHexString.of(bytes)));bytes="";};
    for (const c of line) {
      const [name,code,w]=glyph(c);
      if(font!==name){flush();ops.push(P.setFontAndSize(P.PDFName.of(name),size));font=name;}
      bytes+=code.toString(16).padStart(2,"0");length+=w*size/1000;
    }
    flush();page.pushOperators(...ops,P.endText());
    if(url) page.node.addAnnot(doc.context.register(doc.context.obj({Type:"Annot",Subtype:"Link",Rect:[margin,y-size-2,margin+length,y+1],Border:[0,0,0],A:{S:"URI",URI:P.PDFString.of(new URL(url).href)}})));
    y-=size+3;
  }
  function symbol(url,x,top) {
    const qr=new window.SSFQrEncoder(0,0);qr.addData(new URL(url).href);qr.make();
    const n=qr.getModuleCount(),step=82/(n+8);
    for(let row=0;row<n;row++) for(let col=0;col<n;col++) {
      if(!qr.isDark(row,col)) continue;
      let end=col+1;while(end<n && qr.isDark(row,end))end++;
      page.drawRectangle({color:P.rgb(0,0,0),x:x+(4+col)*step,y:top-(5+row)*step,width:(end-col)*step,height:step});col=end-1;
    }
  }
  newPage();for(const line of lines(sheet.title,sheet.large?24:20,width))write(line,sheet.large?24:20);
  for(const paragraph of sheet.intro){for(const l of lines(paragraph,bodySize,width))write(l,bodySize);y-=4;}
  for(const entry of sheet.entries){
    const rows=[];
    for(const [value,size,url] of entry.fields) for(const line of lines(value,size,width-98)) rows.push([line,size,url]);
    const height=Math.max(82,rows.reduce((n,r)=>n+r[1]+3,0))+18;
    if(y<margin+Math.min(height,710))newPage();
    page.drawLine({start:{x:margin,y},end:{x:572,y},thickness:.6});y-=7;
    const top=y;const first=page;
    symbol(entry.url,490,top);
    for(const row of rows)write(...row);
    if(page===first)y=Math.min(y,top-82);
    y-=12;
  }
  if(sheet.credit){
    if(y<margin+90)newPage();
    const img=await doc.embedPng(assets.dawn);
    page.drawImage(img,{x:442,y:y-33,width:33,height:33});
    symbol(sheet.credit.url,490,y);
    for(const line of lines(sheet.credit.title,bodySize,380))write(line,bodySize);
    for(const line of lines(sheet.credit.url,bodySize,380))write(line,bodySize,sheet.credit.url);
  }
  return doc.save();
}

(function () {
  const byId=id=>document.getElementById(id);
  const preview=byId("sheet-preview"), items=byId("sheet-items"), result=byId("pdf-result");
  const generate=byId("sheet-pdf"), status=byId("pdf-status"), share=byId("pdf-share");
  if (!preview || !items || !result || !generate || !status || !share) return;
  const assetRoot = new URL("./", document.currentScript.src);
  const large = byId("sheet-large");
  let revision=0, blobURL="", file=null;
  const pending = new Map();
  function reset() {
    revision++;
    if(blobURL) URL.revokeObjectURL(blobURL);
    blobURL="";file=null;result.hidden=true;status.textContent="";generate.disabled=false;
    for(const id of ["pdf-open","pdf-save"])byId(id).removeAttribute("href");
    byId("pdf-count").textContent=items.childElementCount+" "+(items.childElementCount===1?"resource selected":"resources selected");
  }
  new MutationObserver(reset).observe(items,{childList:true});
  byId("sheet-credit").addEventListener("change",reset);
  large.addEventListener("change", reset);
  window.addEventListener("pagehide", reset);
  function load(name, path) {
    if (window[name]) return Promise.resolve();
    if (pending.has(name)) return pending.get(name);
    const promise = new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      const finish = (ok) => {
        clearTimeout(timer);
        script.onload=script.onerror=null;
        if(ok && window[name]) resolve();
        else {script.remove();reject(Error("asset unavailable"));}
      };
      const timer=setTimeout(()=>finish(false),20000);
      script.src=new URL(path,assetRoot).href;
      script.onload=()=>finish(true);script.onerror=()=>finish(false);
      document.head.append(script);
    }).finally(()=>pending.delete(name));
    pending.set(name,promise);
    return promise;
  }
  function snapshot() {
    return {
      title:byId("sheet-title").textContent,
      large:large.checked,
      intro:Array.from(preview.querySelectorAll(":scope > p"),p=>p.textContent),
      entries:Array.from(items.children,article=>{
        const details=article.firstElementChild, url=details.querySelector("a").href;
        return {url,fields:Array.from(details.querySelectorAll("h2,p,a"),node=>[node.textContent,node.tagName==="H2"?(large.checked?18:14):(large.checked?14:11),node.tagName==="A"?url:null])};
      }),
      credit:byId("sheet-credit").checked?{title:byId("sheet-source").querySelector("strong").textContent,url:byId("sheet-source").querySelector("a").href}:null
    };
  }
  generate.addEventListener("click",async()=>{
    reset();
    if(!items.childElementCount){status.textContent="Select at least one resource first.";return;}
    const current=revision;
    generate.disabled=true;status.textContent="Preparing your PDF…";
    try {
      await Promise.all([
        load("PDFLib", "vendor/pdf-lib.min.js"),
        load("SSFPdfAssets", "vendor/sheet-font.js")
      ]);
      if(revision!==current)return;
      const bytes=await buildSheetPDF(snapshot());
      if(revision!==current)return;
      const blob=new Blob([bytes],{type:"application/pdf"});
      blobURL=URL.createObjectURL(blob);
      byId("pdf-open").href=byId("pdf-save").href=blobURL;
      share.hidden=true;
      if(typeof File==="function" && navigator.share && navigator.canShare){
        file=new File([blob],"Resource-sheet.pdf",{type:blob.type});
        try{share.hidden=!navigator.canShare({files:[file]});}catch{share.hidden=true;}
      }
      result.hidden=false;status.textContent="Your PDF is ready. Open it to read or print, or save a copy.";
      byId("pdf-open").focus();
    }catch{if(current===revision)status.textContent="Could not create the PDF. Try Get PDF directly again, or use Print or your browser’s Share menu.";}
    finally{if(current===revision)generate.disabled=false;}
  });
  share.addEventListener("click",async()=>{
    if (!file || result.hidden) return;
    const current=revision;
    try{await navigator.share({files:[file]});}catch(error){if(current===revision && error.name!=="AbortError")status.textContent="Sharing is unavailable. Choose Open PDF or Save PDF instead.";}
  });

})();
