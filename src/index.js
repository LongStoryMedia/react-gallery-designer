/*
react-gallery-designer
(c) Long Story Media
@license MIT
*/

import React, { PureComponent, createRef } from "react";
import ImageDesigner from "react-image-designer";
import _$ from "long-story-library";
import {
  isRight,
  isLeft,
  rightOffset,
  leftOffset,
  vi,
  heightAdj,
  transform,
  prefix,
  tryDecode
} from "./utils";

if (typeof window !== "undefined") {
  require("core-js/es6/map");
  require("core-js/es6/set");
  require("raf-polyfill");
}

export default class Gallery extends PureComponent {
  state = {
    isPaused: true,
    slide: 0,
    images: [],
    arrowOpacity: 0,
    zoomedIn: false,
    touchX: 0,
    ref: createRef()
  };

  settings = {
    inview: _$(this.props).OBJ(["settings", "inview"], 1),
    auto: _$(this.props).OBJ(["settings", "auto"], true),
    noImages: _$(this.props).OBJ(["settings", "noImages"]),
    playpause: _$(this.props).OBJ(["settings", "playpause"]),
    pauseonhover: _$(this.props).OBJ(["settings", "pauseonhover"]),
    direction: _$(this.props).OBJ(["settings", "direction"], "left"),
    orientation: _$(this.props).OBJ(["settings", "orientation"], "horizontal"),
    animation: _$(this.props).OBJ(["settings", "animation"], "slide"),
    speed: _$(this.props).OBJ(["settings", "speed"], 2000),
    timingfn: _$(this.props).OBJ(["settings", "timingfn"], "ease-in-out"),
    transitionspeed: _$(this.props).OBJ(["settings", "transitionspeed"], 0.25),
    arrows: _$(this.props).OBJ(["settings", "arrows"]),
    advance: _$(this.props).OBJ(["settings", "advance"], 1),
    startposition: _$(this.props).OBJ(["settings", "startposition"], "center"),
    showcaptions: _$(this.props).OBJ(["settings", "showcaptions"]),
    linkslides: _$(this.props).OBJ(["settings", "linkslides"]),
    thumbnails: _$(this.props).OBJ(["settings", "thumbnails"]),
    lightbox: _$(this.props).OBJ(["settings", "lightbox"]),
    contain: _$(this.props).OBJ(["settings", "contain"]),
    playIcon: _$(this.props).OBJ(["settings", "playIcon"], "&#9654;"),
    pauseIcon: _$(this.props).OBJ(["settings", "pauseIcon"], "&#9208;"),
    nextIcon: _$(this.props).OBJ(["settings", "nextIcon"], "&#8250;"),
    prevIcon: _$(this.props).OBJ(["settings", "prevIcon"], "&#8249;"),
    imagePercentHigh: _$(this.props).OBJ(
      ["settings", "imagePercentHigh"],
      _$(this.props).OBJ(["settings", "thumbnails"]) ? 80 : 100
    ),
    thumbPercentHigh: _$(this.props).OBJ(
      ["settings", "thumbPercentHigh"],
      _$(this.props).OBJ(["settings", "thumbnails"]) ? 15 : 0
    ),
    lbSmallPercentHigh: _$(this.props).OBJ(
      ["settings", "lbSmallPercentHigh"],
      30
    ),
    tag: _$(this.props).OBJ(["settings", "tag"], "div")
  };

  componentDidMount() {
    const { auto, lightbox } = this.settings;
    const { images } = this.props;
    const _images = images.sort((a, b) => a.index - b.index);
    this.setState({ images: this.setSlides(_images) });
    this.playPauseCtrl();
    return auto && !lightbox && this.play();
  }

  componentWillUnmount() {
    clearInterval(this.newSlide);
  }

  componentDidUpdate(prevProps, prevState) {
    const { zoomedIn, slide, images } = this.state;
    const { lightbox } = this.settings;
    if (lightbox && !zoomedIn && prevState.zoomedIn && slide >= 0) {
      this.setState({
        images: images.map(img => ({
          ...img,
          isLoaded: false
        }))
      });
    }
  }

  setThumbId = idx => {
    const { images } = this.props;
    let i = this.state.images.length / images.length,
      id = [];
    while (i > 0) {
      id.push(idx + i * images.length - images.length);
      i--;
    }
    return "thumbNailImg_" + id.join(",");
  };

