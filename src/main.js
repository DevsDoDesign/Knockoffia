import React from 'react'


var Screen = React.createClass({
	render() {
		return <strong>Hello :D</strong>
	}
})

var Key = React.createClass({
	render() {
		return <button>{this.props.digit}</button>
	}
})

var Keypad = React.createClass({
	render() {
		return (
			<div>
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
				<Screen />
				<Keypad />
			</div>
		)
	}
});

React.render(<Phone />, document.getElementById('main'));
