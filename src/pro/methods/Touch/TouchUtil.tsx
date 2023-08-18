// class TouchUtil {
const getCoordinates = (e: any) => {
  const [touch] = e.touches;

  return {
    x: touch.clientX,
    y: touch.clientY,
  };
};

const getDirection = ({ x, y }: { x: number; y: number }) => {
  return {
    x: {
      direction: x < 0 ? 'left' : 'right',
      value: Math.abs(x),
    },
    y: {
      direction: y < 0 ? 'up' : 'down',
      value: Math.abs(y),
    },
  };
};

const getOrigin = ({ x, y }: { x: any; y: any }, { x: x2, y: y2 }: { x: any; y: any }) => {
  return {
    x: x - x2,
    y: y - y2,
  };
};

// _getDistanceBetweenTwoPoints(x1, x2, y1, y2) {
//   return Math.hypot(x2 - x1, y2 - y1);
// }

const getMidPoint = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) => {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
};

const getVectorLength = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

const getRightMostTouch = (touches: any) => {
  let rightMost = null;
  const distance = Number.MIN_VALUE;

  for (const touch of touches) {
    if (touch.clientX > distance) {
      rightMost = touch;
    }
  }

  return rightMost;
};

const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
  const value = Math.atan2(y2 - y1, x2 - x1);
  const result = value * (180 / Math.PI);
  return Math.round(result + 360) % 360;
};

const getAngularDistance = (start: number, end: number) => {
  return end - start;
};

const getCenterXY = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) => {
  return {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2,
  };
};

const getPinchTouchOrigin = (touches: any) => {
  const [t1, t2] = touches;

  const _position = {
    x1: t1.clientX,
    x2: t2.clientX,
    y1: t1.clientY,
    y2: t2.clientY,
  };

  return [getVectorLength(_position), getCenterXY(_position)];
};

const isNumber = (startTouch: any, touch: any) => {
  return typeof startTouch === 'number' && typeof touch === 'number' && !isNaN(startTouch) && !isNaN(touch);
};

// _getPosition({ x1, x2, y1, y2 }) {
//   return { x1, x2, y1, y2 };
// }

//   export default TouchUtil;
export {
  getCoordinates,
  getDirection,
  getOrigin,
  getPinchTouchOrigin,
  isNumber,
  getAngle,
  getAngularDistance,
  getMidPoint,
  getRightMostTouch,
};
