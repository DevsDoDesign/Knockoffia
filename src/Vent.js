import EventEmitter from 'eventemitter'

export default new class Vent {

	emitter = new EventEmitter

	emit(...args) {
		this.emitter.emit(...args)
	}

	on(...args) {
		this.emitter.on(...args)
	}

	off (...args) {
		this.emitter.off(...args)
	}

	// KEYS
	keyPressed(digit) {
		this.emit('key-pressed', digit)
	}
	onKeyPressed(cb) {
		this.on('key-pressed', cb)
	}
	offKeyPressed(cb) {
		this.on('key-pressed', cb)
	}

}