  playPauseCtrl = () => {
    const { isPaused } = this.state;
    const { pauseonhover, pauseIcon, playIcon } = this.settings;
    let playPauseIcon, playPauseOnClick, playPauseOnHover;
    if (!isPaused) {
      playPauseIcon = pauseIcon;
      playPauseOnClick = this.pause;
    } else {
      playPauseIcon = playIcon;
      playPauseOnClick = this.play;
    }
    if (pauseonhover) {
      playPauseOnHover = playPauseOnClick;
    }
    return { playPauseIcon, playPauseOnClick, playPauseOnHover };
  };

  setSlides = images => {
    const {
      inview,
      advance,
      animation,
      startposition,
      lightbox
    } = this.settings;
    const adv =
      "flip" === animation || "fade" === animation
        ? 1
        : "book" === animation
        ? 2
        : Number(advance);
    const onDeck = Number(adv);
    const visibleImgs = vi(animation, inview);
    const extra = ((visibleImgs % 2) + 1) % 2;
    const leftIdx = Math.floor(visibleImgs / 2) - extra;
    const rightIdx = images.length - Math.floor(visibleImgs / 2);
    const needClones = !!(images.length < visibleImgs + onDeck * 2);
    const imgs = images.map((img, i) => ({
      ...img,
      isLoaded: false,
      index: i,
      thumbId: this.setThumbId(i)
    }));
    if (!needClones) {
      if ("left" === startposition) {
        this.setState({ slide: leftIdx });
        return this.mapSlides(imgs, leftIdx);
      }
      if ("right" === startposition) {
        this.setState({ slide: rightIdx });
        return this.mapSlides(imgs, rightIdx);
      }
      return lightbox ? this.mapSlides(imgs, -1) : this.mapSlides(imgs, 0);
    }
    return this.setSlides(
      imgs.concat(imgs.map((img, i) => ({ ...img, isLoaded: false, index: i })))
    );
  };

