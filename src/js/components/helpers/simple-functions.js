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

export function initFileInputBlock() {
   $('.form-file-block .button').on('click', function (e) {
      e.preventDefault();
      $(e.currentTarget).closest('.form-file-block').find('input').click();
   });

   const resetField = (input) => {
      input.type = ''
      input.type = 'file'
   }

   $('.form-file-block input').on('change', function (e) {
      const file = e.target.value,
         fileSize = this.files[0].size / 1024 / 1024,
         fileType = this.files[0].type,
         isValidType = fileType.includes('image') || fileType.includes('pdf'),
         $fileName = $(e.currentTarget).closest('.form-file-block').find('.filename');

      if (fileSize > 5) {
         $fileName.addClass('error').text('Допустимый размер файла не более 5мб');
         resetField(e.target)
      } else if (!isValidType) {
         $fileName.addClass('error').text('Недопустимый тип файла');
         resetField(e.target)
      } else {
         let fileName = file.split('\\');
         $fileName.removeClass('error').text(fileName[fileName.length - 1]);
      }
   });
}

export function initCardRemoveModal() {
   $('.lk__profile-card svg').on('click', function (e) {
      let cardId = $(e.currentTarget).closest('.lk__profile-card').attr('data-card-id');

      $('#card_remove_id').val(cardId);
   });

   $('.card-modal .button[type="submit"]').on('click', function (e) {
      if (location.href.includes('tab=cards')) {
         location.reload();
      } else {
         location.href += '?tab=cards';
      }
   });
}
