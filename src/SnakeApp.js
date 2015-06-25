import React from 'react'
import Vent from './Vent'
import KEYS from './KEYS'

export default React.createClass({
	componentDidMount() {
        var parentElement = document.getElementById("snake");
    	var settings = {
    		    frameInterval : 120,
    		    backgroundColor : "#b7c390",
                autoInit : true,
        		gridWidth : 8,
        		gridHeight : 5,
        		pointSize : 16,
        		snakeColor : "black",
        		snakeEyeColor : "black",
        		candyColor : "black",
        		shrinkingCandyColor : "black",
        		scoreBoardColor : "#b7c390",
        		scoreTextColor : "#b7c390",
        		collisionTolerance : 1		
    	};
    	var game = new SnakeJS(parentElement, settings);
        
		Vent.onKeyPressed(this.keyPressed)
	},
	componentWillUnmount() {
		snake = document.getElementById('snake');
		snake.parentNode.removeChild(snake)
	
		Vent.offKeyPressed(this.keyPressed)
	},
	keyPressed(key) {
		console.log('key', key)
		if (key === KEYS.ENTER) {
			Vent.openMenuApp()
		}
	},
	render() {
		return (
			<div></div>
		)
	}
})
