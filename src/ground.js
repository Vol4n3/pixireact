import {Container, Graphics, filters} from "pixi.js";

export class Ground {
  groundHeight;

  constructor(game, container) {
    this.container = new Container();
    this.container.sortableChildren = true;
    this.sprite = new Graphics();
    this.sprite.zIndex = 1;
    this.updateSize(game.width, game.height,game.groundHeight);
    this.container.addChild(this.sprite);

    container.addChild(this.container);

    game.resizeListeners.push((changes) => {
      this.updateSize(changes.width, changes.height,changes.groundHeight);
    });
  }

  updateSize(width, height,groundHeight) {
    this.container.position.y = height- groundHeight;
    this.sprite.clear();
    // grass
    this.sprite.beginFill(0x1d8e26);
    this.sprite.drawRect(0, 0, width, groundHeight);
    this.sprite.endFill();
    // dirt
    this.sprite.beginFill(0x865c38);
    this.sprite.drawRect(0, groundHeight / 2, width, groundHeight);
    this.sprite.endFill();
  }
}
