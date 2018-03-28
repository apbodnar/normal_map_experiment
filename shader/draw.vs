precision highp float;

attribute vec3 pos;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;

uniform mat4 perspective;

varying vec3 outNormal;
varying vec2 texCoords;

void main(void) {
  outNormal = normal;
  texCoords = uv;
  gl_Position = perspective * vec4(0.5* (pos + tangent )* -vec3(0.1,0.1,0.1)  + vec3(-1, 0, -2.0),1);
}
