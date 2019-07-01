var glMatrix = require('gl-matrix');

class vec3{
	constructor(x=0,y=0,z=0){
		this.vals = [x,y,z];
	}
	
	clone(){
		return new vec3(this.x, this.y, this.z);
	}
	lerp(v, s){
		return this.add( v.sub(this).scale(s) );
	}
	
	get x(){
		return this.vals[0];
	}
	get y(){
		return this.vals[1];
	}
	get z(){
		return this.vals[2];
	}
	
	set x(v){
		this.vals[0] = v;
	}
	set y(v){
		this.vals[1] = v;
	}
	set z(v){
		this.vals[2] = v;
	}
	
	get length(){
		const x = this.vals[0];
		const y = this.vals[1];
		const z = this.vals[2];
		return Math.sqrt(x*x + y*y + z*z);
	}
	get lengthSqrd(){
		const x = this.vals[0];
		const y = this.vals[1];
		const z = this.vals[2];
		return x*x + y*y + z*z;
	}
	
	normalize(){
		const lngth = this.length;
		return new vec3(this.vals[0] / lngth,
							 this.vals[1] / lngth,
							 this.vals[2] / lngth);
	}
	
	scale(scalar){
		return new vec3(this.vals[0] * scalar,
							 this.vals[1] * scalar,
							 this.vals[2] * scalar);
	}
	addScalar(scalar){
		return new vec3(this.vals[0] + scalar,
							 this.vals[1] + scalar,
							 this.vals[2] + scalar);
	}
	
	mul(v){
		return new vec3(this.vals[0] * v.vals[0],
							 this.vals[1] * v.vals[1],
							 this.vals[2] * v.vals[2]);
	}
	div(v){
		return new vec3(this.vals[0] / v.vals[0],
							 this.vals[1] / v.vals[1],
							 this.vals[2] / v.vals[2]);
	}
	add(v){
		return new vec3(this.vals[0] + v.vals[0],
							 this.vals[1] + v.vals[1],
							 this.vals[2] + v.vals[2]);
	}
	sub(v){
		return new vec3(this.vals[0] - v.vals[0],
							 this.vals[1] - v.vals[1],
							 this.vals[2] - v.vals[2]);
	}
}

module.exports = vec3;