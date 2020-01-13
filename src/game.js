import {Application} from "pixi.js";

export class Game {
  padding = 200;
  height = window.innerHeight + this.padding;
  width = window.innerWidth + this.padding;
  groundHeight = this.height / 2;
  rRef = this.resize.bind(this);

  /**
   * @typedef changes
   * @type {object}
   * @property {number} width
   * @property {number} height
   * @property {number} groundHeight
   */
  /**
   * @type {function(changes)[]}
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
    this.groundHeight = this.height / 2;
    this.app.renderer.resize(this.width, this.height);
    this.resizeListeners.forEach((listener) => {
      listener({width:this.width, height:this.height, groundHeight:this.groundHeight});
    })
  }
}
