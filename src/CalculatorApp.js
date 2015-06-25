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
			answer: 0,
            operator: ''
		}
	},
	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
			case KEYS.CLEAR:
				if (this.state.answer === 0) {
					Vent.exit()
				}
				else {
					this.setState({
						answer: 0
					})
				}
			case KEYS.ENTER:
			case KEYS.HASH:
			case KEYS.STAR:
				break;
			default:
				this.setState({
					answer: this.state.answer += key
				});
				break;
		}
	},
	clear() {
		this.setState({ digits: '' })
	},
	render() {
		return (
		<div><div className="calc__operator">{this.state.operator}</div><div className="calc__answer">{this.state.answer}</div></div>
		)
	}
})

