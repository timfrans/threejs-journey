import * as THREE from 'three'
import gsap from '  ';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const group = new THREE.Group();
group.position.set(1, .5, 1);
// group.rotation.x = .5 * Math.PI;
scene.add(group);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube);

const axisHelper = new THREE.AxesHelper(2);
group.add(axisHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(group.position);

scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const clock = new THREE.Clock();

gsap.to(group.position, {y: 2, duration: 1, delay: 1})
gsap.to(group.position, {y: 0, duration: 1, delay: 2})

function tick() {
    const elapsedTime = clock.getElapsedTime();

    // group.rotation.y = elapsedTime * Math.PI * 2; // 160 degree rotation each second

    // result is mesh positioning in circle
    // group.position.y = Math.sin(elapsedTime); // elapsed time is used as rotation in raidans
    // group.position.x = Math.cos(elapsedTime); // elapsed time is used as rotation in raidans

    camera.lookAt(group.position);
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();