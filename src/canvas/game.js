import {Application} from "pixi.js";

export class Game {
  constructor() {
    this.padding = 200;
    this.height = window.innerHeight + this.padding;
    this.width = window.innerWidth + this.padding;
    this.groundHeight = this.height / 1.5;
    this.app = new Application({
      width: this.width,
      height: this.height,
      transparent: true
    });
    document.getElementById('scene').appendChild(this.app.view);
  }
}
