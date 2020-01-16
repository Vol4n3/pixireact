import {Filter, utils} from 'pixi.js';
import {Vertex} from './helper/vertex';

const fragment = `precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform vec2 uPos;
uniform vec2 uEllipse;
uniform vec3 uColor;
uniform vec3 uAmbient;

void main(void) {
  vec4 inputColor = texture2D(uSampler, vTextureCoord);
  if(inputColor.a == 0.0) discard;
  vec2 coord = vTextureCoord * filterArea.xy;
  coord -= uPos * dimensions.xy;
  float dist = (coord.x * coord.x) / (uEllipse.x * uEllipse.x) + (coord.y * coord.y) / (uEllipse.y * uEllipse.y);
  if(dist <= 1.0){
     inputColor.rgb += (uAmbient + uColor) * ( 1.0 - dist / 1.0);
  }
  gl_FragColor = inputColor;
}`;

export class LightPointFilter extends Filter {
  constructor(options = {}) {
    super(Vertex, fragment);
    this.uniforms.dimensions = new Float32Array(2);
    this.uniforms.uColor = new Float32Array(3);
    this.uniforms.uEllipse = new Float32Array(2);
    this.uniforms.uPos = new Float32Array(2);
    this.uniforms.uAmbient = new Float32Array(3);
    this.position = options.position || {x: 30, y: 750};
    this.color = options.color || 0x111111;
    this.ellipse = options.ellipse || {width: 300, height: 200};
    this.ambient = options.ambient || 0x222222;
  }

  set ellipse(ellipse) {
    this.uniforms.uEllipse[0] = ellipse.width;
    this.uniforms.uEllipse[1] = ellipse.height;
  }

  get ellipse() {
    return {width: this.uniforms.uEllipse[0], height: this.uniforms.uEllipse[1]};
  }

  get ambient() {
    return utils.rgb2hex(this.uniforms.uAmbient);
  }

  set ambient(color) {
    const ambientArr = utils.hex2rgb(color);
    this.uniforms.uAmbient[0] = ambientArr[0];
    this.uniforms.uAmbient[1] = ambientArr[1];
    this.uniforms.uAmbient[2] = ambientArr[2];
  }

  get color() {
    return utils.rgb2hex(this.uniforms.uColor);
  }

  set color(color) {
    const colorArr = utils.hex2rgb(color);
    this.uniforms.uColor[0] = colorArr[0];
    this.uniforms.uColor[1] = colorArr[1];
    this.uniforms.uColor[2] = colorArr[2];
  }

  apply(filterManager, input, output, clear, currentState) {
    const {width, height} = input.filterFrame;
    this.uniforms.dimensions[0] = width;
    this.uniforms.dimensions[1] = height;
    this.uniforms.uPos[0] = this.position.x / width;
    this.uniforms.uPos[1] = this.position.y / height;
    super.apply(filterManager, input, output, clear, currentState);
    // filterManager.applyFilter(this, input, output, clear);
  }
}
