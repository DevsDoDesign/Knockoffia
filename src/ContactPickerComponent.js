import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

var ContactPicker = React.createClass({
	render() {
		return (
		<div>
			<h3>Pick Contact:</h3>
			<p>{this.state.currentContact}</p>
		</div>
		)
	},

	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
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

	enter() {
		Vent.contactPicked(this.state.currentContact)
	},

	getInitialState() {
		return {
			currentContact: '(None)',
			contacts: [
				'(None)', 'Dan Harper', 'Robb Lewis', 'Ed Poole', 'Ali Smith', 'Jimmy Saville', '(ALL CONTACTS)'
			]
		}
	},

	// COPY PASTE FROM MENUAPP; fuck it, hack day
	up() {
		var nextContactIndex = this.currentContactIndex() + 1;

		this.setState({
			currentContact: this.state.contacts[nextContactIndex] || this.state.contacts[0]
		})
	},
	down() {
		var prevContactIndex = this.currentContactIndex() - 1;

		this.setState({
			currentContact: this.state.contacts[prevContactIndex] || this.state.contacts[this.state.contacts.length - 1]
		})
	},
	currentContactIndex() {
		return this.state.contacts.indexOf(this.state.currentContact)
	}
})

export default ContactPicker

export function contactPickerFirst(afterPickerCb) {
	return React.createClass({
		getInitialState() {
			return {
				screen: <ContactPicker />
			}
		},
		componentDidMount() {
			Vent.onContactPicked(this.contactPicked)
		},
		componentWillUnmount() {
			Vent.offContactPicked(this.contactPicked)
		},
		render() {
			return this.state.screen
		},
		contactPicked(contact) {
			this.setState({
				screen: afterPickerCb(contact)
			})
		}
	})
}
