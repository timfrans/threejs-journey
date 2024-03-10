import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => console.log('loading started');
loadingManager.onLoad = () => console.log('loading completed');
loadingManager.onError = () => console.log('loading error');

const textureLoader = new THREE.TextureLoader(loadingManager);
// collor
const albedo = textureLoader.load('/textures/minecraft.png');
albedo.colorSpace = THREE.SRGBColorSpace;
// no mipmapping needed with nearest filter on minFilter
albedo.generateMipmaps = false;
albedo.minFilter = THREE.NearestFilter;
// nearest filter maps a texture more sharp on a geometry -- better performance
albedo.magFilter = THREE.NearestFilter;

// what is shown - color
const alpha = textureLoader.load('/textures/door/alpha.jpg');
// create fake shadows
const ambientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg');
// add height to geometry using texture - requires higher amount of vertices
const height = textureLoader.load('/textures/door/height.jpg');
// adds details without requiring extra vertices - better performance
const normal = textureLoader.load('/textures/door/normal.jpg');
// shiny
const metalness = textureLoader.load('/textures/door/metalness.jpg');
// grainy
const roughness = textureLoader.load('/textures/door/roughness.jpg');

// sets the repeat width of texture
// albedo.repeat.x = 2;
// sets the repeat height of texture
// albedo.repeat.y = 3;
// configures repeat method for x axis
// albedo.wrapS = THREE.MirroredRepeatWrapping;
// configures repeat method for y axis
// albedo.wrapT = THREE.MirroredRepeatWrapping;

// albedo.offset.x = 0.5;
// albedo.offset.y = 0.5;

albedo.rotation = Math.PI * .5;
// default this is left bottom corner in 2d space
albedo.center = new THREE.Vector2(.5, .5)


// native js way to load textures as an image
// const textureImage = new Image();
// const texture = new THREE.Texture(textureImage);
// texture.colorSpace = THREE.SRGBColorSpace;

// textureImage.onload = () => {
//     texture.needsUpdate = true;   
// }

// textureImage.src = '/textures/door/color.jpg'

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({ map: albedo })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()