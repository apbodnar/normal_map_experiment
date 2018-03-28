precision highp float;

uniform sampler2D normalMapTex;
uniform sampler2D diffuseMapTex;

varying vec3 outNormal;
varying vec3 outPos;
varying vec3 outTangent;
varying vec3 outBiTangent;
varying vec2 outUv;

const vec3 lightPos = vec3(5.0,5.0,5.0);

vec3 mappedNormal() {
  vec3 mapped = normalize(2.0 * texture2D(normalMapTex,outUv*vec2(50,-50)).rgb - vec3(1.0));
  return mapped.r * outTangent + mapped.g * outBiTangent + mapped.b * outNormal;
}

void main(void) {

  vec3 lightDir = normalize(lightPos - outPos);
  vec3 normal = mappedNormal();

  vec3 reflectDir = reflect(-lightDir, normal);
  float lambertian = max(dot(lightDir,normal), 0.0);
  vec3 viewDir = normalize(outPos);

  float specAngle = max(dot(reflectDir, viewDir), 0.0);
  float specular = pow(specAngle, 400.0);

  vec3 color = texture2D(diffuseMapTex,outUv*vec2(1,-1)).rgb;// + texture2D(normalMapTex,texCoords).rgb;
  //gl_FragColor = vec4(vec3(vec3(color) * dot(mappedNormal(), normalize(vec3(1,1,0)))), 1);

  gl_FragColor = vec4( lambertian*color + vec3(specular) * color, 1.0);

}

//precision mediump float;
//
//varying vec3 normalInterp;
//varying vec3 vertPos;
//
//uniform int mode;
//
//const vec3 lightPos = vec3(1.0,1.0,1.0);
//const vec3 diffuseColor = vec3(0.5, 0.0, 0.0);
//const vec3 specColor = vec3(1.0, 1.0, 1.0);
//
//void main() {
//
//  vec3 normal = normalize(normalInterp);
//  vec3 lightDir = normalize(lightPos - vertPos);
//
//  float lambertian = max(dot(lightDir,normal), 0.0);
//  float specular = 0.0;
//
//  if(lambertian > 0.0) {
//
//    vec3 reflectDir = reflect(-lightDir, normal);
//    vec3 viewDir = normalize(-vertPos);
//
//    float specAngle = max(dot(reflectDir, viewDir), 0.0);
//    specular = pow(specAngle, 4.0);
//
//    // the exponent controls the shininess (try mode 2)
//    if(mode == 2)  specular = pow(specAngle, 16.0);
//
//    // according to the rendering equation we would need to multiply
//    // with the the "lambertian", but this has little visual effect
//    if(mode == 3) specular *= lambertian;
//
//    // switch to mode 4 to turn off the specular component
//    if(mode == 4) specular *= 0.0;
//
//  }
//
//  gl_FragColor = vec4( lambertian*diffuseColor +
//                        specular*specColor, 1.0);
//}