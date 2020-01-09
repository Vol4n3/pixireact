export const Linear = (ratio, start, desired) => {
  return start + (desired - start) * ratio;
  //return desired * ratio + start;

};
// t = current
// b start
// c desired - start
// d duration
export const EaseInCubic = (ratio, start, desired) => {
  return (desired - start) * ratio * ratio * ratio + start;
};

export const EaseOutCubic = (ratio, start, desired) => {
  const t = ratio - 1;
  return (desired - start) * (t  * t * t + 1) + start;
};

export const EaseInOutCubic = (ratio, start, desired) => {
  const t = ratio * 2;
  const c = (desired - start) / 2;
  if( t < 1){
    return  c * t  * t * t  + start;
  }
  const u = t - 2;
  return c * (u  * u * u + 2) + start;
};
