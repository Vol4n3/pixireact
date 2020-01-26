import {Graphics} from 'pixi.js';

export class ArrowTarget {
  constructor() {
    this.sprite = new Graphics();
    this.sprite.zIndex = 5;
    this.sprite.visible = false;
  }
  hide(){
    this.sprite.visible = false;
  }
  draw(p1, p2,color) {
    this.sprite.visible = true;
    this.sprite.clear();
    this.sprite.lineStyle(5, color);
    this.sprite.moveTo(p1.x, p1.y);
    this.sprite.lineTo(p2.x, p2.y);
  }
}
