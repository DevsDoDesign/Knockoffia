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
			<Key digit={KEYS.UP} />
			<Key digit={KEYS.CLEAR} />
			<br/>
			<Key digit={KEYS.DOWN} />
			<Key digit={KEYS.ENTER} />
			<br/>
			<Key digit="1" />
			<Key digit="2" />
			<Key digit="3" />
			<br/>
			<Key digit="4" />
			<Key digit="5" />
			<Key digit="6" />
			<br/>
			<Key digit="7" />
			<Key digit="8" />
			<Key digit="9" />
			<br/>
			<Key digit="#" />
			<Key digit="0" />
			<Key digit="*" />
		</div>
		)
	}
})
