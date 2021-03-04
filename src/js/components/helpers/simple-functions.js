import * as $ from 'jquery';

export function initInfoTabs() {
   $('.info__wrap .item .top').on('click', function () {
      $(this).closest('.item').toggleClass('item-show-content');
   });
}

export function initSmoothScrollToAnchor() {
   $(`a[href*="#"]`).click(function () {
      if ($(this).attr('href').length > 1) {
         if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = ($target.length && $target) || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
               var targetOffset = $target.offset().top - $('#header').height();
               $('html,body').animate({ scrollTop: targetOffset }, 1000);
               return false;
            }
         }
      }
   });
}

export function initSubmenuMobileOpen() {
   $('.header__menu-link.with-submenu').on('click', function (e) {
      e.preventDefault();

      if ($(window).width() < 1000) {
         $(this).toggleClass('show-submenu');
      }
   });
}
