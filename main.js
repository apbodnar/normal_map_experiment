import * as Utility from './utility.js'
import * as ObjLoader from './obj_loader.js'

function NormalMapExperiment() {
  "use strict";
  let gl;
  let assets = {};
  let programs = {};
  let textures = {};
  let numTriangles = 0;
  let ticks = 0;
  let perspective = mat4.perspective(mat4.create(), 1, window.innerWidth / window.innerHeight, 0.1, 5);
  let worldView = mat4.create();
  let isFramed = !!window.frameElement;
  let active = !isFramed;

  function initGL(canvas) {
    gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
    gl.viewportWidth = canvas.width = window.innerWidth;
    gl.viewportHeight = canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  }

  function getShader(gl, str, id) {
    let shader = gl.createShader(gl[id]);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(id + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function initProgram(path, uniforms, attributes, assets) {
    let fs = getShader(gl, assets[path + ".fs"], "FRAGMENT_SHADER");
    let vs = getShader(gl, assets[path + ".vs"], "VERTEX_SHADER");
    let program = gl.createProgram();
    program.uniforms = {};
    program.attributes = {};
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    uniforms.forEach(function (name) {
      program.uniforms[name] = gl.getUniformLocation(program, name);
    });
    attributes.forEach(function (name) {
      program.attributes[name] = gl.getAttribLocation(program, name);
    });

    return program;
  }

  function initPrograms(assets) {
    programs.draw = initProgram(
      "shader/draw",
      ["normalMapTex", "diffuseMapTex", "perspective", "worldView"],
      ["pos", "normal", "uv", "tangent"],
      assets
    );
  }

  function createImageTexture(image){
    let texture = gl.createTexture();
    let ext = gl.getExtension("EXT_texture_filter_anisotropic");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  function initBuffers(assets) {
    let posBuffer = gl.createBuffer();
    let normalBuffer = gl.createBuffer();
    let uvBuffer = gl.createBuffer();
    let tangentBuffer = gl.createBuffer();
    let parsed = ObjLoader.parseMesh(assets["mesh/lighthouse.obj"]);
    let verts = [];
    let norms = [];
    let uvs = [];
    let tangents = [];
    parsed.forEach((triangle) => {
      triangle.verts.forEach((v) => {
        v.forEach((vv) => { verts.push(vv)});
      })
    });
    parsed.forEach((triangle) => {
      triangle.normals.forEach((n) => {
        n.forEach((nn) => { norms.push(nn)});
      })
    });
    parsed.forEach((triangle) => {
      triangle.uvs.forEach((u) => {
        u.forEach((uu) => { uvs.push(uu)});
      })
    });
    parsed.forEach((triangle) => {
      triangle.tangents.forEach((t) => {
        t.forEach((tt) => { tangents.push(tt)});
      })
    });
    console.log(tangents);
    numTriangles = verts.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.pos);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norms), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.normal);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.uv);

    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.tangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.tangent);
    // textures.diffuseMapTex = createImageTexture(assets["texture/turtle.png"]);
    // textures.normalMapTex = createImageTexture(assets["texture/brick.png"]);
    textures.diffuseMapTex = createImageTexture(assets["texture/lighthouse.png"]);
    textures.normalMapTex = createImageTexture(assets["texture/brick.png"]);
  }

  function initEvents() {
    let element = document.getElementById("view");
    let xi, yi;
    let mode = false;

    element.addEventListener("mousedown", function (e) {

    }, false);
    element.addEventListener("mousemove", function (e) {

    }, false);
    element.addEventListener("mouseup", function (e) {

    }, false);
    element.addEventListener('mousewheel', function (e) {

    }, false);
  }

  function draw() {
    let program = programs.draw;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    // gl.vertexAttribPointer(program.attributes.pos, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(program.attributes.pos);
    // gl.vertexAttribPointer(program.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(program.attributes.normal);
    // gl.vertexAttribPointer(program.attributes.uv, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(program.attributes.uv);
    // gl.vertexAttribPointer(program.attributes.tangent, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(program.attributes.tangent);
    gl.uniformMatrix4fv(program.uniforms.perspective, false, perspective);
    gl.uniformMatrix4fv(program.uniforms.worldView, false, worldView);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.diffuseMapTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.normalMapTex);
    gl.uniform1i(program.uniforms.diffuseMapTex, 0);
    gl.uniform1i(program.uniforms.normalMapTex, 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLES, 0, numTriangles);
  }


  function tick() {
    worldView = mat4.rotateY(worldView, mat4.create(), ++ticks * 0.01);
    requestAnimationFrame(tick);
    draw();
  }

  function start(res) {
    window.addEventListener("mouseover",function(){ active = true; });
    window.addEventListener("mouseout",function(){ active = !isFramed; });
    let canvas = document.getElementById("view");
    initGL(canvas);
    initPrograms(res);
    initBuffers(res);
    initEvents();
    console.log(programs.draw.attributes)

    gl.clearColor(0.3, 0.5, 0.9, 1.0);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    tick();
  }

  let pathSet = new Set([
    "shader/draw.vs",
    "shader/draw.fs",
    "texture/brick.png",
    "texture/lighthouse.png",
    "mesh/lighthouse.obj"
  ]);
  Utility.loadAll(Array.from(pathSet), start);
}

new NormalMapExperiment();
