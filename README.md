React Gallery Designer
=========================
[![Build Status](https://travis-ci.org/LongStoryMedia/react-gallery-designer.svg?branch=master)](https://travis-ci.org/LongStoryMedia/react-gallery-designer)

[![Known Vulnerabilities](https://snyk.io//test/github/LongStoryMedia/react-gallery-designer/badge.svg?targetFile=package.json)](https://snyk.io//test/github/LongStoryMedia/react-gallery-designer?targetFile=package.json)

## Installation

#### yarn
```sh
$ yarn add react-gallery-designer
```

#### npm
```sh
$ npm install react-gallery-designer
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-gallery-designer/umd/react-gallery-designer.min.js"></script>
```

If you use the UMD build you can find the library on `window.__RGD`.

### Demos

##### [lightbox](https://longstorymedia.github.io/react-gallery-designer/examples/lightbox.html)
##### [rotator](https://longstorymedia.github.io/react-gallery-designer/examples/rotator.html)
##### [rss](https://longstorymedia.github.io/react-gallery-designer/examples/rss.html)
##### [carousel](https://longstorymedia.github.io/react-gallery-designer/examples/carousel.html)

## Props

### images (required)
<u>type</u>: array\
<u>description</u>: Array of objects representing the props for each image. This library uses [react-image-designer](https://github.com/LongStoryMedia/react-image-designer) for each image (and thumbnail) in the gallery. In addition to the [props](https://github.com/LongStoryMedia/react-image-designer#props) from `react-image-designer`, you may also define the following:
#### - link
<u>default</u>: ""\
<u>type</u>: string\
<u>description</u>: Url to link image.
#### - target
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: add `target="_blank" rel="noopener noreferrer"` to the `a` tag.
#### - index
<u>default</u>: 0\
<u>type</u>: number\
<u>description</u>: Index of image in array. Array will be sorted to user defined order if index is provided.
#### - caption
<u>default</u>: ""\
<u>type</u>: string\
<u>description</u>: Caption for image.

additionally the following [props](https://github.com/LongStoryMedia/react-image-designer#props) are not modifiable on the image object because they are either taken care of at the global level, or are handled by `react-gallery-designer` internally (and changing that would break it):
- id
- className
- contain
- tag

### settings
##### - lightbox
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Displays all images in a `row wrap` flex-box, and expands an image to full screen on click with "next", and "prev" controls. Returns to previous view state on click when expanded.

##### - inview
<u>default</u>: 1\
<u>type</u>: number\
<u>description</u>: Number of images visible on screen at one time.

##### - auto
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: If slide should start rotating right away.

##### - noImages
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Useful for a rotating rss feed or similar application.

##### - direction
<u>default</u>: "left"\
<u>type</u>: string\
<u>description</u>: Direction in which the gallery should rotate. Options include "left", "right", "up", "down".

##### - orientation
<u>default</u>: "horizontal"\
<u>type</u>: string\
<u>description</u>: Orient gallery vertically or horizontally.

##### - animation
<u>default</u>: "slide"\
<u>type</u>: string\
<u>description</u>: Type of animation for gallery. Options include "slide", "carousel", "book", "flip", "fade".

##### - speed
<u>default</u>: 2000\
<u>type</u>: number\
<u>description</u>: How much time (in milliseconds) each image will remain in place.

##### - timingfn
<u>default</u>: "ease-in-out"\
<u>type</u>: string\
<u>description</u>: css timing function for transitions.

##### - transitionspeed
<u>default</u>: 0.25\
<u>type</u>: number\
<u>description</u>: How fast the transitions are.

##### - playpause
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Puts a play/pause button in the top left (while mouse is over gallery container).

##### - pauseonhover
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: If the gallery should pause while hovering.

##### - arrows
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Puts arrow on the left and right of the gallery container (while mouse is over gallery container).

##### - advance
<u>default</u>: 1\
<u>type</u>: number\
<u>description</u>: How many images the gallery should advance every interval.

##### - startposition
<u>default</u>: "center"\
<u>type</u>: string\
<u>description</u>: Position of the first image in the gallery relative to other images in view. Options include "left", "right", "center".

##### - showcaptions
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: If `caption` prop is supplied for each image, display caption over image.

##### - linkslides
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: If `link` prop is supplied for each image, make image a clickable link.

##### - thumbnails
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Displays thumbnails under gallery container. Brings corresponding image into view on click.

##### - contain
<u>default</u>: false\
<u>type</u>: boolean\
<u>description</u>: Sets `background-size` of image to `contain`.

##### - playIcon
<u>default</u>: "&#9654;"\
<u>type</u>: string\
<u>description</u>: HTML to use for play button.

##### - pauseIcon
<u>default</u>: "&#9208;"\
<u>type</u>: string\
<u>description</u>: HTML to use for pause button.

##### - nextIcon
<u>default</u>: "&#8250;"\
<u>type</u>: string\
<u>description</u>: HTML to use for next button.

##### - prevIcon
<u>default</u>: "&#8249;"\
<u>type</u>: string\
<u>description</u>: HTML to use for prev button.

##### - tag
<u>default</u>: "div"\
<u>type</u>: string\
<u>description</u>: Tag to use for images. Will use `src` if `img` is used. Else images will render as `background-image`.

##### - imagePercentHigh
<u>default</u>: thumbnails ? 80 : 100\
<u>type</u>: number\
<u>description</u>: Percent of the height of the gallery container to use as the height of each image.

##### - thumbPercentHigh
<u>default</u>: thumbnails ? 15 : 0\
<u>type</u>: number\
<u>description</u>: Percent of the height of the gallery container to use as the height of each thumbnail.

##### - lbSmallPercentHigh
<u>default</u>: 30\
<u>type</u>: number\
<u>description</u>: Percent of the height of the gallery container to use as the height of each small lightbox image.

### style
<u>description</u>: Style for to the gallery container.

### thumbnailStyle
<u>description</u>: Style for to the thumbnails.

### imgStyle
<u>description</u>: Style for to the images.

### captionStyle
<u>description</u>: Style for to the captions.

### lightboxStyle
<u>description</u>: Style for to full screen images when in lightbox mode.

### controlStyle
<u>description</u>: Style for to the play/pause and next/prev buttons.

### className
<u>description</u>: Class for the gallery container.

### id
<u>description</u>: Id for the gallery container.

### imgClass
<u>description</u>: Class for gallery images.

### captionClass
<u>description</u>: Class for image captions.

### thumbnailClass
<u>description</u>: Class for thumbnail images.

### controlClass
<u>description</u>: Class for the play/pause and next/prev buttons.

## examples

#### commonjs
```js
import Gallery from "react-gallery-designer";

const ids = [15, 20, 25, 30, 35, 40, 45, 50 , 55, 145, 150];

const images = ids.map((id, i) => ({
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

const settings = {
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

const SuperCoolGallery = props => (
  <Gallery
    {...props}
    settings={settings}
    images={images}
  />
)
```

#### umd
<sub>see ./examples/umdLightbox.html</sub>
```html
<div id="react-gallery"></div>
<script>
  var ids = [
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    125,
    130,
    135,
    140,
    145,
    150,
    155,
    160,
    165,
    170,
    175,
    180,
    190,
    195,
    200
  ];

  var imgs = ids.map(function(id, i) {
    return {
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
                1900px`
      }
    });

  var settings = {
    lightbox: true
  };

  return __RGD({
    images: imgs,
    settings: settings,
    style: {
      width: "600px",
      maxWidth: "95%",
      margin: "0 auto"
    },
    domId: "react-gallery"
  })

</script>
```

### Try Things Live
To test the options, git clone this repo, put some images in the 'imgs' directory, or grab them from whatever remote resource, and set-up your configuration. Then run ``yarn start ./relative/path/from/src/to/configuration`` or ``npm run start ./relative/path/from/src/to/configuration``.

There are examples provided. To run them locally, execute ``yarn start ../examples/gallery-example`` or ``npm run start ../examples/gallery-example``.

##### image credits
Thanks to [APS](https://www.apsnet.org/Pages/default.aspx) for the images provided in the `gallery-example.js` example.

Thanks to my lovely wife Norah @ [Fox & Folk](https://knitfoxandfolk.com/) for the images provided for all the rest.

### Contributing
clone, install, tinker, submit pr. Thanks!
