import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	compoentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
    getInitialState() {
        return {
            started: false,
            time: 113
        }
    },
	keyPressed(key) {
        if (key == KEYS.ENTER)
            console.log('enter');
            return;
	},
    calculateTime() {
         var minutes = Math.floor(this.state.time / 60)
         var seconds = this.state.time - minutes * 60
         
         return minutes + ':' + seconds
    },
	render() {
		return (
			<div>
				<p><strong>Timer</strong></p>
				<br />
                <p>{this.calculateTime()}</p>
			</div>
		)
	}
})
