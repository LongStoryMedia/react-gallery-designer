import _$ from "long-story-library";

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
  const _string = _$(style).OBJ(["height"], def);
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
