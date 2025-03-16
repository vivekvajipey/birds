// Player controls and camera management
class PlayerController {
    constructor(camera, domElement, birds) {
        this.camera = camera;
        this.domElement = domElement;
        this.birds = birds;
        
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.isZooming = false;
        this.normalFOV = 75;
        this.zoomFOV = 25;
        
        // Movement properties
        this.moveSpeed = 0.15;
        this.jumpSpeed = 0.5;
        this.gravity = 0.02;
        this.playerHeight = 1.7;
        this.isOnGround = true;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
        
        // Audio setup
        this.setupAudio();

        this.setupControls();
        this.setupEventListeners();
    }
    
    setupAudio() {
        // Create audio elements for binocular sounds
        this.binocularZoomInSound = new Audio();
        this.binocularZoomInSound.volume = 0.5;
        this.binocularZoomInSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAVFRUVFRUVFSoqKioqKioqPz8/Pz8/Pz9UVFRNTU1NTWhoaGhoaGhoaH19fX19fX2Me3t7e3t7e5SUlJSUlJSUqampqampqamp3t7e3t7e3vf39/f39/f39/////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAV4AAAAAAAAAB4zY8HIIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDEFAPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMQpA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        
        this.binocularZoomOutSound = new Audio();
        this.binocularZoomOutSound.volume = 0.5;
        this.binocularZoomOutSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAVFRUVFRUVFSoqKioqKioqPz8/Pz8/Pz9UVFRNTU1NTWhoaGhoaGhoaH19fX19fX2Me3t7e3t7e5SUlJSUlJSUqampqampqamp3t7e3t7e3vf39/f39/f39/////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAV4AAAAAAAAAB4zY8HJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDEFAPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMQpA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        
        this.cameraShutterSound = new Audio();
        this.cameraShutterSound.volume = 0.7;
        this.cameraShutterSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMD19fX19fX19fX19fX19fX19fX19fX19fX1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAQQD5KJMAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    }
    
    setupControls() {
        // Set up orbit controls for the camera
        this.controls = new THREE.OrbitControls(this.camera, this.domElement);
        
        // Limit vertical rotation to prevent flipping
        this.controls.minPolarAngle = Math.PI * 0.1;
        this.controls.maxPolarAngle = Math.PI * 0.9;
        
        // Disable panning and zooming with orbit controls
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        
        // Improve trackpad support
        this.controls.rotateSpeed = 0.7; // Adjust rotation speed
        this.controls.enableDamping = true; // Add smooth damping effect
        this.controls.dampingFactor = 0.1; // Set damping factor
        
        // Make sure controls respond to all input types
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };
        
