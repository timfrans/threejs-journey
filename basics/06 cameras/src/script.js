import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const cursor = {
    x: 0,
    y: 0
}

// Sizes
const sizes = {
    width: 800,
    height: 600
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - .5;
    cursor.y = e.clientY / sizes.height - .5;
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
/**
 * PerspectiveCamera renders everything using a square
 * this could result in deformation of rendered objects
 * using a calculated aspectRatio we can multiple this with one of the 2 axis (horizonal or vertical)
 * the axis we have to use is the horizontal because:
 * when we have a vertical axis of 2 and an aspect ratio of 4/3 we have a horizontal axis of 2 * 4/3
 * this results in a horizontal axis of 2.66 -- we fixed the perspective deformation
*/
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, .1, 100);
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
// makes moving the camera smoother
controls.enableDamping = true;


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // camera.position.x = -cursor.x * 10;
    // camera.position.y = cursor.y * 10;
    // camera.lookAt(mesh.position)

    // camera.position.x = Math.sin(cursor.x * 2 * Math.PI) * 3;
    // camera.position.z = Math.cos(cursor.x * 2 * Math.PI) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);

    // to make damping work we need to update controls each render
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()