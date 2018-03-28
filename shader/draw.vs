precision highp float;

attribute vec3 pos;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;

uniform mat4 perspective;
uniform mat4 worldView;

varying vec3 outNormal;
varying vec3 outPos;
varying vec3 outTangent;
varying vec3 outBiTangent;
varying vec2 outUv;

void main(void) {
  outPos = pos;
  outTangent = tangent;
  outBiTangent = normalize(cross(tangent, normal));
  outNormal = normal;
  outUv = uv;
  gl_Position = perspective * (worldView * vec4(pos* 0.02,1) + vec4(0,0,-2,0));//* -vec3(0.1,0.1,0.1)  + vec3(-1, 0, -2.0),1);
}
