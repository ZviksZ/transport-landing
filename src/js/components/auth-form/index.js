import * as $ from 'jquery';
import { initFormWithValidate, validateField, validateForm } from '../form';

export class InitAuthForm {
   constructor() {
      this.$form = $('#auth-form');

      if (this.$form.length === 0) return false;

      this.enteredPhone = null;
      this.isNumberRegistered = false;

      this.progressInputsLength = this.$form.find('.auth__step-progress .field').length;

      this.init();
   }

   init = () => {
      $('#auth-phone-number').val('')
      initFormWithValidate(this.$form);

      this.$form.on('submit', this.onSubmit);
      this.$form.find('.auth__code-input').on('input', this.enterCode);
      this.$form.find('.auth__step-progress .input-text').on('blur', this.setProgress);
      this.$form.find('.auth__step-disabled .input-text').on('input change', this.checkDisabledBtn);
      this.$form.find('.auth__step-link').on('click', this.changeStep);
      this.$form.find('.auth__tabs .item').on('click', this.changeTab);
      $('#auth__send-phone-repeat').on('click', this.sendPhoneNumberApi);
   };

   setProgress = () => {
      setTimeout(() => {
         const successFields = this.$form.find('.auth__step-progress .field.success').length;
         const progressWidth = (successFields / this.progressInputsLength) * 100 + '%';

         $('.auth__progress-container .auth__progress-line').animate({width: progressWidth}, 400);
      }, 100)

   };

   changeTab = (e) => {
      const activeTab = $(e.currentTarget).attr('data-tab');

      this.$form.find('.auth__tabs .item').removeClass('active');
      this.$form.find('.auth__tabs .item[data-tab="' + activeTab + '"]').addClass('active');

      $('#auth-company-type').val(activeTab);
   };

   checkDisabledBtn = (e) => {
      const stepBlock = $(e.currentTarget).closest('.auth__step-disabled');
      const step = stepBlock.attr('data-step');

      if (this.validateStep(step, false)) {
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

         if (this.isNumberRegistered) {

         } else {
            this.toggleSteps('3')
         }

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

      if (+currentStep > +isNextStep) {
         $('#auth__send-time').addClass('hide');
         $('#auth__send-phone-repeat').removeClass('hide');
      }

      if (isNextStep !== '3') {
         clearInterval(this.timer);
         $('#auth__send-time span').text('');
      }

      if ($(e.currentTarget).hasClass('auth__send-phone')) {
         this.sendPhoneNumberApi(e);
         this.setPhoneNumberText();
      }

      this.toggleSteps(nextStep)

   };

   toggleSteps = (nextStep) => {
      this.$form.find('.auth__step').removeClass('active');
      if (nextStep === '2') {
         this.$form
            .find('.auth__step[data-step="' + nextStep + '"] input')
            .val('')
            .closest('.field')
            .addClass('empty').removeClass('success error');
      }

      this.$form
         .find('.auth__step[data-step="' + nextStep + '"]')
         .addClass('active')
         .find('input')
         .first()
         .focus();
   }

   initPhoneTimer = () => {
      const display = $('#auth__send-time span');
      let timeLeft = 60;

      display.html(timeLeft);

      $('#auth__send-time').removeClass('hide');
      $('#auth__send-phone-repeat').addClass('hide');

      this.timer = setInterval(() => {
         if (--timeLeft >= 0) {
            display.html(timeLeft);
         } else {
            $('#auth__send-time').addClass('hide');
            $('#auth__send-phone-repeat').removeClass('hide');

            clearInterval(this.timer);
         }
      }, 1000);
   };

   sendPhoneNumberApi = (e) => {
      e.preventDefault();
      const value = $('#auth-phone-number').val();

      this.isNumberIsRegistered();
      this.initPhoneTimer();


      console.log(value);
   };

   isNumberIsRegistered = () => {
      $.ajax({
         url: '/checkRegister',
         type: 'POST',
         contentType: 'application/json',
         data: {
            phone: $('#auth-phone-number').val(),
         },
         success: (res) => {
            this.isNumberRegistered = res.isAuth;
         },
         error: (res) => {
            console.log('Раскомментировать')
            /*this.$form.addClass('show-message');*/
         },
         timeout: 30000,
      });
   };

   setPhoneNumberText = () => {
      const value = $('#auth-phone-number').val();
      const code = value.slice(0, 3);
      const phone1 = value.slice(3, 6);
      const phone2 = value.slice(6, 8);
      const phone3 = value.slice(8, 10);

      const text = `+7 (${code}) ${phone1}-${phone2}-${phone3}`;

      this.enteredPhone = text;
      $('#auth-phone-number-text').text(text);
   };

   validateStep = (step, showError = true) => {
      let error = 0;
      let $fields = this.$form.find('.auth__step[data-step="' + step + '"] .validate');

      $fields.each(function () {
         if (!validateField($(this), showError)) {
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

      console.log('submit')

      if (validateForm(form, true)) {
         console.log('submit validateForm')

         $.ajax({
            url: form.attr('action'),
            type: 'POST',
            dataType: 'text',
            data: data,
            beforeSend: () => {
               this.addLoader();
            },
            success: (res) => {
               alert('Sended form');
               this.removeLoader();
            },
            error: (res) => {
               this.removeLoader();
               form.addClass('show-message');
               this.scrollToMessage(form);
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
}
