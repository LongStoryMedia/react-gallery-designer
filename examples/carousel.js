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
  style: {borderRight: "red solid 10px", borderLeft: "blue solid 10px"},
  repeat: true,
  position: "bottom right",
  alt: "SOOPERKEWLIMGOMG",
  timeout: 500
}));

export const settings = {
  auto: true,
  noImages: false,
  animation: "carousel",
  inview: 5,
  speed: 3500,
  timingfn: "linear",
  transitionspeed: 0.333333,
  contain: true,
  arrows: true,
  playpause: true,
  playIcon: "PLAY",
  pauseIcon: "PAUSE",
  nextIcon: "NEXT",
  prevIcon: "PREV",
};

export const galleryProps = {
  style: {
    height: "100vh",
    backgroundImage: "linear-gradient(blue, red)"
  },
  imgStyle: {
    margin: 0
  }
}
