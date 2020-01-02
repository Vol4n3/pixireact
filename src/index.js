import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Application, Container} from 'pixi.js';
import {Sun} from './sun';
import {Ground} from './ground';
import {Sky} from './sky';

ReactDOM.render(<App/>, document.getElementById('root'));
const padding = 200;
let width = window.innerWidth + padding;
let height = window.innerHeight + padding;
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

const sky = new Sky(width, height);

sky.sprite.zIndex = 1;
container.addChild(sky.sprite);
resizeListeners.push(() => {
  sky.updateDraw(width, height);
});
const sun = new Sun(app, 50);
sun.sprite.zIndex = 2;
sun.sprite.position.set(width / 2 - 200, 0);
container.addChild(sun.sprite);

const ground = new Ground(width, height);
ground.sprite.zIndex = 4;
resizeListeners.push(() => {
  ground.updateSize(width, height);
});
container.addChild(ground.sprite);

app.stage.addChild(container);

const updateSkySun = (sunPosition, powerDisplacement) => {
  const horizon = height - height / 3;
  let hueSkyTop = 290 - Math.round(Math.abs(120 - 120 * sunPosition / horizon));
  let hueSkyBottom = 50 - Math.round(Math.abs(30 - 30 * sunPosition / horizon));
  let luminosityBottom = 50 + Math.round(Math.abs(30 - 30 * sunPosition / horizon));
  let afterHorizon = sunPosition - horizon;
  let skyDarkness = Math.round(2000 * afterHorizon / (height / 3)) / 100;
  if (afterHorizon < 0) {
    skyDarkness = 0;
  }
  if (skyDarkness > 40) {
    skyDarkness = 40
  }
  if (hueSkyTop < 190) {
    hueSkyTop = 190;
  }
  if (luminosityBottom > 80) {
    luminosityBottom = 80;
  }
  const topSkyColor = `hsl(${hueSkyTop}, 100%, ${70 - skyDarkness}%)`;
  const bottomSkyColor = `hsl(${hueSkyBottom}, 90%, ${luminosityBottom - skyDarkness}%)`;
  sky.updateDraw(width, height, [topSkyColor, bottomSkyColor]);
  sun.updateGraphic(['#f9f4e3', '#f9efd9']);
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
  if(sun.sprite.position.y > height * 2){
    incrementSun = -1;
  }else if(sun.sprite.position.y < height * -2){
    incrementSun = 1;
  }
  count++;
  if (count > 10) {
    updateSkySun(sun.sprite.position.y , 0);
    count = 0;
  }
});
