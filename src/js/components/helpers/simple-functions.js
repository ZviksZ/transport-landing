import * as $                                 from 'jquery';
import { initFormWithValidate, validateForm } from '../form';

export function initInfoTabs() {
   $('.info__wrap .item .top').on('click', function() {
      $(this)
         .closest('.item')
         .toggleClass('item-show-content');
   });
}

export function initSmoothScrollToAnchor() {
   $(`a[href*="#"]`).click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
         && location.hostname == this.hostname) {
         var $target = $(this.hash);
         $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
         if ($target.length) {
            var targetOffset = $target.offset().top - $('#header').height();
            $('html,body').animate({scrollTop: targetOffset}, 1000);
            return false;
         }
      }
   });
}

export function initCloseMenuOnClick() {
   $('.header__menu-nav .header__menu-link').on('click', () => {
      $('html').removeClass('header-menu-open');
   })
}
