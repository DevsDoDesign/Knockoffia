import React from 'react'
import _ from 'lodash'
import Vent from './Vent'
import KEYS from './KEYS'
import { key2, key3, key4, key5, key6, key7, key8, key9, key0 } from './t9'
import {contactPickerFirst} from './ContactPickerComponent'

var SmsComposer = React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},

	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},

	getInitialState() {
		return {
		}
	},

	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				Vent.exit()
				break;
			case KEYS.ENTER:
				break;
			default:
				break;
		}
	},

	render() {
		return (
		<div>Calling {this.props.contact}...</div>
		)
	}
});

export default contactPickerFirst(function(contact) {
	return <SmsComposer contact={contact} />
})
