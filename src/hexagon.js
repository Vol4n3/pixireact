import {Graphics, Point, Polygon} from "pixi.js";

export class Hexagon {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {HexagonCube}cube
   */
  constructor(x,y,radius,cube) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.points = getPolygonPoint(6, 0, 0, this.radius);
    this._cube = cube;
    this.sprite = new Graphics();
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.hitArea = new Polygon(this.points.map(p => new Point(p.x, p.y)));
    this.sprite.position.set(x,y);
    this.draw();

    this.sprite.on('click', this.onClick.bind(this));
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
    return new Hexagon(this.x + (this.width / 2) * (cube.y - cube.x),
      this.y + (this.height * 3 / 4) * cube.z,
      this.radius, cube)
  }
  onClick(event) {
    console.log(this);
    this.sprite.interactive = false;
  }

  draw() {
    this.sprite.clear();
    this.sprite.lineStyle(2, 0xdddddd);
    this.sprite.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < 6; i++) {
      this.sprite.lineTo(this.points[i].x, this.points[i].y);
    }
    this.sprite.closePath();
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
