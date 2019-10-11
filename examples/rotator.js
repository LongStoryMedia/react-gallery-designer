const ids = [15, 20, 25, 30, 35, 40, 45];

export const images = ids.map(function(id, i) {
  return {
    src: `../imgs/IMG_${id}-1900.jpg`,
    placeholder: `../imgs/IMG_${id}-100.jpg`,
    srcset: `../imgs/IMG_${id}-1900.jpg 1900w,
            ../imgs/IMG_${id}-1200.jpg 1200w,
            ../imgs/IMG_${id}-768.jpg 768w,
            ../imgs/IMG_${id}-480.jpg 480w,
            ../imgs/IMG_${id}-300.jpg 300w`,
    sizes: `(max-width: 320px) 320w,
            (max-width: 480px) 480w,
            (max-width: 768px) 768w,
            (max-width: 1200px) 1200w,
            1900px`,
    caption: `caption-${i}`,
    link: "./rotator.html",
    target: true,
    index: ids.length - i
  }
});

export const settings = {
  animation: "slide",
  timingfn: "cubic-bezier(0.95, 0.05, 0.25, 1)",
  inview: 1,
  speed: 2500,
  transitionspeed: 0.75,
  linkslides: true,
  playpause: true,
  arrows: false,
  showcaptions: true,
  contain: false,
  thumbnails: false
};

export const galleryProps = {
  style: {
    height: "60vh"
  },
  captionStyle: {
    color: "#fff",
    backgroundColor: "rgba(25,25,25,0.25)",
    height: "50px",
    fontSize: "30px",
    bottom: 0,
    left: 0,
    right: 0,
    width:"75%",
    margin:"0 auto",
    position: "absolute"
  }
}
