const glMatrix = require('gl-matrix');
const GlFunctionsInstantiator = require('./glFunctions');
const ShaderCode = require('./ShaderCode');
const StaticFunctions = require('../StaticFunctions');

//---------------------------GLSL-----------------------------

const CIRCLE_FRGMNT_CNT = 50;

//---------------------------GLSL-----------------------------

var vertexShaderSourceImplmntation = `	
	uniform float pxs[$!{POINTS_COUNT}!$];
	uniform float pys[$!{POINTS_COUNT}!$];
	uniform float pzs[$!{POINTS_COUNT}!$];
	uniform float radii[$!{POINTS_COUNT}!$];
	
	out vec4 f_col;
	
	mat4 genPointTransform(){
		vec3 cent = vec3(pxs[gl_InstanceID],
						 	  pys[gl_InstanceID],
						 	  pzs[gl_InstanceID]);
		
		mat4 trnsform = mat4(1.0);
		
		float radius = radii[gl_InstanceID];
		
		float scaleX = radius;
		float scaleY = radius;
		float scaleZ = 1.0;
		vec3 sclv = vec3(scaleX, scaleY, scaleZ);
		
		mat4 sclm = scaleMat4( sclv );
		mat4 trnsl = translateMat4(cent);
		
		return trnsl * sclm;
	}
	
	void main(){
		vec4 pos4 = vec4(pos, 1.0);
		vec4 col = vec4(1.0, 0.0, 1.0, 1.0);
		
		mat4 pntTrnsfrm = genPointTransform();
		
		vec4 tarp = perspective * modelView * pntTrnsfrm * pos4;
		
		gl_Position = tarp;
		
		f_col = col;
	}
`;
var fragmentShaderSourceImplmntation = `#version 300 es
	precision mediump float;
	
	in vec4 f_col;
	
	out vec4 outColor;
	
	void main() {
		outColor = f_col;
	}
`;

class APointsDrawer{
	constructor(canvasID, camera, points=[], radius=1){
		
		let radii = [];
		for(let i=0; i < points.length; ++i){
			radii.push( radius );
		}
		this.pointData = {
			points: 	[],
			pointsChanged: true,
			radii: radii,
		};
		
		this.glVars = {
			vertices:		[],
			norms: 			[], // normals
		}
		
		this.glMeta = {
			instancing: true,
			instanceCount: 0,
		};
		
		this.genVertices();
		
		this.setPoints(points);
		
		this.camera = camera;
		
		if(!canvasID){
			canvasID = 'canvas';
		}
		
		var canvas = document.getElementById(canvasID);
		this.gl = canvas.getContext('webgl2', {antialias: true});
		
		if(!this.gl){
			console.log('no gl-context!');
			return;
		}
		
		this.glFunctions = new GlFunctionsInstantiator(this.gl, false);
		
		this.vertexShaderSource = ShaderCode.vertexShaderSourceBase + vertexShaderSourceImplmntation;
		this.fragmentShaderSource = fragmentShaderSourceImplmntation;
		
/*		console.log('vertexShaderSource:');
		console.log(this.vertexShaderSource);*/
		
		this.initGl();
	}
	
	setPoints(points){
		this.pointData.points = points;
		this.pointData.pointsChanged = true;
		this.glMeta.instanceCount = points.length; 
	}
	
	genVertices(){
		let verts = [];
		
		const offs = Math.PI * 2 / CIRCLE_FRGMNT_CNT;
		
		for(let i=0; i < CIRCLE_FRGMNT_CNT; ++i){
			let curoffs = offs * i;
			let op1 = curoffs + offs;
			
			let p0 = [0, 0, 0];
			let p1 = [Math.cos(curoffs),
						 Math.sin(curoffs),
						 0.0];
			let p2 = [Math.cos(op1),
						 Math.sin(op1),
						 0.0];
			verts.push( p0[0], p0[1], p0[2],
						   p1[0], p1[1], p1[2],
						   p2[0], p2[1], p2[2] );
		}
		
		this.glVars.vertices = verts;
		
		this.genNorms();
	}
	genNorms(){
		let norms = []
		for(let i=0; i < this.glVars.vertices.length / 3; ++i){
			norms.push( 0,0,1 );
		}
		this.glVars.norms = norms;
	}
	
	
	supportsWebGL2(){
		return !!this.gl;
	}

