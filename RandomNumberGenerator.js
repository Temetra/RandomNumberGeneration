// https://stackoverflow.com/a/47593316
// http://papa.bretmulvey.com/post/124027987928/hash-functions
// http://www.pcg-random.org/posts/some-prng-implementations.html

// Used for seed generation
function xfnv1a(k) {
	for (var i = 0, h = 2166136261 >>> 0; i < k.length; i++)
		h = Math.imul(h ^ k.charCodeAt(i), 16777619);
	return function () {
		h += h << 13; h ^= h >>> 7;
		h += h << 3; h ^= h >>> 17;
		return (h += h << 5) >>> 0;
	}
}

// Pseudorandom number generator
function sfc32(a, b, c, d) {
	return function () {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
		var t = (a + b) | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		d = d + 1 | 0;
		t = t + d | 0;
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	}
}

// random() returns a number between 0.0 and 1.0
var SeededSfc32 = class {
	constructor(seed_string) {
		let seed = xfnv1a(seed_string)
		this.random = sfc32(seed(), seed(), seed(), seed())
	}
}

// random() returns true or false
// The ratio of true to false can be adjusted
var RandomBoolean = class {
	constructor(seed_string, ratio = 0.5) {
		this._rng = new SeededSfc32(seed_string)
		this.ratio = ratio
	}

	random() {
		let rnd = this._rng.random()
		return (rnd <= this.ratio)
	}
}

// random() returns true or false
// The ratio of true to false can be adjusted
// Sequential true results are limited to the threshold
// Results past this threshold are deferred for later, to maintain the ratio
var LimitedRandomBoolean = class {
	constructor(seed_string, ratio = 0.5, run_threshold = 3) {
		this._rng = new RandomBoolean(seed_string, ratio)
		this.run_length = 0
		this.run_threshold = run_threshold
		this.backlog = 0
	}

	random() {
		let rand = this._rng.random()

		if (rand) {
			this.run_length += 1
			if (this.run_length >= this.run_threshold) {
				rand = false
				this.backlog += 1
				this.run_length = 0
			}
		} else if (this.backlog > 0 && this.run_length <= 1) {
			rand = true
			this.backlog -= 1
			this.run_length += 1
		} else {
			this.run_length = 0
		}

		return rand
	}
}

export { SeededSfc32, RandomBoolean, LimitedRandomBoolean }