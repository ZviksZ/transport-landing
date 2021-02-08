import * as $ from 'jquery';

export class HeaderMenu {
   constructor() {
      this.$html = $('html');
      this.$burgerBtn = $('#header .header__burger');

      this.init();
   }

   init = () => {
      this.$burgerBtn.on('click', this.toggleMenu);
   };

   toggleMenu = () => {
      if (this.$html.hasClass('header-menu-open')) {
         this.$html.removeClass('header-menu-open');
      } else {
         this.$html.addClass('header-menu-open');
      }
   };
}