  mapSlides = (images, setImg, prevImgs) => {
    const { ref } = this.state;
    const {
      inview,
      animation,
      orientation,
      style,
      lightbox,
      imagePercentHigh
    } = this.settings;
    const visibleImgs = vi(animation, inview);
    const extra = ((visibleImgs % 2) + 1) % 2;
    const midInview = Math.floor(visibleImgs / 2) - extra;
    const sideLength = Math.floor(images.length / 2);
    return images.map((img, i) => {
      const ro = rightOffset(images, img.index, setImg, sideLength);
      const lo = leftOffset(images, img.index, setImg, sideLength);
      const isRMid = isRight(midInview, images, img.index, setImg);
      const isLMid = isLeft(midInview, images, img.index, setImg);
      const isR = isRight(sideLength, images, img.index, setImg);
      const isL = isLeft(sideLength, images, img.index, setImg);
      const positionAdjust =
        "book" === animation && lo === 1
          ? 200
          : "book" === animation && lo === 2
          ? 200
          : "book" === animation && ro === 2
          ? 200
          : "book" === animation && ro === 3
          ? 200
          : "flip" === animation ||
            ("carousel" === animation && ro === midInview + 1 + extra) ||
            ("carousel" === animation && lo === midInview + 1)
          ? 100
          : 0;
      const translateR = 100 * (midInview + ro) - positionAdjust;
      const translateL = 100 * (midInview - lo) - positionAdjust;
      const _ref = _$(ref).OBJ(["current"]);
      const _height = _$(imagePercentHigh).vh(_ref);
      const translateD = heightAdj(
        style,
        _height,
        (h, u) => `${(h / inview) * (midInview + ro)}${u}`
      );
      const translateU = heightAdj(
        style,
        _height,
        (h, u) => `${(h / inview) * (midInview - lo)}${u}`
      );
      if (lightbox) {
        if (img.index === setImg) return { ...img, isLoaded: true };
        return img;
      }
      if (img.index === setImg) {
        return {
          ...img,
          transform: transform({
            translate:
              "flip" === animation
                ? "0, 0"
                : "horizontal" === orientation
                ? `${100 * midInview}%, 0`
                : `0, ${translateU}`,
            scale: "1",
            rotateY: "0"
          }),
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin: "book" === animation ? "right" : "center",
          visibility: "visible",
          opacity: 1,
          isLoaded: true,
          zIndex: "book" === animation ? 5 : "carousel" === animation ? 10 : ""
        };
      }
      if (isR) {
        const view =
          isRMid ||
          ro === midInview + extra ||
          i === setImg + extra ||
          (i === 0 && setImg === images.length - 1 && extra > 0);
        return {
          ...img,
          transform: transform({
            translate:
              "flip" === animation
                ? "0, 0"
                : "horizontal" === orientation
                ? `${translateR}%, 0`
                : `0, ${translateD}`,
            scale:
              "carousel" === animation
                ? `${(1 / (midInview * 2)) * (midInview * 2 - ro + extra)}`
                : "1",
            rotateY:
              "flip" === animation || (ro === 2 && "book" === animation)
                ? `180deg`
                : "carousel" === animation
                ? `${(90 / (midInview + 1)) * (ro - extra)}deg`
                : "0"
          }),
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin:
            "carousel" === animation
              ? `${(1 / (midInview * 2)) * (midInview - ro + extra) * 100}%`
              : "book" === animation
              ? ro === 1
                ? "left"
                : "right"
              : "center",
          visibility:
            view || ("book" === animation && ro <= 2) ? "visible" : "hidden",
          opacity: view || ("book" === animation && ro <= 3) ? 1 : 0,
          isLoaded: view || _$(prevImgs).OBJ([img.index, "isLoaded"], false),
          zIndex:
            ("carousel" === animation || "book" === animation) && ro === 1
              ? 7
              : ("carousel" === animation || "book" === animation) && ro === 2
              ? 6
              : "carousel" === animation && ro >= midInview + extra
              ? -1
              : ""
        };
      }
      if (isL) {
        return {
          ...img,
          transform: transform({
            translate:
              "flip" === animation
                ? "0, 0"
                : "horizontal" === orientation
                ? `${translateL}%, 0`
                : `0, ${translateU}`,
            scale:
              "carousel" === animation
                ? `${(1 / (midInview * 2)) * (midInview * 2 - lo)}`
                : "1",
            rotateY:
              "flip" === animation || (lo === 1 && "book" === animation)
                ? `180deg`
                : "carousel" === animation
                ? `${(90 / (midInview + 1)) * lo}deg`
                : "0"
          }),
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin:
            "book" === animation
              ? "left"
              : "carousel" === animation
              ? `${(1 / (midInview * 2)) * (midInview - lo) * 100}%`
              : "center",
          visibility:
            isLMid || ("book" === animation && lo <= 1) ? "visible" : "hidden",
          opacity: isLMid || ("book" === animation && lo <= 3) ? 1 : 0,
          isLoaded: isLMid || _$(prevImgs).OBJ([img.index, "isLoaded"], false),
          zIndex:
            ("carousel" === animation || "book" === animation) && lo === 1
              ? 8
              : "carousel" === animation && lo >= midInview
              ? -1
              : ""
        };
      }
      return {
        ...img,
        transform: transform({
          translate:
            "carousel" === animation ? "0, 0" : `${100 * sideLength}%, 0`,
          scale: "carousel" === animation ? ".5" : "1",
          rotateY: "0"
        }),
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transformOrigin: "book" === animation ? "left" : "center",
        opacity: 0,
        visibility: "hidden",
        zIndex: ""
      };
    });
  };

  slide = dir => {
    const { slide, images, isPaused } = this.state;
    const { advance, animation } = this.settings;
    const adv =
      "flip" === animation || "fade" === animation
        ? 1
        : "book" === animation
        ? 2
        : parseInt(advance, 10);
    this.setState(prevState => {
      if (prevState.slide === slide) {
        const nextImg =
          isPaused || "carousel" === animation
            ? (slide === images.length - 1 && "book" !== animation) ||
              ("book" === animation && slide === images.length - 2)
              ? 0
              : "book" === animation && slide === images.length - 1
              ? 1
              : "book" === animation
              ? slide + 2
              : slide + 1
            : slide + adv >= images.length
            ? 0 + (slide + adv - images.length)
            : slide + adv;
        const prevImg =
          isPaused || "carousel" === animation
            ? (slide === 0 && "book" !== animation) ||
              ("book" === animation && slide === 1)
              ? images.length - 1
              : "book" === animation && slide === 0
              ? images.length - 2
              : "book" === animation
              ? slide - 2
              : slide - 1
            : slide - adv < 0
            ? images.length + (0 + (slide - adv))
            : slide - adv;
        const setImg =
          "next" === dir ? nextImg : "prev" === dir ? prevImg : nextImg;
        return {
          slide: setImg,
          images: this.mapSlides(images, setImg, prevState.images)
        };
      }
    });
  };

