import * as $ from 'jquery';
import { initFormWithValidate, validateForm } from '../form';

export class MonedoForm {
   constructor() {
      this.$form = $('#monedo-form');

      if (!this.$form.length) return false;

      this.$formMessage = $('#monedo-form-message');

      this.init();
   }

   init = () => {
      initFormWithValidate(this.$form);

      this.initHandlers();
   };

   initHandlers = () => {
      this.$form.on('submit', this.onSubmit);
      $('#monedo-form_policy').on('change', this.policyChecked);

      this.$form.find('.monedo-close').on('click', e => {
         e.preventDefault();
         this.$form.removeClass('show-message');
      });
   };

   policyChecked = e => {
      if ($(e.target).prop('checked')) {
         $('#monedo-form_policy')
            .closest('.policy')
            .find('.error-message')
            .text('');
      } else {
         $('#monedo-form_policy')
            .closest('.policy')
            .find('.error-message')
            .text('Согласие обязательно');
      }
   };

   onSubmit = e => {
      e.preventDefault();

      let data = this.$form.serialize();
      let isPolicyChecked = $('#monedo-form_policy').prop('checked');

      if (!isPolicyChecked) {
         $('#monedo-form_policy')
            .closest('.policy')
            .find('.error-message')
            .text('Согласие обязательно');
      }

      if (validateForm(this.$form, true) && isPolicyChecked) {
         $.ajax({
            url: '/netcat/add.php',
            type: 'POST',
            dataType: 'text',
            data: data,
            success: res => {
               this.successForm();
            },
            error: res => {
               this.errorForm();
            },
            timeout: 30000
         });
      }
   };

   successForm = () => {
      this.clearForm(this.$form);

      this.$formMessage.find('.title').text('Спасибо за ваше доверие');
      this.$formMessage.find('.text').text('Мы искренне благодарны вам за то, что выбрали нас в качестве вашего делового партнера, давая нам возможность расти.');

      this.$formMessage.addClass('show-message');
   };

   errorForm = () => {
      this.$formMessage.find('.title').text('Отправка не удалась');
      this.$formMessage.find('.text').text('Что-то пошло не так. Попробуйте повторить отправку формы.');

      this.$formMessage.addClass('show-message');

      setTimeout(() => {
         this.$formMessage.removeClass('show-message');
      }, 2500);
   };

   clearForm = form => {
      form[0].reset();
      form
         .find('.field')
         .removeClass('success')
         .addClass('empty');
      form.find('.field input').val('');
   };
}
