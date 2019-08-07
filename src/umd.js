import "core-js/es6/map";
import "core-js/es6/set";
import "raf-polyfill";

import Gallery from "./";
import React from "react";
import { render } from "react-dom";

export default ({
  settings,
  images,
  domId,
  className,
  imgClass,
  captionClass,
  playicon,
  pauseicon,
  nexticon,
  previcon,
  style,
  imgStyle,
  ...props
}) => render(
  <Gallery
    images={images}
    settings={settings}
    className={className}
    imgClass={imgClass}
    captionClass={captionClass}
    playIcon={playicon}
    pauseIcon={pauseicon}
    nextIcon={nexticon}
    prevIcon={previcon}
    style={style}
    imgStyle={imgStyle}
    {...props}
  />,
  document.getElementById(domId)
);
