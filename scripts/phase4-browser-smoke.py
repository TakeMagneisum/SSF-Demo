#!/usr/bin/env python3
"""Optional browser test for permitted local installations. No restriction bypass."""
import os,tempfile,threading,functools
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
with tempfile.TemporaryDirectory() as tmp:
 Path(tmp,'ssf-demo').symlink_to(ROOT,target_is_directory=True)
 with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp)) as http:
  threading.Thread(target=http.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{http.server_port}/ssf-demo/'
  try:
   with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],timeout=12000)
    print('Chromium',browser.version,flush=True)
    for width,height in [(1366,900),(320,640),(390,844),(844,390)]:
     ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=width<500,color_scheme='dark',reduced_motion='reduce')
     ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
     page=ctx.new_page();page.set_default_timeout(5000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
     def go(route):
      response=page.goto(base+route,wait_until='load');assert response.status==200
     def root(name):return page.locator('html').get_attribute('data-ssf-'+name)
     def reflow():assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'),(width,page.url)
     go('index.html');assert root('theme')=='dark';assert root('motion')=='reduced';reflow();assert not page.evaluate('Boolean(window.SSF_RESOURCE_AREAS)')
     page.locator('[data-ssf-preference=appearance]').select_option('light');assert root('theme')=='light'
     page.locator('.ssf-display summary').click();page.locator('[data-ssf-preference=text]').select_option('larger');page.locator('[data-ssf-preference=spacing]').select_option('relaxed');page.locator('[data-ssf-preference=contrast]').select_option('high');page.locator('[data-ssf-preference=density]').select_option('compact');reflow()
     page.locator('[data-ssf-pref-close]').focus();page.keyboard.press('Escape');assert page.locator('.ssf-display details').get_attribute('open') is None;assert page.locator('.ssf-display summary').evaluate('(e)=>document.activeElement===e')
     for route in ['explore-map.html?country=US&state=GA&county=13179','explore-map.html?country=GB','find-help.html?area=liberty','discover.html?zip=31320','learn/cpr/','before-you-travel.html','support/','privacy-policy/','404.html']:
      go(route);assert root('text')=='larger' and root('theme')=='light';reflow();page.reload(wait_until='load');assert root('text')=='larger'
     go('index.html');page.locator('.ssf-display summary').click();page.locator('[data-ssf-pref-reset]').click();assert root('text')=='standard';assert root('theme')=='dark';page.locator('[data-ssf-pref-close]').click()
     if width<1100:
      page.locator('.menu-toggle').click();assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='true';page.keyboard.press('Escape');assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
     page.emulate_media(forced_colors='active');assert page.evaluate("matchMedia('(forced-colors: active)').matches");reflow()
     assert not errors,errors;print(f'PASS {width}x{height}: theme/OS motion, controls, keyboard, large text/reflow, direct routes/refresh, forced colors',flush=True);ctx.close()
    ctx=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':640});page=ctx.new_page();page.goto(base+'explore-map.html');assert page.locator('[data-ssf-display]').is_hidden();assert page.locator('#map-guides a').count()==106;assert page.locator('[data-ssf-nav] a').first.is_visible();ctx.close();print('PASS no-JS navigation and guide fallback')
    browser.close()
  finally:http.shutdown()
