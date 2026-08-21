import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as fs from 'fs';
import * as path from 'path';

// Node.js FileReader polyfill for GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  };
}



const outputDir = path.join(process.cwd(), 'public', 'models', 'ocean');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const exporter = new GLTFExporter();

async function exportGLB(scene, filename) {
  const gltf = await exporter.parseAsync(scene, { binary: true });
  const filePath = path.join(outputDir, filename);
  const buffer = Buffer.from(gltf);
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Exported ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return { filename, size: buffer.length };
}


// ─────────────────────────────────────────────────────────────
// 1. Realistic Tropical Fish (Clownfish)
// ─────────────────────────────────────────────────────────────
function buildTropicalFish() {
  const root = new THREE.Group();
  root.name = 'TropicalFish';

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#FF6F00',
    roughness: 0.28,
    metalness: 0.08,
  });

  const stripeMat = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.32,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  const finMat = new THREE.MeshStandardMaterial({
    color: '#FF7D1A',
    roughness: 0.4,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });

  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.1 });
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: '#111111' });

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.35, 18, 14);
  bodyGeo.scale(1.5, 0.9, 0.48);
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = 'FishBody';
  root.add(bodyMesh);

  // White Stripes
  const stripe1Geo = new THREE.SphereGeometry(0.35, 16, 12);
  stripe1Geo.scale(0.18, 0.92, 0.5);
  const stripe1 = new THREE.Mesh(stripe1Geo, stripeMat);
  stripe1.position.set(0.04, 0, 0);
  root.add(stripe1);

  const stripe2Geo = new THREE.SphereGeometry(0.35, 16, 12);
  stripe2Geo.scale(0.14, 0.85, 0.46);
  const stripe2 = new THREE.Mesh(stripe2Geo, stripeMat);
  stripe2.position.set(0.24, 0, 0);
  root.add(stripe2);

  // Dorsal fin
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(-0.25, 0);
  dorsalShape.quadraticCurveTo(-0.08, 0.28, 0.18, 0.22);
  dorsalShape.quadraticCurveTo(0.28, 0.06, 0.22, 0);
  dorsalShape.closePath();
  const dorsalGeo = new THREE.ShapeGeometry(dorsalShape);
  const dorsalMesh = new THREE.Mesh(dorsalGeo, finMat);
  dorsalMesh.position.set(-0.05, 0.22, 0);
  dorsalMesh.name = 'DorsalFin';
  root.add(dorsalMesh);

  // Tail (Caudal) fin
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.quadraticCurveTo(0.26, 0.26, 0.4, 0.35);
  tailShape.quadraticCurveTo(0.3, 0, 0.4, -0.35);
  tailShape.quadraticCurveTo(0.26, -0.26, 0, 0);
  const tailGeo = new THREE.ShapeGeometry(tailShape);
  tailGeo.scale(0.85, 0.85, 0.85);
  const tailMesh = new THREE.Mesh(tailGeo, finMat);
  tailMesh.position.set(-0.68, 0, 0);
  tailMesh.rotation.set(0, Math.PI, 0);
  tailMesh.name = 'TailFin';
  root.add(tailMesh);

  // Pectoral Fins (Left & Right)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.quadraticCurveTo(0.12, 0.14, 0.22, 0.05);
  finShape.quadraticCurveTo(0.14, -0.09, 0, 0);
  const finGeo = new THREE.ShapeGeometry(finShape);

  const leftFin = new THREE.Mesh(finGeo, finMat);
  leftFin.position.set(0.14, -0.04, 0.15);
  leftFin.rotation.set(0.2, 0.35, -0.25);
  leftFin.name = 'LeftFin';
  root.add(leftFin);

  const rightFin = new THREE.Mesh(finGeo, finMat);
  rightFin.position.set(0.14, -0.04, -0.15);
  rightFin.rotation.set(-0.2, -0.35, 0.25);
  rightFin.name = 'RightFin';
  root.add(rightFin);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.055, 8, 8);
  const pupilGeo = new THREE.SphereGeometry(0.03, 8, 8);

  const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  leftEye.position.set(0.3, 0.07, 0.13);
  const leftPupil = new THREE.Mesh(pupilGeo, eyePupilMat);
  leftPupil.position.set(0.33, 0.07, 0.15);
  root.add(leftEye, leftPupil);

  const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  rightEye.position.set(0.3, 0.07, -0.13);
  const rightPupil = new THREE.Mesh(pupilGeo, eyePupilMat);
  rightPupil.position.set(0.33, 0.07, -0.15);
  root.add(rightEye, rightPupil);

  return root;
}

