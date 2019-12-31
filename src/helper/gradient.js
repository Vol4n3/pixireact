import {Texture} from "pixi.js";

/**
 *
 * @param {number} size
 * @param {string[]} colors
 * @param {boolean} [horizontal]
 * @returns {PIXI.Texture}
 */
export const CreateGradient = (size, colors,horizontal) => {
  const canvas = document.createElement('canvas');
  const width =  (horizontal) ? size : 1;
  const height =  (horizontal) ? 1 : size;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / colors.length, color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return Texture.from(canvas);
};
