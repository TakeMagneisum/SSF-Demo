'use strict';
// Independent synthetic release probes, not public content. Do not loosen baselines or edit frozen classifier.
require('../assets/urgent.js');
const probes=[['I cannot breathe and need groceries','emergency'],['I want to die and need rent help','suicide'],['domestic violence and a ride','violence'],['no puedo respirar y comida','emergency'],['groceries and rent','ordinary'],['I feel unsafe at home','violence'],['I do not have chest pain','ordinary'],['suicide prevention training','ordinary'],['my baby stopped breathing','emergency'],['my friend is choking','emergency'],['I am having a stroke','emergency']];
let failures=0;for(const [q,expected] of probes){const observed=global.SSF_URGENT_INTENT(q)||'ordinary';const pass=observed===expected;failures+=!pass;console.log(JSON.stringify({synthetic:q,expected,observed,result:pass?'match':'OPEN safety review'}));}
console.log(`${probes.length-failures}/${probes.length} independent probes matched; ${failures} open classification discrepancies. No source/target edits. This is NOT a medical triage classifier or a population accuracy study.`);process.exitCode=failures?2:0;
