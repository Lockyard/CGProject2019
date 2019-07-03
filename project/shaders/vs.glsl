#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 position1;
in vec4 position2;
in vec4 position3;
in vec4 position4;
in vec4 position5;

uniform mat4 matrix;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = matrix*position1;
}
