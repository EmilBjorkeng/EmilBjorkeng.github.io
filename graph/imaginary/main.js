import {
    complexify,
    cadd, csub, cmul, cdiv,
    csqrt, csin, ccos, ctan,
    csinh, ccosh, ctanh,
    cexp, clog, c10log, cabs,
    cpow, cnroot
} from './mathUtils.js';

window.complexify = complexify;

window.cadd = cadd;
window.csub = csub;
window.cmul = cmul;
window.cdiv = cdiv;

window.csqrt = csqrt;
window.csin = csin;
window.ccos = ccos;
window.ctan = ctan;

window.csinh = csinh;
window.ccosh = ccosh;
window.ctanh = ctanh;

window.cexp = cexp;
window.clog = clog;
window.c10log = c10log;
window.cabs = cabs;

window.cpow = cpow;
window.cnroot = cnroot;

import { animate } from './render.js';
import { calculateGraph } from './graph.js';
import { inputText } from './ui.js';
import './events.js';

animate();
calculateGraph(inputText, true);