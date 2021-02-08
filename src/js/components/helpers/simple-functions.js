import * as $                                 from 'jquery';
import { initFormWithValidate, validateForm } from '../form';

export function initInfoTabs() {
   $('.info__wrap .item .top').on('click', function() {
      $(this)
         .closest('.item')
         .toggleClass('item-show-content');
   });
}

export function initInteriorMobileBtn() {
   $('.interior-page__wrap .see-more').on('click', function() {
      if ($(this).closest('.interior-page__wrap').hasClass('show-content')) {
         $(this)
            .text('Показать больше')
            .closest('.interior-page__wrap')
            .removeClass('show-content');
      } else {
         $(this)
            .text('Скрыть')
            .closest('.interior-page__wrap')
            .addClass('show-content');
      }
   });
}

export function initMonedoHeader() {
   $('.monedo-header .burger').on('click', function() {
      $('html').toggleClass('show-menu');
   });
}
export function initMonedoMenu() {
   $('.monedo-menu nav a').on('click', function() {
      $('html').removeClass('show-menu');
   });
}
