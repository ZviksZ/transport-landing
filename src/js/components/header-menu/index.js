import * as $                from 'jquery';
import {lockyOn}             from 'dom-locky';
import {lockBodyOnModalOpen} from "../helpers";

export class HeaderMenu {
   constructor() {
      this.$html = $('html');
      this.$burgerBtn = $('#header .header__burger');

      this.init();
   }

   init = () => {
      this.$burgerBtn.on('click', this.toggleMenu);

      $('.header__menu-nav .header__menu-link').on('click', () => {
         $('html').removeClass('header-menu-open');
         lockBodyOnModalOpen(false)
      })
   };

   toggleMenu = () => {
      if (this.$html.hasClass('header-menu-open')) {
         this.$html.removeClass('header-menu-open');
         lockBodyOnModalOpen(false)
      } else {
         this.$html.addClass('header-menu-open');
         lockBodyOnModalOpen(true)
      }
   };
}
