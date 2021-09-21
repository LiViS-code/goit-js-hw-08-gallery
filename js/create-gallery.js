import * as moduleGallery from "./app.js";

const ref = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  lightboxImage: document.querySelector(".lightbox__image"),
  lightboxOverlay: document.querySelector(".lightbox__overlay"),
};

const onClick = (e) => {
  if (e.target.nodeName === "IMG") e.preventDefault();
  ref.lightboxImage.src = e.target.dataset.source;
  ref.lightboxImage.alt = e.target.alt;
};

const openModal = () => {
  ref.lightbox.classList.add("is-open");
  ref.gallery.removeEventListener("click", openModal);
  ref.btnClose.addEventListener("click", closeModal);
  ref.lightboxOverlay.addEventListener("click", closeModal);
};

const closeModal = () => {
  ref.lightbox.classList.remove("is-open");
  ref.btnClose.removeEventListener("click", closeModal);
  ref.lightboxOverlay.removeEventListener("click", closeModal);
  ref.gallery.addEventListener("click", openModal);
  ref.lightboxImage.src = "";
  ref.lightboxImage.alt = "";
};

// сформировать массив шаблонных строк с разметкой согласно шаблона
const imgMarkup = new Array(moduleGallery.galleryItems.length)
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
ref.gallery.addEventListener("click", onClick);
ref.gallery.addEventListener("click", openModal);
