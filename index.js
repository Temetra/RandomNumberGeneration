import { ScaledCanvas } from './ScaledCanvas.js'
import { hslToRgb, rgba } from './ColorConversion.js'
import * as RandomNumberGenerator from './RandomNumberGenerator.js'
import * as Input from './Input.js'

const size = 64 			// Width/height of virtual canvas
const scale = 8 			// Actual canvas is scaled to increase pixel size
let canvas = null			// Instance of ScaledCanvas
let prng = null 			// RNG algorithm instance
let prng_seed = null 		// Seed for RNG
let prng_ratio = 0 			// Ratio of true to false values
let prng_threshold = 0		// Threshold before 'true' result sequences are broken up
let currentScenario = null

const colors = Object.freeze({ 
	black: { r:0, g:0, b:0, a:255 },
	white: { r:255, g:255, b:255, a:255 },
	apple: rgba(43, 156, 28, 1),
	banana: rgba(229, 220, 52, 1),
	orange: rgba(244, 133, 21, 1),
	pear: rgba(153, 205, 71, 1),
	strawberry: rgba(205, 71, 71, 1)
})

const fruits = {
	apple: 1,
	banana: 1,
	pear: 1,
	orange: 1,
	strawberry: 1
}

const scenarios = {
	randomColors: function() {
		prng = new RandomNumberGenerator.SeededSfc32(prng_seed)
		plotRandomPixels()
	},

	randomBooleans: function() {
		prng = new RandomNumberGenerator.RandomBoolean(prng_seed, prng_ratio)
		plotRandomPixels()
	},

	limitedRandomBooleans: function() {
		prng = new RandomNumberGenerator.LimitedRandomBoolean(prng_seed, prng_ratio, prng_threshold)
		plotRandomPixels()
	},

	randomFruit: function() {
		prng = new RandomNumberGenerator.RandomWeightedItem(fruits, prng_seed)
		plotRandomPixels()
	}
}

// Application functions to expose to UI events
const app = {
	scenarios: Object.getOwnPropertyNames(scenarios).reduce((a, c) => { a[c] = c; return a; }, {}),
	setScenario: setScenario,
	setSeed: setSeed,
	setRatio: setRatio,
	setThreshold: setThreshold,
	setFruitWeight: setFruitWeight,
	getRandomCharacters: getRandomCharacters
}

window.addEventListener("load", () => {
	// Create canvas
	let container = document.getElementById("output")
	canvas = new ScaledCanvas(size, size, scale, container)

	// Set up UI
	Input.bindEvents(app)

	// Set default random func
	setScenario("randomColors")

	// Add app to window for debugging
	window.app = app
})

// Returns 16 random characters [a-zA-Z0-9]
function getRandomCharacters() {
	let rnd = new RandomNumberGenerator.RandomCharacters("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	return rnd.random(16)
}

function setScenario(selectedScenario) {
	// Set the current scenario
	currentScenario = scenarios[selectedScenario]

	// Execute scenario
	currentScenario()
}

function setSeed(value) {
	// Set value
	prng_seed = value

	// Update display
	if (currentScenario) currentScenario()
}

function setRatio(value) {
	// Set value
	if (value > 1.0) value = 1.0
	else if (value < 0.0) value = 0.0
	prng_ratio = value

	// Update display
	if (currentScenario === scenarios.randomBooleans || currentScenario === scenarios.limitedRandomBooleans) {
		currentScenario()
	}
}

function setThreshold(value) {
	// Set value
	if (value > 10) value = 10
	else if (value < 1) value = 1
	prng_threshold = value

	// Update display
	if (currentScenario === scenarios.limitedRandomBooleans) {
		currentScenario()
	}
}

function setFruitWeight(fruit, weight) {
	// Set value
	fruits[fruit] = weight

	// Update display
	if (currentScenario === scenarios.randomFruit) {
		currentScenario()
	}
}

function plotRandomPixels() {
	// Clear old output
	canvas.clear()

	// Number of random values to generate
	let amount = size * size

	// Draw random pixels
	for (let i = 0; i < amount; i++) {
		let value = prng.random()
		let color = getColor(currentScenario.name, value)
		canvas.drawPixelAtIndex(i, color)
	}
}

// Return a color based on the type of algo and value
function getColor(type, value) {
	switch (type) {
		case "randomBooleans":
		case "limitedRandomBooleans":
			if (value) return colors.black
			return colors.white
		case "randomFruit":
			return colors[value]
		case "randomColors":
			/* falls through */
		default:
			let color = hslToRgb(value * 360, 1.0, 0.6)
			return { r:color[0], g:color[1], b:color[2], a:255 }
	}
}
