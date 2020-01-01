import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Application, Container} from 'pixi.js';
import {Sun} from './sun';
import {Ground} from './ground';
import {Sky} from './sky';

ReactDOM.render(<App/>, document.getElementById('root'));

let width = window.innerWidth;
let height = window.innerHeight;
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
  width = window.innerWidth;
  height = window.innerHeight;
  app.renderer.resize(width, height);
  resizeListeners.forEach((listener) => {
    listener()
  })
});

const container = new Container();
container.sortableChildren = true;

const sky = new Sky(width,height);

sky.sprite.zIndex = 1;
container.addChild(sky.sprite);
resizeListeners.push(() => {
  sky.updateSize(width, height);
});
const sun = new Sun(app, 50);
sun.sprite.zIndex = 2;
sun.sprite.position.set(-500, -500);
container.addChild(sun.sprite);

const ground = new Ground(width, height);
ground.sprite.zIndex = 4;
resizeListeners.push(() => {
  ground.updateSize(width, height);
});
container.addChild(ground.sprite);


app.stage.addChild(container);

app.ticker.add(() => {
  sun.sprite.position.set(sun.sprite.position.x + 1 , sun.sprite.position.y + 1)
});
