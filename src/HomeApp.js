import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	compoentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	keyPressed(key) {
		console.log('key', key)
		if (key === KEYS.ENTER) {
			Vent.openMenuApp()
		}
	},
	render() {
		return (
			<div>
				<p>12:24pm</p>
				<p><strong>#DevsDoDesign</strong></p>
				<p>MENU</p>
			</div>
		)
	}
})
