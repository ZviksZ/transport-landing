import * as $                    from 'jquery';
import {initFormWithValidate} from "../form";

export class FeedForm {
   constructor() {
      this.$form = $('#feed_form');

      if (!this.$form) {
         return false
      }
      //this.$formMessage = this.$form.find('.form-message');

      this.init();
   }

   init = () => {
      initFormWithValidate(this.$form);

      this.initHandlers();
   }

   initHandlers = () => {
      this.$form.on('submit', this.onSubmit)
   }

   onSubmit = async (e) => {
      e.preventDefault();

      let data = {
         f_email: this.$form.find('#feed-follow-input').val()
      }

      /* let $formData = {};

       this.$form.find('input, textarea, select').each(function() {
          $formData[this.name] = $(this).val();
       });



       /!*let data = {
          isNaked: 1,
          f_name:$formData.career_name,
          f_phone: $formData.career_phone,
          f_rezume:  new FormData(file),
          catalogue: 1,
          cc: 44,
          sub: 38,
          posting: 1
       }*!/
       let form = $(e.currentTarget)*/

      try {
         await fetch('/netcat/add.php', {
            method: 'POST',
            body: data
         });

         this.successForm()
      } catch (e) {
         this.errorForm()
      }



      this.successForm()
   }

   successForm = () => {
      this.clearForm();


      //this.$form.addClass('form-hide');


   }

   errorForm = () => {

   }

   clearForm = () => {
      this.$form[0].reset();
      this.$form.find('.field').removeClass('success').addClass('empty');
   }


}
