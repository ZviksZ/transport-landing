import * as $ from 'jquery';

export class Parallax {
   constructor() {
      this.$items = $('.parallax');

      if (this.$items.length === 0 || $(window).width() < 1000) return false;

      this.lastScrollTop = 0;

      this.init();
   }

   init = () => {
      this.parallaxInit();
      $(window)
         .on('resize', () => {
            this.parallaxInit();
         })
         .on('scroll', () => {
            this.parallax();
         });
   };

   parallaxInit = () => {
      this.lastScrollTop = $(window).scrollTop() * 1;

      this.$items.each(function () {
         let plusOffset = +$(this).attr('data-plus-offset') || $(window).height();

         const top = $(this).offset().top + plusOffset;
         $(this).attr({
            'data-top': top,
         });
      });

      this.parallax();
   };

   parallax = () => {
      const scrollTop = $(window).scrollTop() * 1;
      const windowHeight = $(window).height();
      const screenTop = scrollTop + windowHeight;

      this.$items.each(function () {
         const top = +$(this).attr('data-top'),
            direction = $(this).attr('data-direction'),
            maxTranslate = +$(this).attr('data-max-translate'),
            isNegativeMove = maxTranslate < 0;

         if (screenTop > top && screenTop < top + windowHeight + 200) {
            let p = screenTop - top;
            let x = 0;
            let y = 0;

            if (direction === 'vertical') {
               y = isNegativeMove ? -p * 0.1 : p * 0.1;

               if (isNegativeMove && y < maxTranslate || !isNegativeMove && y > maxTranslate) {
                 y = maxTranslate
               }
            } else {
               x = isNegativeMove ? -p * 0.1 : p * 0.1;

               if (isNegativeMove && x < maxTranslate || !isNegativeMove && x > maxTranslate) {
                  x = maxTranslate
               }
            }

            $(this)
               .attr({
                  'data-offset_x': x,
                  'data-offset_y': y,
               })
               .css({
                  transform: 'translate(' + x + 'px,' + y + 'px)',
               });
         }
      });
   };
}
