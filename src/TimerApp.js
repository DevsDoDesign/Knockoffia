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
            time: 58
        }
    },
	keyPressed(key) {
        if (key == KEYS.ENTER)
            this.incrementTime()
	},
	incrementTime() {
		setInterval(this.setTime, 1000)
	},
	setTime() {
		this.setState({
			time: this.state.time + 1
		})
	},
    calculateTime() {
         var minutes = Math.floor(this.state.time / 60)
         var seconds = this.state.time - minutes * 60
		
		if (seconds < 10) seconds = '0' + seconds;
         
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
