// Bird models created using polyhedra geometries
class BirdModelFactory {
    constructor() {
        this.birdModels = {};
        this.textureLoader = new THREE.TextureLoader();
    }

    // Initialize and create all bird models
    async init() {
        // Create a model for each bird type
        for (const birdType of BIRD_TYPES) {
            const birdData = BIRD_DATABASE[birdType];
            this.birdModels[birdType] = this.createBirdModel(birdType, birdData);
        }
        
        return this.birdModels;
    }

    // Create a bird model based on the bird type
    createBirdModel(birdType, birdData) {
        // Create a group to hold all bird parts
        const birdGroup = new THREE.Group();
        
        // Create the main body geometry using an icosahedron (20-sided polyhedron)
        const bodyGeometry = new THREE.IcosahedronGeometry(0.5 * birdData.size, 0);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.color,
            roughness: 0.8,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.z = 1.5; // Elongate the body
        birdGroup.add(body);
        
        // Create the head using a dodecahedron (12-sided polyhedron)
        const headGeometry = new THREE.DodecahedronGeometry(0.3 * birdData.size, 0);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.color,
            roughness: 0.8,
            metalness: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0.1 * birdData.size, 0.6 * birdData.size);
        birdGroup.add(head);
        
        // Add bird-specific features based on type
        switch(birdType) {
            case 'cardinal':
                this.addCardinalFeatures(birdGroup, birdData);
                break;
            case 'bluebird':
                this.addBluebirdFeatures(birdGroup, birdData);
                break;
            case 'goldfinch':
                this.addGoldfinchFeatures(birdGroup, birdData);
                break;
            case 'hummingbird':
                this.addHummingbirdFeatures(birdGroup, birdData);
                break;
            case 'owl':
                this.addOwlFeatures(birdGroup, birdData);
                break;
            case 'turkey':
                this.addTurkeyFeatures(birdGroup, birdData);
                break;
        }
        
        // Add common features (wings, tail, legs)
        this.addWings(birdGroup, birdData);
        
        // Don't add the default tail for turkey as it has a custom fan tail
        if (birdType !== 'turkey') {
            this.addTail(birdGroup, birdData);
        }
        
        // Don't add the default legs for turkey as it has longer legs
        if (birdType !== 'turkey') {
            this.addLegs(birdGroup, birdData);
        }
        
        this.addBeak(birdGroup, birdData, birdType);
        
