import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

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
 * Lights
 */
// with ambient light, light is added to each mesh in all directions
// because directional light will bounce off all meshes the process of calculating light bounces take a hit on performance
// the bouncing of light can be repoduced by using ambient light which is less of a performance hit
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.01).name('Ambient Light Intensity');

// directional lights will target the center of the scene by default
// each light ray goes from the position of the light to the center
const directionalLight = new THREE.DirectionalLight(0x00fffc, .9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight)

// hemisphere light is a light that has two colors
// the first color is the color emitted from the top of the scene
// the second color is the color emitted from the bottom of the scene
// a mix of these 2 colors are mixed in the middle of meshes
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight)

// infinite small point of light which spreads out light beams in all directions
// we can control to which distance meshes are affected by the light
// decay controls how fast the light fades away
const pointLight = new THREE.PointLight(0xff9000, 1.5);
pointLight.position.set(1, 0, 1);
pointLight.distance = 10;
pointLight.decay = 1;
scene.add(pointLight);

// think about photoshoots where they use a big rectangular shaped light
// we get a diffused effect with this light
// this only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(0,0,0);
scene.add(rectAreaLight)

// to move the direction of the spotlight we need to add the target of the spotlight to the scene
// after this we can update the position of the target and the spotlight will point to it
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * .1, 0.1, 1);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -1.5;
scene.add(spotLight.target);
// spotLight.lookAt(new THREE.Vector3())
scene.add(spotLight);

const hemispherLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemispherLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper); 

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()