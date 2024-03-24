import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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

const gltfLoader = new GLTFLoader();

let duck;
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
    gltf.scene.position.y = -1.2
    scene.add(gltf.scene);

    duck = gltf.scene;
    // objectsToTest.push(duck);
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

const raycaster = new THREE.Raycaster();
const rayDestination = new THREE.Vector2(0, 0);

window.addEventListener('mousemove', (e) => {
    const destinationX = ((e.clientX / sizes.width) - 0.5) * 2;
    const destinationY = -((e.clientY / sizes.height) - 0.5) * 2;
    rayDestination.set(destinationX, destinationY);
})

window.addEventListener('click', (e) => {
    if(!currentIntersect) return;

    currentIntersect.object.material.color.set('purple');
})

const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight) 

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects)

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

let currentIntersect;
const objectsToTest = [object1, object2, object3];

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // objectsToTest.forEach(o => o.material.color.set('red'));

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.cos(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    raycaster.setFromCamera(rayDestination, camera);

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(7, 0 ,0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);

    const intersects = raycaster.intersectObjects(objectsToTest);
    if(intersects.length) {
        if(!currentIntersect) {
            intersects[0].object.material.color.set('blue');
            
        }
        currentIntersect = intersects[0];
    } else {
        if(currentIntersect) {
            currentIntersect.object.material.color.set('red')
        }

        currentIntersect = undefined;
    }


    if(duck) {
        const intersect = raycaster.intersectObject(duck);
        if(intersect.length) {
            duck.scale.set(2,2,2)
        }
        else {
            duck.scale.set(1,1,1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()