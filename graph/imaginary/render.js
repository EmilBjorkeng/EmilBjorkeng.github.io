import * as THREE from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import {
    gridSize, cellSize, halfGrid,
    initializeGrid, updateGridPositions,
    updateAxesPositions, updateGridLabels
} from './grid.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

let rotation = { x: 0.5, y: 0 };
let position_offset = { x: 0, y: 0, z: 0 };

const FOV = 80;
const nearClipPlane = 0.1;
const farClipPlane = gridSize * 1.5;
const cameraState = { distance: 10 };

const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, nearClipPlane, farClipPlane);
camera.position.set(0, 0, cameraState.distance);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
renderer.localClippingEnabled = true;

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // Do not block mouse events
document.getElementById('canvas-container').appendChild(labelRenderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const cutoffPlanes = [
    new THREE.Plane(new THREE.Vector3( 1,  0,  0), halfGrid),
    new THREE.Plane(new THREE.Vector3(-1,  0,  0), halfGrid),
    new THREE.Plane(new THREE.Vector3( 0,  1,  0), halfGrid),
    new THREE.Plane(new THREE.Vector3( 0, -1,  0), halfGrid),
    new THREE.Plane(new THREE.Vector3( 0,  0,  1), halfGrid),
    new THREE.Plane(new THREE.Vector3( 0,  0, -1), halfGrid),
];

initializeGrid(scene, cutoffPlanes);

// Center dot
const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const centerDot = new THREE.Mesh(dotGeometry, dotMaterial);
scene.add(centerDot);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    camera.position.x = position_offset.x + cameraState.distance * Math.sin(rotation.y) * Math.cos(rotation.x);
    camera.position.y = position_offset.y + cameraState.distance * Math.sin(rotation.x);
    camera.position.z = position_offset.z + cameraState.distance * Math.cos(rotation.y) * Math.cos(rotation.x);

    camera.lookAt(position_offset.x, position_offset.y, position_offset.z);

    scene.rotation.x = 0;
    scene.rotation.y = 0;
    scene.position.set(0, 0, 0);

    // Center the cutoff box
    cutoffPlanes[0].constant = -(position_offset.x) + halfGrid;
    cutoffPlanes[1].constant = (position_offset.x) + halfGrid;
    cutoffPlanes[2].constant = -(position_offset.y) + halfGrid;
    cutoffPlanes[3].constant = (position_offset.y) + halfGrid;
    cutoffPlanes[4].constant = -(position_offset.z) + halfGrid;
    cutoffPlanes[5].constant = (position_offset.z) + halfGrid;

    updateGridPositions(position_offset); // Infinite Grid
    updateAxesPositions(position_offset); // Infinite Axes

    // Center the center dot
    centerDot.position.x = position_offset.x;
    centerDot.position.y = position_offset.y;
    centerDot.position.z = position_offset.z;

    updateGridLabels(position_offset, cameraState.distance, camera.position);

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

export {
    scene, renderer, labelRenderer,
    camera, cameraState,
    rotation, position_offset,
    centerDot, cutoffPlanes,
    animate
};
