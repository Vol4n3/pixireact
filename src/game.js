import {Application} from "pixi.js";

export class Game {
  padding = 200;
  groundHeight = 450;
  height = window.innerHeight + this.padding;
  width = window.innerWidth + this.padding;
  rRef = this.resize.bind(this);
  /**
   * @type {function(number,number)[]}
   */
  resizeListeners = [];

  constructor() {
    this.app = new Application({
      width: this.width,
      height: this.height,
      transparent: true
    });
    document.getElementById('scene').appendChild(this.app.view);
    window.addEventListener('resize', this.rRef);
  }

  resize() {
    this.width = window.innerWidth + this.padding;
    this.height = window.innerHeight + this.padding;
    this.app.renderer.resize(this.width, this.height);
    this.resizeListeners.forEach((listener) => {
      listener(this.width, this.height);
    })
  }
}
