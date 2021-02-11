import * as $ from 'jquery';
import {lockyOn} from 'dom-locky';

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
         this.lock()
      } else {
         this.$html.addClass('header-menu-open');
         this.lock = lockyOn('#header');
      }
   };
}
