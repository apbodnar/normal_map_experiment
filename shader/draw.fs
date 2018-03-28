precision highp float;

uniform sampler2D normalMapTex;
uniform sampler2D diffuseMapTex;

varying vec3 outNormal;
varying vec2 texCoords;

void main(void) {
  vec3 color = texture2D(diffuseMapTex,texCoords).rgb + texture2D(normalMapTex,texCoords).rgb;
  gl_FragColor = vec4(color, 1);
}
