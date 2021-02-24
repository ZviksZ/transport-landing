import * as $ from 'jquery';
import { initFormWithValidate, validateField, validateForm } from '../form';

export class InitAuthForm {
   constructor() {
      this.$form = $('#auth-form');

      if (this.$form.length === 0) return false;

      this.enteredPhone = null;
      this.currentStep = '1';

      this.init();
   }

   init = () => {
      initFormWithValidate(this.$form);

      this.$form.on('submit', this.onSubmit);
      this.$form.find('.auth__code-input').on('input', this.enterCode);
      this.$form.find('.auth__step-disabled .input-text').on('input', this.checkDisabledBtn);
      this.$form.find('.auth__step-link').on('click', this.changeStep);
      this.$form.find('.auth__tabs .item').on('click', this.changeTab);
   };

   changeTab = e => {
      const activeTab = $(e.currentTarget).attr('data-tab')

      this.$form.find('.auth__tabs .item').removeClass('active')
      this.$form.find('.auth__tabs .item[data-tab="' + activeTab + '"]').addClass('active')

      $('#auth-company-type').val(activeTab)
   }

   checkDisabledBtn = (e) => {
      const stepBlock = $(e.currentTarget).closest('.auth__step-disabled');
      const step = stepBlock.attr('data-step');

      if (this.validateStep(step)) {
         stepBlock.find('.auth__step-link--next').attr('disabled', false);
      } else {
         stepBlock.find('.auth__step-link--next').attr('disabled', true);
      }
   };

   addLoader = () => {
      this.$form.addClass('show-loading');
   };

   removeLoader = () => {
      this.$form.removeClass('show-loading');
   };

   enterCode = (e) => {
      const $this = $(e.currentTarget);
      const count = +$this.attr('data-code');
      const val = $this.val();

      if (val.length > 1) {
         $this.val($this.val().slice(0, 1));
         $this.closest('.field').removeClass('empty');
      } else if (val.length === 0) {
         $this.closest('.field').addClass('empty');
      }

      if (val && count === 4) {
         $this.closest('.field').removeClass('empty');
         this.checkCode();
      }

      $this.closest('.field').next('.field').find('input').focus();
   };

   checkCode = () => {
      this.addLoader();

      setTimeout(() => {
         this.removeLoader();
      }, 1000);
   };

   changeStep = (e) => {
      e.preventDefault();
      const nextStep = $(e.currentTarget).attr('data-step');
      const currentStep = $(e.currentTarget).closest('.auth__step').attr('data-step');
      const isNextStep = $(e.currentTarget).hasClass('auth__step-link--next');

      if (isNextStep && !this.validateStep(currentStep)) {
         return false;
      }

      if ($(e.currentTarget).hasClass('auth__send-phone')) {
         this.sendPhoneNumberApi();
         this.setPhoneNumberText();
      }

      this.$form.find('.auth__step').removeClass('active');
      this.$form
         .find('.auth__step[data-step="' + nextStep + '"] input').val('').closest('.field').addClass('empty')
      this.$form
         .find('.auth__step[data-step="' + nextStep + '"]')
         .addClass('active')
         .find('input')
         .first()
         .focus();
   };

   sendPhoneNumberApi = () => {
      const value = $('#auth-phone-number').val();
   }

   setPhoneNumberText = () => {
      const value = $('#auth-phone-number').val();
      const code = value.slice(0, 3);
      const phone1 = value.slice(3, 6);
      const phone2 = value.slice(6, 8);
      const phone3 = value.slice(8, 10);

      const text = `+7 (${code}) ${phone1}-${phone2}-${phone3}`;

      $('#auth-phone-number-text').text(text);
   };

   validateStep = (step) => {
      let error = 0;
      let $fields = this.$form.find('.auth__step[data-step="' + step + '"] .validate');

      $fields.each(function () {
         if (!validateField($(this), true)) {
            error++;
         }
      });

      if (error > 0) return false;

      return true;
   };

   onSubmit = (e) => {
      e.preventDefault();

      const form = $(e.currentTarget);

      let data = form.serialize();

      if (validateForm(form, true)) {
         $.ajax({
            url: form.attr('action'),
            type: 'POST',
            dataType: 'text',
            data: data,
            success: (res) => {
               this.clearForm(form);

               form.find('.form-message .title').text('Успешно');
               form.find('.form-message .text').text('Данные были успешно отправлены');

               form.find('.close-form-message').show();

               form.addClass('show-message success');

               this.scrollToMessage(form);
            },
            error: (res) => {
               form.find('.form-message .title').text('Ошибка');
               form.find('.form-message .text').text('Отправка данных не удалась. Попробуйте повторить отправку формы.');

               form.addClass('show-message error');

               this.scrollToMessage(form);

               setTimeout(() => {
                  form.removeClass('show-message error');
               }, 2500);
            },
            timeout: 30000,
         });
      }
   };

   scrollToMessage = (form) => {
      if (!$('html').hasClass('open-modal') && $(window).width() < 1000) {
         $('html, body').animate(
            {
               scrollTop: form.offset().top,
            },
            0
         );
      }
   };

   clearForm = (form) => {
      form[0].reset();
      form.find('.field').removeClass('success').addClass('empty');
      form.find('.field input').val('');
   };
}