	//-----------------------------------------------------------------
	
	updateGLPointsData(){
		
		this.glFunctions.useProgram('points');
		
		let pxs = [];
		let pys = [];
		let pzs = [];
		let radii = [];
		
		const pnts = this.pointData.points;
		
		for(let i=0; i < pnts.length; ++i){
			let p = pnts[i];
			
			pxs.push( p[0] );
			pys.push( p[1] );
			pzs.push( p[2] );
			radii.push( this.pointData.radii[i] );
		}
		
		this.glFunctions.setUniform1fv('pxs', pxs);
		this.glFunctions.setUniform1fv('pys', pys);
		this.glFunctions.setUniform1fv('pzs', pzs);
		this.glFunctions.setUniform1fv('radii', radii);
	}
	initGlVars(){	
		this.glFunctions.useProgram('points');
		
		this.glFunctions.createVAO('points');
		
		this.glFunctions.evalLayoutLocations( ['pos'] );
		
		console.log('layoutLocations: ', this.glFunctions.layoutLocations);
		
		const vertices = this.glVars.vertices;
		this.glFunctions.genAndBindVectorVBO(vertices,  3, 'pos');
		
		this.glFunctions.setUniformVector3fv('cameraPos', this.camera.cameraPos);
		
		this.updateGLPointsData();
		
		this.glFunctions.setModelView(this.camera);
		this.glFunctions.setPerspective();
		
		//	 always unbind VAO:
		this.glFunctions.unbindVAO();
	}
	
	updateCamera(camera){
		this.camera = camera;
		this.cameraChanged = true;
	}
	updateCameraUniforms(){
		this.glFunctions.setUniformVector3fv('cameraPos', this.camera.cameraPos);
		
		this.glFunctions.setModelView(this.camera);
		
		this.cameraChanged = false;
	}
	
	
	//-----------------------------------------------------------------
	
	paintVertices(){
		let vertices = this.glVars.vertices;
		
		let primitiveType = this.gl.TRIANGLES;
		let offset = 0;
		let count = Math.floor(vertices.length / 3);
		let instanceCount = this.glMeta.instanceCount;
		if(this.glMeta.instancing){
			if(instanceCount > 0){
				this.gl.drawArraysInstanced(primitiveType, offset, count, instanceCount);
			}else{
				console.log('instanced drawing: count: ', instanceCount);
			}
		}else{
			if(count > 0){
				this.gl.drawArrays(primitiveType, offset, count);
			}else{
				console.log('APointsDrawer::paintVertices: count === 0!!!');
			}
		}
	}
	
	//-----------------------------------------------------------------
	
	createAndCompileShaderSrc(){
		let frgmntShrdSrc 		= this.fragmentShaderSource;
		let vertexShaderSource  = this.vertexShaderSource;
		
		vertexShaderSource = StaticFunctions.replaceString(vertexShaderSource, 
																		  [Math.max(this.pointData.points.length, 500),],
																		  ['POINTS_COUNT',]);
	
		var vertexShader   = this.glFunctions.createShader(this.gl.VERTEX_SHADER,   vertexShaderSource);
		var fragmentShader = this.glFunctions.createShader(this.gl.FRAGMENT_SHADER, frgmntShrdSrc);
	
		var program = this.glFunctions.createProgram('points', vertexShader, fragmentShader);
		this.glFunctions.useProgram('points');
	}
	
	initGl() {
		if (!this.gl) {
			console.log('no gl context!');
			return false;
		}
		
		this.createAndCompileShaderSrc();
		
		this.initGlVars();
		
		return true;
	}
	updateGlVars(){
		if(this.pointData.pointsChanged){
			this.updateGLPointsData();
			this.pointData.pointsChanged = false;
		}
		if(!!this.cameraChanged){
			this.updateCameraUniforms();
		}
	}
	
	
	drawPoints(){
		this.glFunctions.useProgram('points');
		
		this.glFunctions.bindVAO('points');
		
		this.updateGlVars();
		
		this.paintVertices();
		
		this.glFunctions.unbindVAO();
	}
}

module.exports = APointsDrawer;



