export function parseMesh(objText) {
  let lines = objText.split('\n');
  let vertices = [];
  let triangles = [];
  let vertNormals = [];
  let meshNormals = [];
  let uvs = [];

  function parseFace(quad_indices){
    let triList = [];
    for(let i=0; i < quad_indices.length - 2; i++){
      triList.push([quad_indices[0], quad_indices[i+1], quad_indices[i+2]])
    }
    triList.forEach(parseTriangle);
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
    let tri = new Triangle(
      vertices[indices[0][0] - 1], vertices[indices[1][0] - 1], vertices[indices[2][0] - 1],
      uvs[indices[0][1] - 1], uvs[indices[1][1] - 1], uvs[indices[2][1] - 1],
      meshNormals[indices[0][2] - 1], meshNormals[indices[1][2] - 1], meshNormals[indices[2][2] - 1]
    );

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
  return triangles;
}


export class Triangle {
  constructor(v1, v2, v3, uv1, uv2, uv3, n1, n2, n3) {
    this.verts = [v1, v2, v3];
    this.uvs = [uv1, uv2, uv3];
    this.normals = [n1, n2, n3];
  }
}
