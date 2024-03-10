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

const fog = new THREE.Fog('#262837', 1, 15);
// scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorAlbedo = textureLoader.load('/textures/door/color.jpg')
doorAlbedo.colorSpace = THREE.SRGBColorSpace

const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorMetalness = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg')

const bricksAlbedo = textureLoader.load('/textures/bricks/color.jpg');
bricksAlbedo.colorSpace = THREE.SRGBColorSpace;

const brickNormal = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughness = textureLoader.load('/textures/bricks/roughness.jpg')
const brickAmbientOcclusion = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

const grassAlbedo = textureLoader.load('/textures/grass/color.jpg')
grassAlbedo.colorSpace = THREE.SRGBColorSpace
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')
const grassAo = textureLoader.load('/textures/grass/ambientOcclusion.jpg')

grassAlbedo.repeat.set(8,8)
grassNormal.repeat.set(8,8)
grassRoughness.repeat.set(8,8)
grassAo.repeat.set(8,8)

grassAlbedo.wrapS = THREE.RepeatWrapping;
grassAlbedo.wrapT = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;
grassAo.wrapS = THREE.RepeatWrapping;
grassAo.wrapT = THREE.RepeatWrapping;


/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricksAlbedo,
        normalMap: brickNormal,
        aoMap: brickAmbientOcclusion,
        roughnessMap: brickRoughness
     })
)
walls.position.y = walls.geometry.parameters.height / 2;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = roof.geometry.parameters.height / 2 + walls.geometry.parameters.height
roof.rotation.y = Math.PI * .25;
house.add(roof);

const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorAlbedo, 
    alphaMap: doorAlpha,
    normalMap: doorNormal,
    aoMap: doorAmbientOcclusion,
    displacementMap: doorHeight,
    displacementScale: .1,
    metalnessMap: doorMetalness,
    roughnessMap: doorRoughness
});
doorMaterial.transparent = true;

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2, 100, 100),
    doorMaterial
)
door.position.y = door.geometry.parameters.height / 2
door.position.z = walls.geometry.parameters.width / 2 + 0.01;
house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.set(.5, .5, .5);
bush1.position.set(.8, .2, 2.2)
house.add(bush1);


const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.set(.25, .25, .25);
bush2.position.set(1.4, .1, 2.1)
house.add(bush2);


const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.set(.4, .4, .4);
bush3.position.set(-.8, .1, 2.2)
house.add(bush3);

const bush4 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush4.scale.set(.15, .15, .15);
bush4.position.set(-1, .05, 2.6)
house.add(bush4);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassAlbedo,
        normalMap: grassNormal,
        aoMap: grassAo, 
        roughnessMap: grassRoughness,
     })
)
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

const graveyard = new THREE.Group();
scene.add(graveyard);

const graveGeometry = new THREE.BoxGeometry(.6, .8, .2);
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;

    const maxRadius = 10;
    const minRadius = 4;

    const radius = minRadius + (Math.random() * (maxRadius - minRadius))

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.castShadow = true;
    graveyard.add(grave);

    grave.position.set(x, graveGeometry.parameters.height / 2 - .1, z)
    grave.rotation.y = (Math.random() - .5) * .4
    grave.rotation.z = (Math.random() - .5) * .4;
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', .26)
moonLight.castShadow = true;
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff8d46', 3, 7);
doorLight.castShadow = true;
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const ghost1 = new THREE.PointLight('#ff00ff', 6, 3);
ghost1.castShadow = true;
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 6, 3);
ghost2.castShadow = true;
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 6, 3);
ghost3.castShadow = true;
scene.add(ghost3)

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

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837');

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * .5;
    ghost1.position.x = Math.sin(ghost1Angle) * 5;
    ghost1.position.z = Math.cos(ghost1Angle) * 5;
    ghost1.position.y = Math.sin(ghost1Angle * 3);

    const ghost2Angle = -elapsedTime * .32;
    ghost2.position.x = Math.sin(ghost2Angle) * 4;
    ghost2.position.z = Math.cos(ghost2Angle) * 4;
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = elapsedTime * .18;
    ghost3.position.x = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * .32));
    ghost3.position.z = Math.cos(ghost3Angle) * (7 +Math.sin(elapsedTime * .5));
    ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime + 2.5);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()