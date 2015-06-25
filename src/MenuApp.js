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
	getInitialState() {
		return {
			currentApp: 'Phone'
		}
	},
	exit(key) {
		if (key === KEYS.CLEAR) {
			Vent.exit()
		}
		else if (key === KEYS.UP) {
			this.up()
		}
		else if (key === KEYS.DOWN) {
			this.down()
		}
	},
	render() {
		return (
			<div>{this.state.currentApp}</div>
		)
	},
	up() {
		var nextAppIndex = this.currentAppIndex() + 1;

		this.setState({
			currentApp: this.props.apps[nextAppIndex] || this.props.apps[0]
		})
	},
	down() {
		var prevAppIndex = this.currentAppIndex() - 1;

		this.setState({
			currentApp: this.props.apps[prevAppIndex] || this.props.apps[this.props.apps.length - 1]
		})
	},
	currentAppIndex() {
		return this.props.apps.indexOf(this.state.currentApp)
	}
})
