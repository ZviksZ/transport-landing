import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min';

export class MonedoPage {
   constructor() {
      this.$page = $('.monedo-page');

      if (this.$page.length === 0) return false;

      this.init();
   }

   init = () => {
      this.initHandlers();

      if ($(window).width() <= 1000) {
         this.initMonedoAboutSlider();
      }

      this.initMonedoMediaSlider();

      $(window).on('resize', () => {
         if ($(window).width() <= 1000) {
            this.initMonedoAboutSlider();
         } else if ($(window).width() > 1000 && !this.$monedoAboutSlider.destroyed) {
            this.$monedoAboutSlider.destroy();
         }
      });
   };

   initHandlers = () => {
      this.$page.find('.monedo-header .burger').on('click', function() {
         $('html').toggleClass('show-menu');
      });

      this.$page.find('.monedo-menu nav a').on('click', function() {
         $('html').removeClass('show-menu');
      });
   };

   initMonedoAboutSlider = () => {
      this.$monedoAboutSlider = new Swiper($('#monedo-about__list'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         resistance: false,
         slidesPerView: 1,
         //spaceBetween: 32,
         navigation: {
            nextEl: '.monedo-about .swiper-button-next',
            prevEl: '.monedo-about .swiper-button-prev',

         },
         breakpoints: {
            1000: {
               slidesPerView: 3
            }
         }
      });
   };
   initMonedoMediaSlider = () => {
      this.$monedoMediaSlider = new Swiper($('#monedo-media__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         resistance: false,
         slidesPerView: 1,
         //spaceBetween: 32,
         navigation: {
            nextEl: '.monedo-media .swiper-button-next',
            prevEl: '.monedo-media .swiper-button-prev'
         },
         pagination: {
            el: '.swiper-pagination',
            clickable: true
         }
      });
   };
}
