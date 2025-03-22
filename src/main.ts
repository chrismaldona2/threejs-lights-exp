import "./style.css";
import * as THREE from "three";
import {
  OrbitControls,
  RectAreaLightHelper,
} from "three/examples/jsm/Addons.js";
import { toggleFullscreen } from "./fullscreen";
import GUI from "lil-gui";

document.getElementById("app")!.innerHTML = `<canvas id="canvas"/>`;

const gui = new GUI({ title: "Lights", closeFolders: true });

//
// SETUP
//
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

//
// scene
//
const canvas = document.getElementById("canvas")!;
const scene = new THREE.Scene();

//
// camera
//
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(3, 2, 6);
scene.add(camera);

//
// renderer
//
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;

const render = () => {
  renderer.render(scene, camera);
};

//
// orbit controls
//
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//
// objects
//
const material = new THREE.MeshStandardMaterial({
  roughness: 0.5,
});

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial()
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1), material);
ring.position.set(0, 1, -2);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
sphere.position.set(2, 1, -2);
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1), material);
box.position.set(-2, 1, -2);
scene.add(floor, ring, sphere, box);

ring.castShadow = true;
sphere.castShadow = true;
box.castShadow = true;

//
// LIGHTS
//
//
// ambient light
//
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const ambientLightTweaks = gui.addFolder("Ambient Light");
ambientLightTweaks.addColor(ambientLight, "color").name("Color");
ambientLightTweaks
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("Intensity");

//
// directional light
//
const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
const directionalLightTweaks = gui.addFolder("Directional light");
directionalLightTweaks.addColor(directionalLight, "color").name("Color");
directionalLightTweaks
  .add(directionalLight, "intensity")
  .min(0)
  .max(2)
  .step(0.001)
  .name("Intensity");
directionalLightTweaks.add(directionalLight, "castShadow").name("Cast shadow");
const directionalLightPosition = directionalLightTweaks.addFolder("Position");
directionalLightPosition.add(directionalLight.position, "x").min(-20).max(20);
directionalLightPosition.add(directionalLight.position, "y").min(0).max(10);
directionalLightPosition.add(directionalLight.position, "z").min(-20).max(20);

//
// hemisphere light
//
const hemisphereLight = new THREE.HemisphereLight(0x00ffcc, 0x34e830, 0);
const hemisphereLightTweaks = gui.addFolder("Hemisphere Light");
hemisphereLightTweaks.addColor(hemisphereLight, "color").name("Color");
hemisphereLightTweaks
  .addColor(hemisphereLight, "groundColor")
  .name("Ground color");
hemisphereLightTweaks
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("Intensity");

//
// point light
//
const pointLight = new THREE.PointLight(0xffffff, 0);
pointLight.position.set(0, 2.25, 1);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
const pointLightTweaks = gui.addFolder("Point light");
pointLightTweaks.addColor(pointLight, "color").name("Color");
pointLightTweaks
  .add(pointLight, "intensity")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Intensity");
pointLightTweaks
  .add(pointLight, "distance")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Distance");
pointLightTweaks
  .add(pointLight, "decay")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Decay");
pointLightTweaks.add(pointLight, "castShadow").name("Cast shadow");
const pointLightPosition = pointLightTweaks.addFolder("Position");
pointLightPosition.add(pointLight.position, "x").min(-20).max(20);
pointLightPosition.add(pointLight.position, "y").min(0).max(10);
pointLightPosition.add(pointLight.position, "z").min(-20).max(20);

//
// rect area light
//
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0, 10, 10);
rectAreaLight.position.z = -5;
rectAreaLight.rotation.y = Math.PI;
const rectAreaLightTweaks = gui.addFolder("Rect Area light");
rectAreaLightTweaks.addColor(rectAreaLight, "color").name("Color");
rectAreaLightTweaks
  .add(rectAreaLight, "intensity")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Intensity");
rectAreaLightTweaks
  .add(rectAreaLight, "width")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Width");
rectAreaLightTweaks
  .add(rectAreaLight, "height")
  .min(0)
  .max(20)
  .step(0.01)
  .name("Height");

const rectAreaLightMethods = {
  lookAtRing: () => rectAreaLight.lookAt(ring.position),
  lookAtSphere: () => rectAreaLight.lookAt(sphere.position),
  lookAtBox: () => rectAreaLight.lookAt(box.position),
  lookAtCenter: () => rectAreaLight.lookAt(new THREE.Vector3()),
};
rectAreaLightTweaks
  .add(rectAreaLightMethods, "lookAtRing")
  .name("Look at ring");
