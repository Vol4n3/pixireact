export const MinDistanceRangeLoop = (start, end, min, max) => {
  const distanceA = end - start;
  let distanceB;
  if (distanceA > 0) {
    distanceB = min - max + distanceA;
  } else {
    distanceB = max - min + distanceA;
  }
  return Math.abs(distanceA) < Math.abs(distanceB) ? distanceA : distanceB;
};

export const LinearHue = (ratio, start, desired) => {
  return Math.round(start + MinDistanceRangeLoop(start, desired, 0, 360) * ratio);
};

