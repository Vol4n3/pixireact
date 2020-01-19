import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BaseTexture, Container, Rectangle, Texture, Graphics,filters,utils, Sprite} from 'pixi.js';
import {Sun} from './sun';
import {Ground} from './ground';
import {Sky} from './sky';
import {HexagonGrid} from './hexagonGrid';
import {Entity} from './entity';
import {Linear} from './helper/easing';
import {ArrowTarget} from './arrow-target';
import {LinearHue} from './helper/utils';
import {Game} from './game';
import {LightPointFilter} from './light-point.filter';
import {AmbientFilter} from './ambient.filter';

ReactDOM.render(<App/>, document.getElementById('root'));

//socket
const socketUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8854/' : 'https://comuty.fr/';
const script = document.createElement('script');
let socket;
script.async = true;
script.src = socketUrl + 'socket.io/socket.io.js';
script.onload =  ()=>{
  socket = window.io(socketUrl);
};
document.head.appendChild(script);
// config app
const game = new Game();
// global container
const container = new Container();
container.sortableChildren = true;
game.app.stage.addChild(container);
// sky
const sky = new Sky(game, container);
sky.sprite.zIndex = 1;
// sun
const sun = new Sun(game, container, 75);
sun.sprite.zIndex = 2;
// ground
const containerObject = new Container();
containerObject.zIndex = 4;
const ambient = 0x444444;
const ambientFilter = new AmbientFilter({ambient});
const lightFilter = new LightPointFilter({ambient});
const lightFilter2 = new LightPointFilter({ambient});
lightFilter2.position.x = 900;
containerObject.filters =  [ambientFilter,lightFilter];
container.addChild(containerObject);
const background = new Sprite();
containerObject.addChild(background);
const ground = new Ground(game, containerObject);
// map
const hexagonGrid = new HexagonGrid(game, ground.container);
hexagonGrid.container.position.set(game.width / 12, game.height / 25);
hexagonGrid.container.zIndex = 2;


// entities
const assets = new BaseTexture('./assets.png');
// hero
const heroTexture = new Texture(assets, new Rectangle(0, 0, 120, 120));
const hero = new Entity(game.app, heroTexture, hexagonGrid.hexagons[0]);
hexagonGrid.container.addChild(hero.sprite);
// other
const otherHeroTexture = new Texture(assets, new Rectangle(120, 0, 120, 120));
const otherHero = new Entity(game.app, otherHeroTexture, hexagonGrid.hexagons[50]);
hexagonGrid.container.addChild(otherHero.sprite);

// click events
hexagonGrid.hexagons.forEach(h => h.clickListeners.push(async (hexagon) => {
  const path = hexagonGrid.findPath(hero.positionHexagon, hexagon, 3);
  for (let i = 0; i < path.length; i++) {
    await hero.moveTo(path[i], 10);
    hexagonGrid.container.sortChildren()
  }
}));
// arrow
const arrowTarget = new ArrowTarget();
hexagonGrid.container.addChild(arrowTarget.sprite);

// hover event
let haveHighlights = false;
hexagonGrid.hexagons.forEach(h => h.hoverListeners.push((hexagon) => {
  if (haveHighlights) {
    hexagonGrid.hexagons.forEach(h => h.draw())
  }
  if (hexagon.attachedEntity) {
    const canTarget = hexagonGrid.rayTracing(hero.positionHexagon, hexagon);
    const haveObstacle = canTarget.some(h => h.obstacle);
    if (canTarget.length) {
      if (haveObstacle) {
        arrowTarget.draw(hero.sprite.position, hexagon.sprite.position, 0xffcc00)
      } else {
        arrowTarget.draw(hero.sprite.position, hexagon.sprite.position, 0x00ccff)
      }
    } else {

    }
    return;
  }
  arrowTarget.hide();
  const canMove = hexagonGrid.findPath(hero.positionHexagon, hexagon, 3);

  if (canMove.length) {
    canMove.forEach(h => h.draw(true));
    haveHighlights = true;
  } else {
    haveHighlights = false;
  }
}));
const light = new Graphics();
light.beginFill(0xffffff,0.2);
light.drawEllipse(0, 0, 75, 30);
//light.blendMode = BLEND_MODES.MULTIPLY;

const eropos = otherHero.sprite.getGlobalPosition();
light.position.set(eropos.x, eropos.y);

const blur = new filters.BlurFilter(10);

light.filters = [blur];
light.zIndex = 10;
//container.addChild(light);

