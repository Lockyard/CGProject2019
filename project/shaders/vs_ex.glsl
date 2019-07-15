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
uniform mat4 normalMatrix;


void main() {
	fsNormal = mat3(normalMatrix)*inNormal;
	fsPosition = vec3(worldMatrix * vec4(inPosition, 1.0));

	fsUVs = inUVs;
	gl_Position = wvpMatrix * vec4(inPosition, 1.0);
}