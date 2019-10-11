import _$ from "long-story-library";
import Gallery from "../src/";
import React from "react";
import { render } from "react-dom";

(function(_$) {
  _$.getXML(
    "https://rss.app/feeds/wVz8jpG6ZOlhgOxg.xml",
    function(rss) {
      _$.parseXML(rss, function(doc) {
        const images = Array.from(_$.tags("item", doc), function(item, i) {
          return {
            caption: _$.qs("title", item).childNodes[0].nodeValue,
            link: _$.qs("link", item).childNodes[0].nodeValue,
            target: true
          };
        });
        const settings = {
          inview: 2,
          auto: true,
          direction: "left",
          animation: "slide",
          orientation: "vertical",
          speed: 5000,
          transitionspeed: 1,
          advance: 1,
          showcaptions: true,
          linkslides: true,
          noImages: true
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
        if (images.length > 4) {
        render(
          <Gallery images={images} settings={settings} {...galleryProps} />,
          document.getElementById("react-gallery")
        );
        }
      });
    }
  );
})(new _$());
