import * as $ from 'jquery';
import Choices from 'choices.js';

export class CustomSelect {
  constructor() {
    this.$select = $('select.custom-select');
    if (this.$select.length > 0) {
      this.init();
    }
  }
  init = () => {
    this.$select.each((_, item) => this.initChoices(item));

  };

  initChoices = (
    $element,
    options = {
      searchEnabled: false,
      searchChoices: false,
      removeItems: true,
      itemSelectText: '',
      renderSelectedChoices: 'always',
      classNames: {
        containerOuter: 'choices choices-custom',
      },
      /*sorter: function(a, b) {
         return +b.value - +a.value;
      },*/
    }
  ) => {
    if (!$element) return;



    let choice = new Choices($element, options);
  };
}
