let app = null

function bindEvents(appObj) {
	app = appObj

	document.getElementById("random_colors").addEventListener("change", randomColorsChange)
	document.getElementById("random_pixels").addEventListener("change", randomPixelsChange)
	document.getElementById("limited_random_pixels").addEventListener("change", limitedRandomPixelsChange)
	document.getElementById("random_fruit").addEventListener("change", randomFruitChange)

	let elem = document.getElementById("seed_input")
	elem.value = app.getRandomCharacters()
	elem.addEventListener("input", (evt) => {
		let value = evt.target.value
		app.setSeed(value)
	})
	elem.dispatchEvent(new Event("input"))

	addAndTriggerEvent("ratio_range", "input", (evt) => {
		let value = parseInt(evt.target.value) * 0.01
		app.setRatio(value) 
	})

	addAndTriggerEvent("threshold_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setThreshold(value)
	})

	addAndTriggerEvent("apple_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setFruitWeight("apple", value)
	})

	addAndTriggerEvent("banana_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setFruitWeight("banana", value)
	})

	addAndTriggerEvent("orange_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setFruitWeight("orange", value)
	})

	addAndTriggerEvent("pear_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setFruitWeight("pear", value)
	})

	addAndTriggerEvent("strawberry_range", "input", (evt) => {
		let value = parseInt(evt.target.value)
		app.setFruitWeight("strawberry", value)
	})
}

function addAndTriggerEvent(elementName, eventType, func) {
	let elem = document.getElementById(elementName)
	elem.addEventListener(eventType, func)
	elem.dispatchEvent(new Event(eventType))
}

function hide(elementName) {
	document.getElementById(elementName).classList.add("hide")
}

function show(elementName) {
	document.getElementById(elementName).classList.remove("hide")
}

function randomColorsChange() {
	hide("ratio_slider")
	hide("threshold_slider")
	hide("fruit_sliders")
	app.setScenario(app.scenarios.randomColors)
}

function randomPixelsChange() {
	show("ratio_slider")
	hide("threshold_slider")
	hide("fruit_sliders")
	app.setScenario(app.scenarios.randomBooleans)
}

function limitedRandomPixelsChange() {
	show("ratio_slider")
	show("threshold_slider")
	hide("fruit_sliders")
	app.setScenario(app.scenarios.limitedRandomBooleans)
}

function randomFruitChange() {
	hide("ratio_slider")
	hide("threshold_slider")
	show("fruit_sliders")
	app.setScenario(app.scenarios.randomFruit)
}

export { bindEvents }