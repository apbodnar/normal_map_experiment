precision highp float;

uniform sampler2D normalMapTex;
uniform sampler2D diffuseMapTex;

varying vec3 outNormal;
varying vec3 outPos;
varying vec3 outTangent;
varying vec3 outBiTangent;
varying vec2 outUv;

const vec3 lightPos = vec3(15.0,15.0,5.0);

vec3 mappedNormal() {
  vec3 mapped = normalize(2.0 * texture2D(normalMapTex,outUv*vec2(50,-50)).rgb - vec3(1.0));
  return mapped.r * outTangent + mapped.g * outBiTangent + mapped.b * outNormal;
}

void main(void) {

  vec3 lightDir = normalize(lightPos - outPos);
  vec3 normal = mappedNormal();

  vec3 reflectDir = reflect(-lightDir, normal);
  float lambertian = max(dot(lightDir,normal), 0.2);
  vec3 viewDir = normalize(outPos);

  float specAngle = max(dot(reflectDir, viewDir), 0.0);
  float specular = pow(specAngle, 40.0);

  vec3 color = texture2D(diffuseMapTex,outUv*vec2(1,-1)).rgb;// + texture2D(normalMapTex,texCoords).rgb;
  //gl_FragColor = vec4(vec3(vec3(color) * dot(mappedNormal(), normalize(vec3(1,1,0)))), 1);

  gl_FragColor = vec4( lambertian*color + vec3(specular) * color, 1.0);

}
