import * as $                from 'jquery';
import {lockyOn}             from 'dom-locky';
import {lockBodyOnModalOpen} from "../helpers";

export default class TooltipCustom {
   constructor() {
      this.$tooltips = $('.tooltip');

      if (!this.$tooltips.length) return false;

      this.desktop = null;

      this.init();
   }

   init() {
      this.$popupInfo = this.createPopup();
      this.$popupInfoContent = this.$popupInfo.find('.content');



      $(window)
         .on('mousemove', e => {
            this.setPopupPosition(e);
         })
         .on('resize', e => {
            this.initEventsHandler();
         });

      // закрытие тултипа
      $('body').on('click', '[data-close-popup-info]', () => {
         this.hidePopup();
         return false;
      });

      this.initEventsHandler();
   }

   /**
    * Обработчик событий холста
    * для десктопа и мобильной версии разные события
    */
   initEventsHandler() {
      const desktop = this.isDesktop();
      if (desktop !== this.desktop) this.desktop = desktop;

      this.$tooltips.off('mouseenter');
      this.$tooltips.off('mouseleave');
      this.$tooltips.off('click');

      if (this.desktop) {
         this.$tooltips
            .on('mouseenter', e => {
               const text = e.currentTarget.dataset['text'];
               this.setDataPopup(text);
               this.showPopup();
            })
            .on('mouseleave', e => {
               this.hidePopup();
            });
      } else {
         this.$tooltips.on('click', e => {
            const text = e.currentTarget.dataset['text'];
            this.handlerClickMobile(text);
            return false;
         });
      }
   }

   handlerClickMobile(text) {
      this.setDataPopup(text);
      this.showPopup();
   }

   /**
    * Определение десктопа
    * @returns {boolean}
    */
   isDesktop() {
      return window.innerWidth > 1000;
   }

   /**
    * Позиционирование тултипа
    * @param {Object} e - объект с параметрами курсора
    */
   setPopupPosition(e) {
      const mouseX = e.clientX + document.body.scrollLeft;
      const mouseY = e.clientY + document.body.scrollTop;


      const tooltipHeight = this.$popupInfo.height() + 30;
      const tooltipWidth = this.$popupInfo.width() + 15;
      let top = mouseY + 35;
      let left = mouseX - (tooltipWidth / 2);

      //условия, чтобы тултип не ушел за вьюпорт
      if (mouseY + tooltipHeight > $(window).height()) {
         top = top - tooltipHeight;
      }

      if (mouseX + tooltipWidth > $(window).width()) {
         left = left - tooltipWidth;
      }

      const style = {
         left: `${left}px`,
         top: `${top}px`
      };

      this.$popupInfo.css(style);
   }

   /**
    * Показ тултипа
    */
   showPopup() {
      lockBodyOnModalOpen(true)

      this.$popupInfo.addClass('show');
      setTimeout(() => {
         this.$popupInfo.addClass('show-effect');
      }, 5);
   }

   /**
    * Закрытие тултипа
    */
   hidePopup() {

      lockBodyOnModalOpen(false)

      if (this.desktop) {
         this.$popupInfo.removeClass('show show-effect');
         this.clearPopup();
      } else {
         this.$popupInfo.removeClass('show-effect');
         setTimeout(() => {
            this.$popupInfo.removeClass('show');
            this.clearPopup();
         }, 400);
      }
   }

   /**
    * Создание тултипа
    * @return {HTMLElement} созданный тултип
    */
   createPopup() {
      $('body').append(`
            <div id="popup_info" class="popup-info">
                <div class="content"></div>
            </div>
        `);

      return $('#popup_info');
   }

   /**
    * Добавление данных в тултип
    * @param {Object} text - текст для подсказки
    */
   setDataPopup(text = '') {

      const headHTML = `
            <div class="head">
                <div class="info">
                    <div class="text">${text}</div>
                </div>   
            </div>
        `;

      const buttonHTML = `
            <div class="popup__footer text-align-center hide-desktop">             
                <a href="#" class="button small popup__footer-close" data-close-popup-info>Понятно</a>
            </div>
        `;

      const popupHTML = headHTML + buttonHTML;
      this.$popupInfoContent.html(popupHTML);
   }

   /**
    * Очистка HTML тултипа
    */
   clearPopup() {
      this.$popupInfoContent.html('');
   }
}
