precision highp float;

uniform sampler2D normalMapTex;
uniform sampler2D diffuseMapTex;

varying vec3 outNormal;
varying vec2 texCoords;

void main(void) {
  gl_FragColor = vec4(1, 0, 1, 1);
}
