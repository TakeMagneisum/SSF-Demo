import subprocess,sys,shlex
cmds=['python scripts/phase1-data-baseline.py','node scripts/validate-data.js','node scripts/validate-explore-map.cjs','python validate-guides.py','python scripts/validate-demo-links.py --strict-legacy','node scripts/phase2-data.cjs','node scripts/phase2-picker.cjs','python scripts/phase2-http-smoke.py','python scripts/phase3-nav.py','node scripts/phase3-postal.cjs','node scripts/phase3-region-search.cjs','node scripts/phase3-interactions.cjs','python scripts/phase3-http-smoke.py','python scripts/phase4-template.py','node scripts/phase4-preferences.cjs','node scripts/phase4-handout.cjs','python scripts/phase4-contrast.py']+['node --check assets/'+x+'.js' for x in ['phase4-preferences','handout','phase3-map-ui','phase3-home','explore-map','i18n','calm']]
if len(sys.argv)>1: cmds += ['node --check assets/guide.js','node --check assets/phase5-vocabulary.js','node scripts/phase5-finder.cjs','node --check assets/phase5-prep.js','node scripts/phase5-prep.cjs','python scripts/phase5-http-smoke.py']
failed=[]
for c in cmds:
 print('\n$ '+c,flush=True); r=subprocess.run(shlex.split(c),stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True); print(r.stdout,end='');print('EXIT',r.returncode,flush=True)
 if r.returncode:failed.append(c)
print(f'{len(cmds)-len(failed)}/{len(cmds)} passed',flush=True);sys.exit(bool(failed))
