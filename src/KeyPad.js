import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

var Key = React.createClass({
	render() {
		return <button onClick={this.keyPressed}>{this.props.digit}</button>
	},
	keyPressed() {
		Vent.keyPressed(this.props.digit);
	}
})

export default React.createClass({
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
