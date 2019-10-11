const ids = [
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

export const images = ids.map(id => ({
  src: `/imgs/IMG_${id}-1900.jpg`,
  placeholder: `/imgs/IMG_${id}-100.jpg`,
  srcset: `/imgs/IMG_${id}-1900.jpg 1900w, /imgs/IMG_${id}-1200.jpg 1200w, /imgs/IMG_${id}-768.jpg 768w, /imgs/IMG_${id}-480.jpg 480w, /imgs/IMG_${id}-300.jpg 300w`,
  sizes:
    "(max-width: 320px) 320w, (max-width: 480px) 480w, (max-width: 768px) 768w, (max-width: 1200px) 1200w, 1900px"
}));

export const settings = { lightbox: true };
