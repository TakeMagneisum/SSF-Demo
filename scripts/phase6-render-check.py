"""Optional actual PDF rendering/QR check (PyMuPDF + OpenCV + NumPy). No browser.
Run node scripts/phase6-pdf.cjs <scratch-directory> first. No generated PDF is deployed."""
import collections,json,sys,re,unicodedata
from pathlib import Path
import fitz,cv2,numpy as np
root=Path(sys.argv[1]); total=0
norm=lambda text:re.sub(r'\s+','',unicodedata.normalize('NFC',text))
for name in ['single','large']:
    meta=json.loads((root/(name+'.json')).read_text()); doc=fitz.open(root/(name+'.pdf')); assert len(doc)==meta['pages']
    text=''.join(p.get_text() for p in doc); assert '\ufffd' not in text
    for entry in meta['sheet']['entries']:
        for value,_,*_ in entry['fields']:assert norm(value) in norm(text),(name,value)
    expected=[e['url'] for e in meta['sheet']['entries']];credit=meta['sheet']['credit']
    if credit:expected.append(credit['url'])
    decoded=[]
    for i,page in enumerate(doc):
        for block in page.get_text('blocks'):
            assert 30<=block[0] and block[2]<=582 and 20<=block[1] and block[3]<=765,(i,block[:4])
        pix=page.get_pixmap(matrix=fitz.Matrix(3,3),clip=fitz.Rect(480,0,580,792)); im=np.frombuffer(pix.samples,dtype=np.uint8).reshape(pix.height,pix.width,pix.n)
        ok,values,_,_=cv2.QRCodeDetector().detectAndDecodeMulti(cv2.cvtColor(im,cv2.COLOR_RGB2GRAY));decoded+=list(values) if ok else []
        page.get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(root/f'{name}-{i+1}.png')
    assert collections.Counter(decoded)==collections.Counter(expected),(decoded,expected)
    total+=len(decoded);print(f'{name}: {len(doc)} rendered pages, {len(decoded)} QR targets decoded exactly; source field text and bounds passed')
print(f'{total} QR symbols decoded across actual generated PDFs; no native print/device scan claim.')
