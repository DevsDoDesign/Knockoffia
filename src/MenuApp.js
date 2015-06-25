import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.exit)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.exit)
	},
	exit(key) {
		if (key === KEYS.CLEAR) {
			Vent.exit()
		}
	},
	render() {
		return (
		<div>APPS HERE!</div>
		)
	}
})
