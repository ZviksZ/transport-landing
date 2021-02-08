import * as $ from 'jquery';
import { Calculator, CalculatorMonedo } from './components/calculator';
import { CustomSelect } from './components/custom-select';
import { CustomTabs } from './components/custom-tabs';
import { Effects } from './components/effects';
import { FeedForm } from './components/feed-form';
import { initMaskedInput, initMoneyInput, initPlaceholders } from './components/form';
import { Header } from './components/header';
import { HeaderMenu } from './components/header-menu';
import { initInfoTabs, initInteriorMobileBtn } from './components/helpers/simple-functions.js';
import { ModalWindowFullScreen } from './components/modal-window-fullscreen';
import { MonedoForm, MonedoPage } from './components/monedo';
window.jQuery = require('jquery');

$(function() {
   // главное меню на мобильном
   new Header();
   new HeaderMenu();

   new Effects();

   // инициализация плагина кастомных селектов
   new CustomSelect();

   // функционал табов
   new CustomTabs();

   // форма подписки на рассылку новостей
   new FeedForm();

   //Функционал калькулятора
   new Calculator();
   new CalculatorMonedo();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();
   initMoneyInput();

   initInfoTabs();
   initInteriorMobileBtn();

   new MonedoForm();
   new MonedoPage();

   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
   setTimeout(() => {
      $('.monedo-preloader').addClass('monedo-preloader-hide');
   }, 200);
});
