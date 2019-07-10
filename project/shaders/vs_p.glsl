attribute vec3 inPosition; 
attribute vec3 inNormal; 
attribute vec2 inUVs;

//attribute bool inLightUpObjects;

//varying bool fsLightUpObjects;

varying vec3 fsNormal; 
varying vec3 fsPosition; 
varying vec2 fsUVs;
varying vec2 fsUV2s;

uniform mat4 wvpMatrix; 


void main() { 
	fsNormal = inNormal; 
	fsPosition =  inPosition;
	fsUVs = inUVs;

	//fsLightUpObject = inLightUpObjects;

	gl_Position = wvpMatrix * vec4(inPosition, 1.0);
}
	