import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BaseTexture, Container, Rectangle, Texture} from 'pixi.js';
import * as Filters from 'pixi-filters';
import {Sun} from './sun';
import {Ground} from './ground';
import {Sky} from './sky';
import {HexagonGrid} from './hexagonGrid';
import {Entity} from './entity';
import {Linear} from './helper/easing';
import {ArrowTarget} from './arrow-target';
import {LinearHue} from './helper/utils';
import {Game} from './game';

ReactDOM.render(<App/>, document.getElementById('root'));
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
const ground = new Ground(game, container);
ground.container.zIndex = 4;
const adjustmentFilter = new Filters.AdjustmentFilter({brightness: 0.9,});
ground.container.filters = [adjustmentFilter];
container.addChild(ground.container);
// map
const hexagonGrid = new HexagonGrid(game.width, game.height);
hexagonGrid.container.position.set(100, 50);
hexagonGrid.container.zIndex = 2;
ground.container.addChild(hexagonGrid.container);

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


// sky update
const stepsSkyColors = [
  [[240, 18, 31, 0], [238, 26, 55, 0.8], [238, 26, 55, 0.8], [263, 24, 57, 1]], // 4
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
];
const updateSkySun = () => {
  let sunlight = Math.PI * 2 - sun.angle;
  let heightSunRatio =  sun.sprite.position.y / sun.origin.y;
  heightSunRatio = ( heightSunRatio < 0 ) ? 0 : heightSunRatio > 0.8 ? 0.8 : heightSunRatio;
  adjustmentFilter.brightness =  1 - heightSunRatio;
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
  for (let i = 0; i < 4 ; i++) {
    gradients.push({
      color: `hsl(${LinearHue(ratio, SC[i][0], NSC[i][0])},${Math.round(Linear(ratio, SC[i][1], NSC[i][1]))}%,${Math.round(Linear(ratio, SC[i][2], NSC[i][2]))}%)`,
      offset: Math.round(Linear(ratio, SC[i][3], NSC[i][3]) * 100) / 100
    })
  }
  sky.updateDraw(game.width, game.height, gradients);
  // sun.updateGraphic(['#f9f4e3', '#f9efd9']);
  sun.updateFilterDisplacement(0);
  sun.updateBloom({
    threshold: 0.15,
    bloomScale: 2.5,
    brightness: 0.8,
    blur: 40,
    quality: 10
  })
};
let count = 0;
game.app.ticker.add(() => {
  count++;
  if (count > 3) {
    updateSkySun();
    count = 0;
  }
});
