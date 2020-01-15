import {Application} from "pixi.js";

export class Game {
  padding = 200;
  height = window.innerHeight + this.padding;
  width = window.innerWidth + this.padding;
  groundHeight = this.height / 2;

  constructor() {
    this.app = new Application({
      width: this.width,
      height: this.height,
      transparent: true
    });
    document.getElementById('scene').appendChild(this.app.view);
  }
}
