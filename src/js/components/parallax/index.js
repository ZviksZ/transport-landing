import * as $ from 'jquery';

export class Parallax {
   constructor() {
      this.windowWidth = $(window).width();
      this.windowHeight = $(window).height();
      this.lastScrollTop = 0;

      this.init();
   }

   init = () => {
      this.parallaxInit();
      $(window)
         .on('resize', () => {
            //запускаем параллакс
            this.parallaxInit();
         })
         .on('scroll', () => {
            //запускаем параллакс
            this.parallax();
         });
   };

   parallaxInit = () => {
      //задаём всем элементам верхний отступ согласно их экрану
      let scrollTop = $(window).scrollTop() * 1;
      this.lastScrollTop = scrollTop;

      if ($('#parallax_leaf-1').length) {
         let $elemNew = $('#parallax_leaf-1');
         let top = $elemNew.offset().top + 100;
         $elemNew.attr({
            'data-top': top
         });
      }
      if ($('#parallax_leaf-2').length) {
         let $elemNew = $('#parallax_leaf-2');
         let top = $elemNew.offset().top + 100;
         $elemNew.attr({
            'data-top': top
         });
      }
      if ($('#parallax_leaf-3').length) {
         let $elemNew = $('#parallax_leaf-3');
         let top = $elemNew.offset().top + 100;
         $elemNew.attr({
            'data-top': top
         });
      }

      this.parallax();
   };

   parallax = () => {
      let scrollTop = $(window).scrollTop() * 1;
      let screenTop = scrollTop + this.windowHeight;

      if ($('#parallax_leaf-1').length) {
         let $elem = $('#parallax_leaf-1');
         let top = $elem.attr('data-top') * 1;

         if (screenTop > top && screenTop < top + this.windowHeight - 200) {
            let p = screenTop - top;
            let x = 0;
            let y = -p * 0.6;
            let scale = 1;
            let angle = -p * 0.1;

            $elem
               .attr({
                  'data-offset_x': x,
                  'data-offset_y': y,
                  'data-rotate': angle,
               })
               .css({
                  transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + angle + 'deg) scale(' + scale + ', ' + scale + ')'
               });
         }
      }

      if ($('#parallax_leaf-2').length) {
         let $elem = $('#parallax_leaf-2');
         let top = $elem.attr('data-top') * 1;

         if (screenTop > top && screenTop < top + this.windowHeight - 200) {
            let p = screenTop - top;
            let x = 0;
            let y = -p * 0.6;
            let scale = 1;
            let angle = -p * 0.1;

            $elem
               .attr({
                  'data-offset_x': x,
                  'data-offset_y': y,
                  'data-rotate': angle,
               })
               .css({
                  transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + angle + 'deg) scale(' + scale + ', ' + scale + ')'
               });
         }
      }

      if ($('#parallax_leaf-3').length) {
         let $elem = $('#parallax_leaf-3');
         let top = $elem.attr('data-top') * 1;
         //console.log(top);
         if (screenTop > top && screenTop < top + this.windowHeight - 200) {
            let p = screenTop - top;
            let x = 0;
            let y = -p * 0.6;
            let scale = 1;
            let angle = -p * 0.1;

            $elem
               .attr({
                  'data-offset_x': x,
                  'data-offset_y': y,
                  'data-rotate': angle,
               })
               .css({
                  transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + angle + 'deg) scale(' + scale + ', ' + scale + ')'
               });
         }
      }
   };
}
