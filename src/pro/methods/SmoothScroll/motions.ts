const motionLinear = (t: number): number => {
  return t;
};

// Ease-In

const motionEaseInQuad = (t: number): number => {
  return t * t;
};

const motionEaseInCubic = (t: number): number => {
  return t * t * t;
};

const motionEaseInQuart = (t: number): number => {
  return t * t * t * t;
};

const motionEaseInQuint = (t: number): number => {
  return t * t * t * t * t;
};

// Ease-In-Out

const motionEaseInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

const motionEaseInOutCubic = (t: number): number => {
  t /= 0.5;
  if (t < 1) return (t * t * t) / 2;
  t -= 2;
  return (t * t * t + 2) / 2;
};

const motionEaseInOutQuart = (t: number): number => {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t * t * t;
  t -= 2;
  return -(t * t * t * t - 2) / 2;
};

const motionEaseInOutQuint = (t: number): number => {
  t /= 0.5;
  if (t < 1) return (t * t * t * t * t) / 2;
  t -= 2;
  return (t * t * t * t * t + 2) / 2;
};

// Ease-Out

const motionEaseOutQuad = (t: number): number => {
  return -t * (t - 2);
};

const motionEaseOutCubic = (t: number): number => {
  t--;
  return t * t * t + 1;
};

const motionEaseOutQuart = (t: number): number => {
  t--;
  return -(t * t * t * t - 1);
};

const motionEaseOutQuint = (t: number): number => {
  t--;
  return t * t * t * t * t + 1;
};

export const getEasing = (scrollProgress: number, easing: string): number => {
  switch (easing) {
    case 'motionLinear':
      return motionLinear(scrollProgress);
    case 'motionEaseInQuad':
      return motionEaseInQuad(scrollProgress);
    case 'motionEaseInCubic':
      return motionEaseInCubic(scrollProgress);
    case 'motionEaseInQuart':
      return motionEaseInQuart(scrollProgress);
    case 'motionEaseInQuint':
      return motionEaseInQuint(scrollProgress);
    case 'motionEaseInOutQuad':
      return motionEaseInOutQuad(scrollProgress);
    case 'motionEaseInOutCubic':
      return motionEaseInOutCubic(scrollProgress);
    case 'motionEaseInOutQuart':
      return motionEaseInOutQuart(scrollProgress);
    case 'motionEaseInOutQuint':
      return motionEaseInOutQuint(scrollProgress);
    case 'motionEaseOutQuad':
      return motionEaseOutQuad(scrollProgress);
    case 'motionEaseOutCubic':
      return motionEaseOutCubic(scrollProgress);
    case 'motionEaseOutQuart':
      return motionEaseOutQuart(scrollProgress);
    case 'motionEaseOutQuint':
      return motionEaseOutQuint(scrollProgress);
    default:
      return motionLinear(scrollProgress);
  }
};
