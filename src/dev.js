import "core-js/es6/map";
import "core-js/es6/set";
import "raf-polyfill";

import Gallery from "./";
import React from "react";
import { render } from "react-dom";

const rgd = ({ images, settings, galleryProps, ...props }) =>
  render(
    <Gallery
      images={images}
      settings={settings}
      {...galleryProps}
      {...props}
    />,
    document.getElementById("react-gallery")
  );

import(TEST_SCRIPT)
  .then(({ images, settings, galleryProps, ...props }) => {
    return (
      rgd({ images, settings, galleryProps, ...props })
    );
  })
  .catch(e => {
    throw new Error(e);
  });
