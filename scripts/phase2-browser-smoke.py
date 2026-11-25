#!/usr/bin/env python3
"""Optional offline local Chromium smoke; requires Playwright and Chromium."""
import os,tempfile,threading,functools
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
with tempfile.TemporaryDirectory() as tmp:
    Path(tmp,'ssf-demo').symlink_to(ROOT,target_is_directory=True)
    http=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp))
    threading.Thread(target=http.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{http.server_port}/ssf-demo/'
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],timeout=12000)
        print('Chromium',browser.version,flush=True)
        for width,height in [(1366,900),(390,844)]:
            ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
            ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
            page=ctx.new_page();page.set_default_timeout(5000)
            errors=[];requests=[];bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('request',lambda r:requests.append(r.url))
            page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
            def go(route):
                response=page.goto(base+route,wait_until='load');assert response.status==200
            def no_resources():
                assert not page.evaluate('Boolean(window.SSF_RESOURCE_AREAS)')
                assert not any(any(x in u for x in ['-resources.js','/resources.js','/expanded-editions.js']) for u in requests),requests
            go('index.html');assert page.evaluate('Object.keys(SSF_COVERAGE.guides).length')==106;no_resources()
            page.locator('[data-country-select]').select_option('GB');page.locator('[data-area-select]').select_option('london-enfield');page.locator('[data-area-open]').click();page.wait_for_url('**/find-help.html?area=london-enfield');assert page.evaluate('SSF_CURRENT_AREA.id')=='london-enfield';assert page.locator('[data-emergency-card]').get_attribute('href')=='tel:999'
            requests.clear();go('explore-map.html');assert page.locator('#map-guides li').count()==106;no_resources()
            page.locator('#map-country').select_option('US');page.locator('#state-links a[href*="state=GA"]').click();page.wait_for_url('**state=GA');page.locator('#county-links a[href*="county=13179"]').click();page.wait_for_url('**county=13179');assert page.locator('#map-guides li').count()==1
            page.reload(wait_until='load');assert page.locator('#map-guides a').get_attribute('href')=='find-help.html?area=liberty';page.go_back(wait_until='load');assert 'county=' not in page.url;page.go_forward(wait_until='load');assert 'county=13179' in page.url;no_resources()
            go('explore-map.html?country=GB');borough=page.locator('#borough-map [aria-label="Enfield"]');borough.wait_for();assert page.locator('#borough-map [aria-label]').count()==33;borough.focus();page.keyboard.press('Enter');assert page.locator('#map-open').get_attribute('href')=='find-help.html?area=london-enfield';page.reload(wait_until='load');borough.wait_for();no_resources()
            go('find-help.html?area=liberty');assert page.evaluate('SSF_CURRENT_AREA.id')=='liberty';assert page.locator('#resource-grid article').count()>0;page.reload(wait_until='load');assert page.evaluate('SSF_CURRENT_AREA.id')=='liberty'
            page.locator('#help-query').fill('cannot breathe');page.locator('#help-search').evaluate('(f)=>f.requestSubmit()');assert page.locator('#guide-answer').is_visible();assert '911' in page.locator('#guide-answer').inner_text()
            page.locator('input[data-sheet-key]').first.check();assert page.evaluate('JSON.parse(sessionStorage.getItem("ssf-print-selection-v1")).length')>=1;page.locator('#sheet-review').click();assert page.locator('#sheet-print').is_visible()
            go('discover.html?zip=31320');assert page.locator('#zip-result a[href*="area=liberty"]').count()>0;assert page.locator('#discovery-grid article').count()==13;page.reload(wait_until='load');assert page.locator('#discovery-grid article').count()==13
            go('404.html');page.get_by_role('link',name='Go to the homepage').click();page.wait_for_url('**/index.html')
            if width<500: page.locator('.menu-toggle').click()
            page.locator('[data-calm-toggle]').first.click();assert page.locator('html').get_attribute('data-calm')=='true';page.locator('[data-language-select]').first.select_option('es');assert page.locator('html').get_attribute('lang')=='es'
            assert not errors,errors;assert not bad,bad
            print(f'PASS {width}x{height}: picker; world/state/county refresh/history; London keyboard/refresh; directory urgent and handout; ZIP refresh; direct 404 recovery; Calm View and language; no full resource bundle on home/map; no page or HTTP errors',flush=True);ctx.close()
        ctx=browser.new_context(java_script_enabled=False);page=ctx.new_page();page.goto(base+'explore-map.html');assert page.locator('#map-guides a').count()==106;ctx.close();print('PASS no-JS guide list',flush=True)
        ctx=browser.new_context();ctx.route('**/coverage-index.js*',lambda r:r.abort());page=ctx.new_page();page.goto(base+'explore-map.html');assert page.locator('#map-guides a').count()==106;assert 'could not load' in page.locator('#map-status').inner_text();page.goto(base+'index.html');assert page.locator('#coverage-unavailable').is_visible();ctx.close();print('PASS blocked coverage index fallback',flush=True)
        browser.close()
    http.shutdown()
