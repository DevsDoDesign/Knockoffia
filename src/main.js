import React from 'react'
import Vent from './Vent'

import KEYS from './KEYS'
import KeyPad from './KeyPad'
import MenuApp from './MenuApp'
import DialerApp from './DialerApp'


var Screen = React.createClass({
	render() {
		return (<div>{this.props.children}</div>)
	}
})



var Phone = React.createClass({
	getInitialState() {
		return {
			app: <DialerApp />
		}
	},
	componentDidMount() {
		Vent.onExit(this.exitApp)
	},
	exitApp() {
		console.warn('exiting')
		this.setState({ app: <MenuApp /> })
	},
	render() {
		return (
			<div>
				<Screen>
					{this.state.app}
				</Screen>
				<KeyPad />
			</div>
		)
	}
});

React.render(<Phone />, document.getElementById('main'));
