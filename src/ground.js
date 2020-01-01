import {Graphics} from "pixi.js";

export class Ground {
  constructor(width,height) {
    this.sprite = new Graphics();
    this.updateSize(width,height)
  }
  updateSize(width,height){
    this.sprite.clear();
    this.sprite.beginFill(0xaaccaa);
    this.sprite.moveTo(0, 0);
    this.sprite.lineTo(width, 0);
    this.sprite.lineTo(width, -height / 3);
    this.sprite.lineTo(0, -height / 3);
    this.sprite.endFill();
    this.sprite.position.y = height;
  }
}