// A canvas with a 2d context
// Scale allows the canvas to have a virtual size smaller than the physical one
// This makes "pixels" larger when drawn with drawPixel
var ScaledCanvas = class {
	constructor(width, height, scale, container = document.body) {
		this.width = width
		this.height = height
		this.scale = scale
		this.container = container
		createCanvas.call(this)
	}

	drawPixel(x, y, color) {
		if (this.context) {
			this.context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + (color.a / 255) + ")"
			this.context.fillRect(x * this.scale, y * this.scale, this.scale, this.scale)
		}
	}

	drawPixelAtIndex(index, color) {
		let y = Math.floor(index / this.width)
		let x = (index % this.width)
		this.drawPixel(x, y, color)
	}

	clear() {
		if (this.context) {
			this.context.save()
			this.context.setTransform(1, 0, 0, 1, 0, 0)
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.context.restore()
		}
	}
}

function createCanvas() {
	// Create canvas
	let canvas = this.canvas = document.createElement("canvas")
	canvas.width = (this.width * this.scale)
	canvas.height = (this.height * this.scale)

	// Add canvas to container element
	this.container.appendChild(canvas)

	// Get context
	if (this.canvas.getContext) {
		this.context = this.canvas.getContext("2d")
		this.context.imageSmoothingEnabled = false
	}
}

export { ScaledCanvas }