import * as THREE from 'three';

export const STAR_COUNT = 200;
export const STAR_FIELD_SIZE = 100;

/**
 * Builds the 3D world: camera, torus, lights, stars, background, avatar and
 * moon. It doesn't touch the DOM or WebGL, and textures are passed in, so the
 * scene can be built and tested outside the browser too.
 */
export function createScene({ aspect, textures }) {
	// Setup

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.setZ(30);
	camera.position.setX(-3);

	// Torus

	const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
	const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
	const torus = new THREE.Mesh(geometry, material);

	scene.add(torus);

	// Lights

	const pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(5, 5, 5);

	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(pointLight, ambientLight);

	// Helpers

	// const lightHelper = new THREE.PointLightHelper(pointLight);
	// const gridHelper = new THREE.GridHelper(200, 50);
	// scene.add(lightHelper, gridHelper);

	// Stars

	const stars = Array.from({ length: STAR_COUNT }, createStar);
	scene.add(...stars);

	// Background

	scene.background = textures.space;

	// Avatar

	const adVaporam = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshBasicMaterial({ map: textures.adVaporam }),
	);

	scene.add(adVaporam);

	// Moon

	const moon = new THREE.Mesh(
		new THREE.SphereGeometry(3, 32, 32),
		new THREE.MeshStandardMaterial({
			map: textures.moon,
			normalMap: textures.normal,
		})
	);

	scene.add(moon);

	moon.position.z = 30;
	moon.position.setX(-10);

	adVaporam.position.z = -5;
	adVaporam.position.x = 2;

	return { scene, camera, torus, stars, adVaporam, moon };
}

export function createStar() {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(STAR_FIELD_SIZE));

	star.position.set(x, y, z);
	return star;
}

// Scroll Animation

/**
 * Moves the camera through the scene as the page scrolls.
 * `top` is `document.body.getBoundingClientRect().top`: 0 at the top of the
 * page, negative while scrolling down.
 */
export function moveCamera({ camera, moon, adVaporam }, top) {
	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	adVaporam.rotation.y += 0.01;
	adVaporam.rotation.z += 0.01;

	camera.position.z = top * -0.01;
	camera.position.x = top * -0.0002;
	camera.rotation.y = top * -0.0002;
}

// Animation Loop

/** Advances the animation by one frame. */
export function animateFrame({ torus, moon }) {
	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	moon.rotation.x += 0.005;
}
