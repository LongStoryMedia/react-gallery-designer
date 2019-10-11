const IDS = [66337, 66336, 66330, 66333, 66335];

export const images = IDS.map(id => ({
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
}));

export const settings = {
  animation: "fade",
  transitionspeed: 1,
  speed: 3000
};

export const galleryProps = {
  style: {
    height: "50vh"
  },
  imgStyle: {
    width: "100%",
    margin: "0 auto"
  },
  captionStyle: {
    color: "#fff",
    backgroundColor: "rgba(25,25,25,0.25)",
    height: "75px",
    fontSize: "30px",
    bottom: 0,
    left: 0,
    right: 0,
    width:"75%",
    margin:"0 auto",
    position: "absolute"
  }
}
