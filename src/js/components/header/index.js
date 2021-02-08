import * as $ from 'jquery';

export class Header {
   constructor() {
      this.$header = $('#header');
      this.headerClassName = 'header-fixed';

      this.init();
   }

   init = () => {
      this.refreshStateHeader();

      $(window).on('scroll', this.refreshStateHeader);
   };

   refreshStateHeader = e => {
      if (pageYOffset > window.innerHeight) {
         this.$header.addClass(this.headerClassName);
      } else {
         this.$header.removeClass(this.headerClassName);
      }
   };
}
