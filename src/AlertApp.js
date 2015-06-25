import React from 'react'
import Vent from './Vent'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.exit);
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.exit);
	},
	exit() {
		Vent.exit()
	},
	render() {
		return (
			<strong>{this.props.message}</strong>
		)
	}
})
