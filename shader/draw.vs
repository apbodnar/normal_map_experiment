precision highp float;

attribute vec3 pos;
attribute vec3 normal;
attribute vec3 tangent;

varying vec3 outNormal;
varying vec2 texCoords;

void main(void) {
  outNormal = normal + tangent;
  gl_Position = vec4(pos * -vec3(0.1,0.1,0.1),1);
}
