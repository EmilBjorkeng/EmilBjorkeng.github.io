import { complexMult, complexify, sqrt, nRoot, pow } from './mathUtils.js';

window.complexMult = complexMult;
window.complexify = complexify;
window.sqrt = sqrt;
window.nRoot = nRoot;
window.pow = pow;

import { animate } from './render.js';
import { calculateGraph } from './graph.js';
import { inputText } from './ui.js';
import './events.js';

animate();
calculateGraph(inputText, true);