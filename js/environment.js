// Environment setup for the game
class Environment {
    constructor(scene) {
        this.scene = scene;
        this.trees = [];
        this.rocks = [];
    }
    
    createGround() {
        // Create ground
        const groundGeometry = new THREE.CircleGeometry(50, 32);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3d9e41, // Green
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        return ground;
    }
    
    createSkybox() {
        // Create skybox using a cube geometry with gradient shader
        const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500);
        const skyboxMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) }, // Blue
                bottomColor: { value: new THREE.Color(0xffffff) }, // White
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);
        
        return skybox;
    }
    
    createTrees() {
        // Tree positions
        const treePositions = [
            [10, 0, -15], [-8, 0, -12], [15, 0, 5], [-12, 0, 8], [0, 0, -20], 
            [20, 0, -10], [-18, 0, -5], [22, 0, 15], [-20, 0, 12], [5, 0, 25]
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos[0], pos[1], pos[2]);
            tree.scale.set(
                1 + Math.random() * 0.5, 
                1 + Math.random() * 0.5, 
                1 + Math.random() * 0.5
            );
            tree.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(tree);
            this.trees.push(tree);
        });
    }
    
    createTree() {
        // Create a simple tree using polyhedra
        const treeGroup = new THREE.Group();
        
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, // Brown
            roughness: 0.9,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);
        
        // Tree foliage using octahedron (8-sided polyhedron)
        const foliageGeometry = new THREE.OctahedronGeometry(3, 0);
        const foliageMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E8B57, // Sea green
            roughness: 0.8,
            metalness: 0.1
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 6;
        foliage.scale.y = 1.5;
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        return treeGroup;
    }
    
    createRocks() {
        // Random rock positions
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 30;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const rock = this.createRock();
            rock.position.set(x, 0, z);
            rock.rotation.y = Math.random() * Math.PI * 2;
            rock.scale.set(
                0.5 + Math.random() * 1.5,
                0.5 + Math.random() * 1,
                0.5 + Math.random() * 1.5
            );
            this.scene.add(rock);
            this.rocks.push(rock);
        }
    }
    
    createRock() {
        // Create a rock using tetrahedron (4-sided polyhedron)
        const rockGeometry = new THREE.TetrahedronGeometry(1, 1);
        const rockMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080, // Gray
            roughness: 0.9,
            metalness: 0.2
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        return rock;
    }
    
    addAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        return ambientLight;
    }
    
    addDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Set up shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;
        
        this.scene.add(directionalLight);
        return directionalLight;
    }
    
    createEnvironment() {
        this.createGround();
        this.createSkybox();
        this.createTrees();
        this.createRocks();
        this.addAmbientLight();
        this.addDirectionalLight();
    }
} 