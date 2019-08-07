import _$ from "long-story-library";
import Gallery from "../src/";
import React from "react";
import { render } from "react-dom";

_$("https://rss.app/feeds/wVz8jpG6ZOlhgOxg.xml").getXML(rss =>
  _$(rss).parseXML(doc => {
    const images = Array.from(_$().tags("item", doc), (item, i) => ({
      caption: _$().qs("title", item).childNodes[0].nodeValue,
      link: _$().qs("link", item).childNodes[0].nodeValue,
      target: true
    }));
    const settings = {
      inview: 3,
      auto: true,
      playpause: false,
      pauseonhover: false,
      animation: "slide",
      orientation: "vertical",
      speed: 5000,
      transitionspeed: 1,
      arrows: false,
      advance: 1,
      showcaptions: true,
      linkslides: true,
      thumbnails: false,
      contain: false,
      noImages: true,
      slidePercentHigh: 100
    };
    const galleryProps = {
      captionStyle: {
        color: "#595956",
        fontWeight: "bold",
        padding: "20px"
      },
      imgStyle: {
        textDecoration: "none",
        backgroundImage: "linear-gradient(transparent, #d5d5d5)"
      },
      style: {
        width: "300px",
        height: "400px",
        margin: "10vh auto",
        border: "#000 solid 2px"
      }
    };
    render(
      <Gallery images={images} settings={settings} {...galleryProps} />,
      document.getElementById("react-gallery")
    );
  })
);
