// Main game class
class BirdwatchingGame {
    constructor() {
        // Game properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.environment = null;
        this.playerController = null;
        this.birds = [];
        this.birdAnimations = [];
        this.clock = new THREE.Clock();
        this.isGameRunning = false;
        
        // Bird behavior timing
        this.lastBirdBehaviorTime = 0;
        this.birdBehaviorInterval = 5000; // 5 seconds
        
        // Loading manager
        this.loadingManager = new THREE.LoadingManager();
        this.setupLoadingManager();
    
        // Safety timeout - force start game after 5 seconds regardless of loading status
        setTimeout(() => {
            console.log('Safety timeout triggered - forcing game start');
            if (!this.isGameRunning) {
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen.style.opacity = 0;
                loadingScreen.style.transition = 'opacity 1s';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
                
                this.isGameRunning = true;
                
                // If scene is initialized, start the animation
                if (this.scene && this.camera && this.renderer) {
                    this.animate();
                } else {
                    console.error('Scene was not initialized before timeout');
                }
            }
        }, 5000);
    }
    
    setupLoadingManager() {
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log(`Loading: ${url} - ${itemsLoaded}/${itemsTotal}`);
            const progress = (itemsLoaded / itemsTotal) * 100;
            document.getElementById('loading-progress').style.width = progress + '%';
        };
        
        this.loadingManager.onLoad = () => {
            console.log('All assets loaded successfully');
            // Hide loading screen with a fade out
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.opacity = 0;
            loadingScreen.style.transition = 'opacity 1s';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
            
            // Start the game
            this.isGameRunning = true;
        };
        
