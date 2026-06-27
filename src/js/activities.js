import Swiper from 'swiper';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';

// ----------------------------
// スライダー
// ----------------------------
document.querySelectorAll('.js-activities-gallery').forEach((gallery) => {
  const activitySwiper = new Swiper(
    gallery.querySelector('.js-activities-swiper'),
    {
      modules: [Autoplay],

      slidesPerView: 3,

      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },

      loop: true,
      speed: 5000,
      spaceBetween: 16,
    }
  );

  // ----------------------------
  // モーダル
  // ----------------------------
  const modal = gallery.querySelector('.js-modal');
  const closeButton = modal.querySelector('.c-modal__close');
  const overlay = modal.querySelector('.c-modal__overlay');

  const modalSubSwiper = new Swiper(
    gallery.querySelector('.js-modal-sub-swiper'),
    {
      slidesPerView: 4,
      spaceBetween: 10,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
    }
  );

  const modalSwiper = new Swiper(
    gallery.querySelector('.js-modal-swiper'),
    {
      modules: [Navigation, Thumbs],

      slidesPerView: 1,

      navigation: {
        nextEl: modal.querySelector('[data-modal-swiper="next-btn"]'),
        prevEl: modal.querySelector('[data-modal-swiper="prev-btn"]'),
      },

      thumbs: {
        swiper: modalSubSwiper,
      },
    }
  );

  gallery
    .querySelectorAll('.js-activities-swiper .swiper-slide')
    .forEach((slide) => {
      slide.addEventListener('click', () => {
        const index = Number(slide.dataset.slideIndex);

        modal.classList.add('is-open');

        modalSwiper.update();
        modalSubSwiper.update();

        modalSwiper.slideTo(index, 0);
      });
    });

  const closeModal = () => {
    modal.classList.remove('is-open');
  };

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
});