import {Sprite} from "pixi.js";
import {CreateGradient} from './helper/gradient';

export class Sky {

  constructor(game,container) {
    this.sprite = new Sprite();
    this.groundHeight = game.groundHeight;
    this.updateDraw(game.width, game.height,[{color : '#6bddff',offset: 0},{color : '#fde4da',offset: 1}]);
    container.addChild(this.sprite);
  }

  /**
   *
   * @param width
   * @param height
   * @param {Object[]} [colors]
   * @param {string} colors.color
   * @param {number} colors.offset
   */
  updateDraw(width, height,colors) {
    if (colors) {
      this.colors = colors
    }
    this.sprite.width = width;
    this.sprite.height = height;
    this.texture = CreateGradient(height * 2, this.colors);
    this.sprite.texture = this.texture;
  }
}
