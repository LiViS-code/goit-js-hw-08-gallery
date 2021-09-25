// получить картинки
import * as moduleGallery from "./app.js";

// количество картинок
const imgCount = moduleGallery.galleryItems.length;

// ссылки на элементы HTML
const refs = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  lightboxImage: document.querySelector(".lightbox__image"),
  lightboxOgverlay: document.querySelector(".lightbox__overlay"),
};

// сформировать массив шаблонных строк с разметкой согласно шаблона
const imgMarkup = new Array(imgCount)
  .fill(0)
  .map((_, i) => {
    return `
    <li class="gallery__item">
    <a
      class="gallery__link"
      href=${moduleGallery.galleryItems[i].original}
    >
      <img
        class="gallery__image"
        src=${moduleGallery.galleryItems[i].preview}
        data-source=${moduleGallery.galleryItems[i].original}
        alt=${moduleGallery.galleryItems[i].description}
      />
    </a>
  </li>
  `;
  })
  .join("");

// рендер разметки в DOM
refs.gallery.insertAdjacentHTML("afterbegin", imgMarkup);

// делегируем нажатия на элементах галереи
refs.gallery.addEventListener("click", handlerClick);
refs.gallery.addEventListener("keydown", _.throttle(closeModal, 300));

// обработчик событий
function handlerClick(e) {
  if (e.target.nodeName !== "IMG") return;

  e.preventDefault();

  openModal(e.target);
}

// открыть модалку
function openModal(e) {
  refs.lightbox.classList.add("is-open");

  uploadPictures(e.dataset.source, e.alt);

  addModalListener();
}

// слушать события в модалке
function addModalListener() {
  refs.btnClose.addEventListener("click", closeModal);
  refs.lightboxOgverlay.addEventListener("click", closeModal);
}

// убрать прослушку с модалки
function removeModalListener() {
  refs.btnClose.removeEventListener("click", closeModal);
  refs.lightboxOgverlay.removeEventListener("click", closeModal);
}

// загрузить картинку
function uploadPictures(src, alt) {
  refs.lightboxImage.src = src;
  refs.lightboxImage.alt = alt;
}

// закрыть модалку
function closeModal(e) {
  const triggers = [
    "Escape",
    "ArrowRight",
    "ArrowLeft",
    "lightbox__button",
    "lightbox__overlay",
  ];

  if (!triggers.includes(e.key || e.target.className)) return;

  if (e.key === "ArrowRight" || e.key === "ArrowLeft") return leafOver(e.key);

  refs.lightbox.classList.remove("is-open");

  removeModalListener();

  uploadPictures("", "");
}

// листать картинки стрелками
function leafOver(key) {
  const imgCurrentLink = document.querySelector(".lightbox__image").src;
  const currentIndex = moduleGallery.galleryItems.findIndex(
    (link) => link.original === imgCurrentLink
  );
  let newIndex;

  switch (key) {
    case "ArrowRight":
      newIndex =
        currentIndex < imgCount - 1
          ? (newIndex = currentIndex + 1)
          : (newIndex = 0);
      break;
    case "ArrowLeft":
      newIndex =
        currentIndex > 0
          ? (newIndex = currentIndex - 1)
          : (newIndex = imgCount - 1);
      break;
  }

  uploadPictures(
    moduleGallery.galleryItems[newIndex].original,
    moduleGallery.galleryItems[newIndex].description
  );
}
