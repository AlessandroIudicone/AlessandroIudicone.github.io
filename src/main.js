import './style.css';
import AD_VAPORAM from './assets/AD_VAPORAM.png';
import MOON_TEXTURE from './assets/moon.jpg';
import NORMAL_BACKGROUND from './assets/normal.jpg';
import SPACE_BACKGROUND from './assets/space.jpg';
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { animateFrame, createScene, moveCamera } from './scene.js';

// Browser wiring: renderer, textures, scroll and animation loop.
// What is in the scene and how it moves lives in scene.js.

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();

const world = createScene({
	aspect: window.innerWidth / window.innerHeight,
	textures: {
		space: textureLoader.load(SPACE_BACKGROUND),
		adVaporam: textureLoader.load(AD_VAPORAM),
		moon: textureLoader.load(MOON_TEXTURE),
		normal: textureLoader.load(NORMAL_BACKGROUND),
	},
});

// const controls = new OrbitControls(world.camera, renderer.domElement);

// Scroll Animation

function onScroll() {
	moveCamera(world, document.body.getBoundingClientRect().top);
}

document.body.onscroll = onScroll;
onScroll();

// Animation Loop

function animate() {
	requestAnimationFrame(animate);

	animateFrame(world);

	// controls.update();

	renderer.render(world.scene, world.camera);
}

animate();
