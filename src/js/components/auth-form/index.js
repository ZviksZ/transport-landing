import * as $ from 'jquery';
import { initFormWithValidate, validateField, validateForm } from '../form';

export class InitAuthForm {
   constructor() {
      this.$form = $('#auth-form');

      if (this.$form.length === 0) return false;

      this.enteredPhone = null;
      this.isNumberRegistered = false;

      this.progressInputsLength = this.$form.find('.auth__step-progress .field:not(.field-not-progress)').length;

      this.init();
   }

   init = () => {
      this.initSmsFieldInput($('#auth__code'), (value) => {
         if (value && value.length === 4) {
            this.checkCode();
         }
      });

      $('#auth-phone-number').val('');
      initFormWithValidate(this.$form);

      this.$form.on('submit', this.onSubmit);
      this.$form.find('.auth__step-progress .input-text').on('blur', this.setProgress);
      this.$form.find('.auth__step-progress select').on('change', this.setProgress);
      this.$form.find('.auth__step-disabled .input-text').on('input change', this.checkDisabledBtn);
      this.$form.find('.auth__step-link').on('click', this.changeStep);
      this.$form.find('.auth__tabs .item').on('click', this.changeTab);
      $('#auth__send-phone-repeat').on('click', this.sendPhoneNumberApi);
   };

   initSmsFieldInput = ($field, callback) => {
      let $inputs = $field.find('.sms-input');
      $inputs
         .on('input', function (e) {
            onInputHandler($(this), e);
         })
         .on('change', function () {
            if ($(this).val() !== '') {
               $(this).removeClass('empty');
            } else {
               $(this).addClass('empty');
            }
         });

      function onInputHandler($input, e) {
         if (e.currentTarget.value.length === 4) {
            setSMSFullValue();

            return;
         }

         cleanSMSValue();

         let thisVal = $input.val(),
            inputIndex = +$input.attr('data-index'),
            nextIndex = inputIndex + 1,
            prevIndex = inputIndex - 1;

         checkPrevNextInputStep($input);

         /*Оцищаем от говна*/
         function cleanSMSValue() {
            $input.val($input.val().replace(/\D/g, ''));
            $input.val($input.val().substr(0, 1));
         }

         /*Вставка*/
         function setSMSFullValue() {
            let smsFullVal = e.currentTarget.value || '';
            smsFullVal = smsFullVal.replace(/\D/g, '');

            let smsArr = smsFullVal.split('');

            for (var i = 0; i < $inputs.length; i++) {
               $inputs[i].value = smsArr[i];
            }

            getSMSFullvalue();

            $inputs.trigger('change').trigger('blur');
         }

         /**/
         function checkSMSValue(value) {
            if (value.length === 4) {
               $inputs.trigger('blur');
               callback(value);
            }
         }

         /*Сбор данных со всех инпатов*/
         function getSMSFullvalue() {
            let fullValue = '';

            for (let i = 0; i < $inputs.length; i++) {
               let itemValue = $inputs[i].value;
               fullValue += itemValue;
            }

            checkSMSValue(fullValue);
         }

         /*Переключение менжду инпатами при изменении*/
         function checkPrevNextInputStep() {
            if (thisVal.length > 0) {
               $('[data-index=' + nextIndex + ']').focus();
            } else {
               if (+thisVal.length === 0 && prevIndex !== 0) {
                  $('[data-index=' + prevIndex + ']').focus();
               }
            }

            if (thisVal.length === 4) {
               $inputs.trigger('blur');
            }

            getSMSFullvalue();
         }
      }
   };

   setProgress = () => {
      setTimeout(() => {
         const successFields = this.$form.find('.auth__step-progress .field.success').length;
         const progressWidth = (successFields / this.progressInputsLength) * 100 + '%';

         $('.auth__progress-container .auth__progress-line').animate({ width: progressWidth }, 400);
      }, 100);
   };

   changeTab = (e) => {
      const activeTab = $(e.currentTarget).attr('data-tab');
      const innField = $('[name="inn"]')

      this.$form.find('.auth__tabs .item').removeClass('active');
      this.$form.find('.auth__tabs .item[data-tab="' + activeTab + '"]').addClass('active');

      innField.attr('data-type', activeTab)

      if (innField.closest('.field').hasClass('error') || innField.closest('.field').hasClass('success')) {
         validateField(innField, true)
      }

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

   checkCode = () => {
      this.addLoader();

      setTimeout(() => {
         this.removeLoader();

         this.isNumberIsRegistered();
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

      this.toggleSteps(nextStep);
   };

   toggleSteps = (nextStep) => {
      this.$form.find('.auth__step').removeClass('active');
      if (nextStep === '2') {
         this.$form
            .find('.auth__step[data-step="' + nextStep + '"] input')
            .val('')
            .closest('.field')
            .addClass('empty')
            .removeClass('success error');
      }

      this.$form
         .find('.auth__step[data-step="' + nextStep + '"]')
         .addClass('active');

      if (!this.$form
         .find('.auth__step[data-step="' + nextStep + '"]').hasClass('no-focus-step')) {
         this.$form
            .find('.auth__step[data-step="' + nextStep + '"]')
            .find('input')
            .first()
            .focus();
      }
   };

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


      this.initPhoneTimer();


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

            if (this.isNumberRegistered) {

            } else {
               this.toggleSteps('3');
            }
         },
         error: (res) => {
            this.$form.addClass('show-message');
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
      let data;

      if (form.hasClass('with-files')) {
        data = new FormData( e.currentTarget )
      } else {
         data = form.serialize();
      }

      if (validateForm(form, true)) {
         $.ajax({
            url: form.attr('action'),
            type: 'POST',
            dataType: 'text',
            processData: false,
            contentType: false,
            data: data,
            beforeSend: () => {
               this.addLoader();
            },
            success: (res) => {
               this.removeLoader();

               if(this.$form.hasClass('with-success')) {
                  form.find('.auth__message').html(this.getSuccessMessage())
                  form.addClass('show-message');
               } else {

               }
            },
            error: (res) => {
               this.removeLoader();
               form.find('.auth__message').html(this.getErrorMessage())
               form.addClass('show-message');
               this.scrollToMessage(form);
            },
            timeout: 30000,
         });
      }
   };

   getSuccessMessage = () => {
      return `
         <img src="./img/auth/success.svg" alt="">
            <h2 class="h2">Отлично</h2>
            <p class="color-gray auth__text">
                Ваша заявка отправлена. Следите за статусом в личном кабинете
            </p>
            <a href="/profile" class="button">Личный кабинет</a>
      `
   }

   getErrorMessage = () => {
      return `
         <img src="./img/auth/error.svg" alt="">
            <h2 class="h2">Ошибка</h2>
            <p class="color-gray auth__text">
                Что-то пошло не так, попробуйте позже или напишите нам на <a href="mailto:support@example.ru">support@example.ru</a>, описав ситуацию, при которой возникает ошибка
            </p>
            <a href="/" class="button">Закрыть</a>
      `
   }

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
