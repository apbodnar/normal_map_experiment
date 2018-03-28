import {Vec3} from './vector.js'

export function parseMesh(objText) {
  let lines = objText.split('\n');
  let vertices = [];
  let triangles = [];
  let vertNormals = [];
  let meshNormals = [];
  let tangents = [];
  let uvs = [];

  function parseFace(quad_indices){
    let triList = [];
    for(let i=0; i < quad_indices.length - 2; i++){
      triList.push([quad_indices[0], quad_indices[i+1], quad_indices[i+2]])
    }
    triList.forEach(parseTriangle);
  }

  function averageTangents(normArray) {
    let total = [0, 0, 0];
    for (let i = 0; i < normArray.length; i++) {
      total = Vec3.add(total, normArray[i]);
    }
    return Vec3.normalize(Vec3.scale(total, 1.0 / normArray.length));
  }

  function computeTangents(verts, uvs){
    //debugger;
    let dv1 = Vec3.sub(verts[1], verts[0]);
    let dv2 = Vec3.sub(verts[2], verts[0]);
    let dt1 = Vec3.sub(uvs[1], uvs[0]);
    let dt2 = Vec3.sub(uvs[2], uvs[0]);
    let r = 1.0 / (dt1[0] * dt2[1] - dt1[1] * dt2[0]);
    let tangent = Vec3.sub(Vec3.scale(dv1, dt2[1] * r), Vec3.scale(dv2, dt1[1] * r));
    return tangent;

  }

  function parseTriangle(indices){
    for(let i=0; i<indices.length; i++){
      for(let j=0; j<indices[i].length; j++){
        switch (j) {
          case 0:
            indices[i][j] = indices[i][j] < 1 ? vertices.length + indices[i][j] + 1 : indices[i][j];
            break;
          case 1:
            break;
          case 2:
            indices[i][j] = indices[i][j] < 1 ? meshNormals.length + indices[i][j] + 1 : indices[i][j];
        }
      }
    }

    let tangent = computeTangents(
      [vertices[indices[0][0] - 1], vertices[indices[1][0] - 1], vertices[indices[2][0] - 1]],
      [uvs[indices[0][1] - 1], uvs[indices[1][1] - 1], uvs[indices[2][1] - 1]]
    );

    let tri = new Triangle(
      vertices[indices[0][0] - 1], vertices[indices[1][0] - 1], vertices[indices[2][0] - 1],
      uvs[indices[0][1] - 1], uvs[indices[1][1] - 1], uvs[indices[2][1] - 1],
      meshNormals[indices[0][2] - 1], meshNormals[indices[1][2] - 1], meshNormals[indices[2][2] - 1],
      indices[0][0] - 1, indices[1][0] - 1, indices[2][0] - 1
    );

    for (let j = 0; j < indices.length; j++) {
      if (!tangents[indices[j][0] - 1]) {
        tangents[indices[j][0] - 1] = [];
      }
      tangents[indices[j][0] - 1].push(tangent);
    }

    triangles.push(tri);

  }

  for (let i = 0; i < lines.length; i++) {
    let array = lines[i].trim().split(/[ ]+/);
    let vals = array.slice(1, array.length);
    if (array[0] === 'v') {
      vertices.push(vals.map(parseFloat))
    } else if (array[0] === 'f') {
      vals = vals.map(function(s){return s.split('/').map(parseFloat)})
      parseFace(vals);
    } else if(array[0] === 'vt'){
      let uv = vals.map(function(coord){return parseFloat(coord) || 0});
      uvs.push(uv);
    } else if(array[0] === 'vn'){
      meshNormals.push(vals.map(parseFloat))
    }
  }

  for (let i = 0; i < triangles.length; i++) {
    for (let j = 0; j < 3; j++){
      triangles[i].tangents[j] = averageTangents(tangents[triangles[i].indices[j]]);
    }
  }

  return triangles;
}


export class Triangle {
  constructor(v1, v2, v3, uv1, uv2, uv3, n1, n2, n3, i1, i2, i3) {
    this.verts = [v1, v2, v3];
    this.uvs = [uv1, uv2, uv3];
    this.normals = [n1, n2, n3];
    this.indices = [i1, i2, i3];
    this.tangents = [];
  }


}

// glm::vec3 & v0 = vertices[i+0];
// glm::vec3 & v1 = vertices[i+1];
// glm::vec3 & v2 = vertices[i+2];
//
// // Shortcuts for UVs
// glm::vec2 & uv0 = uvs[i+0];
// glm::vec2 & uv1 = uvs[i+1];
// glm::vec2 & uv2 = uvs[i+2];
//
// // Edges of the triangle : position delta
// glm::vec3 deltaPos1 = v1-v0;
// glm::vec3 deltaPos2 = v2-v0;
//
// // UV delta
// glm::vec2 deltaUV1 = uv1-uv0;
// glm::vec2 deltaUV2 = uv2-uv0;

// float r = 1.0f / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
// glm::vec3 tangent = (deltaPos1 * deltaUV2.y   - deltaPos2 * deltaUV1.y)*r;
// glm::vec3 bitangent = (deltaPos2 * deltaUV1.x   - deltaPos1 * deltaUV2.x)*r;
