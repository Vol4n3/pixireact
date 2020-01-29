import {Sprite} from "pixi.js";
import {EaseOutCubic, Linear} from '../helper/easing';

export class Entity {
  /**
   *
   * @param {PIXI.Application}app
   * @param {PIXI.Texture}texture
   * @param {Hexagon}hexagon
   */
  constructor(app, texture, hexagon) {
    this.direction = {x: 0, y: 0};
    this.maxTicks = 0;
    this.moveTick = 1;
    this.start = {x: 0, y: 0};
    this.traveling = false;
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.positionHexagon = hexagon;
    this.sprite.zIndex = hexagon.cube.z;
    hexagon.attachedEntity = this;
    const firstCell = hexagon.sprite.position;
    this.sprite.position.set(firstCell.x, firstCell.y);
    app.ticker.add(() => {
      this.update()
    })
  }

  /**
   *
   * @param {Hexagon} hexagon
   * @param {number} ticks
   */
  async moveTo(hexagon, ticks) {
    if (this.traveling) {
      return;
    }
    this.sprite.zIndex = hexagon.cube.z + 1;
    this.moveTick = 0;
    this.maxTicks = ticks;
    this.start = {x: this.sprite.position.x, y: this.sprite.position.y};
    this.direction = {x: hexagon.sprite.position.x, y: hexagon.sprite.position.y};
    this.traveling = true;
    this.positionHexagon.attachedEntity = null;
    hexagon.attachedEntity = this;
    this.positionHexagon = hexagon;
    return new Promise((resolve) => {
      this.onFinish = () => {
        resolve();
      }
    });
  }

  update() {
    if (this.moveTick > this.maxTicks) {
      if (this.traveling) {
        this.traveling = false;
        this.onFinish();
      }
      return;
    }
    const transition = {
      x: Linear(this.moveTick / this.maxTicks, this.start.x, this.direction.x),
      y: Linear(this.moveTick / this.maxTicks, this.start.y, this.direction.y)
    };
    this.sprite.position.set(transition.x, transition.y);
    this.moveTick++;
  }
}
