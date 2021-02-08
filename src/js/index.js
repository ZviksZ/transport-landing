import * as $ from 'jquery';
import { Calculator } from './components/calculator';
import { CustomSelect } from './components/custom-select';
import { CustomTabs } from './components/custom-tabs';
import { Effects } from './components/effects';
import { initMaskedInput, initMoneyInput, initPlaceholders } from './components/form';
import { HeaderMenu } from './components/header-menu';
import { initInfoTabs, initInteriorMobileBtn } from './components/helpers/simple-functions.js';
import { ModalWindowFullScreen } from './components/modal-window-fullscreen';
import { ReviewsSlider } from './components/reviews-slider';
window.jQuery = require('jquery');

$(function () {
   new HeaderMenu();

   new Effects();

   // инициализация плагина кастомных селектов
   new CustomSelect();

   // функционал табов
   new CustomTabs();

   //Функционал калькулятора
   new Calculator();

   new ReviewsSlider();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();
   initMoneyInput();

   initInfoTabs();

   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
});
