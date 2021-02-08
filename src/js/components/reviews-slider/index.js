import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min';

export class ReviewsSlider {
   constructor() {
      this.$slider = $('#reviews__slider');

      if (this.$slider.length === 0) return false;

      this.init();
   }

   init = () => {
      this.initReviewsSlider();
   };

   initReviewsSlider = () => {
      new Swiper($('#reviews__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         slidesPerView: 3,
         spaceBetween: 32,
         navigation: {
            nextEl: '.reviews__slider-wrap .swiper-button-next',
            prevEl: '.reviews__slider-wrap .swiper-button-prev',
         },
         pagination: {
            el: '.reviews__slider-wrap .swiper-pagination',
            clickable: true,
         },
      });
   };
}
