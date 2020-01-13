import {Container} from "pixi.js";
import {Hexagon} from './hexagon';
import {AxialToCube, CubeDirection, equalCube, lineCube, OppositeDirection} from './hexagonCube';

/**
 * @typedef HexagonsMapReachable
 * @type {object}
 * @property {Hexagon} hexagon
 * @property {string} [cameFromDirection]
 * @property {number} [value]
 */

/**
 * @param {HexagonsMapReachable[]} map
 * @param {HexagonCube} hexagonCube
 * @returns {HexagonsMapReachable}
 */
const FindReachable = (map, hexagonCube) => {
  return map.find(hexagonReachable => equalCube(hexagonCube, hexagonReachable.hexagon.cube))
};
/**
 *
 */
const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export class HexagonGrid {
  /**
   *
   * @type {Hexagon[]}
   */
  hexagons = [];

  constructor(game,container) {
    this.container = new Container();
    this.container.sortableChildren = true;
    const base = new Hexagon(0, 0, game.groundHeight/20, AxialToCube(0, 0));
    this.hexagons.push(base);
    const maxRow = 5;
    const maxCols = 20;
    for (let row = 0; row < maxRow; row++) {
      const cols = (row % 2 === 0) ? maxCols : maxCols + 1;
      for (let col = 0; col < cols; col++) {
        if (row === 0 && col === 0) {
          continue;
        }
        const next = base.createNextHexagon(AxialToCube(col, row));
        this.hexagons.push(next);
      }
    }
    this.container.addChild(...this.hexagons.map(h => h.sprite));
    container.addChild(this.container);
  }

  rayTracing(startHexagon, endHexagon) {
    const line = lineCube(startHexagon.cube, endHexagon.cube);
    return line.map(cube => this.hexagons.find(hexagon => equalCube(hexagon.cube, cube)));
  }

  /**
   *
   * @param {Hexagon} startHexagon
   * @param {Hexagon} endHexagon
   * @param {number} movement
   * @param {boolean} [randomize]
   * @return {Hexagon[]}
   */
  findPath(startHexagon, endHexagon, movement, randomize) {
    const reachable = this.reachable(startHexagon, movement * 3, randomize);
    let destination = FindReachable(reachable.hexagonsMapReachable, endHexagon.cube);
    const path = [];
    if (!destination.cameFromDirection || !destination.hexagon.canMoveInto || destination.hexagon.obstacle) {
      return path;
    }
    path.push(destination.hexagon);
    let iteration = reachable.fringes.length;
    while (iteration) {
      iteration--;
      const previousCube = CubeDirection(destination.hexagon.cube, OppositeDirection(destination.cameFromDirection), 1);
      const find = FindReachable(reachable.fringes[iteration], previousCube);
      if (find) {
        destination = find;
        path.push(find.hexagon);
      }
    }
    return path.reverse().slice(1, movement + 1);
  }

  /**
   * @param {Hexagon}startHexagon
   * @param {number}movement
   * @param {boolean} [randomize]
   */
  reachable(startHexagon, movement, randomize) {
    const hexagonsMapReachable = this.hexagons.map(hexagon => ({
      hexagon
    }));
    const first = FindReachable(hexagonsMapReachable, startHexagon.cube);
    /** @type {HexagonCube[]} */
    const visited = [startHexagon.cube];
    /** @type {HexagonsMapReachable[][]} */
    const fringes = [[first]];
    let hexagonDirections = [
      'southWest',
      'west',
      'northWest',
      'northEast',
      'east',
      'southEast',
    ];
    if (randomize) {
      hexagonDirections = shuffle(hexagonDirections)
    }
    for (let i = 1; i < movement; i++) {
      fringes.push([]);
      fringes[i - 1].forEach(hexagonReachable => {
        hexagonDirections.forEach(direction => {
          const neighborCube = CubeDirection(hexagonReachable.hexagon.cube, direction, 1);
          const neighbor = FindReachable(hexagonsMapReachable, neighborCube);
          if (!neighbor ||
            !neighbor.hexagon.canMoveInto ||
            neighbor.hexagon.obstacle ||
            neighbor.hexagon.attachedEntity ||
            visited.some(v => equalCube(v, neighborCube))) {
            return;
          }
          neighbor.cameFromDirection = direction;
          neighbor.value = i;
          fringes[i].push(neighbor);
          visited.push(neighborCube);
        })
      })
    }
    return {fringes, hexagonsMapReachable};
  }
}
