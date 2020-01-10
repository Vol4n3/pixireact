import {Graphics, Container} from "pixi.js";

export class Ground {
  groundHeight;
  constructor(game,container) {
    this.groundHeight = game.groundHeight;
    this.container = new Container();
    this.container.sortableChildren = true;
    this.sprite = new Graphics();
    this.sprite.zIndex = 1;
    this.updateSize(game.width,game.height);
    this.container.addChild(this.sprite);
    this.container.position.y = game.height - this.groundHeight;
    container.addChild(this.container);

    game.resizeListeners.push((width,height) => {
      this.updateSize(width, height);
    });
  }
  updateSize(width,height){
    this.sprite.clear();
    // grass
    this.sprite.beginFill(0x1d8e26);
    this.sprite.drawRect(0,0,width, this.groundHeight - 250 );
    this.sprite.endFill();
    // dirt
    this.sprite.beginFill(0x865c38);
    this.sprite.drawRect(0,this.groundHeight - 250, width,250);
    this.sprite.endFill();
  }
}
