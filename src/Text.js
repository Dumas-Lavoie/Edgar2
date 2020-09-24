import * as THREE from "three";
import { lerp } from "./utils";
global.THREE = THREE;
const createGeometry = require("three-bmfont-text");

const font = require("./static/SourceSansPro-Black.json");
const GlyphURL = require("./static/SourceSansPro-Black.png");
const MSDFShader = require("three-bmfont-text/shaders/msdf");
export const loadTextAssets = (assets, loader) => {
  assets.font = font;
  loader.begin("glyphs");
  var glyphsLoader = new THREE.TextureLoader();
  glyphsLoader.crossOrigin = "";
  glyphsLoader.load(GlyphURL, glyphs => {
    assets.glyphs = glyphs;
    loader.end("glyphs");
  });
};

export const createTextMaterial = (glyphs, options = {}) => {
  const mdsf = MSDFShader({
    transparent: true,
    side: THREE.DoubleSide,
    map: glyphs,
    color: "rgb(255,255,255)",
    negate: false,
    ...options
  });
  const material = new THREE.RawShaderMaterial({ ...mdsf });
  return material;
};

export class Text {
  constructor(sceneManager, text) {
    this.sceneManager = sceneManager;
    this.glyphs = null;
    this.font = font;
    this.text = text;

    this.baseScale = 1;
    this.scaleY = 1;
    this.scaleX = 1;

    this.scaleMultX = 1;
    this.scaleMultY = 1;

    this.mesh = null;
  }
  load(loader) {
    loader.begin("glyphs");
    var glyphsLoader = new THREE.TextureLoader();
    glyphsLoader.crossOrigin = "";
    glyphsLoader.load(GlyphURL, glyphs => {
      this.glyphs = glyphs;
      loader.end("glyphs");
    });
  }
  init() {
    const geometry = createGeometry({
      font: this.font,
      align: "center",
      text: this.text
    });
    const material = createTextMaterial(this.glyphs);
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.resizeText(true);
    this.sceneManager.scene.add(mesh);
  }
  updateText(text) {
    if (text === this.text) return;
    this.text = text;
    const geometry = createGeometry({
      font: this.font,
      align: "center",
      text
    });

    this.mesh.geometry = geometry;
    this.mesh.geometry.needsUpdate = true;
    let multX = 1;
    let multY = 1;

    this.setScale(
      this.baseScale * this.scaleMultX,
      this.baseScale * this.scaleMultY
    );

    this.resizeText();
  }
  update() {
    let scaleXChange = lerp(this.scaleX, this.baseScale, 0.1, 0.00001);
    let scaleYChange = lerp(this.scaleY, this.baseScale, 0.1, 0.00001);
    if (scaleXChange !== 0 || scaleYChange !== 0) {
      this.setScale(this.scaleX + scaleXChange, this.scaleY + scaleYChange);
    }
  }
  resizeText(force = false) {
    let scale = 0.04;
    let scaleMultX = 1.3;
    let scaleMultY = 1.05;
    if (window.innerWidth >= 800) {
      scaleMultX = 1.3;
      scaleMultY = 1.05;
      scale = 0.06;
    }
    if (window.innerWidth >= 1200) {
      scaleMultX = 1.3;
      scaleMultY = 1.05;
      scale = 0.09;
    }

    this.scaleMultX = scaleMultX;
    this.scaleMultY = scaleMultY;
    this.baseScale = scale;
    if (force) {
      this.setScale(scale, scale);
    }
  }
  setScale(scaleX, scaleY) {
    const mesh = this.mesh;
    const layout = mesh.geometry.layout;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    mesh.scale.x = scaleX;
    mesh.scale.y = -scaleY;
    mesh.position.x = (-layout.width / 2) * scaleX;
    mesh.position.y = (-layout.xHeight / 2) * scaleY;
  }
  onResize(width, height) {
    this.resizeText(true);
  }
}
