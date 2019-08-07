import React from "react";
import Gallery from "../src";
import { render, fireEvent, debug, act } from "@testing-library/react";
import { create, update, unmount } from "react-test-renderer";

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

let gallery,
  createGallery,
  updateGallery,
  instance,
  updatedInstance,
  loaded,
  settings,
  current,
  children,
  renderedChildren;

beforeEach(() => {
  createGallery = settings =>
    create(<Gallery images={images} settings={settings} {...props} />);
  gallery = createGallery(initSettings);
  instance = gallery.root;
  children = (gallery, i) => gallery.toJSON()[i].children;
  renderedChildren = (gallery, i) => children(gallery, i).filter(child => !!child.children);
  current = gallery => gallery.getInstance();
  loaded = gallery =>
    gallery.toJSON().children.filter(child => !!child.children);
});

afterEach(() => {
  gallery.unmount();
});

test("exports a React component", () => {
  expect(typeof Gallery).toBe("function");
});

test("# of images given + controls + thumbnails should equal the children (when inview is less than props.images)", () => {
  expect(gallery.toJSON().children.length).toEqual(
    instance.props.images.length
  );
});

test("duplicates props.images until it exceeds inview + advance * 2", () => {
  const newGallery = createGallery({ inview: ids.length });
  expect(newGallery.toJSON().children.length).toEqual(
    instance.props.images.length * 2
  );
  newGallery.unmount();
});

test("only loads images that are visible when initialized", () => {
  expect(loaded(gallery).length).toEqual(current(gallery).settings.inview);
});

test("loads additional images as it advances", () => {
  const prevLoad = loaded(gallery).length;
  current(gallery).slide();
  expect(loaded(gallery).length).toEqual(
    prevLoad + current(gallery).settings.advance
  );
});

test("loads only thumbnails (and all thumbnails) on mount lightbox", () => {
  const lightbox = createGallery({ lightbox: true });
  expect(renderedChildren(lightbox, 0).length).toEqual(0);
  expect(
    renderedChildren(lightbox, 1).filter(c => c.children).length
  ).toEqual(ids.length);
  lightbox.unmount();
});

test("expands and loads lightbox image on click", () => {
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
