#!/usr/bin/env python3
"""All old gates plus Phase 6 offline gates; optional renderer is separate."""
import subprocess,sys,shlex
cmds=['python scripts/phase5-run.py final','node --check assets/sheet-pdf.js','node --check assets/phase6-privacy.js','node --check assets/site.js','node scripts/phase6-pdf.cjs','node scripts/phase6-controller.cjs','node scripts/phase6-privacy.cjs','node scripts/phase6-handout.cjs']
failed=[]
for c in cmds:
 print('\n$ '+c,flush=True);r=subprocess.run(shlex.split(c),stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);print(r.stdout,end='');print('EXIT',r.returncode,flush=True)
 if r.returncode:failed.append(c)
print(f'{len(cmds)-len(failed)}/{len(cmds)} command groups passed (30 prior + 7 new individual commands if all pass)',flush=True);sys.exit(bool(failed))
