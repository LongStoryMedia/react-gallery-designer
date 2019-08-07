const IDS = [66337, 66336, 66330, 66333, 66335];

export const images = IDS.map(id => ({
  src: `https://imagedatabase.apsnet.org/handlers/image.ashx?ID=${id}`,
  link: `https://imagedatabase.apsnet.org/search.aspx?PS=1&ST=${id}&SL=ALL`,
  placeholder: "/imgs/placeholder.png",
  target: true,
  index: id,
  caption: id
}));

export const settings = {
  animation: "slide",
  timingfn: "cubic-bezier(0.95, 0.05, 0.25, 1)",
  inview: 3,
  speed: 2500,
  transitionspeed: 0.75,
  linkslides: true,
  playpause: true,
  arrows: true,
  showcaptions: true,
  contain: true,
  thumbnails: true
};

export const galleryProps = {
  style: {
    height: "30vh"
  },
  imgStyle: {
    width: "90%",
    margin: "0 auto"
  },
  captionStyle: {
    color: "#fff",
    backgroundColor: "rgba(25,25,25,0.25)",
    height: "25px",
    bottom: 0,
    left: 0,
    right: 0,
    width:"75%",
    margin:"0 auto",
    position: "absolute"
  }
}
