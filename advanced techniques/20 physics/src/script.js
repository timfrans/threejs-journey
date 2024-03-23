import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Cannon from 'cannon';

/**
 * Debug
 */
const gui = new GUI()
const debugObject = {
    createSphere: () => {
        createSphere(Math.random() * 0.5, {
            x: (Math.random() - 0.5) * 3, 
            y: 3, 
            z: (Math.random() - 0.5) * 3
        })
    },
    createBox: () => {
        const size = (Math.random())

        createBox(
            size, size, size,
            {
                x: (Math.random() - 0.5) * 3, 
                y: 3, 
                z: (Math.random() - 0.5) * 3
            }
        )
    },
    reset: () => {
        objectsToUpdate.forEach((object) => {
            object.body.removeEventListener('collide', playSound);
            world.removeBody(object.body);

            scene.remove(object.mesh);

            objectsToUpdate.splice(0, objectsToUpdate.length)
        })
    }
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

const hitSound = new Audio('/sounds/hit.mp3');
hitSound.play()

const world = new Cannon.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new Cannon.SAPBroadphase(world)
world.allowSleep = true;

const defaultMaterial = new Cannon.Material('default');
const defaultContactMaterial = new Cannon.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {friction: 0.1, restitution: 0.7}
)
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

function playSound(collision) {
    if(collision.contact.getImpactVelocityAlongNormal() > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }
}

/**
 * Test sphere
 */

const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

function createSphere(radius, position) {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)

    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh)

    const shape = new Cannon.Sphere(radius);
    const body = new Cannon.Body({
        mass: 1,
        shape: shape,
    });
    body.position.copy(position)

    body.addEventListener('collide', playSound)

    world.addBody(body);

    objectsToUpdate.push({mesh, body})
}

createSphere(0.5, {x: 0, y: 3, z: 0})

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

function createBox(width, height, depth, position) {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh)
    
    const shape = new Cannon.Box(new Cannon.Vec3(width/2, height/2, depth/2));
    const body = new Cannon.Body({
        mass: 1,
        shape: shape,
        position: new Cannon.Vec3(0,0,0)
    })
    body.position.copy(position);

    body.addEventListener('collide', playSound)

    world.addBody(body);

    objectsToUpdate.push({body, mesh});
}


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

const floorShape = new Cannon.Plane();
const floorBody = new Cannon.Body({
    shape: floorShape,
})
floorBody.quaternion.setFromAxisAngle(new Cannon.Vec3(-1, 0, 0), Math.PI * 0.5);
world.add(floorBody);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = clock.getElapsedTime();
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    
    world.step(1/60, deltaTime, 3)

    objectsToUpdate.forEach(obj => {
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()