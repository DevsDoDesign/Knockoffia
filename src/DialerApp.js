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
			digits: ''
		}
	},
	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				if (this.state.digits) {
					this.clear();
				}
				else {
					Vent.exit()
				}
				break;
			case KEYS.ENTER:
				alert(`Dialling ${this.state.digits}`);
				this.clear();
				break;
			default:
				this.setState({
					digits: this.state.digits += key
				});
				break;
		}
	},
	clear() {
		this.setState({ digits: '' })
	},
	render() {
		return (
		<div>Dialed: {this.state.digits}</div>
		)
	}
})

