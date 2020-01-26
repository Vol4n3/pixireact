import {Filter, utils} from 'pixi.js';
import {Vertex} from '../helper/vertex';

const fragment = `precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform vec3 uAmbient;


void main(void) {
  vec4 inputColor = texture2D(uSampler, vTextureCoord);
  if(inputColor.a == 0.0) discard;
  inputColor.rgb -= uAmbient;
  gl_FragColor = inputColor;
}`;

export class AmbientFilter extends Filter {
  constructor(options = {}) {
    super(Vertex, fragment);
    this.uniforms.uAmbient = new Float32Array(3);

    this.ambient = options.ambient || 0x222222;
  }

  apply(filterManager, input, output, clear, currentState) {
    const colorArr = utils.hex2rgb(this.ambient);
    this.uniforms.uAmbient[0] = colorArr[0];
    this.uniforms.uAmbient[1] = colorArr[1];
    this.uniforms.uAmbient[2] = colorArr[2];
    super.apply(filterManager, input, output, clear, currentState);
    // filterManager.applyFilter(this, input, output, clear);
  }
}
