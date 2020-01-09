import {Sprite} from "pixi.js";
import {EaseOutCubic} from './helper/easing';

export class Entity {
  type;
  direction = {x: 0, y: 0};
  maxTicks = 0;
  moveTick = 1;
  onFinish;
  start = {x: 0, y: 0};
  traveling = false;

  /**
   *
   * @param {PIXI.Application}app
   * @param {PIXI.Texture}texture
   * @param {Hexagon}hexagon
   */
  constructor(app, texture, hexagon) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.positionHexagon = hexagon;
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
      x: EaseOutCubic(this.moveTick / this.maxTicks, this.start.x, this.direction.x),
      y: EaseOutCubic(this.moveTick / this.maxTicks, this.start.y, this.direction.y)
    };
    this.sprite.position.set(transition.x, transition.y);
    this.moveTick++;
  }
}
