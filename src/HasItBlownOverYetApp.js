import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'
import { key2, key3, key4, key5, key6, key7, key8, key9, key0 } from './t9'

var PostcodeEnterer = React.createClass({
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
			postcode: '',
			pendingLetter: ''
		}
	},

	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				if (this.state.postcode) {
					this.del();
				}
				else {
					Vent.exit()
				}

				break;
			case KEYS.ENTER:
				this.enter();
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
						postcode: this.state.postcode + this.state.pendingLetter
					})
				}

				this.previousKey = key;

				// Set up timeout to "move" to next letter
				this.timeout = setTimeout(function() {
					// Append pending letter to message and remove it
					this.setState({
						pendingLetter: '',
						postcode: this.state.postcode + this.state.pendingLetter
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

	enter() {
		Vent.blownOverPostcodeEntered(this.state.postcode);
	},

	del() {
		if (this.state.pendingLetter) {
			this.setState({ pendingLetter: '' });
		}
		else {
			this.setState({
				postcode: this.state.postcode.substring(0, this.state.postcode.length -1)
			})
		}
	},

	clear() {
		this.setState({
			postcode: '',
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

	render() {
		return (
		<div>
			<h3>Add Postcode:</h3>
			{this.state.postcode + this.state.pendingLetter}
		</div>
		)
	}
});

var LevelRater = React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	getInitialState() {
		return {
			rating: ''
		}
	},
	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				if (this.state.rating) {
					this.del()
				}
				else {
					Vent.exit()
				}
				break;
			case KEYS.ENTER:
				Vent.alert(`Zombie rating "${this.state.rating}" @ "${this.props.postcode}"`)
				break;
			default:
				this.setState({ rating: key })
				break;
		}
	},
	del() {
		this.setState({
			rating: this.state.rating.substring(0, this.state.rating.length - 1)
		})
	},
	clear() {
		this.setState({ rating: '' })
	},
	render() {
		return (
		<div>
			<h3>Add a Rating:</h3>
			{this.state.rating}
		</div>
		)
	}
});

export default React.createClass({
	getInitialState() {
		return {
			screen: <PostcodeEnterer />
		}
	},
	componentDidMount() {
		Vent.onBlownOverPostcodeEntered(this.postcodeEntered)
	},
	componentWillUnmount() {
		Vent.offBlownOverPostcodeEntered(this.postcodeEntered)
	},
	render() {
		return this.state.screen
	},
	postcodeEntered(postcode) {
		this.setState({
			screen: <LevelRater postcode={postcode} />
		})
	}
});