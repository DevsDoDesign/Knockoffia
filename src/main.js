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
import HasItBlownOverYetApp from './HasItBlownOverYetApp'
import CalculatorApp from './CalculatorApp'
import RingtonesApp from './RingtonesApp'
import ContactsApp from './ContactsApp'
import AlertApp from './AlertApp'
import SnakeApp from './SnakeApp'


var Screen = React.createClass({
	render() {
		return (<div className={this.props.className}>{this.props.children}</div>)
	}
})

const APPS = new Map([
	['Phone', () => <DialerApp /> ],
	['SMS', () => <SmsApp />],
	['Home', () => <HomeApp isHome={true} /> ],
	['WAP Browser', () => <WapBrowserApp /> ],
	['Timer', () => <TimerApp /> ],
	['CrapChat', () => <CrapChatApp /> ],
	['Has It Blown Over Yet?', () => <HasItBlownOverYetApp />],
	['Calculator', () => <CalculatorApp /> ],
	['Ringtones', () => <RingtonesApp /> ],
	['Contacts', () => <ContactsApp /> ],
	['Alert', message => <AlertApp message={message} /> ],
	['Snake', () => <SnakeApp /> ],
	['Menu', () => <MenuApp apps={[
		'Phone', 'SMS', 'Contacts', 'CrapChat', 'Has It Blown Over Yet?', 'Timer', 'WAP Browser', 'Calculator', 'Ringtones', 'Snake',
	]} /> ]
])


var Phone = React.createClass({
	getInitialState() {
		return {
			app: APPS.get('Ringtones')()
		}
	},
	componentDidMount() {
		Vent.onHome(this.goHome)
		Vent.onExit(this.exitApp)
		Vent.onOpenMenuApp(this.menuApp)
		Vent.onOpenApp(this.openApp)
		Vent.onAlert(this.showAlert)
	},
	goHome() {
		this.setState({ app: APPS.get('Home')() })
	},
	exitApp() {
		this.setState({ app: APPS.get('Menu')() })
	},
	menuApp() {
		this.setState({ app: APPS.get('Menu')() })
	},
	openApp(appName) {
		this.setState({ app: APPS.get(appName)() })
	},
	showAlert(message) {
		this.setState({ app: APPS.get('Alert')(message) })
	},
	render() {
		return (
			<div className="phone-wrapper">
				<img className="phone" src="/assets/3310.svg" />
				<Screen className={this.screenClass()}>
					{this.state.app}
				</Screen>
				<KeyPad />
				<section id="snake"></section>
			</div>
		)
	},
	screenClass() {
		return this.state.app.props.isHome ? 'screen screen--home' : 'screen'
	}
});

React.render(<Phone />, document.getElementById('main'));
