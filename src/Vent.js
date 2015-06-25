import EventEmitter from 'eventemitter'

export default new class Vent {

	// OS LEVEL

	exit() {
		this.emit('exit')
	}
	onExit(cb) {
		this.on('exit', cb)
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





	// ALIASES

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

}
