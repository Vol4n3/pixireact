import {Texture} from "pixi.js";

/**
 *
 * @param {number} size
 * @param {Object[]} colorConfigs
 * @param {string} colorConfigs.color
 * @param {number} colorConfigs.offset
 * @param {boolean} [horizontal]
 * @returns {PIXI.Texture}
 */
export const CreateGradient = (size, colorConfigs, horizontal) => {
  const canvas = document.createElement('canvas');
  const width =  (horizontal) ? size : 1;
  const height =  (horizontal) ? 1 : size;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colorConfigs.forEach((cc) => {
    gradient.addColorStop(cc.offset, cc.color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return Texture.from(canvas);
};
