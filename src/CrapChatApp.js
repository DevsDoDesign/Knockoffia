import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

import {contactPickerFirst} from './ContactPickerComponent'

var Drawer = React.createClass({
	getInitialState() {
		return {
			selected: [0, 0],
			image: [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			]
		}
	},
	componentDidMount() {
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		Vent.offKeyPressed(this.keyPressed)
	},

	keyPressed(key) {
		if (key === KEYS.CLEAR) {
			Vent.exit()
		}
		else if (key === KEYS.ENTER) {
			this.send()
		}
		else if (key === '2') {
			this.up()
		}
		else if (key === '8') {
			this.down()
		}
		else if (key === '4') {
			this.left()
		}
		else if (key === '6') {
			this.right()
		}
		else if (key === '5') {
			this.toggle()
		}
	},
	up() {
		let [x, y] = this.state.selected
		if (x > 0) x--
		this.setState({ selected: [x, y] })
	},
	down() {
		let [x, y] = this.state.selected
		if (x < 20) x++
		this.setState({ selected: [x, y] })
	},
	left() {
		let [x, y] = this.state.selected
		if (y > 0) y--
		this.setState({ selected: [x, y] })
	},
	right() {
		let [x, y] = this.state.selected
		if (y < 20) y++
		this.setState({ selected: [x, y] })
	},
	toggle() {
		let image = this.state.image
		let [x, y] = this.state.selected
		image[x][y] = 1

		if (x === 19 && y === 19) {
			y = x = 0
		}
		else if (y === 19) {
			y = 0
			x = x + 1
		}
		else {
			y = y + 1
		}

		this.setState({
			image,
			selected: [x, y]
		})
	},
	send() {
		Vent.alert("Naughty snap deployed; you filthy so-and-so ;)")
	},
	render() {
		return (
			<table className="crapchat__image">
				<tbody>
					{ this.state.image.map(this.renderRow) }
				</tbody>
			</table>
		)
	},
	renderRow(row, rowI) {
		return (
		<tr key={'row'+rowI}>
			{row.map(this.renderCol(rowI))}
		</tr>
		)
	},
	renderCol(rowI) {
		return (col, colI) => {
			return (
			<td key={'col'+colI} className={this.colClass(col, rowI, colI)}></td>
			)
		}
	},
	colClass(col, rowI, colI) {
		if (rowI === this.state.selected[0] && colI === this.state.selected[1]) {
			return 'highlighted'
		}
		else {
			return col === 0 ? 'off' : 'on'
		}
	}
})

export default contactPickerFirst(function(contact) {
	return <Drawer contact={contact} />
})
