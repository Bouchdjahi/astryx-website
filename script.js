import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010118);
scene.fog = new THREE.FogExp2(0x010118, 0.0003);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.enableZoom = true;
controls.enablePan = true;
controls.zoomSpeed = 1.2;
controls.rotateSpeed = 0.8;
controls.target.set(0, 0, 0);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0x111122);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffaa66, 1.5, 50);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x88aaff, 0.3);
fillLight.position.set(5, 10, 7);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x4466ff, 0.2);
backLight.position.set(0, 5, -10);
scene.add(backLight);

// --- STARS (Particle System) ---
const starGeometry = new THREE.BufferGeometry();
const starCount = 4000;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 500;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Second star layer (dimmer)
const starGeometry2 = new THREE.BufferGeometry();
const starPositions2 = new Float32Array(2000 * 3);
for (let i = 0; i < 2000; i++) {
    starPositions2[i * 3] = (Math.random() - 0.5) * 600;
    starPositions2[i * 3 + 1] = (Math.random() - 0.5) * 400;
    starPositions2[i * 3 + 2] = (Math.random() - 0.5) * 300 - 100;
}
starGeometry2.setAttribute('position', new THREE.BufferAttribute(starPositions2, 3));
const starMaterial2 = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.08, transparent: true, opacity: 0.4 });
const stars2 = new THREE.Points(starGeometry2, starMaterial2);
scene.add(stars2);

// --- THE SUN ---
const sunGeometry = new THREE.SphereGeometry(2.2, 128, 128);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa66,
    emissive: 0xff4422,
    emissiveIntensity: 0.8,
    metalness: 0.95,
    roughness: 0.3
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { 
    planetId: 'sun',
    name: 'Sun',
    desc: 'The star at the center of our solar system. Contains 99.8% of all mass.',
    fact: '1.3 million Earths could fit inside the Sun!'
};
scene.add(sun);

// Sun glow effect
const sunGlowGeometry = new THREE.SphereGeometry(2.4, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8844,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// --- PLANET DATA (Realistic proportions - sizes and distances scaled for visualization) ---
const planetsData = [
    { id: 'mercury', name: 'Mercury', color: 0xbc9a6c, size: 0.18, distance: 3.5, speed: 0.025, desc: 'The smallest and fastest planet.', fact: 'Temperatures range from -173°C to 427°C!' },
    { id: 'venus', name: 'Venus', color: 0xe6b856, size: 0.22, distance: 4.8, speed: 0.018, desc: 'The hottest planet with a toxic atmosphere.', fact: 'A day on Venus is longer than its year!' },
    { id: 'earth', name: 'Earth', color: 0x4488ff, size: 0.24, distance: 6.2, speed: 0.015, desc: 'Our home, the only known life-bearing planet.', fact: '71% of Earth is covered in water!' },
    { id: 'mars', name: 'Mars', color: 0xc45c3c, size: 0.21, distance: 7.8, speed: 0.012, desc: 'The Red Planet, named for its iron-rich soil.', fact: 'Home to Olympus Mons, the largest volcano in the solar system!' },
    { id: 'jupiter', name: 'Jupiter', color: 0xd4b87a, size: 0.55, distance: 10.5, speed: 0.008, desc: 'The largest planet, a gas giant.', fact: 'Has 95 known moons and a giant red storm!' },
    { id: 'saturn', name: 'Saturn', color: 0xe8cf9a, size: 0.48, distance: 13.0, speed: 0.006, desc: 'Famous for its beautiful ring system.', fact: 'Saturn is so light it would float in water!' },
    { id: 'uranus', name: 'Uranus', color: 0x9ed9e6, size: 0.38, distance: 15.5, speed: 0.005, desc: 'An ice giant that rotates on its side.', fact: 'First planet discovered with a telescope (1781)!' },
    { id: 'neptune', name: 'Neptune', color: 0x3a6ea5, size: 0.37, distance: 18.0, speed: 0.004, desc: 'The windiest planet in the solar system.', fact: 'Winds reach 1,200 miles per hour!' }
];

const planets = [];

// Create planets
planetsData.forEach((data, index) => {
    const geometry = new THREE.SphereGeometry(data.size, 128, 128);
    const material = new THREE.MeshStandardMaterial({ 
        color: data.color, 
        metalness: 0.4, 
        roughness: 0.5,
        emissive: 0x000000
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { 
        planetId: data.id,
        name: data.name,
        desc: data.desc,
        fact: data.fact
    };
    planet.castShadow = true;
    planet.receiveShadow = true;
    scene.add(planet);
    
    // Saturn's ring
    let ring = null;
    if (data.id === 'saturn') {
        const ringGeometry = new THREE.TorusGeometry(data.size * 1.4, 0.12, 64, 200);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xc9b37c, metalness: 0.3, roughness: 0.6 });
        ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.2;
        ring.rotation.z = 0.3;
        planet.add(ring);
    }
    
    planets.push({ 
        mesh: planet, 
        distance: data.distance, 
        speed: data.speed, 
        angle: (index / planetsData.length) * Math.PI * 2,
        ring: ring
    });
    
    // Add orbit line
    const orbitPoints = [];
    const radius = data.distance;
    for (let i = 0; i <= 200; i++) {
        const angle = (i / 200) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.2 });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbit);
});

