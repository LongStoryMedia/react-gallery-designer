/*
react-image-designer
(c) Long Story Media
@license MIT
*/
import React, { PureComponent, createRef } from "react";
import { inView, throttle } from "./utils";

export default class ImageDesigner extends PureComponent {
  state = {
    src: this.props.placeholder || "",
    ref: createRef(),
    mounted: false,
    onScreen: false,
    lazy: typeof this.props.lazy === "undefined" || this.props.lazy,
    styles: this.props.noImage
      ? {}
      : {
          filter: "blur(5px)",
          transition: "filter 0.85s ease-in-out"
        }
  };

  throttleLoad = throttle(() => this.shouldLoad(), 500);

  componentDidUpdate(prevProps, prevState) {
    const { ref, lazy, src, clientHeight } = this.state;
    if (
      (src !== prevProps.src &&
        ref.current &&
        ((lazy && inView(ref.current)) || !lazy)) ||
      (clientHeight !== prevState.clientHeight &&
        ref.current &&
        ((lazy && inView(ref.current)) || !lazy))
    )
      this.shouldLoad();
  }

  componentDidMount() {
    this.image = new Image();
    const { lazy } = this.state;
    this.setState({ mounted: true });
    if (lazy) window.addEventListener("scroll", this.throttleLoad);
    window.addEventListener("load", this.shouldLoad);
    // do this with throttled scroll listener because sometimes an images scrolls on screen between executions
    // in which case the load event wont trigger. so this just checks the current screen every second 
    // to see if there are any unloaded images there.
    this.checkLocation = setInterval(
      () => this.shouldLoad(),
      this.props.scanScreen || 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.checkLocation);
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    if (this.state.lazy)
      window.removeEventListener("scroll", this.throttleLoad);
  }

  shouldLoad = () => {
    const { src, timeout } = this.props;
    const { ref, lazy } = this.state;
    if (!ref.current || (ref.current && !inView(ref.current) && lazy))
      return this.setState({ loading: true });
    if (ref.current.clientHeight <= 0)
      return this.setState({ clientHeight: ref.current.clientHeight });
    if (
      (ref.current && inView(ref.current) && ref.current.clientHeight > 0) ||
      !lazy
    )
      setTimeout(() => this.loadImage(src), timeout);
  };

  onLoad = () => {
    this.setState({
      src: this.props.src,
      styles: { transition: "filter 0.85s ease-in-out", filter: "" },
      loaded: true
    });
    window.removeEventListener("scroll", this.throttleLoad);
  };

  onError = e => this.props.onError && this.props.onError(e);

  loadImage = src => {
    if (this.image.src === this.state.src)
      return clearInterval(this.checkLocation);
    const { srcset, sizes } = this.props;
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    const img = new Image();
    this.image = img;
    img.onload = this.onLoad;
    img.onerror = this.onError;
    img.src = src;
    if (srcset) {
      img.srcset = srcset;
      img.sizes = sizes;
    }
    clearInterval(this.checkLocation);
  };

  render() {
    const {
      style,
      className,
      contain,
      repeat,
      position,
      children,
      alt,
      tag,
      srcset,
      sizes,
      id,
      noImage
    } = this.props;

    const { src, styles, ref, loaded } = this.state;

    const t = tag ? tag : "img";

    const ImgTag = `${t}`;

    const isImg = tag === "img";

    const dynamicStyles = {
      ...styles,
      backgroundColor: (style && style.backgroundColor) || "transparent",
      backgroundImage: noImage || isImg ? "" : `url("${src}")`,
      backgroundPosition: !position ? "center" : position,
      backgroundOrigin: "initial",
      backgroundClip: "initial",
      backgroundAttachment: "initial",
      backgroundSize: !contain ? "cover" : "contain",
      backgroundRepeat: !repeat ? "no-repeat" : "repeat",
      height:
        tag === "img"
          ? (style && style.height) || ""
          : (style && style.height) || "200px",
      ...style
    };

    return (
      <ImgTag
        alt={alt ? alt : src}
        srcSet={loaded ? srcset : ""}
        sizes={loaded ? sizes : ""}
        src={src}
        style={dynamicStyles}
        className={className}
        id={id}
        ref={ref}
      >
        {children}
      </ImgTag>
    );
  }
}
