var glMatrix = require('gl-matrix');
const Ball = require('./Ball');

class GameBall{
	constructor(diameter, ballsCnt){
		this.diam = diameter;
		this.ballsCnt = ballsCnt;
		this.initBalls();
		this.balls = []
	}
	initBalls(){
		
	}
}

module.export = GameBall;