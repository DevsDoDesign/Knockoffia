import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

const TONES = new Map([
	['Bagging Area', 'BaggingArea.mp3'],
	['Boop', 'Boop.mp3'],
	['Boop (Low)', 'BoopLow.mp3'],
	['Buffoon', 'Buffoon.mp3'],
	['Buffoon (High)', 'BuffoonHigh.mp3'],
	['Cashier', 'Cashier.mp3'],
	['Jumping', 'Jumping.mp3'],
	['Jumping (High)', 'JumpingHigh.mp3'],
	['Nokia Theme', 'NokiaTheme.mp3'],
	['Nokia Theme (High)', 'NokiaThemeHigh.mp3'],
	['Vehicle', 'Vehicle.mp3'],
])

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	getInitialState() {
		return {
			current: 'Bagging Area',
			selections: [for (tone of TONES.keys()) tone ]
		}
	},
	keyPressed(key) {
		if (key === KEYS.CLEAR) {
			Vent.exit()
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
		console.log(this.state.current, this.state.selections)
		return (
		<div>{this.state.current}</div>
		)
	},
	enter() {
		console.log(this.state.current);
		(new Audio(`/tones/${TONES.get(this.state.current)}`)).play()
	},
	up() {
		var nextIndex = this.currentIndex() + 1;

		this.setState({
			current: this.state.selections[nextIndex] || this.state.selections[0]
		})
	},
	down() {
		var prevIndex = this.currentIndex() - 1;

		this.setState({
			current: this.state.selections[prevIndex] || this.state.selections[this.state.selections.length - 1]
		})
	},
	currentIndex() {
		return this.state.selections.indexOf(this.state.current)
	}
})
