import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},
	keyPressed(key) {
		Vent.exit()
	},
	render() {
		return (
			<div>
				<p><strong>#DevsDoDesign</strong></p>
				<p className="wap-subline">Kickass projects, from a team of four kickass developers.</p>
				<p className="wap-subline">devsdo.design</p>
			</div>
		)
	}
})
