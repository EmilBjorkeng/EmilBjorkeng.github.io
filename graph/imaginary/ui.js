import { rotation, position_offset, cameraState, centerDot } from './render.js';
import { setGridVisible, setAxesVisible, scaleAxes, setLabelVisible, setMaxLabelDistance, setXYPlaneView } from './grid.js';
import { calculateGraph, setGraphResolution } from './graph.js';
import { setInputTextGetter } from './events.js';

// View buttons
document.getElementById('resetViewBtn').addEventListener('click', (e) => {
    rotation.x = 0.5;
    rotation.y = 0;
    position_offset.x = 0;
    position_offset.y = 0;
    position_offset.z = 0;
    setXYPlaneView(false);

    cameraState.distance = 10;
    const scaleFactor = cameraState.distance / 10;
    scaleAxes(scaleFactor);
});

document.getElementById('xyPlaneViewBtn').addEventListener('click', (e) => {
    rotation.x = 0;
    rotation.y = 0;
    setXYPlaneView(true);
});

// Function input
const functionInput = document.getElementById('functionInput');
let inputText = functionInput.value;

functionInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        inputText = functionInput.value;
        calculateGraph(inputText, true);
    }
});

// For event.js
setInputTextGetter(() => functionInput.value);

// Sliders
const graphResolutionSlider = document.getElementById('graphResolutionSlider');
const graphResolutionValue = document.getElementById('graphResolutionValue');

graphResolutionSlider.addEventListener('input', (e) => {
    graphResolutionValue.textContent = graphResolutionSlider.value;
    setGraphResolution(graphResolutionSlider.value);
});
graphResolutionValue.textContent = graphResolutionSlider.value;
setGraphResolution(graphResolutionSlider.value);

graphResolutionSlider.addEventListener('change', (e) => {
    calculateGraph(inputText, true);
});

const labelRangeSlider = document.getElementById('labelRangeSlider');
const labelRangeValue = document.getElementById('labelRangeValue');

labelRangeSlider.addEventListener('input', (e) => {
    labelRangeValue.textContent = labelRangeSlider.value;
    setMaxLabelDistance(labelRangeSlider.value);
});
labelRangeValue.textContent = labelRangeSlider.value;
setMaxLabelDistance(labelRangeSlider.value);

// Checkboxes
const showGridBox = document.getElementById('showGridBox');
function updateGridVisablility() {
    setGridVisible(showGridBox.checked);
}
showGridBox.addEventListener('change', updateGridVisablility);
updateGridVisablility();

const showAxesBox = document.getElementById('showAxesBox');
function updateAxesVisablility() {
    setAxesVisible(showAxesBox.checked);
}
showAxesBox.addEventListener('change', updateAxesVisablility);
updateAxesVisablility();

const showCenterDotBox = document.getElementById('showCenterDotBox');
function updateCenterDotVisablility() {
    centerDot.visible = showCenterDotBox.checked;
}
showCenterDotBox.addEventListener('change', updateCenterDotVisablility);
updateCenterDotVisablility();

const showLabelsBox = document.getElementById('showLabelsBox');
function updateLabelsVisablility() {
    setLabelVisible(showLabelsBox.checked);
}
showLabelsBox.addEventListener('change', updateLabelsVisablility);
updateLabelsVisablility();

export { inputText };
