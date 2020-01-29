import {Container} from "pixi.js";

export default class Camera {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    this.world = new Container();
    this.world.sortableChildren = true;
    this._screenWidth = game.width - game.padding - game.width / 12;
    this._screenHeight = game.height - game.groundHeight -  game.height / 25;
    game.app.stage.addChild(this.world);
    game.app.ticker.add(() => {
      if (!this._follow) {
        return
      }
      let x = this._offsetX(this._follow.position.x);
      let y = this._offsetY(this._follow.position.y);
      x = x < 0 ? 0 : x + this._screenWidth + game.padding > this.world.width ? this.world.width - this._screenWidth - game.padding : x;
      y = y < 0 ? 0 : y + this._screenHeight  > this.world.height ? this.world.height - this._screenHeight : y;
      this.world.position.set(x, y);
    })
  }

  /**
   *
   * @param {PIXI.Sprite} sprite
   */
  set follow(sprite) {
    this._follow = sprite
  }

  _offsetX(x) {
    return -x + this._screenWidth / 2 ;
  }

  _offsetY(y) {
    return -y + this._screenHeight / 2;
  }
}
