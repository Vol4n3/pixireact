export const HexagonDirection = [
  'southWest',
  'west',
  'northWest',
  'northEast',
  'east',
  'southEast',
];
/**
 *
 * @param {number} col
 * @param {number} row
 * @return {HexagonCube}
 * @constructor
 */
export const AxialToCube = (col, row) => {
  const x = col - (row - (row & 1)) / 2;
  const z = row;
  const y = -x - z;
  return new HexagonCube(x, y, z)
};
/**
 * @param {HexagonCube} cube
 * @param {'southWest','west','northWest','northEast','east','southEast'} direction
 * @param {number} distance
 * @returns {HexagonCube}
 */
export const CubeDirection = (cube, direction, distance) => {
  switch (direction) {
    case 'southWest':
      return new HexagonCube(cube.x - distance, cube.y, cube.z + distance);
    case 'southEast':
      return new HexagonCube(cube.x, cube.y - distance, cube.z + distance);
    case 'east':
      return new HexagonCube(cube.x + distance, cube.y - distance, cube.z);
    case 'west':
      return new HexagonCube(cube.x - distance, cube.y + distance, cube.z);
    case 'northEast':
      return new HexagonCube(cube.x + distance, cube.y, cube.z - distance);
    case 'northWest':
      return new HexagonCube(cube.x, cube.y + distance, cube.z - distance);
    default:
      console.warn('unknown direction', direction);
  }
};

/**
 *
 * @param {number} a
 * @param {number} b
 * @param {number} time
 * @return {*}
 */
export const lerpNumber = (a, b, time) => {
  return a + (b - a) * time;
};
/**
 *
 * @param {number}x
 * @param {number}y
 * @param {number}z
 * @return {HexagonCube}
 */
export const cubeRound = (x, y, z) => {
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
/**
 *
 * @param {HexagonCube}start
 * @param {HexagonCube}end
 * @param {number}time
 * @returns {HexagonCube}
 */
export const lerpCube = (start, end, time) => {
  return cubeRound(
    lerpNumber(start.x, end.x, time),
    lerpNumber(start.y, end.y, time),
    lerpNumber(start.z, end.z, time)
  );
};
/**
 *
 * @param {HexagonCube} start
 * @param {HexagonCube} end
 * @returns {number}
 */
export const distanceCube = (start, end) => {
  return Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y), Math.abs(start.z - end.z));
};
/**
 *
 * @param {HexagonCube}start
 * @param {HexagonCube}end
 * @returns {HexagonCube[]}
 */
export const lineCube = (start, end) => {
  const results = [];
  const n = distanceCube(start, end);
  if (n > 0) {
    for (let i = 0; i <= n; i++) {
      results.push(lerpCube(start, end, 1 / n * i));
    }
  }
  return results;
};
/**
 *
 * @param {HexagonCube} a
 * @param {HexagonCube} b
 * @returns {boolean}
 */
export const equalCube = (a, b) => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
};
/**
 *
 * @param {HexagonCube}cube
 * @param {number}start
 * @param {number}end
 * @returns {HexagonCube[]}
 */
export const circleCube = (cube, start, end) => {
  if (!end) {
    end = start;
    start = 1;
  }
  const result = [];
  for (let radius = start; radius <= end; radius++) {
    let next = CubeDirection(cube, 'east', radius);
    HexagonDirection.forEach((dir) => {
      for (let i = 0; i < radius; i++) {
        next = CubeDirection(cube, dir, 1);
        result.push(next);
      }
    });
  }
  return result;
};

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
}