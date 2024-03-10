import * as THREE from 'three'
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

const loader = new THREE.TextureLoader();

const alpha = loader.load('/textures/door/alpha.jpg');
const ambientOcclusion = loader.load('/textures/door/ambientOcclusion.jpg');
const albedo = loader.load('/textures/door/color.jpg');
albedo.colorSpace = THREE.SRGBColorSpace;

const height = loader.load('/textures/door/height.jpg');
const metalness = loader.load('/textures/door/metalness.jpg');
const normal = loader.load('/textures/door/normal.jpg');
const roughness = loader.load('/textures/door/roughness.jpg');

const matcap1 = loader.load('/textures/matcaps/8.png');
matcap1.colorSpace = THREE.SRGBColorSpace;

const gradient1 = loader.load('/textures/gradients/3.jpg');

const envMapLoader = new RGBELoader();
const envMap = await envMapLoader.loadAsync('/textures/environmentMap/2k.hdr')
envMap.mapping = THREE.EquirectangularReflectionMapping;

scene.background = envMap;
scene.environment = envMap;

// const material = new THREE.MeshBasicMaterial({
//     map: albedo,
//     transparent: true,
//     alphaMap: alpha,
//     side: THREE.DoubleSide
// })

// used to tell the renderer which side of a geometry is the outside
// this info is used to render lightning for example correctly
// const material = new THREE.MeshNormalMaterial({
//     normalMap: normal,
//     flatShading: true
// });

// pixels of the texture are placed on the geometry
// when texture contains some shading this will mimic lightning
// you loose a sence of depth, because the texture is flat
// const material = new THREE.MeshMatcapMaterial({
//     matcap: matcap1
// });

// used for rendering logic for depth
// mostly used internally
// const material = new THREE.MeshDepthMaterial();

// material which takes light into account
// is most performant, but hard to get realistic results with it in big scenes
// some weird patterns could occur with this material
// const material = new THREE.MeshLambertMaterial();

// weird patterns are avoided with this material
// const material = new THREE.MeshPhongMaterial({
//     shininess: 100,
//     specular: new THREE.Color(0x1188ff)
// });

// this gradient contains 3 shades used for shadowing
// gradient1.magFilter = THREE.NearestFilter;
// gradient1.minFilter = THREE.NearestFilter;
// gradient1.generateMipmaps = false;
// its called cell shading
// only 2 possible states, in shadow or light
// const material = new THREE.MeshToonMaterial({
//     gradientMap: gradient1, // this texture only has 3 pixels, GPU will stretch this, you lose the Toon effect because of mipmapping
// });

// implementation of PBR materials
// const material = new THREE.MeshStandardMaterial({
//     metalness: 1,
//     roughness: 1,
//     map: albedo,
//     aoMap: ambientOcclusion, // uses ambient light to create shadowing details (fake though)
//     displacementMap: height, // adds elevation, requires subdivision to add details.
//     displacementScale: .04,
//     metalnessMap: metalness,
//     roughnessMap: roughness,
//     normalMap: normal,
//     transparent: true,
//     alphaMap: alpha,
// })

// same as MeshStandardMaterial, but with more options
const material = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    // map: albedo,
    // aoMap: ambientOcclusion, // uses ambient light to create shadowing details (fake though)
    // aoMapIntensity: 1,
    // displacementMap: height, // adds elevation, requires subdivision to add details.
    // displacementScale: .1,
    // metalnessMap: metalness,
    // roughnessMap: roughness,
    // normalMap: normal,
    // normalScale: new THREE.Vector2(.5, .5),
    // transparent: true,
    // alphaMap: alpha,

    // add varnish on top of material
    // clearcoat: .5,
    // clearcoatRoughness: 0,
    // add softness/fluffy fabric to a material, used for clothing for example

    // uses frennel effect
    // sheen: 1,
    // sheenRoughness: .5,
    // sheenColor: new THREE.Color(1,1,1),

    // iridescence: 1,
    // iridescenceIOR: 1,
    // iridescenceThicknessRange: [100, 800]

    transmission: 1,
    ior: 1.5,
    thickness: .5,
})


// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

const gui = new GUI();
gui.add(material, 'roughness').min(0).max(1).step(0.01);
gui.add(material, 'metalness').min(0).max(1).step(0.01);
// gui.add(material, 'clearcoat').min(0).max(1).step(0.01);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.01);
// gui.add(material, 'sheen').min(0).max(1).step(0.01);
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.01);
// gui.addColor(material, 'sheenColor');

// gui.add(material, 'iridescence').min(0).max(1).step(0.01);
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.01);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

gui.add(material, 'transmission').min(0).max(1).step(0.01);
gui.add(material, 'ior').min(1).max(10).step(0.01);
gui.add(material, 'thickness').min(0).max(1).step(0.01);



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5
scene.add(sphere)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
scene.add(plane)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);
torus.position.x = 1.5;
scene.add(torus);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
// camera.position.y = 1
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

    sphere.rotation.y = elapsedTime * .1;
    sphere.rotation.x = - elapsedTime * .15;

    plane.rotation.y = elapsedTime * .1;
    plane.rotation.x = - elapsedTime * .15;

    torus.rotation.y = elapsedTime * .1;
    torus.rotation.x = - elapsedTime * .15;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()