const isHidden = element => element && element.offsetParent === null;

const pos = element => {
  if (element && element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect();
    return {
      top: typeof window !== "undefined" ? rect.top + window.pageYOffset : 0,
      left: typeof window !== "undefined" ? rect.left + window.pageXOffset : 0,
      bottom: typeof window !== "undefined" ? rect.bottom + window.pageYOffset : 0,
      right: typeof window !== "undefined" ? rect.right + window.pageXOffset : 0
    };
  }
  return false;
};

export const throttle = function(func, interval) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = false;
    };
    if (!timeout) {
      func.apply(context, args);
      timeout = true;
      setTimeout(later, interval);
    }
  };
};

export const inView = element => {
  if (isHidden(element) || !element) return false;

  let top = typeof window !== "undefined" ? window.pageYOffset : 0;
  let left = typeof window !== "undefined" ? window.pageXOffset : 0;
  let bottom = typeof window !== "undefined" ? top + window.innerHeight : 0;
  let right = typeof window !== "undefined" ? left + window.innerWidth : 0;

  const elementPosition = pos(element) || { top: 0, left: 0 };

  return (
    ((elementPosition.bottom >= top && elementPosition.bottom <= bottom) ||
      (elementPosition.top <= bottom && elementPosition.top >= top) ||
      (elementPosition.top <= top && elementPosition.bottom >= bottom)) &&
    (left <= elementPosition.left || right >= elementPosition.left)
  );
}

export const isObject = (nestedObj, pathArr, def) => {
  let reducer = pathArr.reduce((obj, key) => {
    return obj && "undefined" !== typeof obj[key] ? obj[key] : void 0;
  }, nestedObj);
  return typeof reducer !== "undefined" ? reducer : def;
};

export const iterateUp = (len, arr, currentIdx) =>
  currentIdx + len >= arr.length
    ? { wrap: currentIdx + len - arr.length, diff: currentIdx + len }
    : { wrap: currentIdx + len, diff: currentIdx + len };

export const iterateDown = (len, arr, currentIdx) =>
  currentIdx - len < 0
    ? { wrap: arr.length + (currentIdx - len), diff: currentIdx - len }
    : { wrap: currentIdx - len, diff: currentIdx - len };

export const isRight = (len, arr, idx, currentIdx) =>
  (idx > currentIdx && idx <= iterateUp(len, arr, currentIdx).diff) ||
  (idx < currentIdx &&
    iterateUp(len, arr, currentIdx).wrap < currentIdx &&
    idx <= iterateUp(len, arr, currentIdx).wrap);

export const isLeft = (len, arr, idx, currentIdx) =>
  (idx < currentIdx && idx >= iterateDown(len, arr, currentIdx).diff) ||
  (idx > currentIdx &&
    iterateDown(len, arr, currentIdx).wrap > currentIdx &&
    idx >= iterateDown(len, arr, currentIdx).wrap);

export const rightOffset = (arr, idx, currentIdx, len) => {
  len = len || arr.length;
  return idx >= currentIdx || idx - currentIdx >= 0
    ? idx - currentIdx
    : arr.length - currentIdx + idx;
};

export const leftOffset = (arr, idx, currentIdx, len) => {
  len = len || arr.length;
  return idx < currentIdx || currentIdx - idx >= 0
    ? currentIdx - idx
    : arr.length - idx + currentIdx;
};

export const vi = (animation, inview) =>
  "flip" === animation || "fade" === animation
    ? 1
    : "book" === animation
    ? 2
    : "carousel" === animation && parseInt(inview, 10) < 3
    ? 3
    : parseInt(inview, 10);

export const heightAdj = (style, def, cb) => {
  const _string = isObject(style, ["height"], def);
  const _height = parseInt(_string, 10);
  const unit = typeof _string === "string" ? _string.match(/\D.+?$/)[0] : "px";
  return cb ? cb(_height, unit) : `${_height}${unit}`;
};

export const transform = fns =>
  Object.keys(fns)
    .map(fn => `${fn}(${fns[fn]})`)
    .join(" ");

export const prefix = (prop, val) => {
  const camelProp = `${prop.slice(0, 1).toUpperCase()}${prop.slice(1)}`;
  return {
    [prop]: val,
    [`ms${camelProp}`]: val,
    [`Webkit${camelProp}`]: val
  };
};

export const tryDecode = string => {
  try {
    return decodeURIComponent(string);
  } catch (e) {
    return string;
  }
};

export const vh = (arg, ref) => ((((ref && ref.clientHeight) || typeof window !== "undefined" ? window.innerHeight : 1200) / 100) * arg);
