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
  outPos = (worldView * vec4(pos,1)).xyz;
  outNormal = normal;
  outTangent = tangent;
  outBiTangent = normalize(cross(outNormal, outTangent));

  outNormal = (worldView * vec4(outNormal,1)).xyz;
  outTangent = (worldView * vec4(outTangent,1)).xyz;
  outBiTangent = (worldView * vec4(outBiTangent,1)).xyz;

  outUv = uv;
  gl_Position = perspective * (worldView * vec4(pos * 0.02,1) + vec4(0,-0.15,-0.5,0));//* -vec3(0.1,0.1,0.1)  + vec3(-1, 0, -2.0),1);
}
