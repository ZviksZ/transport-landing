import * as $ from 'jquery';
import Choices from 'choices.js';

export class CustomSelect {
   constructor(forLoaded = false, selectInstanceId = null) {
      this.$select = null;
      this.forLoaded = forLoaded;

      if (forLoaded) {
         this.$select = document.getElementById(selectInstanceId);
      } else {
         this.$select = $('select.custom-select:not(.loaded-select)');
      }
      if (this.$select.length > 0) {
         this.init();
      }
   }

   init = () => {
      if (this.forLoaded) {
         this.initChoices(this.$select);
      } else {
         this.$select.each((_, item) => this.initChoices(item));
      }
   };

   getInstance = () => {
      return this.choice
   }

   initChoices = (
      $element,
      options = {
         searchEnabled: false,
         searchChoices: false,
         removeItems: true,
         itemSelectText: '',
         renderSelectedChoices: 'always',
         shouldSort: false,
         classNames: {
            containerOuter: 'choices choices-custom',
            containerInner: 'choices__inner choices-custom-inner',
         },
         /*sorter: function(a, b) {
            return +b.value - +a.value;
         },*/
      }
   ) => {
      if (!$element) return;

      if (this.forLoaded) {
         this.choice = new Choices($element, options);
      } else {
         new Choices($element, options);
      }

   };
}
