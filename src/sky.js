import {Graphics} from "pixi.js";
import {CreateGradient} from './helper/gradient';

export class Sky {
  constructor(width, height) {
    this.sprite = new Graphics();

    this.updateDraw(width, height, ['#6bddff', '#fde4da']);
  }

  updateDraw(width, height, colors) {
    if (colors) {
      this.colors = colors
    }
    this.sprite.clear();
    this.texture = CreateGradient(height * 2, this.colors);
    this.sprite.beginTextureFill({texture: this.texture});
    this.sprite.drawRect(0, 0, width, height);
    this.sprite.endFill();
  }
}
