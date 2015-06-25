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
	getInitialState() {
		return {
			answer: 0,
            operator: null,
			answerTwo: 0
		}
	},
	keyPressed(key) {
		switch (key) {
			case KEYS.UP:
			case KEYS.DOWN:
			case KEYS.CLEAR:
				if (this.state.answer === 0) {
					Vent.exit()
				}
				else {
					this.setState({
						answer: 0,
						answerTwo: 0
					})
				}
				break;
			case KEYS.ENTER:
			case KEYS.HASH:
				this.updateOperator()
				break;
			case KEYS.STAR:
				this.calculate()
				break;
			default:
				if (this.state.operator) {
					this.setState({
						answerTwo: this.state.answerTwo += key
					});
				}
				else {
					this.setState({
						answer: this.state.answer += key
					});
				}
				break;
		}
	},
	updateOperator() {
		this.setState({
			answerTwo: 0
		})
		switch(this.state.operator) {
			case null:
				this.setState({
					operator: '+'
				})
				break
			case '+':
				this.setState({
					operator: '-'
				})
				break
			case '-':
				this.setState({
					operator: '/'
				})
				break
			case '/':
				this.setState({
					operator: 'x'
				})
				break
			case '*':
				this.setState({
					operator: ''
				})
				break
		}
	},
	calculate() {
		switch(this.state.operator) {
			case '+':
				this.add()
				break;
			case '-':
				this.minus()
				break;
			case '/':
				this.divide()
				break;
			case '*':
				this.multiply()
				break;
		}
	},
	add() {
		this.setState({
			answer: parseInt(this.state.answer) + parseInt(this.state.answerTwo),
			operator: null
		})
	},
	minus() {
		this.setState({
			answer: parseInt(this.state.answer) - parseInt(this.state.answerTwo),
			operator: null
		})
	},
	divide() {
		this.setState({
			answer: parseInt(this.state.answer) / parseInt(this.state.answerTwo),
			operator: null
		})
	},
	multiply() {
		this.setState({
			answer: parseInt(this.state.answer) * parseInt(this.state.answerTwo),
			operator: null
		})
	},
	getAnswer() {
		if ( ! this.state.operator) {
			return this.state.answer
		}
		
		return this.state.answerTwo
	},
	render() {
		return (
		<div><div className="calc__operator">{this.state.operator}</div><div className="calc__answer">{this.getAnswer()}</div></div>
		)
	}
})