        // Enable trackpad gesture support
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        
        // Set initial camera position
        this.camera.position.set(0, this.playerHeight, 0); // Roughly human eye level
        this.controls.update();
    }
    
    setupEventListeners() {
        // Toggle zoom with 'Z' key
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Take photo on click when zoomed
        document.addEventListener('click', this.onClick.bind(this));
        
        // Journal toggle with 'J' key
        document.addEventListener('keydown', this.onJournalToggle.bind(this));
    }
    
    onKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'z':
                this.startZoom();
                break;
            case 'w':
            case 'arrowup':
                this.moveForward = true;
                break;
            case 's':
            case 'arrowdown':
                this.moveBackward = true;
                break;
            case 'a':
            case 'arrowleft':
                this.moveLeft = true;
                break;
            case 'd':
            case 'arrowright':
                this.moveRight = true;
                break;
            case ' ': // Space key
                if (this.isOnGround) {
                    this.jump = true;
                    this.velocity.y = this.jumpSpeed;
                    this.isOnGround = false;
                }
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'z':
                this.stopZoom();
                break;
            case 'w':
            case 'arrowup':
                this.moveForward = false;
                break;
            case 's':
            case 'arrowdown':
                this.moveBackward = false;
                break;
            case 'a':
            case 'arrowleft':
                this.moveLeft = false;
                break;
            case 'd':
            case 'arrowright':
                this.moveRight = false;
                break;
        }
    }
    
    onClick(event) {
        if (this.isZooming) {
            this.takePhoto();
        }
    }
    
    onJournalToggle(event) {
        if (event.key === 'j' || event.key === 'J') {
            const journal = document.getElementById('journal');
            journal.style.display = journal.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    startZoom() {
        this.isZooming = true;
        
        // Play zoom in sound
        this.binocularZoomInSound.currentTime = 0;
        this.binocularZoomInSound.play().catch(e => console.log("Audio play failed:", e));
        
        // Smoothly transition FOV with a slight overshoot for realistic feel
        const startFOV = this.camera.fov;
        const targetFOV = this.zoomFOV;
        const overshootFOV = this.zoomFOV * 0.8; // Zoom a bit closer first, then ease back
        
        // First zoom in a bit too far (overshoot)
        new TWEEN.Tween({ fov: startFOV })
            .to({ fov: overshootFOV }, 220)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                this.camera.fov = obj.fov;
                this.camera.updateProjectionMatrix();
            })
            .onComplete(() => {
                // Then ease back to actual target (simulates lens adjustment)
                new TWEEN.Tween({ fov: overshootFOV })
                    .to({ fov: targetFOV }, 120)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        this.camera.fov = obj.fov;
                        this.camera.updateProjectionMatrix();
                    })
                    .start();
            })
            .start();
        
        // Show binocular viewfinder
        const viewfinder = document.getElementById('viewfinder');
        viewfinder.style.display = 'block';
        
        // Add subtle binocular shake effect
        this.addBinocularShake();
    }
    
    stopZoom() {
        this.isZooming = false;
        
        // Play zoom out sound
        this.binocularZoomOutSound.currentTime = 0;
        this.binocularZoomOutSound.play().catch(e => console.log("Audio play failed:", e));
        
        // Remove binocular shake
        this.removeBinocularShake();
        
        // Smoothly transition back
        const startFOV = this.camera.fov;
        const endFOV = this.normalFOV;
        
        new TWEEN.Tween({ fov: startFOV })
            .to({ fov: endFOV }, 250)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                this.camera.fov = obj.fov;
                this.camera.updateProjectionMatrix();
            })
            .start();
        
        // Hide binocular viewfinder
        document.getElementById('viewfinder').style.display = 'none';
    }
    
    addBinocularShake() {
        // Add subtle random shake to camera to simulate handheld binoculars
        if (!this.binocularShakeInterval) {
            this.originalCameraPosition = this.camera.position.clone();
            this.originalControlsTarget = this.controls.target.clone();
            
            this.binocularShakeInterval = setInterval(() => {
                if (!this.isZooming) {
                    this.removeBinocularShake();
                    return;
                }
                
                // Calculate small random offsets for subtle movement
                const shakeIntensity = 0.002;
                const offsetX = (Math.random() - 0.5) * shakeIntensity;
                const offsetY = (Math.random() - 0.5) * shakeIntensity;
                
                // Apply the offsets to both camera and target (keeping relative position)
                const direction = new THREE.Vector3();
                this.camera.getWorldDirection(direction);
                
                // Get perpendicular vectors
                const up = new THREE.Vector3(0, 1, 0);
                const right = new THREE.Vector3().crossVectors(direction, up).normalize();
                const trueUp = new THREE.Vector3().crossVectors(right, direction).normalize();
                
                // Apply shake offset
                const shakeOffset = new THREE.Vector3()
                    .addScaledVector(right, offsetX)
                    .addScaledVector(trueUp, offsetY);
                
                // Apply to both camera and target to maintain look direction
                this.camera.position.add(shakeOffset);
                this.controls.target.add(shakeOffset);
            }, 50); // Update shake every 50ms
        }
    }
    
    removeBinocularShake() {
        if (this.binocularShakeInterval) {
            clearInterval(this.binocularShakeInterval);
            this.binocularShakeInterval = null;
        }
    }
    
    takePhoto() {
        // Play camera shutter sound
        this.cameraShutterSound.currentTime = 0;
        this.cameraShutterSound.play().catch(e => console.log("Audio play failed:", e));
        
        // Flash effect
        const flashOverlay = document.getElementById('flash');
        flashOverlay.style.display = 'block';
        
        setTimeout(() => {
            flashOverlay.style.display = 'none';
            
            // Check which birds are in view
            const capturedBirds = this.getBirdsInView();
            
            // Show capture results
            if (capturedBirds.length > 0) {
                this.processCapturedBirds(capturedBirds);
            } else {
                this.showMessage("No birds in frame!");
            }
        }, 150);
    }
    
    getBirdsInView() {
        // Get birds that are currently in the camera view
        const capturedBirds = [];
        
        if (!this.birds) return capturedBirds;
        
        // Setup camera frustum
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        
        projScreenMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        );
        
        frustum.setFromProjectionMatrix(projScreenMatrix);
        
        // Check each bird
        for (const bird of this.birds) {
            const birdPosition = bird.model.position.clone();
            const distance = birdPosition.distanceTo(this.camera.position);
            
            // Check if bird is in view and within reasonable distance
            const isInView = frustum.containsPoint(birdPosition);
            const maxSpotDistance = 40 - (bird.difficulty * 5); // Harder birds need closer distance
            const isCloseEnough = distance < maxSpotDistance;
            
            // Check if there's no obstruction
            let isVisible = true;
            if (isInView && isCloseEnough) {
                // Direction to bird
                const direction = birdPosition.clone().sub(this.camera.position).normalize();
                
                // Cast ray
                this.raycaster.set(this.camera.position, direction);
                const intersects = this.raycaster.intersectObjects(this.getSceneObjects(), true);
                
                // Check if the first thing hit is the bird
                if (intersects.length > 0) {
                    // Get the bird's model and its parts
                    const birdParts = [];
                    bird.model.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            birdParts.push(child);
                        }
                    });
                    
                    // Check if any of the first few intersections is part of our bird
                    isVisible = false;
                    for (let i = 0; i < Math.min(3, intersects.length); i++) {
                        if (birdParts.includes(intersects[i].object)) {
                            isVisible = true;
                            break;
                        }
                    }
                }
                
                if (isVisible) {
                    capturedBirds.push(bird);
                    bird.discovered = true;
                }
            }
        }
        
        return capturedBirds;
    }
    
    getSceneObjects() {
        // Get all objects in the scene for raycasting
        const objects = [];
        const scene = this.camera.parent;
        
        if (scene) {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    objects.push(object);
                }
            });
        }
        
        return objects;
    }
    
    processCapturedBirds(capturedBirds) {
        let message = "";
        const newDiscoveries = [];
        
        for (const bird of capturedBirds) {
            // Check if this is the first time photographing this bird
            if (!bird.photographed) {
                bird.photographed = true;
                newDiscoveries.push(bird);
                this.updateJournal(bird);
            }
        }
        
        // Create message based on results
        if (newDiscoveries.length > 0) {
            if (newDiscoveries.length === 1) {
                const bird = newDiscoveries[0];
                message = `New bird discovered: ${BIRD_DATABASE[bird.type].name}!`;
            } else {
                message = `${newDiscoveries.length} new birds discovered!`;
            }
            this.updateDiscoveryCounter();
        } else if (capturedBirds.length > 0) {
            message = "Bird photographed again!";
        }
        
        this.showMessage(message);
    }
    
    updateJournal(bird) {
        const journal = document.getElementById('journal-entries');
        const birdData = BIRD_DATABASE[bird.type];
        
        // If this is first time capturing this bird
        if (!document.getElementById(`bird-${bird.type}`)) {
            const entry = document.createElement('div');
            entry.id = `bird-${bird.type}`;
            entry.className = 'journal-entry';
            
            entry.innerHTML = `
                <h3>${birdData.name}</h3>
                <div class="bird-image-placeholder" style="background-color: #${birdData.color.toString(16)}; width: 200px; height: 150px; float: right; margin: 0 0 10px 10px; border: 2px solid #8b5a2b; border-radius: 5px;"></div>
                <p><strong>Scientific Name:</strong> ${birdData.scientificName}</p>
                <p>${birdData.description}</p>
            `;
            
            journal.appendChild(entry);
        }
    }
    
    updateDiscoveryCounter() {
        const count = document.querySelectorAll('.journal-entry').length;
        document.getElementById('birds-count').textContent = count;
        
        if (count === BIRD_TYPES.length) {
            this.showMessage("Congratulations! You've discovered all birds!");
        }
    }
    
    showMessage(text) {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = text;
        messageBox.style.display = 'block';
        
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }
    
    update(deltaTime) {
        if (this.controls) {
            // Update controls with damping for smooth motion
            this.controls.update();
        }
        
        // Handle player movement
        this.updateMovement(deltaTime);
    }
    
    updateMovement(deltaTime) {
        // Apply gravity
        if (!this.isOnGround) {
            this.velocity.y -= this.gravity;
        }
        
        // Calculate movement direction based on camera orientation
        const direction = new THREE.Vector3();
        const rotation = this.camera.getWorldDirection(direction);
        
        // Get camera's forward and right directions (parallel to ground)
        const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
        
        // Fix: Correct right vector calculation - right should be perpendicular to forward
        // Cross product of forward and up vectors gives the correct right vector
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(forward, up).normalize();
        
        // Calculate movement vector
        const moveVector = new THREE.Vector3(0, 0, 0);
        
        if (this.moveForward) moveVector.add(forward);
        if (this.moveBackward) moveVector.sub(forward);
        if (this.moveRight) moveVector.add(right);
        if (this.moveLeft) moveVector.sub(right);
        
        // Normalize the movement vector and apply speed
        if (moveVector.lengthSq() > 0) {
            moveVector.normalize().multiplyScalar(this.moveSpeed);
        }
        
        // Apply horizontal movement
        this.camera.position.x += moveVector.x;
        this.camera.position.z += moveVector.z;
        
        // Apply vertical movement (jumping/falling)
        this.camera.position.y += this.velocity.y;
        
        // Basic ground collision (simplified)
        if (this.camera.position.y < this.playerHeight) {
            this.camera.position.y = this.playerHeight;
            this.velocity.y = 0;
            this.isOnGround = true;
        }
        
        // Update the controls target to be in front of the camera
        const lookAtPosition = new THREE.Vector3();
        lookAtPosition.copy(this.camera.position).add(forward.multiplyScalar(1));
        this.controls.target.copy(lookAtPosition);
    }
} 