// ─────────────────────────────────────────────────────────────
// 2. Realistic Coral Formation
// ─────────────────────────────────────────────────────────────
function buildCoralFormation() {
  const root = new THREE.Group();
  root.name = 'CoralFormation';

  const staghornMat = new THREE.MeshStandardMaterial({
    color: '#FF6E40',
    roughness: 0.7,
    metalness: 0.08,
  });

  const plateMat = new THREE.MeshStandardMaterial({
    color: '#8E24AA',
    roughness: 0.65,
    metalness: 0.1,
  });

  const baseMat = new THREE.MeshStandardMaterial({
    color: '#1A334B',
    roughness: 0.85,
    flatShading: true,
  });

  // Base rock
  const baseRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), baseMat);
  baseRock.scale.set(1.4, 0.6, 1.2);
  baseRock.position.set(0, 0.15, 0);
  root.add(baseRock);

  // Staghorn branch stems
  const stemGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.6, 6);
  stemGeo.translate(0, 0.3, 0);

  const mainStem = new THREE.Mesh(stemGeo, staghornMat);
  mainStem.position.set(0, 0.3, 0);
  root.add(mainStem);

  const branch1 = new THREE.Mesh(stemGeo, staghornMat);
  branch1.position.set(0, 0.55, 0);
  branch1.rotation.set(0.1, 0, 0.45);
  branch1.scale.set(0.85, 0.8, 0.85);
  root.add(branch1);

  const branch2 = new THREE.Mesh(stemGeo, staghornMat);
  branch2.position.set(0, 0.5, 0);
  branch2.rotation.set(0.3, 0.4, -0.5);
  branch2.scale.set(0.9, 0.85, 0.9);
  root.add(branch2);

  const branch3 = new THREE.Mesh(stemGeo, staghornMat);
  branch3.position.set(0, 0.6, 0);
  branch3.rotation.set(-0.35, 0.2, 0.2);
  branch3.scale.set(0.75, 0.7, 0.75);
  root.add(branch3);

  // Plate Coral shelf
  const plateStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.35, 6), plateMat);
  plateStem.position.set(0.4, 0.3, 0.2);
  root.add(plateStem);

  const plateTop = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.05, 8), plateMat);
  plateTop.position.set(0.4, 0.5, 0.2);
  plateTop.rotation.set(0.08, 0.2, -0.1);
  root.add(plateTop);

  const plateLower = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.04, 8), plateMat);
  plateLower.position.set(0.55, 0.38, 0.28);
  plateLower.rotation.set(-0.1, 0.3, 0.12);
  root.add(plateLower);

  return root;
}

// ─────────────────────────────────────────────────────────────
// 3. Realistic Ocean Rock
// ─────────────────────────────────────────────────────────────
function buildOceanRock() {
  const root = new THREE.Group();
  root.name = 'OceanRock';

  const rockMat = new THREE.MeshStandardMaterial({
    color: '#17304A',
    roughness: 0.88,
    metalness: 0.08,
    flatShading: true,
  });

  const mainRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), rockMat);
  mainRock.scale.set(1.5, 1.0, 1.2);
  mainRock.position.set(0, 0.45, 0);
  mainRock.rotation.set(0.15, 0.4, 0.1);
  root.add(mainRock);

  const subRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), rockMat);
  subRock.scale.set(1.1, 0.7, 0.9);
  subRock.position.set(0.8, 0.25, 0.3);
  subRock.rotation.set(0.3, -0.2, 0.1);
  root.add(subRock);

  return root;
}

async function main() {
  console.log('📦 Generating optimized CC0 3D ocean models...');

  const fishScene = new THREE.Scene();
  fishScene.add(buildTropicalFish());
  await exportGLB(fishScene, 'tropical_fish.glb');

  const coralScene = new THREE.Scene();
  coralScene.add(buildCoralFormation());
  await exportGLB(coralScene, 'coral_formation.glb');

  const rockScene = new THREE.Scene();
  rockScene.add(buildOceanRock());
  await exportGLB(rockScene, 'ocean_rock.glb');

  console.log('✨ All 3 initial assets generated and optimized successfully!');
}

main().catch((err) => console.error(err));
