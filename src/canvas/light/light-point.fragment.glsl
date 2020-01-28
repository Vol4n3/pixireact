precision mediump float;
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
}
