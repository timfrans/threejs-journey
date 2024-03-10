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

const CONTEXT = 3;

const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    power: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
}

gui.add(parameters, 'count').min(500).max(1000000).step(100)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    });

gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.add(parameters, 'radius').min(0.01).max(20).step(0.01)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.add(parameters, 'branches').min(2).max(20).step(1)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.add(parameters, 'spin').min(-5).max(5).step(0.1)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.add(parameters, 'randomness').min(0).max(2).step(0.001)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.add(parameters, 'power').min(0).max(10).step(0.01)
    .onFinishChange(() => {
        cleanup();
        generateGalaxy();
    })

gui.addColor(parameters, 'insideColor').onFinishChange(() => {
    cleanup();
    generateGalaxy();
});
gui.addColor(parameters, 'outsideColor').onFinishChange(() => {
    cleanup();
    generateGalaxy();
});


let particleGeometry;
let particleMaterial;
let particles;

function cleanup() {
    if(particles !== null) {
        particleGeometry.dispose();
        particleMaterial.dispose();
        scene.remove(particles);
    }
}

function generateGalaxy() {
    particleGeometry = new THREE.BufferGeometry();
    particleMaterial = new THREE.PointsMaterial({
        color: '#ffffff',
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });
    const positions = new Float32Array(parameters.count * CONTEXT)
    const colors = new Float32Array(parameters.count * CONTEXT)

    const innerColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        /**
         * calculate a normalized fraction of a full circle per branch
         */
        const branchAngle = (i % parameters.branches) / parameters.branches * 2 * Math.PI;

        const radius = Math.random() * parameters.radius;

        const spinAngle = radius * parameters.spin;

        const randomX = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.power) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = innerColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

    }

    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles);
}

generateGalaxy();

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
camera.position.x = 3
camera.position.y = 3
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

    particles.rotation.y = elapsedTime * Math.PI * 2 / 10;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()