        this.loadingManager.onError = (url) => {
            console.error(`Error loading asset: ${url}`);
            // Continue with the game anyway after 3 seconds
            setTimeout(() => {
                console.log('Continuing despite loading errors');
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen.style.opacity = 0;
                loadingScreen.style.transition = 'opacity 1s';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
                
                // Start the game anyway
                this.isGameRunning = true;
            }, 3000);
        };
    }
    
    async init() {
        console.log('Game initialization started');
        try {
            // Initialize Three.js scene
            console.log('Initializing scene');
            this.initScene();
            
            // Create environment
            console.log('Creating environment');
            this.environment = new Environment(this.scene);
            this.environment.createEnvironment();
            
            // Create birds
            console.log('Creating birds');
            await this.createBirds();
            
            // Set up player controller after birds are created
            console.log('Setting up player controller');
            this.playerController = new PlayerController(
                this.camera, 
                this.renderer.domElement,
                this.birds
            );
            
            // Setup close journal button
            document.getElementById('close-journal').addEventListener('click', () => {
                document.getElementById('journal').style.display = 'none';
            });
            
            // Start animation loop
            console.log('Starting animation loop');
            this.animate();
            
            // Start bird behaviors
            console.log('Starting bird behaviors');
            this.startBirdBehaviors();
            
            console.log('Game initialization completed successfully');
        } catch (error) {
            console.error('Error during game initialization:', error);
        }
    }
    
    initScene() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        
        // Set up camera
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        
        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
    
    async createBirds() {
        try {
            // Create bird models
            console.log('Creating bird models');
            const birdModelFactory = new BirdModelFactory();
            const birdModels = await birdModelFactory.init();
            
            console.log('Bird models created, creating individual birds');
            // Create a Bird instance for each type
            for (const birdType of BIRD_TYPES) {
                console.log(`Creating bird: ${birdType}`);
                // Clone the model for this bird
                const birdModel = birdModels[birdType].clone();
                
                // Create bird instance
                const bird = {
                    type: birdType,
                    model: birdModel,
                    data: BIRD_DATABASE[birdType],
                    discovered: false,
                    photographed: false,
                    difficulty: BIRD_DATABASE[birdType].difficulty || 1
                };
                
                // Set initial position at a random perch point
                const perchPoints = [...PERCH_POINTS]; // Clone the array
                const perchIndex = Math.floor(Math.random() * perchPoints.length);
                const perchPoint = perchPoints[perchIndex];
                
                // Adjust height based on bird preferences
                const preferredHeightRange = BIRD_DATABASE[birdType].perchHeight || [1, 5];
                const perchHeight = preferredHeightRange[0] + 
                    Math.random() * (preferredHeightRange[1] - preferredHeightRange[0]);
                
                birdModel.position.set(
                    perchPoint.x + (Math.random() * 2 - 1),
                    perchPoint.y + perchHeight,
                    perchPoint.z + (Math.random() * 2 - 1)
                );
                
                // Random rotation
                birdModel.rotation.y = Math.random() * Math.PI * 2;
                
                // Add bird to scene and array
                this.scene.add(birdModel);
                this.birds.push(bird);
                
                // Create bird animation controller
                const birdAnimation = new BirdAnimation(birdModel, this.scene);
                birdAnimation.state = 'perching';
                this.birdAnimations.push(birdAnimation);
            }
            console.log(`Created ${this.birds.length} birds successfully`);
        } catch (error) {
            console.error('Error creating birds:', error);
        }
    }
    
    startBirdBehaviors() {
        // Initial delay before birds start moving
        setTimeout(() => {
            this.updateBirdBehaviors();
        }, 2000);
    }
    
    updateBirdBehaviors() {
        const now = Date.now();
        
        // Only update behaviors at certain intervals
        if (now - this.lastBirdBehaviorTime > this.birdBehaviorInterval) {
            this.lastBirdBehaviorTime = now;
            
            // For each bird, decide what it should do
            for (let i = 0; i < this.birds.length; i++) {
                const bird = this.birds[i];
                const animation = this.birdAnimations[i];
                
                // Skip if bird is already flying
                if (animation.state === 'flying') continue;
                
                // Random chance for bird to fly to a new perch
                if (Math.random() < 0.3) { // 30% chance
                    // Choose a new random perch
                    const perchPoints = [...PERCH_POINTS];
                    const perchIndex = Math.floor(Math.random() * perchPoints.length);
                    const newPerchPoint = perchPoints[perchIndex];
                    
                    // Adjust height based on bird preferences
                    const preferredHeightRange = BIRD_DATABASE[bird.type].perchHeight || [1, 5];
                    const perchHeight = preferredHeightRange[0] + 
                        Math.random() * (preferredHeightRange[1] - preferredHeightRange[0]);
                    
                    const startPos = bird.model.position.clone();
                    const endPos = new THREE.Vector3(
                        newPerchPoint.x + (Math.random() * 2 - 1),
                        newPerchPoint.y + perchHeight,
                        newPerchPoint.z + (Math.random() * 2 - 1)
                    );
                    
                    // Duration based on difficulty (harder birds fly faster)
                    const duration = 5000 - (bird.difficulty * 500);
                    
                    // Start flying animation
                    animation.fly(startPos, endPos, duration);
                }
            }
        }
    }
    
    animate() {
        if (!this.isGameRunning) {
            console.log('Animation loop exited - game not running');
            return;
        }

        // Only log the first 5 animation frames to avoid console spam
        if (!this.frameCount) {
            this.frameCount = 0;
        }
        
        if (this.frameCount < 5) {
            console.log(`Animation frame ${this.frameCount}`);
            this.frameCount++;
        }
        
        requestAnimationFrame(this.animate.bind(this));
        
        // Get delta time for smooth movement
        const deltaTime = this.clock.getDelta();
        
        // Update controls
        if (this.playerController) {
            this.playerController.update(deltaTime);
        }
        
        // Update bird animations
        for (const animation of this.birdAnimations) {
            animation.update();
        }
        
        // Update bird behaviors
        this.updateBirdBehaviors();
        
        // Update TWEEN animations
        TWEEN.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        // Update camera aspect ratio and renderer size
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    preloadAudio(url) {
        const audio = new Audio();
        audio.src = url;
    }
}

// Helper function to check for WebGL support
const isWebGLAvailable = function() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

// Helper function to display a WebGL error message
const getWebGLErrorMessage = function() {
    const element = document.createElement('div');
    element.id = 'webgl-error-message';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '13px';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.background = '#fff';
    element.style.color = '#000';
    element.style.padding = '1.5em';
    element.style.width = '400px';
    element.style.margin = '5em auto 0';
    element.innerHTML = window.WebGLRenderingContext ? 
        'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />' +
        'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.' :
        'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>' +
        'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.';
    
    return element;
};

// Initialize the game when the window loads
window.addEventListener('load', () => {
    console.log('Window loaded - starting game initialization');
    
    try {
        // Check for WebGL support
        if (!isWebGLAvailable()) {
            console.error('WebGL not available');
            const warning = getWebGLErrorMessage();
            document.body.appendChild(warning);
            return;
        }
        
        console.log('WebGL is available - creating game instance');
        // Create and initialize game
        const game = new BirdwatchingGame();
        window.game = game; // Store in global scope for debugging
        game.init().catch(error => {
            console.error('Game initialization failed:', error);
        });
    } catch (error) {
        console.error('Error in game startup:', error);
        // Emergency fallback - hide loading screen after error
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 3000);
    }
}); 