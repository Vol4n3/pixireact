import {Container} from "pixi.js";
import {Hexagon} from './hexagon';
import {AxialToCube} from './hexagonCube';

export class HexagonGrid {
  constructor() {
    this.container = new Container();
    const base = new Hexagon(0, 0, 40, AxialToCube(0, 0));
    this.container.addChild(base.sprite);
    for (let row = 0; row < 3; row++) {
      const cols = (row % 2 === 0) ? 10 : 9;
      for (let col = 0; col < cols; col++) {
        if (row === 0 && col === 0) {
          continue;
        }
        const next = base.createNextHexagon(AxialToCube(col, row));
        this.container.addChild(next.sprite);
      }
    }
  }
}