  play = () => {
    const { direction, speed } = this.settings;
    const dir = direction === "left" || direction === "up" ? "next" : "prev";
    this.setState({ isPaused: false });
    this.newSlide = setInterval(() => this.slide(dir), speed);
  };

  pause = () => {
    this.setState({ isPaused: true });
    clearInterval(this.newSlide);
  };

  playPause = e => {
    e.preventDefault();
    const { id } = e.target;
    return id === "play"
      ? this.play()
      : id === "pause"
      ? this.pause()
      : this.play();
  };

  arrow = e => {
    e.preventDefault();
    const { pauseonhover } = this.settings;
    const { isPaused } = this.state;
    clearInterval(this.newSlide);
    this.slide(e.currentTarget.id);
    return (
      !isPaused && !pauseonhover && (isPaused ? this.play() : this.pause())
    );
  };

  arrowToggle = () =>
    this.setState(() => ({
      arrowOpacity: this.state.arrowOpacity === 1 ? 0 : 1
    }));

  touchStart = e => {
    const X = e.touches[0].clientX;
    this.setState({ touchX: X });
  };

  touchEnd = e => {
    const { touchX } = this.state;
    const X = e.changedTouches[0].clientX;
    const dir = X < touchX ? "next" : "prev";
    clearInterval(this.newSlide);
    return this.slide(dir);
  };

  zoom = () => this.setState({ zoomedIn: this.state.zoomedIn ? false : true });

  onThumbnailClick = e => {
    const { slide, images } = this.state;
    const { id } = e.target;
    const ids = id.split("thumbNailImg_").pop();
    const slideOpts = ids.split(",");
    const idxs = slideOpts.map(i => Number(i));
    const smOffset = i =>
      leftOffset(images, i, slide) < rightOffset(images, i, slide)
        ? leftOffset(images, i, slide)
        : rightOffset(images, i, slide);
    const setSlide = idxs.reduce((a, b) => {
      const _a = smOffset(a);
      const _b = smOffset(b);
      return _a < _b ? a : b;
    });
    this.setState(prevState => ({
      slide: setSlide,
      images: this.mapSlides(images, setSlide, prevState.images),
      zoomedIn: this.settings.lightbox && true
    }));
  };

