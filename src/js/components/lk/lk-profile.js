import * as $                                                from 'jquery';
import { CustomSelect }                                      from '../custom-select';
import { initRangePicker }                                   from '../form';
import {getParameterByName, lockBodyOnModalOpen, toCurrency} from '../helpers';
import * as _                                                from 'lodash';

export class LkProfile {
   constructor() {
      this.$profileWrapper = $('.lk-profile');
      if (this.$profileWrapper.length === 0) return false;

      this.activeTab = getParameterByName('tab') || 'data';

      this.init();
   }

   init = () => {
      this.initActiveTab()
      this.$profileWrapper.find('.auth__tabs .item').on('click', this.changeTabs)
   };

   changeTabs = (e) => {
      this.activeTab = $(e.currentTarget).attr('data-tab')

      $('[data-tab]').removeClass('active')
      $('[data-tab="' + this.activeTab + '"]').addClass('active')
   }

   initActiveTab = () => {
      $('[data-tab="' + this.activeTab + '"]').addClass('active')
   }

}
