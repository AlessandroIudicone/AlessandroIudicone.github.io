import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
	animateFrame,
	createScene,
	moveCamera,
	STAR_COUNT,
	STAR_FIELD_SIZE,
} from './scene.js';

// Empty textures: in the browser they come from TextureLoader
const textures = {
	space: new THREE.Texture(),
	adVaporam: new THREE.Texture(),
	moon: new THREE.Texture(),
	normal: new THREE.Texture(),
};

const build = () => createScene({ aspect: 16 / 9, textures });

describe('createScene', () => {
	it('adds torus, lights, stars, avatar and moon to the scene', () => {
		const { scene, torus, stars, adVaporam, moon } = build();

		expect(stars).toHaveLength(STAR_COUNT);
		for (const object of [torus, adVaporam, moon, ...stars]) {
			expect(object.parent).toBe(scene);
		}
		expect(scene.children.filter((object) => object.isLight)).toHaveLength(2);
		// torus + 2 lights + stars + avatar + moon
		expect(scene.children).toHaveLength(STAR_COUNT + 5);
	});

	it('uses the textures for background, avatar and moon', () => {
		const { scene, adVaporam, moon } = build();

		expect(scene.background).toBe(textures.space);
		expect(adVaporam.material.map).toBe(textures.adVaporam);
		expect(moon.material.map).toBe(textures.moon);
		expect(moon.material.normalMap).toBe(textures.normal);
	});

	it('places camera, avatar and moon where the scroll animation expects them', () => {
		const { camera, adVaporam, moon } = build();

		expect(camera.aspect).toBeCloseTo(16 / 9);
		expect(camera.position.toArray()).toEqual([-3, 0, 30]);
		expect(adVaporam.position.toArray()).toEqual([2, 0, -5]);
		expect(moon.position.toArray()).toEqual([-10, 0, 30]);
	});

	it('scatters the stars at random inside the star field', () => {
		const { stars } = build();
		const half = STAR_FIELD_SIZE / 2;

		for (const { position } of stars) {
			for (const coordinate of position.toArray()) {
				expect(Math.abs(coordinate)).toBeLessThanOrEqual(half);
			}
		}
		const distinctPositions = new Set(stars.map(({ position }) => position.toArray().join()));
		expect(distinctPositions.size).toBe(STAR_COUNT);
	});
});

describe('moveCamera', () => {
	it('keeps the camera at the origin at the top of the page', () => {
		const world = build();

		moveCamera(world, 0);

		expect(world.camera.position.x).toBeCloseTo(0);
		expect(world.camera.position.z).toBeCloseTo(0);
		expect(world.camera.rotation.y).toBeCloseTo(0);
	});

	it('moves the camera forward while scrolling down', () => {
		const world = build();

		moveCamera(world, -1000); // 1000px below the top

		expect(world.camera.position.z).toBeCloseTo(10);
		expect(world.camera.position.x).toBeCloseTo(0.2);
		expect(world.camera.rotation.y).toBeCloseTo(0.2);
	});

	it('spins moon and avatar a bit at every scroll event', () => {
		const world = build();

		moveCamera(world, 0);
		moveCamera(world, -10);

		expect(world.moon.rotation.toArray().slice(0, 3)).toEqual([
			expect.closeTo(0.1),
			expect.closeTo(0.15),
			expect.closeTo(0.1),
		]);
		expect(world.adVaporam.rotation.y).toBeCloseTo(0.02);
		expect(world.adVaporam.rotation.z).toBeCloseTo(0.02);
	});
});

describe('animateFrame', () => {
	it('rotates torus and moon at every frame', () => {
		const world = build();

		for (let frame = 0; frame < 100; frame++) {
			animateFrame(world);
		}

		expect(world.torus.rotation.x).toBeCloseTo(1);
		expect(world.torus.rotation.y).toBeCloseTo(0.5);
		expect(world.torus.rotation.z).toBeCloseTo(1);
		expect(world.moon.rotation.x).toBeCloseTo(0.5);
	});
});
