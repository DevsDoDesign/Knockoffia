import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

const KEY_SOUNDS = new Map([
	[KEYS.CLEAR, 'cancel.mp3'],
	[KEYS.DOWN, 'BoopLow.mp3'],
	[KEYS.UP, 'Boop.mp3'],
	[KEYS.ENTER, 'enter.mp3'],
	[KEYS.HASH, '1.mp3'],
	[KEYS.STAR, '1.mp3'],
	['0', '0.mp3'],
	['1', '1.mp3'],
	['2', '2.mp3'],
	['3', '3.mp3'],
	['4', '4.mp3'],
	['5', '5.mp3'],
	['6', '6.mp3'],
	['7', '7.mp3'],
	['8', '8.mp3'],
	['9', '9.mp3'],
])

var Key = React.createClass({
	render() {
		return <button className={this.props.className} onClick={this.keyPressed}>{this.props.digit}</button>
	},
	keyPressed() {
		(new Audio(`/tones/${KEY_SOUNDS.get(this.props.digit)}`)).play();
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
