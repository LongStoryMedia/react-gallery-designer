import React from "react";
import Gallery from "../src";
import ImageDesigner from "../src/ImageDesigner"
import { render, fireEvent } from "@testing-library/react";
import { create } from "react-test-renderer";

const ids = [15, 20, 25, 30, 35, 40, 90, 135];

const images = ids.map(id => ({
  src: `/imgs/IMG_${id}-1900.jpg`,
  placeholder: `/imgs/IMG_${id}-100.jpg`,
  srcset: `/imgs/IMG_${id}-1900.jpg 1900w, /imgs/IMG_${id}-1200.jpg 1200w, /imgs/IMG_${id}-768.jpg 768w, /imgs/IMG_${id}-480.jpg 480w, /imgs/IMG_${id}-300.jpg 300w`,
  sizes:
    "(max-width: 320px) 320w, (max-width: 480px) 480w, (max-width: 768px) 768w, (max-width: 1200px) 1200w, 1900px"
}));

const initSettings = {
  inview: 1
};

const props = {
  className: "container"
};

global.Image = Image;

const imageProps = {
  style: {
    width: "100%"
  },
  className: "image",
  id: "Image",
  contain: false,
  repeat: false,
  position: "top left",
  alt: "alt",
  noImage: false
};

let gallery,
  createGallery,
  instance,
  loaded,
  current,
  children,
  renderedChildren,
  imgDesigner,
  updatedInstance,
  imgDesignerB,
  updatedInstanceB,
  imgDesignerD,
  updatedInstanceD,
  imageInstance,
  imageInstanceB;

beforeEach(() => {
  // GALLERY
  createGallery = settings => create(<Gallery images={images} settings={settings} {...props} />);
  gallery = createGallery(initSettings);
  instance = gallery.root;
  children = (gallery, i) => gallery.toJSON()[i].children;
  renderedChildren = (gallery, i) => children(gallery, i).filter(child => !!child.children);
  current = gallery => gallery.getInstance();
  loaded = gallery => gallery.toJSON().children.filter(child => !!child.children);

});

beforeAll(() => {
  // IMAGE
  imgDesigner = create(<ImageDesigner {...images[0]} {...imageProps} />);
  imgDesignerB = create(<ImageDesigner tag="div" {...images[0]} {...imageProps} />);
  imgDesignerD = create(<ImageDesigner timeout={2000} {...images[0]} {...imageProps} />);
  imageInstance = imgDesigner.root;
  imageInstanceB = imgDesignerB.root;
  updatedInstance = imgDesigner.getInstance()
  updatedInstanceB = imgDesignerB.getInstance();
  updatedInstanceD = imgDesignerD.getInstance();
})

afterEach(() => {
  gallery.unmount();
});

test("[Gallery] exports React component as default and dependent Image as named", () => {
  expect(typeof Gallery).toBe("function");
  expect(typeof Image).toBe("function");
});

test("[Gallery] # of images given + controls + thumbnails should equal the children (when inview is less than props.images)", () => {
  expect(gallery.toJSON().children.length).toEqual(
    instance.props.images.length
  );
});

test("[Gallery] duplicates props.images until it exceeds inview + advance * 2", () => {
  const newGallery = createGallery({ inview: ids.length });
  expect(newGallery.toJSON().children.length).toEqual(
    instance.props.images.length * 2
  );
  newGallery.unmount();
});

test("[Gallery] only loads images that are visible when initialized", () => {
  expect(loaded(gallery).length).toEqual(current(gallery).settings.inview);
});

test("[Gallery] loads additional images as it advances", () => {
  const prevLoad = loaded(gallery).length;
  current(gallery).slide();
  expect(loaded(gallery).length).toEqual(
    prevLoad + current(gallery).settings.advance
  );
});

test("[Gallery] loads only thumbnails (and all thumbnails) on mount lightbox", () => {
  const lightbox = createGallery({ lightbox: true });
  expect(renderedChildren(lightbox, 0).length).toEqual(0);
  expect(renderedChildren(lightbox, 1).filter(c => c.children).length).toEqual(
    ids.length
  );
  lightbox.unmount();
});

test("[Gallery] expands and loads lightbox image on click", () => {
  const lightbox = render(
    <Gallery images={images} settings={{ lightbox: true }} {...props} />
  );
  const thumb = lightbox.container.childNodes[1].querySelector("div");
  const img = lightbox.container.firstChild.querySelector("span");
  expect(img.firstChild).toBeNull();
  fireEvent.click(thumb, {
    target: thumb
  });
  expect(img.firstChild).toBeTruthy();
  lightbox.unmount();
});

test("[Image] defaults to img, else sets Image as background-image", () => {
  expect(imgDesigner.toJSON().type).toBe("img");
  expect(imgDesignerB.toJSON().props.style.backgroundImage).toBeTruthy();
});

test("[Image] creates an instance of Image when mounted", () => {
  expect(updatedInstance.image.toString()).toMatch("[object HTMLImageElement]");
});

test("[Image] sets the onload property on the Image instance", () => {
  updatedInstance.loadImage()
  expect(updatedInstance.image.onload.toString()).toEqual(
    updatedInstance.onLoad.toString()
  );
});

test("[Image] sets the onerror property on the Image instance", () => {
  expect(updatedInstance.image.onerror.toString()).toEqual(
    updatedInstance.onError.toString()
  );
});

test("[Image] loads placeholder image on first render", () => {
  expect(updatedInstance.state.src).toEqual(imageInstance.props.placeholder);
});

test("[Image] updates src, or background-image (when type is not img), to full size image on load", () => {
  updatedInstance.onLoad();
  expect(updatedInstance.state.src).toEqual(imageInstance.props.src);
  updatedInstanceB.onLoad();
  expect(updatedInstanceB.state.src).toEqual(imageInstanceB.props.src);
});

test("[Image] does not immediately set image if timeout exists", () => {
  updatedInstanceD.shouldLoad();
  expect(updatedInstanceD.state.src).toEqual(imageInstance.props.placeholder);
});

test("[Image] sets image after timeout if timeout exists", () => {
  setTimeout(() => {
    expect(updatedInstanceD.state.src).toEqual(imageInstance.props.src);
  }, updatedInstanceD.props.timeout + 1);
});
