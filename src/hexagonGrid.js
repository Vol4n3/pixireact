import {Container} from "pixi.js";
import {Hexagon} from './hexagon';
import {HexagonCube} from './hexagonCube';

export class HexagonGrid {
  constructor() {
    this.container = new Container();
    let base = new Hexagon(0, 0, 35, new HexagonCube(0, 0, 0));
    this.container.addChild(base.sprite);
    for (let i = 1; i < 10; i++) {
      const nextCube = base._cube.nextDirection('east', i);
      const nextHexagon = base.createNextHexagon(nextCube);
      this.container.addChild(nextHexagon.sprite);
    }
    const row2cube = base._cube.nextDirection('southWest', 1);
    const row2 = base.createNextHexagon(row2cube);
    this.container.addChild(row2.sprite);
    for (let i = 1; i < 11; i++) {
      const nextCube = row2cube.nextDirection('east', i);
      const nextHexagon = base.createNextHexagon(nextCube);
      this.container.addChild(nextHexagon.sprite);
    }
    const row3Cube = row2._cube.nextDirection('southEast', 1);
    const row3 = base.createNextHexagon(row3Cube);
    this.container.addChild(row3.sprite);
    for (let i = 1; i < 10; i++) {
      const nextCube = row3Cube.nextDirection('east', i);
      const nextHexagon = base.createNextHexagon(nextCube);
      this.container.addChild(nextHexagon.sprite);
    }
    this.container.addChild(row3.sprite);
  }
}
