import * as THREE from "three";
import { lerp } from "./utils";


export class Planes {
  constructor(sceneManager, images) {
    this.sceneManager = sceneManager;
    this.meshes = [];
    this.images = images;
    this.textures = [];
    this.hovering = -1;
    this.initiated = false;
    this.uniforms = {
      uPlaneSize: new THREE.Uniform(new THREE.Vector2(0, 0))
    };

  }
  load(loader) {
    for (let i = 0; i < this.images.length; i++) {
      loader.begin("image-" + i);
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load(this.images[i], image => {
        this.textures[i] = image;
        loader.end("image-" + i);
      });
    }
  }
  init() {
    this.initiated = true;
    const { width, height } = this.sceneManager.getViewSize();

    const planeMetrics = this.getPlaneMetrics(
      width,
      height,
      window.innerWidth,
      window.innerHeight
    );

    const geometry = new THREE.PlaneBufferGeometry(
      planeMetrics.planeWidth,
      planeMetrics.planeHeight,
      1,
      1
    );
    this.uniforms.uPlaneSize.value.set(
      planeMetrics.planeWidth,
      planeMetrics.planeHeight
    );
    this.uniforms.uPlaneSize.needsUpdate = true;

    let translateToLeft = -width / 2 + planeMetrics.planeWidth / 2;
    let x = translateToLeft + planeMetrics.x;

    let space = planeMetrics.space;

    for (let i = 0; i < 3; i++) {
      let texture = this.textures[i];
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uZoom: new THREE.Uniform(0),
          uZoomDelta: new THREE.Uniform(0.2),
          uPlaneSize: this.uniforms.uPlaneSize,
          uImage: new THREE.Uniform(texture),
          uImageSize: new THREE.Uniform(
            new THREE.Vector2(
              texture ? texture.image.width : 0,
              texture ? texture.image.height : 0
            )
          ),
          uMouse: new THREE.Uniform(new THREE.Vector2(0, 0))
        },
        fragmentShader,
        vertexShader
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = x + i * space;
      mesh.userData.index = i;
      this.meshes.push(mesh);
      this.sceneManager.scene.add(mesh);
    }
  }
  onMouseMove(ev) {
    const raycaster = this.sceneManager.raycaster;
    var intersections = raycaster.intersectObjects(this.meshes);
    if (intersections.length > 0  && ($(window).scrollTop() < 500)) {
      const intersection = intersections[0];
      const index = intersection.object.userData.index;
      this.meshes[index].material.uniforms.uMouse.value.set(
        intersection.uv.x,
        intersection.uv.y
      );
      document.body.style.cursor = "pointer";

      if (this.hovering !== index) {
        this.sceneManager.onPlaneHover(index);

        window.onclick = () => {
          if (!$('.hamburger').hasClass('open') && $('#webGLApp').is(":visible")) 
          {
            if (index == 0)
            {
              window.open("https://www.google.ca", "_blank");
          
            }
            if (index == 1) {
              window.open("https://presbyterebluesea.ca/", "_blank");
              
            }
           if (index == 2) {
              window.open("https://spiraleicerolls.com/", "_blank");
             
            }
            else {
              console.log("OUT"); 
            }
            
          }
        }
        this.hovering = index;
      } 
      
      
      

      
  
    } else {
      window.onclick = () => { }
      this.sceneManager.onPlaneNever();
      this.hovering = -1;
      document.body.style.cursor = "default";
      
    }
  }
  update() {
    const meshes = this.meshes;
    for (let i = 0; i < 3; i++) {
      const zoomTarget = this.hovering === i ? 1 : 0;
      const uZoom = meshes[i].material.uniforms.uZoom;

      const zoomChange = lerp(uZoom.value, zoomTarget, 0.1, 0.00001);
      if (zoomChange !== 0) {
        uZoom.value += zoomChange;
        uZoom.needsUpdate = true;
      }
    }
  }
  getPlaneMetrics(viewWidth, viewHeight, width, height) {
    const planeWidth = viewWidth / 4.5;
    if (width < 800) {
      return {
        planeWidth: viewWidth / 3,
        planeHeight: viewHeight * 0.8,
        x: 0,
        // Calculate the resting(empty) space and divided by number of planes
        space: viewWidth / 3
      };
    }
    return {
      planeWidth,
      planeHeight: viewHeight * 0.8,
      x: viewWidth / 5 / 1.5,
      // Calculate the resting(empty) space and divided by number of planes
      space: (viewWidth - (viewWidth / 5 / 1.5) * 2 - planeWidth) / 2
    };
  }
  onResize(width, height) {
    const viewSize = this.sceneManager.getViewSize();

    const planeMetrics = this.getPlaneMetrics(
      viewSize.width,
      viewSize.height,
      width,
      height
    );
    const geometry = new THREE.PlaneBufferGeometry(
      planeMetrics.planeWidth,
      planeMetrics.planeHeight,
      1,
      1
    );

    this.uniforms.uPlaneSize.value.set(
      planeMetrics.planeWidth,
      planeMetrics.planeHeight
    );
    this.uniforms.uPlaneSize.needsUpdate = true;

    let translateToLeft = -viewSize.width / 2 + planeMetrics.planeWidth / 2;
    let x = translateToLeft + planeMetrics.x;
    let space = planeMetrics.space;

    this.meshes.forEach((mesh, i) => {
      mesh.geometry.dispose();
      mesh.geometry = geometry;
      mesh.position.x = x + i * space;
    });
  }
}

const fragmentShader = `
uniform float uZoom;
uniform float uZoomDelta;
uniform vec2 uMouse;

uniform vec2 uPlaneSize;
uniform sampler2D uImage;
uniform vec2 uImageSize;

varying vec2 vUv;

vec2 withRatio(vec2 uv, vec2 canvasSize, vec2 textureSize){
    
    vec2 ratio = vec2(
        min((canvasSize.x / canvasSize.y) / (textureSize.x / textureSize.y), 1.0),
        min((canvasSize.y / canvasSize.x) / (textureSize.y / textureSize.x), 1.0)
      );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
}
vec3 greyScale(vec3 color){
    return vec3(color.r + color.g + color.b)/3.;
}

void main() {
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= 1.- uZoomDelta * uZoom;
    uv += uZoomDelta * (uMouse-0.5) * 0.5 * uZoom;
    uv += 0.5;
    uv = withRatio(uv, uPlaneSize, uImageSize);
    vec3 tex = texture2D(uImage, uv).xyz;
  vec3 color = vec3(0.2 + uZoom * 0.5);
  color = mix(greyScale(tex)*0.5, tex, uZoom);
  gl_FragColor = vec4(color,1.);
}`;
const vertexShader = `
varying vec2 vUv;
void main() {
  vec3 pos = position.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
    vUv = uv;
}`;
