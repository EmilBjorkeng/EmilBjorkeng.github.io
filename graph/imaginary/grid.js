import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

let gridHelperXZ = null;
let gridHelperXY = null;
const gridSize = 500;
const gridDivisions = gridSize;
const cellSize = gridSize / gridDivisions;
const halfGrid = gridSize / 2;
const gridOpacity = 0.3;

const axisLength = 100;
const axisWidth = 0.01;
let axes = [];
const axisOpacity = 0.3;

const labelSpacing = 1;
const labelCount = gridSize / 2;
let maxLabelDistance = 100;
const gridLabels = { x: [], y: [], z: [] };
const fontSize = 12;
let labelVisibility = true;

let isXYPlaneView = false;

function initializeGrid(scene, cutoffPlanes) {
    // Create XZ plane grid (horizontal)
    gridHelperXZ = new THREE.GridHelper(gridSize, gridDivisions, 0x444444, 0x444444);
    gridHelperXZ.material.clippingPlanes = cutoffPlanes;
    gridHelperXZ.material.transparent = true;
    gridHelperXZ.material.opacity = gridOpacity;
    scene.add(gridHelperXZ);

    // Create XY plane grid (vertical)
    gridHelperXY = new THREE.GridHelper(gridSize, gridDivisions, 0x444444, 0x444444);
    gridHelperXY.rotation.x = Math.PI / 2;
    gridHelperXY.material.clippingPlanes = cutoffPlanes;
    gridHelperXY.material.transparent = true;
    gridHelperXY.material.opacity = gridOpacity;
    scene.add(gridHelperXY);

    // Create axes
    function addAxis(Vx, Vy, Vz, color) {
        const direction = new THREE.Vector3(Vx, Vy, Vz);
        const length = direction.length();
        if (length === 0) return null;

        const geometry = new THREE.CylinderGeometry(axisWidth, axisWidth, length, 16);
        const material = new THREE.MeshBasicMaterial({
            color,
            clippingPlanes: cutoffPlanes,
            depthTest: true,
            depthWrite: true,
            transparent: true,
            opacity: axisOpacity
        });

        const axis = new THREE.Mesh(geometry, material);
        axis.position.copy(direction.clone().multiplyScalar(0.5));

        const yAxis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(yAxis, direction.clone().normalize());
        axis.setRotationFromQuaternion(quaternion);
        axis.renderOrder = 1;

        axes.push(axis);
        scene.add(axis);
    }

    addAxis(axisLength, 0, 0, 0xff0000); // X-axis (red)
    addAxis(0, axisLength, 0, 0x00ff00); // Y-axis (green)
    addAxis(0, 0, axisLength, 0x0000ff); // Z-axis (blue)

    // Create Labels
    function createLabel(text, color = '#ffffff') {
        const div = document.createElement('div');
        div.className = 'grid-label';
        div.textContent = text;
        div.style.color = color;
        div.style.fontSize = `${fontSize}px`;
        div.style.fontFamily = 'monospace';
        div.style.padding = '2px 4px';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        div.style.borderRadius = '3px';

        const label = new CSS2DObject(div);
        return label;
    }

    // X-axis labels (red)
    for (let i = 0; i < labelCount * 2 + 1; i++) {
        const label = createLabel('0', '#ff6b6b');
        gridLabels.x.push(label);
        scene.add(label);
    }

    // Y-axis labels (green)
    for (let i = 0; i < labelCount * 2 + 1; i++) {
        const label = createLabel('0', '#95e1d3');
        gridLabels.y.push(label);
        scene.add(label);
    }

    // Z-axis labels (blue)
    for (let i = 0; i < labelCount * 2 + 1; i++) {
        const label = createLabel('0', '#6c9fff');
        gridLabels.z.push(label);
        scene.add(label);
    }
}

function updateGridPositions(position_offset) {
    gridHelperXZ.position.x = Math.floor(position_offset.x / cellSize) * cellSize;
    gridHelperXZ.position.z = Math.floor(position_offset.z / cellSize) * cellSize;
    gridHelperXZ.position.y = 0;

    gridHelperXY.position.x = Math.floor(position_offset.x / cellSize) * cellSize;
    gridHelperXY.position.y = Math.floor(position_offset.y / cellSize) * cellSize;
    gridHelperXY.position.z = 0;
}

function updateAxesPositions(position_offset) {
    axes[0].position.x = position_offset.x;
    axes[1].position.y = position_offset.y;
    axes[2].position.z = position_offset.z;
}

