import React from 'react'
import Vent from './Vent'

import KEYS from './KEYS'
import KeyPad from './KeyPad'
import MenuApp from './MenuApp'
import DialerApp from './DialerApp'
import SmsApp from './SmsApp'
import HomeApp from './HomeApp'
import WapBrowserApp from './WapBrowserApp'
import TimerApp from './TimerApp'
import CrapChatApp from './CrapChatApp'


var Screen = React.createClass({
	render() {
		return (<div>{this.props.children}</div>)
	}
})

const APPS = new Map([
	['Phone', () => <DialerApp /> ],
	['SMS', () => <SmsApp />],
	['Home', () => <HomeApp /> ],
	['WAP Browser', () => <WapBrowserApp /> ],
	['Timer', () => <TimerApp /> ],
	['CrapChat', () => <CrapChatApp /> ],
	['Menu', () => <MenuApp apps={[
		'Phone', 'SMS', 'Contacts', 'CrapChat', 'Has It Blown Over Yet?', 'Timer', 'Clock', 'WAP Browser',
	]} /> ]
])


var Phone = React.createClass({
	getInitialState() {
		return {
			app: APPS.get('Home')()
		}
	},
	componentDidMount() {
		Vent.onExit(this.exitApp)
		Vent.onOpenMenuApp(this.menuApp)
		Vent.onOpenApp(this.openApp)
	},
	exitApp() {
		this.setState({ app: APPS.get('Home')() })
	},
	menuApp() {
		this.setState({ app: APPS.get('Menu')() })
	},
	openApp(appName) {
		this.setState({ app: APPS.get(appName)() })
	},
	render() {
		return (
			<div className="phone-wrapper">
				<img className="phone" src="/assets/3310.svg" />
				<Screen>
					{this.state.app}
				</Screen>
				<KeyPad />
			</div>
		)
	}
});

React.render(<Phone />, document.getElementById('main'));
