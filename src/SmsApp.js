import React from 'react'
import _ from 'lodash'
import Vent from './Vent'
import KEYS from './KEYS'
import { key2, key3, key4, key5, key6, key7, key8, key9, key0 } from './t9'
import {contactPickerFirst} from './ContactPickerComponent'

var SmsComposer = React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)

		this.resetLetterMap();

		this.previousKey = null;
	},

	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
		clearTimeout(this.timeout);
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
					this.del();
				}
				else {
					Vent.exit()
				}

				break;
			case KEYS.ENTER:
				this.send();
				this.clear();

				break;
			default:
				var letter = this.getLetter(key);

				// If cycling on same key, update the pending letter to current letter
				if (key === this.previousKey) {
					this.setState({
						pendingLetter: letter
					});
				}
				// If NOT cycling on same key, set pending letter to current letter
				// And append PREVIOUS pending letter to existing message
				else {
					this.setState({
						pendingLetter: letter,
						msg: this.state.msg + this.state.pendingLetter
					})
				}

				this.previousKey = key;

				// Set up timeout to "move" to next letter
				this.timeout = setTimeout(function() {
					// Append pending letter to message and remove it
					this.setState({
						pendingLetter: '',
						msg: this.state.msg + this.state.pendingLetter
					});

					// Remove previous key - timeout has expired so we should reset. This allows adding of consecutive letters
					this.previousKey = null;

					// Reset map so that generators start back at beginning of sequence
					this.resetLetterMap();
				}.bind(this), 800);

				break;
		}
	},

	getLetter(key) {
		// Get letter from map
		var letter = this.letterMap.get(key);
		var val = letter.next().value;

		// If last letter in cycle, reset to start
		if ( ! val)
			val = letter.next(true).value;

		return val;
	},

	del() {
		if (this.state.pendingLetter) {
			this.setState({ pendingLetter: '' });
		}
		else {
			this.setState({
				msg: this.state.msg.substring(0, this.state.msg.length -1)
			})
		}
	},

	clear() {
		this.setState({
			msg: '',
			pendingLetter: ''
		})
	},

	resetLetterMap() {
		this.letterMap = new Map([
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
	},

	send() {
		fetch(`http://danharper.me/twilio/index.php?contact=${this.props.contact}&message=${this.state.msg}`)
	},

	render() {
		return (
		<div>Message: {this.state.msg + this.state.pendingLetter}</div>
		)
	}
});

export default contactPickerFirst(function(contact) {
	return <SmsComposer contact={contact} />
})
