import * as ScaledCanvas from './ScaledCanvas.js'
import * as SeedableRandom from './SeedableRandom.js'
import * as ColorConversion from './ColorConversion.js'

let canvas = null
let size = 64
let scale = 8
let rnd = null
let rnd_seed = "asdewuyxnequ"
let rnd_ratio = 0.33
let rnd_threshold = 3

let app = {
	setRatio : setRatio,
	getColor : getColor,
	selectRandom : selectRandom,
	selectRandomBoolean: selectRandomBoolean,
	selectLimitedRandomBoolean: selectLimitedRandomBoolean
}

window.addEventListener("load", () => {
	let container = document.getElementById("output")
	canvas = new ScaledCanvas.ScaledCanvas(size, size, scale, container)
	selectRandom()
	window.app = app
})

function setRatio(input) {
	if (input > 1.0) input = 1.0
	else if (input < 0.0) input = 0.0
	rnd_ratio = input
}

function selectRandom() {
	rnd = new SeedableRandom.SeededSfc32(rnd_seed)
	plotRandomPixels()
}

function selectRandomBoolean() {
	rnd = new SeedableRandom.RandomBoolean(rnd_seed, rnd_ratio)
	plotRandomPixels()
}

function selectLimitedRandomBoolean() {
	rnd = new SeedableRandom.LimitedRandomBoolean(rnd_seed, rnd_ratio, rnd_threshold)
	plotRandomPixels()
}

function plotRandomPixels() {
	canvas.clear()
	let amount = size * size
	for (let i = 0; i < amount; i++) {
		let value = rnd.random()
		let color = getColor(value)
		canvas.drawPixelAtIndex(i, color)
	}
}

function getColor(value) {
	let type = rnd.constructor.name
	switch (type) {
		case "SeededSfc32":
			let color = ColorConversion.hslToRgb(value * 360, 1.0, 0.6)
			return { r:color[0], g:color[1], b:color[2], a:255 }
		case "RandomBoolean":
		case "LimitedRandomBoolean":
		default:
			if (value) return { r:0, g:0, b:0, a:255 }
			else return { r:255, g:255, b:255, a:255 }
	}
}
