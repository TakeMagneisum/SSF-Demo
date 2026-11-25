#!/usr/bin/env python3
"""Regression suite. Independent urgent review is a separate intentionally failing release gate."""
import subprocess,sys,shlex
cmds=['python scripts/phase6-run.py','python scripts/phase6-http-smoke.py','python scripts/phase7-legacy.py','python scripts/phase7-http.py','node --check assets/discovery.js','node scripts/phase7-share.cjs','python scripts/phase7-source.py']
failed=[]
for c in cmds:
 print('\n$ '+c,flush=True);r=subprocess.run(shlex.split(c),stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);print(r.stdout,end='');print('EXIT',r.returncode,flush=True)
 if r.returncode:failed.append(c)
print(f'{len(cmds)-len(failed)}/{len(cmds)} command groups passed (38 prior + 5 new checks if all pass). Release gate is separate: node scripts/phase7-urgent-review.cjs',flush=True);sys.exit(bool(failed))
