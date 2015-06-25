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
		
	},
	render() {
		return (
			<div>
				<p><strong>#DevsDoDesign</strong></p>
				<p>Kickass projects, from a team of four kickass developers.</p>
			</div>
		)
	}
})
