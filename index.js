import * as ScaledCanvas from './ScaledCanvas.js'
import * as ColorConversion from './ColorConversion.js'
import * as RandomNumberGenerator from './RandomNumberGenerator.js'
import * as Input from './Input.js'

const size = 64 			// Width/height of virtual canvas
const scale = 8 			// Actual canvas is scaled to increase pixel size
let canvas = null			// Instance of ScaledCanvas
let prng = null 			// RNG algorithm instance
let prng_seed = null 		// Seed for RNG
let prng_ratio = 0 			// Ratio of true to false values
let prng_threshold = 0		// Threshold before 'true' result sequences are broken up

const colors = Object.freeze({ 
	black: { r:0, g:0, b:0, a:255 },
	white: { r:255, g:255, b:255, a:255 }
})

// Application functions to expose to UI events
const app = {
	setSeed: setSeed,
	setRatio: setRatio,
	setThreshold: setThreshold,
	selectRandomColors: selectRandomColors,
	selectRandomBoolean: selectRandomBoolean,
	selectLimitedRandomBoolean: selectLimitedRandomBoolean
}

window.addEventListener("load", () => {
	// Create canvas
	let container = document.getElementById("output")
	canvas = new ScaledCanvas.ScaledCanvas(size, size, scale, container)

	// Set up UI
	Input.bindEvents(app)

	// Set default random func
	selectRandomColors()
})

function setSeed(value) {
	// Set value
	prng_seed = value

	// Update display
	updateDisplay()
}

function setRatio(value) {
	// Set value
	if (value > 1.0) value = 1.0
	else if (value < 0.0) value = 0.0
	prng_ratio = value

	// Update display
	if (prng) {
		let type = prng.constructor.name
		if (type === "RandomBoolean" || type === "LimitedRandomBoolean") {
			updateDisplay()
		}
	}
}

function setThreshold(value) {
	// Set value
	if (value > 10) value = 10
	else if (value < 1) value = 1
	prng_threshold = value

	// Update display
	if (prng) {
		let type = prng.constructor.name
		if (type === "LimitedRandomBoolean") {
			updateDisplay()
		}
	}
}

// Update display based on the current PRNG
function updateDisplay() {
	if (prng) {
		let type = prng.constructor.name
		
		switch (type) {
			case "SeededSfc32":
				selectRandomColors()
				return
			case "RandomBoolean":
				selectRandomBoolean()
				return
			case "LimitedRandomBoolean":
				selectLimitedRandomBoolean()
				return
		}
	}
}

function selectRandomColors() {
	// Set algo to number generation (returns values between 0.0 to 1.0)
	prng = new RandomNumberGenerator.SeededSfc32(prng_seed)

	// Draw pixels
	plotRandomPixels()
}

function selectRandomBoolean() {
	// Set algo to number generation (returns true and false values)
	prng = new RandomNumberGenerator.RandomBoolean(prng_seed, prng_ratio)

	// Draw pixels
	plotRandomPixels()
}

function selectLimitedRandomBoolean() {
	// Set algo to number generation (returns true and false values)
	prng = new RandomNumberGenerator.LimitedRandomBoolean(prng_seed, prng_ratio, prng_threshold)

	// Draw pixels
	plotRandomPixels()
}

function plotRandomPixels() {
	// Clear old output
	canvas.clear()

	// Number of random values to generate
	let amount = size * size

	// Get the name of the algo for color selection
	let prng_name = prng.constructor.name

	// Draw random pixels
	for (let i = 0; i < amount; i++) {
		let value = prng.random()
		let color = getColor(prng_name, value)
		canvas.drawPixelAtIndex(i, color)
	}
}

// Return a color based on the type of algo and value
function getColor(type, value) {
	switch (type) {
		case "SeededSfc32":
			let color = ColorConversion.hslToRgb(value * 360, 1.0, 0.6)
			return { r:color[0], g:color[1], b:color[2], a:255 }
		case "RandomBoolean":
		case "LimitedRandomBoolean":
		default:
			if (value) return colors.black
			else return colors.white
	}
}
