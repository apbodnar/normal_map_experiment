import * as Utility from './utility.js'
import * as ObjLoader from './obj_loader.js'

function NormalMapExperiment() {
  "use strict";
  let gl;
  let assets = {};
  let programs = {};
  let textures = {};

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
      ["normalMapTex", "diffuseMapTex"],
      ["pos", "normal", "tangent"],
      assets
    );
  }

  function createImageTexture(image){
    textures.env = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textures.env);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  function initBuffers(assets) {
    let posBuffer = gl.createBuffer();
    let normalBuffer = gl.createBuffer();
    let tangentBuffer = gl.createBuffer();
    let parsed = ObjLoader.parseMesh(assets["mesh/turtle.obj"]);
    let verts = [];
    parsed.forEach((triangle) => {
      triangle.verts.forEach((v) => {
        v.forEach((vv) => { verts.push(vv)});
      })
    })
    console.log(verts);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.pos);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.normal);

    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programs.draw.attributes.tangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programs.draw.attributes.tangent);
    textures.normalMapTex = createImageTexture(assets["texture/knit_diffuse.jpg"]);
    textures.diffuseMapTex = createImageTexture(assets["texture/knit_normal.jpg"]);
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
    gl.useProgram(program);
    gl.vertexAttribPointer(program.attributes.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.attributes.pos);
    gl.vertexAttribPointer(program.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.attributes.normal);
    gl.vertexAttribPointer(program.attributes.tangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.attributes.tangent);
    gl.uniform1i(program.uniforms.diffuseMapTex, 0);
    gl.uniform1i(program.uniforms.normalMapTex, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.diffuseMapTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.normalMapTex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 31248/3);
  }


  function tick() {
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.BLEND);

    tick();
  }

  let pathSet = new Set([
    "shader/draw.vs",
    "shader/draw.fs",
    "texture/knit_diffuse.jpg",
    "texture/knit_normal.jpg",
    "mesh/turtle.obj"
  ]);
  Utility.loadAll(Array.from(pathSet), start);
}

new NormalMapExperiment();
