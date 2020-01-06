import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Application, Container} from 'pixi.js';
import {Sun} from './sun';
import {Ground} from './ground';
import {Sky} from './sky';
import {HexagonGrid} from './hexagonGrid';

ReactDOM.render(<App/>, document.getElementById('root'));
const padding = 0;
let width = window.innerWidth + padding;
let height = window.innerHeight + padding;
const groundHeight = 375;
const resizeListeners = [];
const app = new Application({
  width,
  height,
  transparent: true,
  autoDensity: true,
  resolution: window.devicePixelRatio || 1
});
document.getElementById('scene').appendChild(app.view);

window.addEventListener('resize', () => {
  width = window.innerWidth + padding;
  height = window.innerHeight + padding;
  app.renderer.resize(width, height);
  resizeListeners.forEach((listener) => {
    listener()
  })
});

const container = new Container();
container.sortableChildren = true;

const sky = new Sky(width, height, groundHeight);

sky.sprite.zIndex = 1;
container.addChild(sky.sprite);
resizeListeners.push(() => {
  sky.updateDraw(width, height, groundHeight);
});
const sun = new Sun(app, 50);
sun.sprite.zIndex = 2;
sun.sprite.position.set(width / 2 - 200, 0);
container.addChild(sun.sprite);

const ground = new Ground(width, height, groundHeight);
ground.sprite.zIndex = 4;
resizeListeners.push(() => {
  ground.updateSize(width, height, groundHeight);
});
container.addChild(ground.sprite);

const hexagonMap = new HexagonGrid(width, height);
hexagonMap.container.zIndex = 5;
hexagonMap.container.position.set(50, 50 + height - groundHeight);
container.addChild(hexagonMap.container);

app.stage.addChild(container);

