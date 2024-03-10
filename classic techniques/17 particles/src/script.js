import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png');


const randomPointsGeometry = new THREE.BufferGeometry();
const VERTICES_COUNT = 20000;
const vertices = new Float32Array(VERTICES_COUNT * 3);

const MIN_POS = -10;
const MAX_POS = 10;

const colors = new Float32Array(VERTICES_COUNT * 3);


for (let i = 0; i < VERTICES_COUNT * 3; i++) {
    vertices[i] = (Math.random() * (MAX_POS - MIN_POS + 1)) + MIN_POS
    colors[i] = Math.random();
}

randomPointsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
randomPointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleMaterial = new THREE.PointsMaterial({
    // color: '#ff88cc',
    alphaMap: particleTexture,
    transparent: true,
    size: 0.1,
    sizeAttenuation: true, // creates perspective for a particle
    // alphaTest: 0.001 // when in an alpha map a part should not be rendered, because alpha is 1, this pixel is still rendered and causes problems
    // this is solved using alpha test to describe which part ofa texture should not be rendered depending on the alpha value of a texture

    // depthTest: false // the gpu will determine which particle is in front of others
    // this could create cool extra dimension effects, but for realistic cases might be hard
    // this mostly is a solution when you do not have any different geometries blocking particles
    // and all the particles are colored the same

    depthWrite: false, // info about particle their depth won't we written into memory
    // this fixes issues the particles blocked by other geometries are still rendered.

    blending: THREE.AdditiveBlending, // this way colors are added when they are on top of each other

    vertexColors: true
})

const particles = new THREE.Points(randomPointsGeometry, particleMaterial);

scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // particles.rotation.y = elapsedTime * .2;

    // this way of updating geometries is areally hit on performance
    // custom shaders is a solution for this.
    for (let i = 0; i < VERTICES_COUNT; i++) {
        const i3 = i * 3;

        const x = randomPointsGeometry.attributes.position.array[i3];
        randomPointsGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }

    randomPointsGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()