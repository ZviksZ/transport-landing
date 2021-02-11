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

      $(window).on('resize', () => {
         this.$slider.destroy();

         this.initReviewsSlider();
      })
   };

   initReviewsSlider = () => {
      this.$slider = new Swiper($('#reviews__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         slidesPerView: 1,
         navigation: {
            nextEl: '.reviews__slider-wrap .swiper-button-next',
            prevEl: '.reviews__slider-wrap .swiper-button-prev',
         },
         pagination: {
            el: '.reviews__slider-wrap .swiper-pagination',
            clickable: true,
         },
         autoHeight: true,
         spaceBetween: 32,
         breakpoints: {
            768: {
               slidesPerView: 2,
               autoHeight: false,
            },
            1000: {
               slidesPerView: 2,
               autoHeight: false,
            },
            1350: {
               slidesPerView: 3,
               autoHeight: false,
            }
         }
      });
   };
}
