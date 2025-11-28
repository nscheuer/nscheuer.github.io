// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(2, 0.4, 1);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Set up orbital controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 5;
// Create the Earth
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
// Load Earth textures
const earthTextureDay = new THREE.TextureLoader().load("assets/images/earthgalaxymaps/8k_earth_daymap-min.webp");
const earthTextureNight = new THREE.TextureLoader().load("assets/images/earthgalaxymaps/8k_earth_nightmap-min.webp");
const earthTextureNormal = new THREE.TextureLoader().load("assets/images/earthgalaxymaps/2k_earth_normal_map.webp");
const earthTextureSpecular = new THREE.TextureLoader().load("assets/images/earthgalaxymaps/2k_earth_specular_map.webp");

// Create a custom shader material
// ...
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
  
      uniform mat4 rotationMatrix;
  
      void main() {
        vUv = uv;
        vNormal = normalize((rotationMatrix * vec4(normal, 0.0)).xyz); // Rotate the normal
        vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
    
      uniform sampler2D glsltextureday;
      uniform sampler2D glsltexturenight;
      uniform sampler2D glsltexturespecular; // New specular map texture
      uniform vec3 glslsunposition;
    
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(glslsunposition - vViewPosition);
        float lightIntensity = max(dot(normal, lightDirection), 0.0);
    
        vec4 glslday = texture2D(glsltextureday, vUv);
        vec4 glslnight = texture2D(glsltexturenight, vUv);
        vec4 glslspecular = texture2D(glsltexturespecular, vUv); // Sample the specular map
    
        vec4 finalColor = mix(glslnight, glslday, smoothstep(0.05, 0.5, lightIntensity));
    
        // Calculate the specular intensity
        float specularIntensity = max(dot(normal, reflect(-lightDirection, normal)), 0.0);
        specularIntensity = pow(specularIntensity, glslspecular.a);
    
        // Apply the specular map only in the direction of the light
        gl_FragColor = mix(finalColor, finalColor + glslspecular * 0.1 * specularIntensity, glslspecular.a);
      }
  `,
  uniforms: {
    glsltextureday: {
      value: earthTextureDay
    },
    glsltexturenight: {
      value: earthTextureNight
    },
    glsltexturenormal: {
      value: earthTextureNormal
    },
    glsltexturespecular: {
      value: earthTextureSpecular
    },
    glslsunposition: {
      value: new THREE.Vector3(10, 0, -10)
    },
    rotationMatrix: {
      value: new THREE.Matrix4()
    } // Initialize the rotation matrix
  }
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

var atmosphereVertexShader = [
  'varying vec3 vNormal;',
  'varying vec3 vPosition;',
  'void main() {',
  'vNormal = normalize( normalMatrix * normal );',

  'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
  'vPosition = gl_Position.xyz;',
  '}'
].join('\n')

var atmosphereFragmentShader = [
  'varying vec3 vNormal;',
  'varying vec3 vPosition;',
  'uniform vec3 vViewPosition;', // Add camera position uniform
  'void main() {',
  'vec3 lightPosition = vec3(-10.0, 10.0, 0.0);',
  'vec3 lightDirection = normalize(lightPosition - vPosition);',
  'float dotNL = clamp(dot(lightDirection, vNormal), 0.0, 1.0);',
  'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
  'float distance = length(vViewPosition - vPosition);', // Calculate distance from camera
  // 'float attenuation = 0.1 / (1.0 + 0.0001 * pow(distance, 0.1));', // Calculate attenuation factor
  // 'float attenuation = exp(-0.001 * distance);',
  // 'float attentuation = 1.0 - 0.001*pow(distance, 2);', // Calculate attenuation factor
  'float attenuation = 480.0 * pow(distance, -5.5);', // Calculate attenuation factor
  'gl_FragColor = vec4( 1, 1.0, 1.0, 1.0 ) * intensity * dotNL * attenuation;', // Apply attenuation
  '}'
].join('\n')

// Create the atmosphere material
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});

// Create the atmosphere mesh
const atmosphereRadius = 1.17;
const atmosphereGeometry = new THREE.SphereGeometry(atmosphereRadius, 32, 32);
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

// Add the atmosphere to the scene
scene.add(atmosphere);

// Add the sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffff00
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(200, 0, -200);
scene.add(sun);
//scene.add(new THREE.AxesHelper(10));

// Add directional light
const sunLight = new THREE.DirectionalLight(0xffffff, 5);
sunLight.position.set(10, 0, -10);
scene.add(sunLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create stars
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});

const starsVertices = [];
const colors = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 3000;
  const y = (Math.random() - 0.5) * 3000;
  const z = (Math.random() - 0.5) * 3000;
  starsVertices.push(x, y, z);

  const color = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  colors.push(color.r, color.g, color.b)
}

starsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starsVertices, 3)
);
starsGeometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(colors, 3)
);

const starShape = new THREE.SphereGeometry(0.5, 8, 8); // Radius, Width Segments, Height Segments

for (let i = 0; i < starsVertices.length; i += 3) {
  const star = new THREE.Mesh(starShape, starsMaterial);
  star.position.set(
    starsVertices[i],
    starsVertices[i + 1],
    starsVertices[i + 2]
  );
  star.scale.set(2, 2, 2);
  scene.add(star);
}      

// Load a cube texture for the skybox (replace 'path/to/skybox/' with your actual path)
if (window.screen.width > 500 && window.screen.height > 500) {
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const cubeTexture = cubeTextureLoader.load([
    "assets/images/earthgalaxymaps/GalaxyTex_PositiveX-min.webp",
    "assets/images/earthgalaxymaps/GalaxyTex_NegativeX-min.webp",
    "assets/images/earthgalaxymaps/GalaxyTex_PositiveY-min.webp",
    "assets/images/earthgalaxymaps/GalaxyTex_NegativeY-min.webp",
    "assets/images/earthgalaxymaps/GalaxyTex_PositiveZ-min.webp",
    "assets/images/earthgalaxymaps/GalaxyTex_NegativeZ-min.webp"
  ]);
  cubeTexture.generateMipmaps = true;
  scene.background = cubeTexture;
}


// Set up post-processing
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom pass
const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(bloomPass);
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  earthMaterial.uniforms.rotationMatrix.value.makeRotationY(earth.rotation.y);
  //renderer.render(scene, camera);
  controls.update();
  composer.render();
}
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();