        return birdGroup;
    }
    
    // Helper methods for bird parts
    addWings(birdGroup, birdData) {
        const wingGeometry = new THREE.TetrahedronGeometry(0.5 * birdData.size, 0);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor || birdData.color,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Left wing
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.4 * birdData.size, 0, 0);
        leftWing.rotation.z = Math.PI / 4;
        leftWing.scale.set(0.7, 0.2, 1.2);
        birdGroup.add(leftWing);
        
        // Right wing
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0.4 * birdData.size, 0, 0);
        rightWing.rotation.z = -Math.PI / 4;
        rightWing.scale.set(0.7, 0.2, 1.2);
        birdGroup.add(rightWing);
    }
    
    addTail(birdGroup, birdData) {
        const tailGeometry = new THREE.ConeGeometry(0.2 * birdData.size, 0.6 * birdData.size, 4);
        const tailMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor || birdData.color,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(0, 0, -0.7 * birdData.size);
        tail.rotation.x = Math.PI / 2;
        birdGroup.add(tail);
    }
    
    addLegs(birdGroup, birdData) {
        const legGeometry = new THREE.CylinderGeometry(0.02 * birdData.size, 0.02 * birdData.size, 0.3 * birdData.size);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.1 * birdData.size, -0.25 * birdData.size, 0);
        birdGroup.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.1 * birdData.size, -0.25 * birdData.size, 0);
        birdGroup.add(rightLeg);
    }
    
    addBeak(birdGroup, birdData, birdType) {
        const beakGeometry = new THREE.ConeGeometry(0.06 * birdData.size, 0.25 * birdData.size, 4);
        let beakColor = 0xFFAA00; // Default beak color (orange)
        
        // Set specific beak colors for certain birds
        if (birdType === 'owl') {
            beakColor = 0xFFFF00; // Yellow for owl
        } else if (birdType === 'cardinal') {
            beakColor = 0xFFA500; // Orange for cardinal
        }
        
        const beakMaterial = new THREE.MeshStandardMaterial({ 
            color: beakColor,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.position.set(0, 0.1 * birdData.size, 0.85 * birdData.size);
        beak.rotation.x = -Math.PI / 2;
        birdGroup.add(beak);
    }
    
    // Bird-specific features
    addCardinalFeatures(birdGroup, birdData) {
        // Cardinal crest
        const crestGeometry = new THREE.TetrahedronGeometry(0.15 * birdData.size, 0);
        const crestMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.color,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const crest = new THREE.Mesh(crestGeometry, crestMaterial);
        crest.position.set(0, 0.3 * birdData.size, 0.6 * birdData.size);
        crest.scale.y = 2;
        birdGroup.add(crest);
        
        // Cardinal face mask
        const maskGeometry = new THREE.SphereGeometry(0.2 * birdData.size, 8, 8, 0, Math.PI, 0, Math.PI / 2);
        const maskMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const mask = new THREE.Mesh(maskGeometry, maskMaterial);
        mask.position.set(0, 0.1 * birdData.size, 0.7 * birdData.size);
        birdGroup.add(mask);
    }
    
    addBluebirdFeatures(birdGroup, birdData) {
        // Bluebird breast
        const breastGeometry = new THREE.SphereGeometry(0.4 * birdData.size, 8, 8, 0, Math.PI, 0, Math.PI / 2);
        const breastMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const breast = new THREE.Mesh(breastGeometry, breastMaterial);
        breast.position.set(0, -0.05 * birdData.size, 0.3 * birdData.size);
        breast.rotation.x = Math.PI / 8;
        breast.scale.set(0.8, 0.8, 0.5);
        birdGroup.add(breast);
    }
    
    addGoldfinchFeatures(birdGroup, birdData) {
        // Goldfinch black cap
        const capGeometry = new THREE.SphereGeometry(0.25 * birdData.size, 8, 8, 0, Math.PI, 0, Math.PI / 2);
        const capMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(0, 0.2 * birdData.size, 0.6 * birdData.size);
        cap.rotation.x = -Math.PI / 8;
        cap.scale.set(1, 0.5, 1);
        birdGroup.add(cap);
    }
    
    addHummingbirdFeatures(birdGroup, birdData) {
        // Ruby throat
        const throatGeometry = new THREE.SphereGeometry(0.2 * birdData.size, 8, 8, 0, Math.PI, 0, Math.PI / 2);
        const throatMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor,
            roughness: 0.5,
            metalness: 0.7 // More metallic for the iridescent look
        });
        
        const throat = new THREE.Mesh(throatGeometry, throatMaterial);
        throat.position.set(0, 0 * birdData.size, 0.55 * birdData.size);
        throat.rotation.x = Math.PI / 8;
        throat.scale.set(0.8, 0.3, 0.5);
        birdGroup.add(throat);
        
        // Long beak for hummingbird (overriding the regular beak)
        const beakGeometry = new THREE.CylinderGeometry(0.01 * birdData.size, 0.01 * birdData.size, 0.4 * birdData.size);
        const beakMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const longBeak = new THREE.Mesh(beakGeometry, beakMaterial);
        longBeak.position.set(0, 0.1 * birdData.size, 0.9 * birdData.size);
        longBeak.rotation.x = -Math.PI / 2;
        birdGroup.add(longBeak);
    }
    
    addOwlFeatures(birdGroup, birdData) {
        // Owl ear tufts
        const tuftGeometry = new THREE.ConeGeometry(0.1 * birdData.size, 0.3 * birdData.size, 4);
        const tuftMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.color,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Left ear tuft
        const leftTuft = new THREE.Mesh(tuftGeometry, tuftMaterial);
        leftTuft.position.set(-0.15 * birdData.size, 0.35 * birdData.size, 0.5 * birdData.size);
        leftTuft.rotation.x = -Math.PI / 8;
        leftTuft.rotation.z = -Math.PI / 8;
        birdGroup.add(leftTuft);
        
        // Right ear tuft
        const rightTuft = new THREE.Mesh(tuftGeometry, tuftMaterial);
        rightTuft.position.set(0.15 * birdData.size, 0.35 * birdData.size, 0.5 * birdData.size);
        rightTuft.rotation.x = -Math.PI / 8;
        rightTuft.rotation.z = Math.PI / 8;
        birdGroup.add(rightTuft);
        
        // Owl eyes
        const eyeGeometry = new THREE.SphereGeometry(0.12 * birdData.size);
        const eyeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFF00, // Yellow eyes
            roughness: 0.1,
            metalness: 0.2
        });
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15 * birdData.size, 0.15 * birdData.size, 0.7 * birdData.size);
        birdGroup.add(leftEye);
        
        // Right eye
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15 * birdData.size, 0.15 * birdData.size, 0.7 * birdData.size);
        birdGroup.add(rightEye);
        
        // Pupil geometry
        const pupilGeometry = new THREE.SphereGeometry(0.05 * birdData.size);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        // Left pupil
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.15 * birdData.size, 0.15 * birdData.size, 0.78 * birdData.size);
        birdGroup.add(leftPupil);
        
        // Right pupil
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.15 * birdData.size, 0.15 * birdData.size, 0.78 * birdData.size);
        birdGroup.add(rightPupil);
    }
    
    addTurkeyFeatures(birdGroup, birdData) {
        // Turkey has a distinctive red wattle (the fleshy growth hanging from the neck)
        const wattleGeometry = new THREE.SphereGeometry(0.15 * birdData.size, 8, 8);
        const wattleMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor, // Red color
            roughness: 0.7,
            metalness: 0.2
        });
        
        const wattle = new THREE.Mesh(wattleGeometry, wattleMaterial);
        wattle.position.set(0, -0.1 * birdData.size, 0.65 * birdData.size);
        wattle.scale.set(0.7, 1.2, 0.5);
        birdGroup.add(wattle);
        
        // Turkey's snood (the fleshy protrusion above the beak)
        const snoodGeometry = new THREE.CylinderGeometry(0.03 * birdData.size, 0.02 * birdData.size, 0.2 * birdData.size);
        const snoodMaterial = new THREE.MeshStandardMaterial({ 
            color: birdData.secondaryColor, // Red color
            roughness: 0.7,
            metalness: 0.2
        });
        
        const snood = new THREE.Mesh(snoodGeometry, snoodMaterial);
        snood.position.set(0, 0.2 * birdData.size, 0.75 * birdData.size);
        snood.rotation.x = Math.PI / 3;
        birdGroup.add(snood);
        
        // Turkey's distinctive fanned tail
        const tailGroup = new THREE.Group();
        
        // Create fan-shaped tail with multiple feathers
        const numFeathers = 9;
        const fanRadius = 0.5 * birdData.size;
        const fanSpread = Math.PI * 0.7; // How wide the fan spreads
        
        for (let i = 0; i < numFeathers; i++) {
            const angle = (i / (numFeathers - 1) - 0.5) * fanSpread;
            
            const featherGeometry = new THREE.ConeGeometry(0.08 * birdData.size, 0.7 * birdData.size, 4);
            const featherMaterial = new THREE.MeshStandardMaterial({ 
                color: birdData.color,
                roughness: 0.9,
                metalness: 0.1
            });
            
            const feather = new THREE.Mesh(featherGeometry, featherMaterial);
            
            // Position and rotate each feather to form a fan shape
            feather.position.set(
                Math.sin(angle) * fanRadius * 0.2,
                Math.cos(angle) * fanRadius * 0.2,
                0
            );
            
            feather.rotation.x = Math.PI / 2; // Tilt up
            feather.rotation.z = -angle; // Fan out
            
            tailGroup.add(feather);
        }
        
        // Position the entire tail group
        tailGroup.position.set(0, 0.1 * birdData.size, -0.7 * birdData.size);
        tailGroup.rotation.x = Math.PI / 6; // Tilt up slightly
        
        birdGroup.add(tailGroup);
        
        // Turkey's distinctive head structure (slightly elongated)
        const headAdjustment = birdGroup.children.find(child => 
            Math.abs(child.position.z - 0.6 * birdData.size) < 0.1 && 
            child instanceof THREE.Mesh);
            
        if (headAdjustment) {
            headAdjustment.scale.set(0.7, 0.8, 1.1); // Make head more elongated
            headAdjustment.position.y += 0.05 * birdData.size; // Raise the head slightly
        }
        
        // Add small "bumps" on the head (caruncles)
        for (let i = 0; i < 5; i++) {
            const bumpSize = (0.04 + Math.random() * 0.03) * birdData.size;
            const bumpGeometry = new THREE.SphereGeometry(bumpSize);
            const bumpMaterial = new THREE.MeshStandardMaterial({ 
                color: birdData.secondaryColor,
                roughness: 0.7,
                metalness: 0.2
            });
            
            const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
            
            // Random position on top of head
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.15 * birdData.size;
            
            bump.position.set(
                Math.cos(angle) * radius,
                0.2 * birdData.size + Math.random() * 0.05 * birdData.size,
                0.6 * birdData.size + Math.sin(angle) * radius
            );
            
            birdGroup.add(bump);
        }
        
        // Turkey's longer legs
        const legGeometry = new THREE.CylinderGeometry(0.02 * birdData.size, 0.02 * birdData.size, 0.5 * birdData.size);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, // Brown color for turkey legs
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15 * birdData.size, -0.4 * birdData.size, 0);
        birdGroup.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15 * birdData.size, -0.4 * birdData.size, 0);
        birdGroup.add(rightLeg);
        
        // Add turkey feet
        this.addTurkeyFeet(birdGroup, birdData, leftLeg.position, 'left');
        this.addTurkeyFeet(birdGroup, birdData, rightLeg.position, 'right');
    }
    
    // Helper method to create turkey feet
    addTurkeyFeet(birdGroup, birdData, legPosition, side) {
        const footColor = 0x8B4513; // Brown
        const footMaterial = new THREE.MeshStandardMaterial({ 
            color: footColor,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create the main part of the foot
        const footGeometry = new THREE.BoxGeometry(0.15 * birdData.size, 0.03 * birdData.size, 0.15 * birdData.size);
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        
        // Position at the bottom of the leg
        foot.position.set(
            legPosition.x,
            legPosition.y - 0.25 * birdData.size,
            legPosition.z + 0.05 * birdData.size
        );
        
        birdGroup.add(foot);
        
        // Add toes (three forward, one backward)
        const toeGeometry = new THREE.CylinderGeometry(0.01 * birdData.size, 0.01 * birdData.size, 0.15 * birdData.size);
        
        // Forward middle toe
        const middleToe = new THREE.Mesh(toeGeometry, footMaterial);
        middleToe.rotation.x = Math.PI / 2;
        middleToe.position.set(
            legPosition.x,
            foot.position.y,
            foot.position.z + 0.1 * birdData.size
        );
        birdGroup.add(middleToe);
        
        // Forward side toes
        const leftToe = new THREE.Mesh(toeGeometry, footMaterial);
        leftToe.rotation.x = Math.PI / 2;
        leftToe.rotation.z = Math.PI / 6;
        leftToe.position.set(
            legPosition.x - 0.07 * birdData.size,
            foot.position.y,
            foot.position.z + 0.07 * birdData.size
        );
        birdGroup.add(leftToe);
        
        const rightToe = new THREE.Mesh(toeGeometry, footMaterial);
        rightToe.rotation.x = Math.PI / 2;
        rightToe.rotation.z = -Math.PI / 6;
        rightToe.position.set(
            legPosition.x + 0.07 * birdData.size,
            foot.position.y,
            foot.position.z + 0.07 * birdData.size
        );
        birdGroup.add(rightToe);
        
        // Backward toe
        const backToe = new THREE.Mesh(toeGeometry, footMaterial);
        backToe.rotation.x = Math.PI / 2;
        backToe.position.set(
            legPosition.x,
            foot.position.y,
            foot.position.z - 0.08 * birdData.size
        );
        birdGroup.add(backToe);
    }
}

// Bird animation class - handles flying, perching, etc.
class BirdAnimation {
    constructor(birdModel, scene) {
        this.birdModel = birdModel;
        this.scene = scene;
        this.state = 'idle';
        this.animationMixer = new THREE.AnimationMixer(birdModel);
        this.clock = new THREE.Clock();
        this.flyingTween = null;
        
        // Wings for animation
        this.leftWing = this.birdModel.children.find(child => 
            child.position.x < 0 && Math.abs(child.rotation.z) > 0);
        this.rightWing = this.birdModel.children.find(child => 
            child.position.x > 0 && Math.abs(child.rotation.z) > 0);
        
        // Initial wing rotations
        this.initialLeftWingRotation = this.leftWing ? this.leftWing.rotation.z : 0;
        this.initialRightWingRotation = this.rightWing ? this.rightWing.rotation.z : 0;
    }
    
    update() {
        const delta = this.clock.getDelta();
        this.animationMixer.update(delta);
        
        // Handle different animation states
        switch(this.state) {
            case 'flying':
                this.animateWings(delta);
                break;
            case 'idle':
                this.occasionalMovement(delta);
                break;
            case 'perching':
                // Small perching movements
                this.perchingMovement(delta);
                break;
        }
    }
    
    animateWings(delta) {
        // Simple wing flapping
        if (this.leftWing && this.rightWing) {
            const wingSpeed = 10;
            const flapAmplitude = Math.PI / 6;
            const time = Date.now() * 0.001;
            
            this.leftWing.rotation.z = this.initialLeftWingRotation + 
                Math.sin(time * wingSpeed) * flapAmplitude;
            this.rightWing.rotation.z = this.initialRightWingRotation - 
                Math.sin(time * wingSpeed) * flapAmplitude;
        }
    }
    
    occasionalMovement(delta) {
        // Occasional small movements for idle birds
        if (Math.random() < 0.01) {
            const smallRotation = (Math.random() - 0.5) * 0.2;
            this.birdModel.rotation.y += smallRotation;
        }
    }
    
    perchingMovement(delta) {
        // Subtle perching movements
        if (Math.random() < 0.05) {
            const smallMovement = (Math.random() - 0.5) * 0.05;
            this.birdModel.position.y += smallMovement;
        }
    }
    
    fly(startPosition, endPosition, duration) {
        // Cancel any existing flying animation
        if (this.flyingTween) {
            this.flyingTween.stop();
        }
        
        this.state = 'flying';
        
        // Reset rotation and position
        this.birdModel.position.copy(startPosition);
        this.birdModel.lookAt(endPosition);
        
        // Get flight path - arc upward
        const midPoint = new THREE.Vector3().lerpVectors(startPosition, endPosition, 0.5);
        midPoint.y += 5; // Arc height
        
        const flightPoints = [
            startPosition,
            midPoint,
            endPosition
        ];
        
        // Create curve
        const curve = new THREE.CatmullRomCurve3(flightPoints);
        const points = curve.getPoints(50);
        
        let progress = 0;
        
        // Create tween for smooth flight animation
        this.flyingTween = new TWEEN.Tween({ progress: 0 })
            .to({ progress: 1 }, duration)
            .onUpdate((obj) => {
                const position = curve.getPointAt(obj.progress);
                this.birdModel.position.copy(position);
                
                // Calculate direction
                if (obj.progress < 0.99) { // Avoid calculation at the very end
                    const tangent = curve.getTangentAt(obj.progress);
                    const lookAtPoint = new THREE.Vector3().addVectors(position, tangent);
                    this.birdModel.lookAt(lookAtPoint);
                    
                    // Add slight bank to turns
                    const nextPosition = curve.getPointAt(Math.min(obj.progress + 0.01, 1));
                    const angle = Math.atan2(nextPosition.x - position.x, nextPosition.z - position.z);
                    this.birdModel.rotation.z = (angle - this.birdModel.rotation.y) * 0.3;
                }
            })
            .onComplete(() => {
                // Return to idle when flight completes
                this.state = 'perching';
                
                // Reset wings
                if (this.leftWing && this.rightWing) {
                    this.leftWing.rotation.z = this.initialLeftWingRotation;
                    this.rightWing.rotation.z = this.initialRightWingRotation;
                }
                
                // Face a random direction after landing
                this.birdModel.rotation.y = Math.random() * Math.PI * 2;
                this.birdModel.rotation.x = 0;
                this.birdModel.rotation.z = 0;
            })
            .start();
    }
    
    cleanup() {
        if (this.flyingTween) {
            this.flyingTween.stop();
        }
        this.animationMixer.stopAllAction();
    }
} 