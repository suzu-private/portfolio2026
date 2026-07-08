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
      slidesPerView: 2.5,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: true,
      speed: 5000,
      spaceBetween: 16,
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
      },
    }
  );

  // ----------------------------
  // モーダル
  // ----------------------------
  const targetModalData = gallery.dataset.modal;
  const targetModal = document.querySelector(`.js-modal[data-modal="${targetModalData}"]`);
  if (!targetModal) return;

  const closeButton = targetModal.querySelector('.c-modal__close');
  const overlay = targetModal.querySelector('.c-modal__overlay');
  const main = document.querySelector('main');

  const modalSubSwiper = new Swiper(
    targetModal.querySelector('.js-modal-sub-swiper'),
    {
      slidesPerView: 4,
      spaceBetween: 10,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
    }
  );

  const modalSwiper = new Swiper(
    targetModal.querySelector('.js-modal-swiper'),
    {
      modules: [Navigation, Thumbs],
      slidesPerView: 1,
      navigation: {
        nextEl: targetModal.querySelector('[data-modal-swiper="next-btn"]'),
        prevEl: targetModal.querySelector('[data-modal-swiper="prev-btn"]'),
      },
      thumbs: {
        swiper: modalSubSwiper,
      },
    }
  );

  let triggerButton = null;
  gallery
    .querySelectorAll('.js-activities-swiper .swiper-slide')
    .forEach((slide) => {
      slide.addEventListener('click', () => {
        console.log(targetModal);
        const index = Number(slide.dataset.slideIndex);

        targetModal.classList.add('is-open');
        triggerButton = slide;
        main.inert = true;

        closeButton.focus();
        document.body.style.overflow = 'hidden';

        modalSwiper.update();
        modalSubSwiper.update();

        modalSwiper.slideTo(index, 0);
      });
    });

  const closeModal = () => {
    targetModal.classList.remove('is-open');

    main.inert = false;
    document.body.style.overflow = '';
    triggerButton?.focus();
  };

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Escapeで閉じる
  document.addEventListener('keydown', (e) => {
    if (!targetModal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeModal();
    }
  });
});