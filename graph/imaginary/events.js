import * as THREE from "three";
import { renderer, labelRenderer, camera, rotation, position_offset, cameraState } from './render.js';
import { calculateGraph, updateLineResolution  } from './graph.js';
import { gridSize, scaleAxes, setXYPlaneView } from './grid.js';

let isDragging = false;
let shiftHeld = false;
let previousMousePosition = { x: 0, y: 0 };

// Set in ui.js
let getInputText = () => '';
function setInputTextGetter(getter) {
    getInputText = getter;
}

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button != 0 && e.button != 2) return;
    isDragging = true;
    shiftHeld = e.shiftKey || e.button == 2; // Shift and Right click
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', (e) => {
    if (e.button != 0 && e.button != 2) return;
    isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    if (shiftHeld) {
        // ROTATE mode when shift is held
        rotation.y -= deltaX * 0.01;
        rotation.x += deltaY * 0.01;
        // Clamp vertical rotation to prevent flipping
        rotation.x = Math.max(-(Math.PI / 2 - 0.1), Math.min(Math.PI / 2 - 0.1, rotation.x));
        setXYPlaneView(false);
    }
    else {
        // PAN mode when shift is not held
        const panSpeed = cameraState.distance * 0.002;

        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        const absX = Math.abs(cameraDirection.x);
        const absY = Math.abs(cameraDirection.y);
        const absZ = Math.abs(cameraDirection.z);

        if (absY > absX && absY > absZ) {
            // Camera looking mostly along Y axis - pan in XZ plane
            const cosY = Math.cos(rotation.y);
            const sinY = Math.sin(rotation.y);

            const rightX = cosY;
            const rightZ = -sinY;

            const forwardSign = cameraDirection.y > 0 ? -1 : 1;
            const forwardX = sinY * forwardSign;
            const forwardZ = cosY * forwardSign;

            position_offset.x -= (rightX * deltaX + forwardX * deltaY) * panSpeed;
            position_offset.z -= (rightZ * deltaX + forwardZ * deltaY) * panSpeed;
        } else if (absX > absZ) {
            // Camera looking mostly along X axis - pan in YZ plane
            const cosY = Math.cos(rotation.y);
            const sinY = Math.sin(rotation.y);
            const cosX = Math.cos(rotation.x);
            const sinX = Math.sin(rotation.x);

            const rightZ = sinY;
            const upY = cosX;
            const upZ = cosY * sinX;

            position_offset.y += upY * deltaY * panSpeed;
            position_offset.z += (rightZ * deltaX + upZ * deltaY) * panSpeed;
        } else {
            // Camera looking mostly along Z axis - pan in XY plane
            const cosY = Math.cos(rotation.y);
            const sinY = Math.sin(rotation.y);
            const cosX = Math.cos(rotation.x);

            const rightX = cosY;
            const upX = -sinY * Math.sin(rotation.x);
            const upY = cosX;

            position_offset.x -= (rightX * deltaX + upX * deltaY) * panSpeed;
            position_offset.y += upY * deltaY * panSpeed;
        }

        calculateGraph(getInputText());
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomSpeed = cameraState.distance * 0.1;
    const newDistance = cameraState.distance + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed);

    // Clamp zoom distance
    if (newDistance > 0.5 && newDistance < gridSize * 0.6) {
        cameraState.distance = newDistance;

        const scaleFactor = cameraState.distance / 10;
        scaleAxes(scaleFactor);
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);

    updateLineResolution(window.innerWidth, window.innerHeight);
});

export { setInputTextGetter };
