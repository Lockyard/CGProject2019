#version 300 es
in vec3 inPosition;
in vec3 inNormal;
in vec2 inUVs;

out vec3 fsNormal;
out vec3 fsPosition;
out vec2 fsUVs;
out vec2 fsUV2s;

uniform mat4 wvpMatrix;
uniform mat4 worldMatrix;


void main() {
	fsNormal = inNormal;
	fsPosition = vec3(worldMatrix * vec4(inPosition, 1.0));

	fsUVs = inUVs;
	gl_Position = wvpMatrix * vec4(inPosition, 1.0);
}

/**
mat4 matPos;
	matPos[0] = vec4(1.0, 0.0, 0.0, inPosition[0]);
	matPos[1] = vec4(0.0, 1.0, 0.0, inPosition[1]);
	matPos[2] = vec4(0.0, 0.0, 1.0, inPosition[2]);
	matPos[3] = vec4(0.0, 0.0, 0.0, 1.0);

	matPos = matPos;

	fsPosition = vec3(matPos[0][3], matPos[1][3], matPos[2][3]);
*/