rectAreaLightTweaks
  .add(rectAreaLightMethods, "lookAtSphere")
  .name("Look at sphere");
rectAreaLightTweaks.add(rectAreaLightMethods, "lookAtBox").name("Look at box");
rectAreaLightTweaks
  .add(rectAreaLightMethods, "lookAtCenter")
  .name("Look at center");

const rectAreaLightPosition = rectAreaLightTweaks.addFolder("Position");
rectAreaLightPosition.add(rectAreaLight.position, "x").min(-20).max(20);
rectAreaLightPosition.add(rectAreaLight.position, "y").min(0).max(10);
rectAreaLightPosition.add(rectAreaLight.position, "z").min(-20).max(20);

//
// spot light
//
const spotLight = new THREE.SpotLight(0x2ff1f4, 5, 7.8, Math.PI * 0.25, 0.4, 1);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.position.set(-0.6, 0.5, 3);
spotLight.target.position.set(0.5, 0, -10);
const spotLightTweaks = gui.addFolder("Spot light");
spotLightTweaks.open();
spotLightTweaks.addColor(spotLight, "color").name("Color");
spotLightTweaks
  .add(spotLight, "intensity")
  .min(0)
  .max(20)
  .step(0.1)
  .name("Intensity");
spotLightTweaks
  .add(spotLight, "distance")
  .min(0)
  .max(20)
  .step(0.1)
  .name("Distance");
spotLightTweaks
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("Angle");
spotLightTweaks
  .add(spotLight, "penumbra")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Penumbra");
spotLightTweaks.add(spotLight, "decay").min(0).max(8).step(0.01).name("Decay");
spotLightTweaks.add(spotLight, "castShadow").name("Cast shadow");
const spotLightPosition = spotLightTweaks.addFolder("Position");
spotLightPosition.add(spotLight.position, "x").min(-10).max(10).step(0.1);
spotLightPosition.add(spotLight.position, "y").min(0).max(5).step(0.1);
spotLightPosition.add(spotLight.position, "z").min(-10).max(10).step(0.1);
const spotLightTarget = spotLightTweaks.addFolder("Target");
spotLightTarget.add(spotLight.target.position, "x").min(-10).max(10).step(0.1);
spotLightTarget.add(spotLight.target.position, "y").min(0).max(5).step(0.1);
spotLightTarget.add(spotLight.target.position, "z").min(-10).max(10).step(0.1);

scene.add(
  ambientLight,
  directionalLight,
  hemisphereLight,
  pointLight,
  rectAreaLight,
  spotLight,
  spotLight.target
);

//
// light helpers
//
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.25
);
hemisphereLightHelper.visible = false;
hemisphereLightTweaks.add(hemisphereLightHelper, "visible").name("Show helper");
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.25
);
directionalLightHelper.visible = false;
directionalLightTweaks
  .add(directionalLightHelper, "visible")
  .name("Show helper");
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.25);
pointLightHelper.visible = false;
pointLightTweaks.add(pointLightHelper, "visible").name("Show helper");
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
spotLightTweaks.add(spotLightHelper, "visible").name("Show helper");
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
rectAreaLightTweaks.add(rectAreaLightHelper, "visible").name("Show helper");

scene.add(
  hemisphereLightHelper,
  directionalLightHelper,
  pointLightHelper,
  spotLightHelper,
  rectAreaLightHelper
);

//
// animation
//
const lookAtRing = () => {
  controls.target.copy(ring.position);
  controls.update();
};
lookAtRing();

const clock = new THREE.Clock();
const tick = () => {
  window.requestAnimationFrame(tick);
  ring.rotation.y = (clock.getElapsedTime() * Math.PI) / 2;
  box.rotation.z = (clock.getElapsedTime() * Math.PI) / 2;
  sphere.position.x = 2 + Math.cos(clock.getElapsedTime()) * 0.4;
  sphere.position.z = -2 + Math.sin(clock.getElapsedTime()) * 0.4;

  if (spotLightHelper.visible) spotLightHelper.update();

  controls.update();
  render();
};
tick();

//
// fullscreen
//
renderer.domElement.addEventListener("dblclick", () =>
  toggleFullscreen(renderer.domElement)
);
window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "f":
      toggleFullscreen(renderer.domElement);
  }
});
