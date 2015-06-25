import React from 'react'
import Vent from './Vent'

import KEYS from './KEYS'
import KeyPad from './KeyPad'
import MenuApp from './MenuApp'
import DialerApp from './DialerApp'
import HomeApp from './HomeApp'


var Screen = React.createClass({
	render() {
		return (<div>{this.props.children}</div>)
	}
})

const APPS = {
	DIALLER: 'Phone'
}


var Phone = React.createClass({
	getInitialState() {
		return {
			app: this._makeMenuApp()
		}
	},
	componentDidMount() {
		Vent.onExit(this.exitApp)
		Vent.onOpenMenuApp(this.menuApp)
	},
	exitApp() {
		this.setState({ app: <HomeApp /> })
	},
	menuApp() {
		this.setState({ app: this._makeMenuApp() })
	},
	_makeMenuApp() {
		return <MenuApp apps={[
			'Phone', 'SMS', 'Contacts', 'CrapChat', 'Has It Blown Over Yet?', 'Timer', 'Clock', 'WAP Browser'
		]} />
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
