import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	getInitialState() {
		return {
			currentApp: 'Phone'
		}
	},
	keyPressed(key) {
		if (key === KEYS.CLEAR) {
			Vent.home()
		}
		else if (key === KEYS.ENTER) {
			this.enter()
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
	enter() {
		Vent.openApp(this.state.currentApp)
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
