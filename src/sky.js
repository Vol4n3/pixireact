import {Graphics} from "pixi.js";
import {CreateGradient} from './helper/gradient';

export class Sky {

  constructor(game,container) {
    this.sprite = new Graphics();
    this.groundHeight = game.groundHeight;
    this.updateDraw(game.width, game.height,[{color : '#6bddff',offset: 0},{color : '#fde4da',offset: 1}]);
    container.addChild(this.sprite);
    game.resizeListeners.push((changes) => {
      this.groundHeight = changes.groundHeight;
      this.updateDraw(changes.width, changes.height);
    });
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
    this.sprite.clear();
    this.texture = CreateGradient(height * 2, this.colors);
    this.sprite.beginTextureFill({texture: this.texture});
    this.sprite.drawRect(0, 0, width, height - this.groundHeight);
    this.sprite.endFill();
  }
}
