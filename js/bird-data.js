// Bird data for the game
const BIRD_TYPES = [
    'cardinal',
    'bluebird',
    'goldfinch',
    'hummingbird',
    'owl',
    'turkey'
];

// Database of bird information
const BIRD_DATABASE = {
    cardinal: {
        name: "Northern Cardinal",
        scientificName: "Cardinalis cardinalis",
        description: "A distinctive, bright red bird with a black face mask and a prominent crest. Cardinals are year-round residents and don't migrate. Males are bright red, while females are more brownish with red accents.",
        color: 0xE41B17, // Main color for the bird model
        secondaryColor: 0x000000, // Secondary color (face mask, details)
        size: 1.0, // Relative size multiplier
        difficulty: 1, // 1-5, affects spawn distance and behavior
        perchHeight: [1, 3], // Preferred height range for perching in units
        activity: "dawn-dusk", // When the bird is most active
        image: "cardinal.jpg" // For the journal
    },
    bluebird: {
        name: "Eastern Bluebird",
        scientificName: "Sialia sialis",
        description: "A small thrush with a bright blue back and rusty-colored throat and breast. Eastern Bluebirds have a sweet, warbling song and are often seen in open woodlands and meadows.",
        color: 0x3B5998, // Blue
        secondaryColor: 0xC04000, // Rusty throat/breast
        size: 0.8,
        difficulty: 2,
        perchHeight: [2, 5],
        activity: "day",
        image: "bluebird.jpg"
    },
    goldfinch: {
        name: "American Goldfinch",
        scientificName: "Spinus tristis",
        description: "A small, brightly colored finch with a conical bill. Males are vibrant yellow with black wings and a black cap during breeding season. They have an undulating flight pattern and a distinctive, canary-like song.",
        color: 0xFFD700, // Gold
        secondaryColor: 0x000000, // Black wings
        size: 0.7,
        difficulty: 3,
        perchHeight: [1, 4],
        activity: "day",
        image: "goldfinch.jpg"
    },
    hummingbird: {
        name: "Ruby-throated Hummingbird",
        scientificName: "Archilochus colubris",
        description: "The only hummingbird commonly found in eastern North America. Males have a brilliant ruby-red throat that can appear black in certain light. Known for their ability to hover in mid-air and fly backward.",
        color: 0x228B22, // Green
        secondaryColor: 0xE41B17, // Ruby throat
        size: 0.5,
        difficulty: 4,
        perchHeight: [2, 6],
        activity: "dawn-dusk",
        image: "hummingbird.jpg"
    },
    owl: {
        name: "Great Horned Owl",
        scientificName: "Bubo virginianus",
        description: "A large, powerful owl with prominent ear tufts that resemble horns. It has a wide range across the Americas and is known for its deep hooting call. It's a nocturnal predator with excellent night vision and hearing.",
        color: 0x8B4513, // Brown
        secondaryColor: 0xD2B48C, // Tan
        size: 1.5,
        difficulty: 5,
        perchHeight: [4, 8],
        activity: "night",
        image: "owl.jpg"
    },
    turkey: {
        name: "Wild Turkey",
        scientificName: "Meleagris gallopavo",
        description: "A large, ground-dwelling bird native to North America. Known for its distinctive gobbling call, fanned tail, and wattles. Wild turkeys primarily walk but can fly for short distances and often roost in trees at night.",
        color: 0x4A412A, // Dark brown
        secondaryColor: 0xE30B5C, // Red wattle color
        size: 2.0, // Larger than other birds
        difficulty: 2, // Easier to spot due to size
        perchHeight: [0, 2], // Prefers ground or low perches
        activity: "day",
        image: "turkey.jpg"
    }
};

// Perch points in the world (x, y, z coordinates)
const PERCH_POINTS = [
    { x: 10, y: 5, z: -15 },
    { x: -8, y: 3, z: -12 },
    { x: 15, y: 4, z: 5 },
    { x: -12, y: 6, z: 8 },
    { x: 0, y: 7, z: -20 },
    { x: 20, y: 5, z: -10 },
    { x: -18, y: 4, z: -5 },
    { x: 22, y: 8, z: 15 },
    { x: -20, y: 7, z: 12 },
    { x: 5, y: 3, z: 25 }
]; 