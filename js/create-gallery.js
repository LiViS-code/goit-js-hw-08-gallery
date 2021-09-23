// получить картинки
import * as moduleGallery from "./app.js";

// количество картинок
const imgCount = moduleGallery.galleryItems.length;

// ссылки на элементы HTML
const ref = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  lightboxImage: document.querySelector(".lightbox__image"),
  lightboxOverlay: document.querySelector(".lightbox__overlay"),
};

// обработчик событий
function handlerClick(e) {
  if (e.target.nodeName !== "IMG") return;
  e.preventDefault();
  openModal(e.target);
}

// открыть модалку
function openModal(img) {
  ref.lightbox.classList.add("is-open");
  uploadPictures(img.dataset.source, img.alt);
  ref.btnClose.addEventListener("click", closeModal);
  ref.lightboxOverlay.addEventListener("click", closeModal);
  window.addEventListener("keyup", _.throttle(closeModal.bind(img), 300));
}

// загрузить картинку
function uploadPictures(src, alt) {
  ref.lightboxImage.src = src;
  ref.lightboxImage.alt = alt;
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

  ref.lightbox.classList.remove("is-open");
  ref.btnClose.removeEventListener("click", closeModal);
  ref.lightboxOverlay.removeEventListener("click", closeModal);
  uploadPictures("", "");
}

// листать картинки стрелками
function leafOver(key) {
  const imgCurrentLink = document.querySelector(".lightbox__image").src;
  const currentIndex = moduleGallery.galleryItems.findIndex(
    (link) => link.original === imgCurrentLink
  );
  let nextIndex;

  switch (key) {
    case "ArrowRight":
      nextIndex =
        currentIndex < imgCount - 1
          ? (nextIndex = currentIndex + 1)
          : (nextIndex = 0);
      break;
    case "ArrowLeft":
      nextIndex =
        currentIndex > 0
          ? (nextIndex = currentIndex - 1)
          : (nextIndex = imgCount - 1);
      break;
  }

  return uploadPictures(
    moduleGallery.galleryItems[nextIndex].original,
    moduleGallery.galleryItems[nextIndex].description
  );
}

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
ref.gallery.insertAdjacentHTML("afterbegin", imgMarkup);

// делегируем нажатия на элементах галереи
ref.gallery.addEventListener("click", handlerClick);
