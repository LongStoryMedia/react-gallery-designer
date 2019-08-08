const ids = [15, 20, 25, 30, 35, 40, 45, 50 , 55, 145, 150];

export const images = ids.map((id, i) => ({
  src: `/imgs/IMG_${id}-1900.jpg`,
  placeholder: `/imgs/IMG_${id}-100.jpg`,
  srcset: `/imgs/IMG_${id}-1900.jpg 1900w,
          /imgs/IMG_${id}-1200.jpg 1200w,
          /imgs/IMG_${id}-768.jpg 768w,
          /imgs/IMG_${id}-480.jpg 480w,
          /imgs/IMG_${id}-300.jpg 300w`,
  sizes: `(max-width: 320px) 320w,
          (max-width: 480px) 480w,
          (max-width: 768px) 768w,
          (max-width: 1200px) 1200w,
          1900px`,
  link: `https://link-${id}.com`,
  target: true,
  index: i,
  caption: `super cool caption ${i}`,
  style: {borderRight: "red solid 10px"},
  repeat: true,
  position: "bottom right",
  children: "... some more children here ...",
  alt: "SOOPERKEWLIMGOMG",
  timeout: 500
}));

export const settings = {
  lightbox: false,
  inview: 5,
  auto: true,
  noImages: false,
  direction: "right",
  orientation: "horizontal",
  animation: "carousel",
  speed: 3500,
  timingfn: "linear",
  transitionspeed: 0.333333,
  playpause: true,
  pauseonhover: true,
  arrows: true,
  advance: 2,
  startposition: "right",
  showcaptions: true,
  linkslides: true,
  thumbnails: true,
  contain: true,
  playIcon: "PLAY",
  pauseIcon: "PAUSE",
  nextIcon: "NEXT",
  prevIcon: "PREV",
  tag: "figure"
};

export const galleryProps = {
  style: {
    height: "100vh"
  },
  imgStyle: {
    margin: 0
  }
}