// sky update
const stepsSkyColors = [
  [[242, 18, 35, 0], [238, 26, 55, 0.5], [238, 26, 55, 0.5], [336, 43, 66, 1]], // 5
  [[236, 37, 60, 0], [242, 31, 63, 0.6], [242, 31, 63, 0.6], [326, 58, 80, 1]], // 6
  [[211, 55, 68, 0], [211, 55, 68, 0], [211, 55, 68, 0], [1, 59, 81, 1]], // 7
  [[211, 88, 78, 0], [211, 88, 78, 0.1], [197, 100, 83, 0.7], [236, 58, 81, 1]], // 8
  [[197, 100, 86, 0], [197, 100, 86, 0], [197, 100, 86, 0], [198, 100, 79, 1]], // 9
  [[197, 98, 80, 0], [197, 98, 80, 0], [197, 98, 80, 0], [197, 95, 69, 1]], // 10
  [[197, 98, 78, 0], [197, 98, 78, 0], [197, 98, 78, 0], [198, 62, 52, 1]], // 11
  [[197, 79, 63, 0], [197, 79, 63, 0], [197, 79, 63, 0], [206, 65, 40, 1]], // 12
  [[200, 62, 47, 0], [200, 62, 47, 0], [200, 62, 47, 0], [212, 65, 34, 1]], // 13
  [[205, 65, 41, 0], [205, 65, 41, 0], [212, 65, 34, 0.7], [195, 18, 44, 1]], // 14
  [[212, 65, 34, 0], [212, 65, 34, 0], [210, 57, 34, 0.5], [210, 18, 44, 1]], // 15
  [[212, 65, 34, 0], [212, 65, 34, 0], [190, 10, 49, 0.5], [45, 76, 64, 1]], // 16
  [[212, 70, 27, 0], [205, 13, 39, 0.3], [25, 69, 63, 0.7], [21, 51, 46, 1]], // 17
  [[202, 58, 20, 0], [30, 5, 29, 0.3], [28, 63, 47, 0.6], [21, 85, 39, 1]], // 18
  [[204, 88, 3, 0.3], [18, 78, 20, 0.8], [18, 78, 20, 0.8], [15, 74, 11, 1]], // 19
  [[23, 80, 2, 0], [23, 80, 2, 0.5], [20, 85, 16, 1], [20, 85, 16, 1]], // 20
  [[240, 100, 2, 0], [240, 100, 2, 0.8], [23, 100, 4, 1], [23, 100, 4, 1]], // 21
  [[240, 100, 2, 0], [240, 100, 2, 0], [240, 100, 2, 1], [240, 100, 2, 1]], // 22
  [[240, 100, 2, 0], [240, 100, 2, 0], [240, 100, 2, 1], [240, 100, 2, 1]], // 23
  [[244, 89, 4, 0], [244, 89, 4, 0], [244, 89, 4, 0.85], [256, 20, 11, 1]], // 0
  [[244, 89, 4, 0], [244, 89, 4, 0], [244, 89, 4, 0.6], [240, 16, 15, 1]], // 1
  [[244, 89, 4, 0], [244, 89, 4, 0], [244, 89, 4, 0.1], [240, 17, 27, 1]], // 2
  [[240, 16, 15, 0], [240, 16, 15, 0], [240, 16, 15, 0], [240, 18, 39, 1]], // 3
  [[240, 18, 31, 0], [238, 26, 55, 0.8], [238, 26, 55, 0.8], [263, 24, 57, 1]], // 4


];
const updateSkySun = () => {
  let sunlight = Math.PI * 2 - sun.angle;
  let heightSunRatio = sun.sprite.position.y / (sun.origin.y + 700);
  heightSunRatio = (heightSunRatio < 0) ? 0 : heightSunRatio > 0.4 ? 0.4 : heightSunRatio;
  const ambientRation = heightSunRatio;
  const ambientNight = utils.rgb2hex([ambientRation,ambientRation,ambientRation]);
  ambientFilter.ambient = ambientNight;
  lightFilter.ambient = ambientNight;
  lightFilter2.ambient = ambientNight;
  const division = Math.PI * 2 / 24;
  if (sunlight < 0) {
    sunlight = 0;
  }

  const ratio = (sunlight % division) / division;
  let step = Math.floor(sunlight / division);
  step = (step < 0) ? stepsSkyColors.length - 1 : (step > stepsSkyColors.length - 1) ? 0 : step;
  let nextStep = step + 1;
  nextStep = (nextStep > stepsSkyColors.length - 1) ? 0 : nextStep;
  const SC = stepsSkyColors[step];
  const NSC = stepsSkyColors[nextStep];
  const gradients = [];
  for (let i = 0; i < 4; i++) {
    gradients.push({
      color: `hsl(${LinearHue(ratio, SC[i][0], NSC[i][0])},${Math.round(Linear(ratio, SC[i][1], NSC[i][1]))}%,${Math.round(Linear(ratio, SC[i][2], NSC[i][2]))}%)`,
      offset: Math.round(Linear(ratio, SC[i][3], NSC[i][3]) * 100) / 100
    })
  }
  sky.updateDraw(game.width, game.height, gradients);
  if (sun.sprite.position.x - sun.origin.x < 0) {
    sun.updateGraphic([{color: 'hsl(355,87%,82%)', offset: 0}, {
      color: 'hsl(320,100%,87%)',
      offset: 1
    }, {color: 'hsl(284,100%,86%)', offset: 1}]);
  } else {
    sun.updateGraphic([{color: 'hsl(56,87%,83%)', offset: 0}, {
      color: 'hsl(30,87%,82%)',
      offset: 0.5
    }, {color: 'hsl(18,100%,76%)', offset: 1}]);
  }
  sun.updateFilterDisplacement(heightSunRatio * 400);
  sun.updateBloom({
    threshold: (1 - heightSunRatio) * 0.15,
    bloomScale: (1 - heightSunRatio) * 2.5,
    brightness: 0.8,
    blur: (1 - heightSunRatio) * 40,
    quality: 10
  })
};
let count = 0;
game.app.ticker.add(() => {
  count++;
  if (count > 5) {
    updateSkySun();
    count = 0;
  }
});
