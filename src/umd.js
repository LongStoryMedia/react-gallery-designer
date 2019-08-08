import React from "react";
import ReactDOM from "react-dom";
import GalleryDesigner from "./";

global.__RGD = ({
  src,
  placeholder,
  style,
  thumbnailStyle,
  imgStyle,
  captionStyle,
  lightboxStyle,
  controlStyle,
  className,
  id,
  imgClass,
  captionClass,
  thumbnailClass,
  controlClass,
  domId,
  ...props
}) => {
  ReactDOM.render(
    <GalleryDesigner
      style={style}
      thumbnailStyle={thumbnailStyle}
      imgStyle={imgStyle}
      captionStyle={captionStyle}
      lightboxStyle={lightboxStyle}
      controlStyle={controlStyle}
      className={className}
      id={id}
      imgClass={imgClass}
      captionClass={captionClass}
      thumbnailClass={thumbnailClass}
      controlClass={controlClass}
      {...props}
    />,
    document.getElementById(domId)
  );
};
