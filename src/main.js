import React from 'react'
import Vent from './Vent'

const KEYS = {
	CLEAR: 'C',
	UP: 'U',
	DOWN: 'D',
	ENTER: 'E'
}


var Screen = React.createClass({
	componentDidMount() {
		console.log(this.props.children)
	},
	render() {
		return (<div>{this.props.children}</div>)
	}
})

var DialerApp = React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	getInitialState() {
		return {
			digits: ''
		}
	},
	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
				break;
			case KEYS.CLEAR:
				this.clear();
				break;
			case KEYS.ENTER:
				alert(`Dialling ${this.state.digits}`);
				this.clear();
				break;
			default:
				this.setState({
					digits: this.state.digits += key
				});
				break;
		}
	},
	clear() {
		this.setState({ digits: '' })
	},
	render() {
		return (
			<div>Dialed: {this.state.digits}</div>
		)
	}
})


var Key = React.createClass({
	render() {
		return <button onClick={this.keyPressed}>{this.props.digit}</button>
	},
	keyPressed() {
		Vent.keyPressed(this.props.digit);
	}
})

var Keypad = React.createClass({
	render() {
		return (
			<div>
				<Key digit={KEYS.CLEAR} />
				<Key digit={KEYS.UP} />
				<Key digit={KEYS.DOWN} />
				<Key digit={KEYS.ENTER} />
				<Key digit="0" />
				<Key digit="1" />
				<Key digit="2" />
				<Key digit="3" />
				<Key digit="4" />
				<Key digit="5" />
				<Key digit="6" />
				<Key digit="7" />
				<Key digit="8" />
				<Key digit="9" />
				<Key digit="#" />
				<Key digit="*" />
			</div>
		)
	}
})

var Phone = React.createClass({
	render() {
		return (
			<div>
				<Screen>
					<DialerApp />
				</Screen>
				<Keypad />
			</div>
		)
	}
});

React.render(<Phone />, document.getElementById('main'));
