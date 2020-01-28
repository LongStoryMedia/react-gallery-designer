/*
react-gallery-designer
(c) Long Story Media
@license MIT
*/

import React, { PureComponent, createRef } from "react";
import ImageDesigner from "./ImageDesigner";
import {
  isRight,
  isLeft,
  rightOffset,
  leftOffset,
  vi,
  heightAdj,
  transform,
  prefix,
  tryDecode,
  isObject,
  vh
} from "./utils";

if (typeof window !== "undefined") {
  require("core-js/es6/map");
  require("core-js/es6/set");
  require("raf-polyfill");
}

export {ImageDesigner}

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
    inview: isObject(this.props, ["settings", "inview"], 1),
    auto: isObject(this.props, ["settings", "auto"], true),
    noImages: isObject(this.props, ["settings", "noImages"]),
    playpause: isObject(this.props, ["settings", "playpause"]),
    pauseonhover: isObject(this.props, ["settings", "pauseonhover"]),
    direction: isObject(this.props, ["settings", "direction"], "left"),
    orientation: isObject(
      this.props,
      ["settings", "orientation"],
      "horizontal"
    ),
    animation: isObject(this.props, ["settings", "animation"], "slide"),
    speed: isObject(this.props, ["settings", "speed"], 2000),
    timingfn: isObject(this.props, ["settings", "timingfn"], "ease-in-out"),
    transitionspeed: isObject(
      this.props,
      ["settings", "transitionspeed"],
      0.25
    ),
    arrows: isObject(this.props, ["settings", "arrows"]),
    advance: isObject(this.props, ["settings", "advance"], 1),
    startposition: isObject(
      this.props,
      ["settings", "startposition"],
      "center"
    ),
    showcaptions: isObject(this.props, ["settings", "showcaptions"]),
    linkslides: isObject(this.props, ["settings", "linkslides"]),
    thumbnails: isObject(this.props, ["settings", "thumbnails"]),
    lightbox: isObject(this.props, ["settings", "lightbox"]),
    contain: isObject(this.props, ["settings", "contain"]),
    playIcon: isObject(this.props, ["settings", "playIcon"], "&#9654;"),
    pauseIcon: isObject(this.props, ["settings", "pauseIcon"], "&#9208;"),
    nextIcon: isObject(this.props, ["settings", "nextIcon"], "&#8250;"),
    prevIcon: isObject(this.props, ["settings", "prevIcon"], "&#8249;"),
    imagePercentHigh: isObject(
      this.props,
      ["settings", "imagePercentHigh"],
      isObject(this.props, ["settings", "thumbnails"]) ? 80 : 100
    ),
    thumbPercentHigh: isObject(
      this.props,
      ["settings", "thumbPercentHigh"],
      isObject(this.props, ["settings", "thumbnails"]) ? 15 : 0
    ),
    lbSmallPercentHigh: isObject(
      this.props,
      ["settings", "lbSmallPercentHigh"],
      30
    ),
    tag: isObject(this.props, ["settings", "tag"], "div")
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
    const needClones =
      images.length < visibleImgs + onDeck * 2 && images.length > 0;
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
      //Honestly - I don't even remember the math here... suffice it to say it works
      //TODO: figure out a more elegant way to calculate all these variables.
      const positionAdjust =
        "book" === animation && (lo === 1 || lo === 2)
          ? 200
          : "book" === animation && (ro === 2 || ro === 3)
          ? 200
          : "flip" === animation
          ? 100
          : 0;
      const translateR = 100 * (midInview + ro) - positionAdjust;
      const translateL = 100 * (midInview - lo) + positionAdjust;
      const _ref = isObject(ref, ["current"]);
      const _height = vh(imagePercentHigh, _ref);
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
            "book" === animation
              ? ro === 1
                ? "left"
                : "right"
              : "carousel" === animation
              ? `${-(Math.log10(ro - extra) * 100)}%`
              : "center",
          visibility:
            view || ("book" === animation && ro <= 2) ? "visible" : "hidden",
          opacity: view || ("book" === animation && ro <= 3) ? 1 : 0,
          isLoaded: view || isObject(prevImgs, [img.index, "isLoaded"], false),
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
              ? `${100 + Math.log10(lo) * 100}%`
              : "center",
          visibility:
            isLMid || ("book" === animation && lo <= 1) ? "visible" : "hidden",
          opacity: isLMid || ("book" === animation && lo <= 3) ? 1 : 0,
          isLoaded:
            isLMid || isObject(prevImgs, [img.index, "isLoaded"], false),
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
    const { id } = e.currentTarget;
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
      ? vh(lbSmallPercentHigh)
      : vh(thumbPercentHigh, isObject(ref, ["current"]));

    const thumbnailHeight = isObject(
      thumbnailStyle,
      ["height"],
      `${tHeight}px`
    );

    const defaultHeight = `calc(${vh(50)}px - ${thumbnailHeight})`;

    const sliderHeight = `calc(${isObject(
      style,
      ["height"],
      defaultHeight
    )} - ${parseInt(thumbnailHeight, 10) * 1.1}px)`;

    const imgHeightHorizontal = `${vh(
      imagePercentHigh,
      isObject(ref, ["current"])
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
      placeholder: isObject(img, ["placeholder"], img.src),
      id: `img-${i}`,
      style: {
        backgroundColor:
          "book" === animation || noImages
            ? isObject(imgStyle, ["backgroundColor"], "#fff")
            : isObject(imgStyle, ["backgroundColor"]),
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
            position: isObject(style, ["position"], "relative"),
            width: isObject(style, ["width"], "100%"),
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
              display: "flex",
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
