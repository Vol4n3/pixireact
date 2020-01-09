import {Graphics, Container} from "pixi.js";

export class Ground {
  constructor(width,height,groundHeight) {
    this.container = new Container();
    this.container.sortableChildren = true;
    this.sprite = new Graphics();
    this.sprite.zIndex = 1;
    this.updateSize(width,height,groundHeight);
    this.container.addChild(this.sprite);
    this.container.position.y = height - groundHeight;
  }
  updateSize(width,height,groundHeight){
    this.sprite.clear();
    // grass
    this.sprite.beginFill(0x1d8e26);
    this.sprite.drawRect(0,0,width, groundHeight - 250 );
    this.sprite.endFill();
    // dirt
    this.sprite.beginFill(0x865c38);
    this.sprite.drawRect(0,groundHeight - 250, width,250);
    this.sprite.endFill();
  }
}
