import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
		clearInterval(this.state.intervalId)
	},
    getInitialState() {
        return {
            time: 58,
			intervalId: null,
			paused: true
        }
    },
	keyPressed(key) {
        if (key == KEYS.ENTER)
            this.incrementTime()
		if (key == KEYS.CLEAR) {
			if (this.state.time == 0) {
				Vent.exit()
			}
			else {
				clearInterval(this.state.intervalId)
				this.setState({
					paused: true,
					time: 0
				})
			}
		}
	},
	incrementTime() {
		if ( ! this.state.intervalId) {
			this.setTime()
			this.setState({
				intervalId: setInterval(this.setTime, 1000),
				paused: false
			})
		}
		else {
			clearInterval(this.state.intervalId)
			this.setState({
				intervalId: null,
				paused: true
			})
		}
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