const minDistanceRangeLoop = (start, end, min, max) => {
  const distanceA = end - start;
  let distanceB;
  if (distanceA > 0) {
    distanceB = min - max + distanceA;
  } else {
    distanceB = max - min + distanceA;
  }
  return Math.abs(distanceA) < Math.abs(distanceB) ? distanceA : distanceB;
};
const linear = (ratio, start, desired) => {
  return start + (desired - start) * ratio;
};
const getLinearHue = (ratio, start, desired) => {
  return Math.round(start + minDistanceRangeLoop(start, desired, 0, 360) * ratio);
};
const stepsSkyColors = [
  {a: [197, 79, 63, 0], b: [197, 79, 63, 0], c: [197, 79, 63, 0], d: [206, 65, 40, 1]}, // 12
  {a: [200, 62, 47, 0], b: [200, 62, 47, 0], c: [200, 62, 47, 0], d: [212, 65, 34, 1]}, // 13
  {a: [205, 65, 41, 0], b: [205, 65, 41, 0], c: [212, 65, 34, 0.7], d: [195, 18, 44, 1]}, // 14
  {a: [212, 65, 34, 0], b: [212, 65, 34, 0], c: [210, 57, 34, 0.5], d: [210, 18, 44, 1]}, // 15
  {a: [212, 65, 34, 0], b: [212, 65, 34, 0], c: [190, 10, 49, 0.5], d: [45, 76, 64, 1]}, // 16
  {a: [212, 70, 27, 0], b: [205, 13, 39, 0.3], c: [25, 69, 63, 0.7], d: [21, 51, 46, 1]}, // 17
  {a: [202, 58, 20, 0], b: [30, 5, 29, 0.3], c: [28, 63, 47, 0.6], d: [21, 85, 39, 1]}, // 18
  {a: [204, 88, 3, 0.3], b: [18, 78, 20, 0.8], c: [18, 78, 20, 0.8], d: [15, 74, 11, 1]}, // 19
  {a: [23, 80, 2, 0], b: [23, 80, 2, 0.5], c: [20, 85, 16, 1], d: [20, 85, 16, 1]}, // 20
  {a: [240, 100, 2, 0], b: [240, 100, 2, 0.8], c: [23, 100, 4, 1], d: [23, 100, 4, 1]}, // 21
  {a: [240, 100, 2, 0], b: [240, 100, 2, 0], c: [240, 100, 2, 1], d: [240, 100, 2, 1]}, // 22
  {a: [240, 100, 2, 0], b: [240, 100, 2, 0], c: [240, 100, 2, 1], d: [240, 100, 2, 1]}, // 23
  {a: [244, 89, 4, 0], b: [244, 89, 4, 0], c: [244, 89, 4, 0.85], d: [256, 20, 11, 1]}, // 0
  {a: [244, 89, 4, 0], b: [244, 89, 4, 0], c: [244, 89, 4, 0.6], d: [240, 16, 15, 1]}, // 1
  {a: [244, 89, 4, 0], b: [244, 89, 4, 0], c: [244, 89, 4, 0.1], d: [240, 17, 27, 1]}, // 2
  {a: [240, 16, 15, 0], b: [240, 16, 15, 0], c: [240, 16, 15, 0], d: [240, 18, 39, 1]}, // 3
  {a: [240, 18, 31, 0], b: [238, 26, 55, 0.8], c: [238, 26, 55, 0.8], d: [263, 24, 57, 1]}, // 4
  {a: [242, 18, 35, 0], b: [238, 26, 55, 0.5], c: [238, 26, 55, 0.5], d: [336, 43, 66, 1]}, // 5
  {a: [236, 37, 60, 0], b: [242, 31, 63, 0.6], c: [242, 31, 63, 0.6], d: [326, 58, 80, 1]}, // 6
  {a: [211, 55, 68, 0], b: [211, 55, 68, 0], c: [211, 55, 68, 0], d: [1, 59, 81, 1]}, // 7
  {a: [211, 88, 78, 0], b: [211, 88, 78, 0.1], c: [197, 100, 83, 0.7], d: [236, 58, 81, 1]}, // 8
  {a: [197, 100, 86, 0], b: [197, 100, 86, 0], c: [197, 100, 86, 0], d: [198, 100, 79, 1]}, // 9
  {a: [197, 98, 80, 0], b: [197, 98, 80, 0], c: [197, 98, 80, 0], d: [197, 95, 69, 1]}, // 10
  {a: [197, 98, 78, 0], b: [197, 98, 78, 0], c: [197, 98, 78, 0], d: [198, 62, 52, 1]}, // 11
];
const updateSkySun = (sunPosition, powerDisplacement) => {
  const division = 100;
  if (sunPosition < 0) {
    sunPosition = 0;
  }
  const ratio = (sunPosition % division) / division;
  let step = Math.floor(sunPosition / division);
  step = (step < 0) ? stepsSkyColors.length - 1 : (step > stepsSkyColors.length - 1) ? 0 : step;
  let nextStep = step + 1;
  nextStep = (nextStep > stepsSkyColors.length - 1) ? 0 : nextStep;
  const SC = stepsSkyColors[step];
  const NSC = stepsSkyColors[nextStep];
  const gradients = [
    {
      color: `hsl(${getLinearHue(ratio, SC.a[0], NSC.a[0])},${Math.round(linear(ratio, SC.a[1], NSC.a[1]))}%,${Math.round(linear(ratio, SC.a[2], NSC.a[2]))}%)`,
      offset: Math.round(linear(ratio, SC.a[3], NSC.a[3]) * 100) / 100
    },
    {
      color: `hsl(${getLinearHue(ratio, SC.b[0], NSC.b[0])},${Math.round(linear(ratio, SC.b[1], NSC.b[1]))}%,${Math.round(linear(ratio, SC.b[2], NSC.b[2]))}%)`,
      offset: Math.round(linear(ratio, SC.b[3], NSC.b[3]) * 100) / 100
    },
    {
      color: `hsl(${getLinearHue(ratio, SC.c[0], NSC.c[0])},${Math.round(linear(ratio, SC.c[1], NSC.c[1]))}%,${Math.round(linear(ratio, SC.c[2], NSC.c[2]))}%)`,
      offset: Math.round(linear(ratio, SC.c[3], NSC.c[3]) * 100) / 100
    },
    {
      color: `hsl(${getLinearHue(ratio, SC.d[0], NSC.d[0])},${Math.round(linear(ratio, SC.d[1], NSC.d[1]))}%,${Math.round(linear(ratio, SC.d[2], NSC.d[2]))}%)`,
      offset: Math.round(linear(ratio, SC.d[3], NSC.d[3]) * 100) / 100
    },
  ];
  sky.updateDraw(width, height, groundHeight, gradients);
  // sun.updateGraphic(['#f9f4e3', '#f9efd9']);
  sun.updateFilterDisplacement(powerDisplacement);
  sun.updateBloom({
    threshold: 0.15,
    bloomScale: 2.5,
    brightness: 0.8,
    blur: 40,
    quality: 10
  })
};
let count = 0;
let incrementSun = 1;
app.ticker.add(() => {
  sun.sprite.position.y = sun.sprite.position.y + incrementSun;
  if (sun.sprite.position.y > height * 2) {
    incrementSun = -1;
  } else if (sun.sprite.position.y < height * -2) {
    incrementSun = 1;
  }
  count++;
  if (count > 2) {
    document.body.className = `sky-gradient-${Math.round(sun.sprite.position.y / 100)}`;
    updateSkySun(sun.sprite.position.y, 0);
    count = 0;
  }
});
