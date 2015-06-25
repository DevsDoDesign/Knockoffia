import React from 'react'
import _ from 'lodash'
import Vent from './Vent'
import KEYS from './KEYS'
import { key2, key3, key4, key5, key6, key7, key8, key9, key0 } from './t9'

var letters = new Map([
	['2', key2()],
	['3', key3()],
	['4', key4()],
	['5', key5()],
	['6', key6()],
	['7', key7()],
	['8', key8()],
	['9', key9()],
	['0', key0()]
]);

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)

		this.previousKey = null;
	},

	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},

	getInitialState() {
		return {
			msg: '',
			pendingLetter: ''
		}
	},

	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				if (this.state.msg) {
					this.clear();
				}
				else {
					Vent.exit()
				}

				break;
			case KEYS.ENTER:
				alert(`Sending ${this.state.msg}`);
				this.clear();

				break;
			default:
				var letter = letters.get(key);
				var val = letter.next().value;

				if ( ! val) return;

				if (key === this.previousKey) {
					this.setState({
						pendingLetter: val
					});
				}
				else {
					this.setState({
						pendingLetter: val,
						msg: this.state.msg + this.state.pendingLetter
					})
				}

				this.previousKey = key;

				setTimeout(function() {
					this.setState({
						pendingLetter: '',
						msg: this.state.msg + this.state.pendingLetter
					});

					this.previousKey = null;
				}.bind(this), 800);

				break;
		}
	},

	clear() {
		this.setState({
			msg: '',
			pendingLetter: ''
		})
	},

	render() {
		return (
		<div>Dialed: {this.state.msg + this.state.pendingLetter}</div>
		)
	}
});