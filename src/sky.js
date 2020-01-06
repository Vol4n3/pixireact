import {Graphics} from "pixi.js";
import {CreateGradient} from './helper/gradient';

export class Sky {
  constructor(width, height,groundHeight) {
    this.sprite = new Graphics();
    this.updateDraw(width, height, groundHeight,[{color : '#6bddff',offset: 0},{color : '#fde4da',offset: 1}]);
  }

  updateDraw(width, height, groundHeight,colors) {
    if (colors) {
      this.colors = colors
    }
    this.sprite.clear();
    this.texture = CreateGradient(height * 2, this.colors);
    this.sprite.beginTextureFill({texture: this.texture});
    this.sprite.drawRect(0, 0, width, height - groundHeight);
    this.sprite.endFill();
  }
}
