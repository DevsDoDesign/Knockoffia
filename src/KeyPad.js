import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

var Key = React.createClass({
	render() {
		return <button className={this.props.className} onClick={this.keyPressed}>{this.props.digit}</button>
	},
	keyPressed() {
		Vent.keyPressed(this.props.digit);
	}
})

export default React.createClass({
	render() {
		return (
		<div className="keyPad">
			<Key className="key--clear" digit={KEYS.CLEAR} />
			<Key className="key--up" digit={KEYS.UP} />

			<Key className="key--down" digit={KEYS.DOWN} />
			<Key className="key--enter" digit={KEYS.ENTER} />

			<Key className="key--1" digit="1" />
			<Key className="key--2" digit="2" />
			<Key className="key--3" digit="3" />

			<Key className="key--4" digit="4" />
			<Key className="key--5" digit="5" />
			<Key className="key--6" digit="6" />

			<Key className="key--7" digit="7" />
			<Key className="key--8" digit="8" />
			<Key className="key--9" digit="9" />

			<Key className="key--hash" digit="#" />
			<Key className="key--0" digit="0" />
			<Key className="key--star" digit="*" />
		</div>
		)
	}
})
