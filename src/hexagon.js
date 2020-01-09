import {Graphics, Point, Polygon} from "pixi.js";

export class Hexagon {
  /**
   * @type {function(Hexagon,Event)[]}
   */
  blurListeners = [];
  /**
   * @type {function(Hexagon,Event)[]}
   */
  clickListeners = [];
  cube;
  /**
   * @type {function(Hexagon,Event)[]}
   */
  hoverListeners = [];
  sprite = new Graphics();
  attachedEntity;
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {HexagonCube}cube
   */
  constructor(x, y, radius, cube) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.points = getPolygonPoint(6, 0, 0, radius);
    const rand = Math.random();
    this.canMoveInto = (rand > 0.1);
    this.obstacle = !(rand > 0.1);
    /** @type {HexagonCube}*/
    this.cube = cube;
    this.sprite.interactive = this.canMoveInto;
    this.sprite.buttonMode = this.sprite.interactive;
    this.sprite.hitArea = new Polygon(this.points.map(p => new Point(p.x, p.y)));
    this.sprite.pivot.set(0.5, 0.5);
    this.sprite.position.set(x, y);
    this.sprite.zIndex = 0;
    this.draw();
    this.sprite.on('pointerup', this.handler.bind(this, 'clickListeners'));
    this.sprite.on('pointerover', this.handler.bind(this, 'hoverListeners'));
    this.sprite.on('pointerout', this.handler.bind(this, 'blurListeners'));
  }

  get height() {
    return 2 * this.radius + 10;
  }

  get width() {
    return Math.sqrt(3) * this.radius + 10;
  }

  /**
   *
   * @param {HexagonCube} cube
   * @return {Hexagon}
   */
  createNextHexagon(cube) {
    return new Hexagon(this.x + (this.width / 2) * (cube.x - cube.y),
      this.y + (this.height * 3 / 4) * cube.z,
      this.radius, cube)
  }

  /**
   * @param{boolean} [highlight]
   */
  draw(highlight) {
    this.sprite.clear();
    if (this.canMoveInto) {
      this.sprite.lineStyle(2, 0xdddddd);
    } else {
      this.sprite.lineStyle(2, 0xdd5566);
    }
    if (highlight) {
      this.sprite.beginFill(0xcccccc);
    }
    this.sprite.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < 6; i++) {
      this.sprite.lineTo(this.points[i].x, this.points[i].y);
    }
    this.sprite.closePath();

    if (highlight) {
      this.sprite.endFill();
    }
  }

  handler(listenerName, event) {
    this[listenerName].map((cb) => cb(this, event));
  }
}

export const getPolygonPoint = (nFaces, centerX, centerY, radius) => {
  const points = [];
  for (let i = 0; i < nFaces; i++) {
    points.push(PolygonPoint(nFaces, i, centerX, centerY, radius))
  }
  return points;
};
export const PolygonPoint = (nFaces, index, centerX, centerY, radius) => {
  const angle = Math.PI / nFaces * (2 * index - 1);
  return {
    x: Math.round(centerX + radius * Math.cos(angle)),
    y: Math.round(centerY + radius * Math.sin(angle))
  };
};
