import {Graphics} from "pixi.js";
import {CreateGradient} from './helper/gradient';

export class Sky {
  constructor(width, height) {
    this.sprite = new Graphics();
    this.texture = CreateGradient(height * 2, ['#6bddff', '#fde4da']);
    this.updateSize(width, height);
  }

  updateSize(width, height) {
    this.sprite.clear();
    this.sprite.beginTextureFill({texture: this.texture});
    this.sprite.drawRect(0, 0, width, height);
    this.sprite.endFill();
  }
}