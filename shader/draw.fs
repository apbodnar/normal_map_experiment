precision highp float;

uniform sampler2D normalMapTex;
uniform sampler2D diffuseMapTex;

varying vec3 outNormal;
varying vec3 outPos;
varying vec3 outTangent;
varying vec3 outBiTangent;
varying vec2 outUv;

vec3 mappedNormal() {
  vec3 mapped = normalize(2.0 * texture2D(normalMapTex,outUv*vec2(1,-1)).rgb - 1.0);
  return mapped.r * outTangent + mapped.g * outBiTangent + mapped.b * outNormal;
}

void main(void) {
  vec3 color = texture2D(diffuseMapTex,outUv*vec2(1,-1)).rgb;// + texture2D(normalMapTex,texCoords).rgb;
  gl_FragColor = vec4(vec3(color * dot(mappedNormal(), normalize(vec3(1,1,1)))), 1);
}
