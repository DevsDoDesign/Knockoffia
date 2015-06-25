import React from 'react'

class Foo extends React.Component {
	render() {
		return <strong>Hello :D</strong>
	}
}

React.render(<Foo />, document.getElementById('main'));
