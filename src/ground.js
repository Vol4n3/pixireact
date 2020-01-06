import {Graphics} from "pixi.js";

export class Ground {
  constructor(width,height,groundHeight) {
    this.sprite = new Graphics();
    this.updateSize(width,height,groundHeight)
  }
  updateSize(width,height,groundHeight){
    this.sprite.clear();
    // grass
    this.sprite.beginFill(0x1d8e26);
    this.sprite.drawRect(0,0,width, -groundHeight );
    this.sprite.endFill();
    // dirt
    this.sprite.beginFill(0x865c38);
    this.sprite.drawRect(0,0,width,235-groundHeight);
    this.sprite.endFill();
    this.sprite.position.y = height;
  }
}