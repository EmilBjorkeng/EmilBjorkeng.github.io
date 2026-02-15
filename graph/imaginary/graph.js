import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { transpile } from './tokenize.js';
import { complexify } from './mathUtils.js';
import { scene, position_offset, cutoffPlanes } from './render.js';
import { gridSize } from './grid.js';

let graphLine = null;
let updatePoint = gridSize;
let graphResolution = 100;

const graphWidth = 2;

function calculateGraph(inputText, force = false) {
    if (!inputText || inputText.trim() === '') {
        if (graphLine) {
            scene.remove(graphLine);
            graphLine = null;
        }
        return;
    }

    // Update graph in segments
    if (!(Math.abs(updatePoint - position_offset.x) > gridSize / 2) && !force) return;
    updatePoint = position_offset.x;

    try {
        const funcText = `complexify(${transpile(inputText)})`;
        const func = new Function('x', `return ${funcText};`);

        const points = [];
        const xMin = -gridSize + position_offset.x;
        const xMax = gridSize + position_offset.x;
        const step = 1 / graphResolution;

        for (let x = xMin; x <= xMax; x += step) {
            const z = func(x);
            if (!isFinite(x) || !isFinite(z[0]) || !isFinite(z[1])) continue;
            points.push(new THREE.Vector3(x, z[0], z[1]));
        }

        if (graphLine) {
            graphLine.geometry.setFromPoints(points);
            graphLine.geometry.attributes.position.needsUpdate = true;
        }
        else {
            const geometry = new LineGeometry();

            const positions = [];
            for (const point of points) {
                positions.push(point.x, point.y, point.z);
            }
            geometry.setPositions(positions);

            const material = new LineMaterial({
                color: 0xffffff,
                linewidth: graphWidth,
                clippingPlanes: cutoffPlanes,
                worldUnits: false
            });

            material.resolution.set(window.innerWidth, window.innerHeight);
            graphLine = new Line2(geometry, material);
            graphLine.renderOrder = 2;

            scene.add(graphLine);
        }
    }
    catch (error) {
        console.error('Error graphing function:', error.message);

        if (graphLine) {
            scene.remove(graphLine);
            graphLine = null;
        }
    }
}

function setGraphResolution(resolution) {
    graphResolution = resolution;
}

function updateLineResolution(width, height) {
    if (graphLine && graphLine.material) {
        graphLine.material.resolution.set(width, height);
    }
}

export { calculateGraph, setGraphResolution, updateLineResolution };
