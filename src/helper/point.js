export const RotatePointAround = (point, origin, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: cos * dx + sin * dy + origin.x,
    y: cos * dy - sin * dx + origin.y
  };
};
export const yForEllipse = (a, b, x, sign) => {
  return  b * Math.sqrt(1 - x * x / a * a) * sign;
};
export const Ellipse = (a, b, origin, angle) => {
  return {
    x: origin.x - (a * Math.cos(angle)),
    y: origin.y + (b * Math.sin(angle))
  }
};
