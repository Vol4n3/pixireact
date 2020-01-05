export const HexagonDirection = [
  'southWest',
  'west',
  'northWest',
  'northEast',
  'east',
  'southEast',
];

export class HexagonCube {
  x;
  y;
  z;
  constructor(x, y, z) {
    if ((x + y + z) !== 0) {
      console.warn('sum hexa cube not equal to 0');
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   *
   * @param {HexagonCube}hexagonCube
   * @param {number}time
   * @returns {HexagonCube}
   */
  lerp(hexagonCube, time) {
    const _LERP = (a, b, t) => {
      return a + (b - a) * t;
    };
    const _ROUND = (x, y, z) => {
      let rx = Math.round(x);
      let ry = Math.round(y);
      let rz = Math.round(z);
      const x_diff = Math.abs(rx - x);
      const y_diff = Math.abs(ry - y);
      const z_diff = Math.abs(rz - z);
      if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry - rz;
      } else if (y_diff > z_diff) {
        ry = -rx - rz;
      } else {
        rz = -rx - ry;
      }
      return new HexagonCube(rx, ry, rz);
    };
    return _ROUND(
      _LERP(this.x, hexagonCube.x, time),
      _LERP(this.y, hexagonCube.y, time),
      _LERP(this.z, hexagonCube.z, time)
    );
  }

  /**
   *
   * @param hexagonCube
   * @returns {HexagonCube[]}
   */
  lineTo(hexagonCube) {
    const results = [];
    const n = this.distanceTo(hexagonCube);
    if (n > 0) {
      for (let i = 0; i <= n; i++) {
        results.push(this.lerp(hexagonCube, 1 / n * i));
      }
    }
    return results;
  }
  /**
   *
   * @param {'southWest','west','northWest','northEast','east','southEast'} direction
   * @param {number} distance
   * @returns {HexagonCube}
   */
  nextDirection(direction, distance) {
    switch (direction) {
      case 'southWest':
        return new HexagonCube(this.x, this.y - distance, this.z + distance);
      case 'southEast':
        return new HexagonCube(this.x - distance, this.y, this.z + distance);
      case 'east':
        return new HexagonCube(this.x - distance, this.y + distance, this.z);
      case 'northEast':
        return new HexagonCube(this.x, this.y + distance, this.z - distance);
      case 'northWest':
        return new HexagonCube(this.x + distance, this.y, this.z - distance);
      case 'west':
        return new HexagonCube(this.x + distance, this.y - distance, this.z);
    }
  }

  /**
   *
   * @param {HexagonCube} hexagonCube
   * @returns {number}
   */
  distanceTo(hexagonCube) {
    return Math.max(Math.abs(this.x - hexagonCube.x), Math.abs(this.y - hexagonCube.y), Math.abs(this.z - hexagonCube.z));
  }

  /**
   *
   * @param {HexagonCube} hexagonCube
   * @returns {boolean}
   */
  equal(hexagonCube) {
    return this.x === hexagonCube.x && this.y === hexagonCube.y && this.z === hexagonCube.z;
  }
  /**
   *
   * @param start
   * @param end
   * @returns {HexagonCube[]}
   */
  circle(start, end) {
    if (!end) {
      end = start;
      start = 1;
    }
    const result = [];
    for (let radius = start; radius <= end; radius++) {
      let next = this.nextDirection('east', radius);
      HexagonDirection.forEach((dir) => {
        for (let i = 0; i < radius; i++) {
          next = next.nextDirection(dir, 1);
          result.push(next);
        }
      });
    }
    return result;
  }
}