import EventEmitter from 'eventemitter'

export default new class Vent {

	// OS LEVEL

	exit() {
		this.emit('exit')
	}
	onExit(cb) {
		this.on('exit', cb)
	}
	openMenuApp() {
		this.emit('open-menu')
	}
	onOpenMenuApp(cb) {
		this.on('open-menu', cb)
	}
	openApp(app) {
		this.emit('open-app', app)
	}
	onOpenApp(cb) {
		this.on('open-app', cb)
	}


	// KEYS
	keyPressed(digit) {
		this.emit('key-pressed', digit)
	}
	onKeyPressed(cb) {
		this.on('key-pressed', cb)
	}
	offKeyPressed(cb) {
		this.off('key-pressed', cb)
	}

	// CRAPCHAT
	crapChatContactPicked(contact) {
		this.emit('crapchat-contact-picked', contact)
	}
	onCrapChatContactPicked(cb) {
		this.on('crapchat-contact-picked', cb)
	}
	offCrapChatContactPicked(cb) {
		this.off('crapchat-contact-picked', cb)
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