// --- ASTEROID BELT (between Mars and Jupiter) ---
const asteroidCount = 3000;
const asteroidGeometry = new THREE.BufferGeometry();
const asteroidPositions = new Float32Array(asteroidCount * 3);

for (let i = 0; i < asteroidCount; i++) {
    const r = 8.5 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 0.8;
    asteroidPositions[i * 3] = Math.cos(angle) * r;
    asteroidPositions[i * 3 + 1] = y;
    asteroidPositions[i * 3 + 2] = Math.sin(angle) * r;
}
asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
const asteroidMaterial = new THREE.PointsMaterial({ color: 0x887766, size: 0.04 });
const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
scene.add(asteroidBelt);

// --- RAYCASTER FOR CLICKING ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = [sun, ...planets.map(p => p.mesh)];
    const intersects = raycaster.intersectObjects(clickableObjects);
    
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        
        // Update info panel
        document.getElementById('planet-name').textContent = data.name;
        document.getElementById('planet-desc').textContent = data.desc;
        document.getElementById('planet-fact').innerHTML = '✨ ' + data.fact;
        
        // Add click effect (flash)
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = 0;
        flash.style.left = 0;
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle, rgba(68,136,255,0.2) 0%, transparent 70%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = 1000;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
        
        // Highlight planet temporarily
        const originalEmissive = obj.material.emissiveIntensity || 0;
        obj.material.emissiveIntensity = 0.5;
        obj.material.emissive = new THREE.Color(0x88aaff);
        setTimeout(() => {
            obj.material.emissiveIntensity = originalEmissive;
            obj.material.emissive = new THREE.Color(0x000000);
        }, 500);
    }
}

window.addEventListener('click', onClick, false);

// --- ANIMATION LOOP ---
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    
    // Rotate planets
    planets.forEach(planet => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        
        // Rotate planet on axis
        planet.mesh.rotation.y += 0.01;
        
        // Rotate Saturn's ring
        if (planet.ring) {
            planet.ring.rotation.z += 0.005;
        }
    });
    
    // Rotate sun
    sun.rotation.y += 0.002;
    sunGlow.rotation.y += 0.001;
    
    // Rotate asteroid belt
    asteroidBelt.rotation.y += 0.001;
    
    // Animate stars
    stars.rotation.y += 0.0002;
    stars2.rotation.x += 0.0001;
    
    // Pulse sun light
    const intensity = 1.2 + Math.sin(time * 3) * 0.15;
    sunLight.intensity = intensity;
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

console.log('Realistic Solar System Loaded!');