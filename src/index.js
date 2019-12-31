import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Application, Container, Graphics} from 'pixi.js';
import {Sun} from './sun';
import {CreateGradient} from './helper/gradient';

ReactDOM.render(<App/>, document.getElementById('root'));

const width = window.innerWidth;
const height = window.innerHeight;
const app = new Application({
  width,
  height,
  transparent: true,
  resolution: window.devicePixelRatio || 1
});
document.getElementById('scene').appendChild(app.view);
const container = new Container();
container.sortableChildren = true;

const sky = new Graphics();
sky.beginTextureFill({texture: CreateGradient(height * 2, ['#6bddff', '#fde4da'])});
sky.drawRect(0, 0, width, height);
sky.endFill();
sky.zIndex = 1;
container.addChild(sky);

const sun = new Sun(app, 50);
container.addChild(sun.sprite);
sun.sprite.zIndex = 2;

const ground = new Graphics();
ground.beginFill(0xaaccaa);
ground.moveTo(0, 0);
ground.lineTo(width, 0);
ground.lineTo(width, -height / 3);
ground.lineTo(0, -height / 3);
ground.endFill();
ground.position.y = height;
ground.zIndex = 4;
container.addChild(ground);


app.stage.addChild(container);

app.ticker.add(()=>{
  //sun.sprite.position.set(sun.sprite.position.x + 1 , sun.sprite.position.y + 1)
});
