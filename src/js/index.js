import * as $                                                from 'jquery';
import {InitAuthForm}                                        from "./components/auth-form";
import { Calculator }                                                                        from './components/calculator';
import { CustomSelect }                                                                      from './components/custom-select';
import { CustomTabs }                                                                        from './components/custom-tabs';
import { Effects }                                                                           from './components/effects';
import { initMaskedInput, initMoneyInput, initPlaceholders }                                 from './components/form';
import { HeaderMenu }                                                                        from './components/header-menu';
import {initSubmenuMobileOpen}                                                               from "./components/helpers/simple-functions";
import {initCloseMenuOnClick, initInfoTabs, initInteriorMobileBtn, initSmoothScrollToAnchor} from './components/helpers/simple-functions.js';
import { ModalWindowFullScreen }                                                             from './components/modal-window-fullscreen';
import { Parallax }                                                                          from './components/parallax';
import { ReviewsSlider }                                                                     from './components/reviews-slider';
import TooltipCustom                                                                         from "./components/tooltip";
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

   new InitAuthForm();

   new ReviewsSlider();

   new Parallax();

   new TooltipCustom();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();
   initMoneyInput();

   initInfoTabs();

   initSmoothScrollToAnchor();

   initSubmenuMobileOpen();

   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
});