  render() {
    const { images, isPaused, arrowOpacity, zoomedIn, slide, ref } = this.state;

    const {
      animation,
      transitionspeed,
      timingfn,
      showcaptions,
      linkslides,
      inview,
      arrows,
      contain,
      playpause,
      nextIcon,
      prevIcon,
      thumbnails,
      lightbox,
      tag,
      noImages,
      orientation,
      thumbPercentHigh,
      imagePercentHigh,
      lbSmallPercentHigh
    } = this.settings;

    const {
      style,
      thumbnailStyle,
      imgStyle,
      captionStyle,
      lightboxStyle,
      controlStyle,
      className,
      imgClass,
      captionClass,
      thumbnailClass,
      controlClass,
      id
    } = this.props;

    const {
      playPauseOnHover,
      playPauseIcon,
      playPauseOnClick
    } = this.playPauseCtrl();

    const visibleImgs =
      "flip" === animation || "fade" === animation
        ? 1
        : "book" === animation
        ? 2
        : "carousel" === animation && parseInt(inview, 10) < 3
        ? 3
        : parseInt(inview, 10);

    const animationStyle = img =>
      "fade" !== animation
        ? {
            ...prefix("transform", img.transform),
            visibility: img.visibility,
            zIndex: img.zIndex,
            ...prefix("transformOrigin", img.transformOrigin),
            ...prefix("backfaceVisibility", img.backfaceVisibility)
          }
        : {
            opacity: img.opacity,
            zIndex: img.zIndex
          };

    const transition =
      "fade" === animation
        ? `opacity ${transitionspeed}s ${timingfn}, visibility ${transitionspeed}s ${timingfn}`
        : `transform ${transitionspeed}s ${timingfn}, visibility ${transitionspeed}s ${timingfn}, transform-origin ${transitionspeed}s ${timingfn}`;

    const tHeight = lightbox
      ? _$(lbSmallPercentHigh).vh()
      : _$(thumbPercentHigh).vh(_$(ref).OBJ(["current"]));

    const thumbnailHeight = _$(thumbnailStyle).OBJ(["height"], `${tHeight}px`);

    const defaultHeight = `calc(${_$(50).vh()}px - ${thumbnailHeight})`;

    const sliderHeight = `calc(${_$(style).OBJ(
      ["height"],
      defaultHeight
    )} - ${parseInt(thumbnailHeight, 10) * 1.1}px)`;

    const imgHeightHorizontal = `${_$(imagePercentHigh).vh(
      _$(ref).OBJ(["current"])
    )}px`;

    const imgHeightVertical = `calc(${sliderHeight} / ${visibleImgs})`;

    const slideHeight =
      orientation === "vertical" ? imgHeightVertical : imgHeightHorizontal;

    const BoxTag = linkslides && !lightbox ? "a" : "span";

    const arrowStyle = {
      fontSize: "1.25em",
      top: "45%",
      position: "absolute",
      opacity: lightbox ? 1 : arrowOpacity,
      ...prefix("transition", "opacity ease-in-out 0.25s"),
      backgroundColor: "rgba(150, 150, 150, 0.5)",
      width: "auto",
      height: "1.35em",
      textAlign: "center",
      cursor: "pointer",
      zIndex: lightbox ? 21 : 11
    };

    const zoomedInStyle = () =>
      zoomedIn
        ? {
            position: "fixed",
            height: "100vh",
            width: "100vw",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            zIndex: 20,
            backgroundColor: "#000",
            ...lightboxStyle
          }
        : {};

    const imgProps = (img, i) => ({
      src: img.src,
      noImage: noImages,
      srcset: img.srcset,
      sizes: img.sizes,
      placeholder: _$(img).OBJ(["placeholder"], img.src),
      id: `img-${i}`,
      style: {
        backgroundColor:
          "book" === animation || noImages
            ? _$(imgStyle).OBJ(["backgroundColor"], "#fff")
            : _$(imgStyle).OBJ(["backgroundColor"]),
        margin: lightbox ? "5vh auto" : "",
        ...imgStyle,
        ...img.style,
        visibility: img.visibility,
        opacity: "fade" !== animation ? 1 : img.opacity,
        ...prefix("transition", transition),
        height: slideHeight,
        maxHeight: lightbox ? "90vh" : "",
        maxWidth: lightbox ? "90vw" : ""
      },
      className: imgClass,
      contain: contain,
      tag: tag,
      lazy: true
    });
    return (
      <>
        <div
          className={className}
          onMouseEnter={
            !lightbox ? (playPauseOnHover, this.arrowToggle) : () => null
          }
          onMouseLeave={
            !lightbox ? (playPauseOnHover, this.arrowToggle) : () => null
          }
          onTouchStart={this.touchStart}
          onTouchEnd={this.touchEnd}
          style={{
            ...prefix("transition", transition),
            display: "flex",
            overflow: lightbox ? "auto" : "hidden",
            position: _$(style).OBJ(["position"], "relative"),
            width: _$(style).OBJ(["width"], "100%"),
            ...style,
            height: !lightbox ? sliderHeight : "",
            ...zoomedInStyle()
          }}
          id={id}
          ref={ref}
        >
          {images &&
            images.map((img, i) => (
              <BoxTag
                key={`${img.id}-${i}`}
                id={["slideBox", i].join("-")}
                onClick={lightbox ? this.zoom : () => null}
                className={
                  img.visibility !== "hidden"
                    ? "react-gallery-slide active"
                    : "react-gallery-slide"
                }
                style={{
                  ...animationStyle(img),
                  width:
                    orientation === "horizontal" && !lightbox
                      ? `${100 / visibleImgs}%`
                      : "100%",
                  ...prefix("transition", transition),
                  ...prefix("transformStyle", img.transformStyle),
                  position: "absolute",
                  display: lightbox && !zoomedIn ? "none" : "block",
                  zIndex: lightbox && zoomedIn && img.index === slide ? 20 : "",
                  textAlign: "center",
                  cursor: lightbox
                    ? zoomedIn
                      ? "zoom-out"
                      : "zoom-in"
                    : linkslides
                    ? "pointer"
                    : "auto"
                }}
                href={
                  linkslides
                    ? /^https?:\/\//.test(tryDecode(img.link)) ||
                      /^\//.test(tryDecode(img.link))
                      ? tryDecode(img.link)
                      : `http://${tryDecode(img.link)}`
                    : ""
                }
                target={img.target ? "_blank" : ""}
                rel={img.target ? "noopener noreferrer" : ""}
              >
                {img.children}
                {img.isLoaded &&
                  (tag !== "img" ? (
                    <ImageDesigner {...imgProps(img, i)}>
                      {showcaptions && (
                        <div
                          className={captionClass}
                          dangerouslySetInnerHTML={{
                            __html: tryDecode(img.caption)
                          }}
                          style={{
                            visibility: img.visibility,
                            opacity: "fade" !== animation ? 1 : img.opacity,
                            ...prefix("transition", transition),
                            ...captionStyle
                          }}
                        />
                      )}
                    </ImageDesigner>
                  ) : (
                    <ImageDesigner {...imgProps(img, i)} />
                  ))}
              </BoxTag>
            ))}
          {((arrows && !lightbox) || (lightbox && zoomedIn)) && (
            <>
              <span
                onClick={this.arrow}
                id="prev"
                className={controlClass}
                dangerouslySetInnerHTML={{ __html: prevIcon }}
                style={{
                  left: "0",
                  ...arrowStyle,
                  ...controlStyle
                }}
              />
              <span
                onClick={this.arrow}
                id="next"
                className={controlClass}
                dangerouslySetInnerHTML={{ __html: nextIcon }}
                style={{
                  right: "0",
                  ...arrowStyle,
                  ...controlStyle
                }}
              />
            </>
          )}
          {playpause && !lightbox && (
            <span
              onClick={playPauseOnClick}
              id={isPaused ? "play" : "pause"}
              className={controlClass}
              dangerouslySetInnerHTML={{ __html: playPauseIcon }}
              style={{
                top: "0",
                left: "0",
                position: "absolute",
                opacity: arrowOpacity,
                ...prefix("transition", "opacity ease-in-out 0.25s"),
                backgroundColor: "rgba(150, 150, 150, 0.5)",
                cursor: "pointer",
                zIndex: 11,
                ...controlStyle
              }}
            />
          )}
        </div>
        {(thumbnails || lightbox) && (
          <div
            className={thumbnailClass}
            style={{
              ...thumbnailStyle,
              display: zoomedIn ? "none" : "flex",
              flexFlow: `row ${lightbox ? "wrap" : ""}`,
              position: "relative",
              bottom: 0,
              margin: "0 auto",
              width: "100%",
              justifyContent: "space-around"
            }}
          >
            {images &&
              this.props.images.map(
                (img, i) =>
                  i >= 0 && (
                    <div
                      onClick={this.onThumbnailClick}
                      id={this.setThumbId(i)}
                      key={["thumb", i].join("-")}
                      style={{
                        width: lightbox ? "" : "100%",
                        margin: lightbox ? "25px" : "",
                        maxWidth: lightbox
                          ? ""
                          : `${100 / this.props.images.length}%`,
                        cursor: "pointer",
                        zIndex: 11,
                        position: "relative",
                        height: thumbnailHeight,
                        textAlign: "center"
                      }}
                    >
                      <ImageDesigner
                        src={img.src}
                        placeholder={
                          img.placeholder ? img.placeholder : img.src
                        }
                        srcset={img.srcset}
                        id={img.thumbId}
                        style={{
                          height: thumbnailHeight,
                          margin: "auto",
                          maxWidth: "90%",
                          ...thumbnailStyle
                        }}
                        tag="img"
                      />
                    </div>
                  )
              )}
          </div>
        )}
      </>
    );
  }
}