function updateGridLabels(position_offset, cameraDistance, cameraPosition) {
    if (!labelVisibility) return;

    const xStart = Math.round(position_offset.x / labelSpacing) * labelSpacing;
    const yStart = Math.round(position_offset.y / labelSpacing) * labelSpacing;
    const zStart = Math.round(position_offset.z / labelSpacing) * labelSpacing;

    if (isXYPlaneView) {
        // X-axis labels
        for (let i = 0; i < gridLabels.x.length; i++) {
            const offset = (i - labelCount) * labelSpacing;
            const value = xStart + offset;
            const withinRange = Math.abs(value - position_offset.x) < maxLabelDistance;

            gridLabels.x[i].element.textContent = value.toString();
            gridLabels.x[i].position.set(value, position_offset.y, 0);
            gridLabels.x[i].visible = withinRange;

            gridLabels.x[i].element.style.fontSize = `${fontSize}px`;
        }

        // Y-axis labels
        for (let i = 0; i < gridLabels.y.length; i++) {
            const offset = (i - labelCount) * labelSpacing;
            const value = yStart + offset;
            const withinRange = Math.abs(value - position_offset.y) < maxLabelDistance;

            gridLabels.y[i].element.textContent = value.toString();
            gridLabels.y[i].position.set(position_offset.x, value, 0);
            gridLabels.y[i].visible = withinRange;

            gridLabels.y[i].element.style.fontSize = `${fontSize}px`;
        }

        // Hide Z-axis labels
        for (let i = 0; i < gridLabels.z.length; i++) {
            gridLabels.z[i].visible = false;
        }
    }
    else {
        function setFont(distanceToCamera) {
            const scaleFactor = 80 / Math.pow(distanceToCamera, 1.6);
            const newFontSize = Math.min(1, Math.max(0, scaleFactor)) * fontSize;

            return `${newFontSize}px`;
        }

        // Update X-axis labels
        for (let i = 0; i < gridLabels.x.length; i++) {
            const offset = (i - labelCount) * labelSpacing;
            const value = xStart + offset;
            const labelPos = new THREE.Vector3(value, 0, 0);

            const distanceToCamera = labelPos.distanceTo(cameraPosition);
            const withinClippingBounds = Math.abs(value - position_offset.x) < halfGrid;
            const visible = distanceToCamera < maxLabelDistance && withinClippingBounds;

            gridLabels.x[i].element.textContent = value.toString();
            gridLabels.x[i].position.set(value, 0, 0);
            gridLabels.x[i].visible = visible;
            gridLabels.x[i].element.style.opacity = Math.max(0, 100 / Math.pow(cameraDistance, 1.8));

            gridLabels.x[i].element.style.fontSize = setFont(distanceToCamera);
        }

        // Update Y-axis labels
        for (let i = 0; i < gridLabels.y.length; i++) {
            const offset = (i - labelCount) * labelSpacing;
            const value = yStart + offset;
            const labelPos = new THREE.Vector3(0, value, 0);

            const distanceToCamera = labelPos.distanceTo(cameraPosition);
            const withinClippingBounds = Math.abs(value - position_offset.y) < halfGrid;
            const visible = distanceToCamera < maxLabelDistance && withinClippingBounds;

            gridLabels.y[i].element.textContent = value.toString();
            gridLabels.y[i].position.set(0, value, 0);
            gridLabels.y[i].visible = visible;
            gridLabels.y[i].element.style.opacity = Math.max(0, 100 / Math.pow(cameraDistance, 1.8));

            gridLabels.y[i].element.style.fontSize = setFont(distanceToCamera);
        }

        // Update Z-axis labels
        for (let i = 0; i < gridLabels.z.length; i++) {
            const offset = (i - labelCount) * labelSpacing;
            const value = zStart + offset;
            const labelPos = new THREE.Vector3(0, 0, value);

            const distanceToCamera = labelPos.distanceTo(cameraPosition);
            const withinClippingBounds = Math.abs(value - position_offset.z) < halfGrid;
            const visible = distanceToCamera < maxLabelDistance && withinClippingBounds;

            gridLabels.z[i].element.textContent = value.toString();
            gridLabels.z[i].position.set(0, 0, value);
            gridLabels.z[i].visible = visible;
            gridLabels.z[i].element.style.opacity = Math.max(0, 100 / Math.pow(cameraDistance, 1.8));

            gridLabels.z[i].element.style.fontSize = setFont(distanceToCamera);
        }
    }
}
function getGridVisible() {
    return gridHelperXZ ? gridHelperXZ.visible : true;
}
function setGridVisible(visible) {
    if (gridHelperXZ) gridHelperXZ.visible = visible;
    if (gridHelperXY) gridHelperXY.visible = visible;
}

function getAxesVisible() {
    return axes.length > 0 ? axes[0].visible : true;
}
function setAxesVisible(visible) {
    axes.forEach(axis => {
        axis.visible = visible;
    });
}
function scaleAxes(scaleFactor) {
    axes.forEach(axis => {
        axis.scale.set(scaleFactor, scaleFactor, scaleFactor);
    });
}

function getLabelVisible() {
    return labelVisibility;
}
function setLabelVisible(visible) {
    if (!visible) {
        for (let i = 0; i < gridLabels.x.length; i++) {
            gridLabels.x[i].visible = false;
        }
        for (let i = 0; i < gridLabels.y.length; i++) {
            gridLabels.y[i].visible = false;
        }
        for (let i = 0; i < gridLabels.z.length; i++) {
            gridLabels.z[i].visible = false;
        }
    }
    labelVisibility = visible;
}
function getMaxLabelDistance() {
    return maxLabelDistance;
}
function setMaxLabelDistance(enabled) {
    maxLabelDistance = enabled;
}

function setXYPlaneView(enabled) {
    isXYPlaneView = enabled;
}

function getXYPlaneView() {
    return isXYPlaneView;
}

export {
    gridSize, cellSize, halfGrid,
    initializeGrid, updateGridPositions,
    updateAxesPositions, updateGridLabels,
    setGridVisible, setAxesVisible,
    getGridVisible, getAxesVisible, scaleAxes,
    getLabelVisible, setLabelVisible,
    setMaxLabelDistance, getMaxLabelDistance,
    setXYPlaneView, getXYPlaneView
};
