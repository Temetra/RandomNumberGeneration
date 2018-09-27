let app = null

function bindEvents(appObj) {
	app = appObj

	document.getElementById("random_colors").addEventListener("change", randomColorsChange)
	document.getElementById("random_pixels").addEventListener("change", randomPixelsChange)
	document.getElementById("limited_random_pixels").addEventListener("change", limitedRandomPixelsChange)

	let ratio_range = document.getElementById("ratio_range")
	ratio_range.addEventListener("input", ratioRangeInput)
	ratioRangeInput({target:ratio_range})

	let threshold_range = document.getElementById("threshold_range")
	threshold_range.addEventListener("input", thresholdRangeInput)
	thresholdRangeInput({target:threshold_range})

	let seed_input = document.getElementById("seed_input")
	seed_input.addEventListener("input", seedInputChange)
	seedInputChange({target:seed_input})
}

function randomColorsChange() {
	document.getElementById("ratio_slider").style.visibility = "hidden"
	document.getElementById("threshold_slider").style.visibility = "hidden"
	app.selectRandomColors() 
}

function randomPixelsChange() {
	document.getElementById("ratio_slider").style.visibility = "visible"
	document.getElementById("threshold_slider").style.visibility = "hidden"
	app.selectRandomBoolean() 
}

function limitedRandomPixelsChange() {
	document.getElementById("ratio_slider").style.visibility = "visible"
	document.getElementById("threshold_slider").style.visibility = "visible"
	app.selectLimitedRandomBoolean() 
}

function ratioRangeInput(evt) {
	let value = parseInt(evt.target.value) * 0.01
	app.setRatio(value) 
}

function thresholdRangeInput(evt) {
	let value = parseInt(evt.target.value)
	app.setThreshold(value)
}

function seedInputChange(evt) {
	let value = evt.target.value
	app.setSeed(value)
}

export { bindEvents }