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
	alert(message) {
		this.emit('alert', message)
	}
	onAlert(cb) {
		this.on('alert', cb)
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

	// CONTACTS
	contactPicked(contact) {
		this.emit('contact-picked', contact)
	}
	onContactPicked(cb) {
		this.on('contact-picked', cb)
	}
	offContactPicked(cb) {
		this.off('contact-picked', cb)
	}

	// Blown Over
	blownOverPostcodeEntered(postcode) {
		this.emit('blown-over-postcode-entered', postcode)
	}
	onBlownOverPostcodeEntered(cb) {
		this.on('blown-over-postcode-entered', cb)
	}
	offBlownOverPostcodeEntered(cb) {
		this.off('blown-over-postcode-entered', cb);
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
