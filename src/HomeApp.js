import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	getInitialState() {
		return {
			time: this.getTime()
		}
	},
	getTime() {
		var date = new Date;
		return `${date.getHours()}:${date.getMinutes()}`
	},
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)

		let intervalId = setInterval(() => {
			this.setState({ time: this.getTime() })
		}, 1000)

		this.setState({ intervalId })
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
		clearInterval(this.state.intervalId)
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
				<p className="time">{this.state.time}</p>
				<p className="home-title">#DevsDoDesign</p>
				<p className="bottom-button">MENU</p>
			</div>
		)
	}
})
