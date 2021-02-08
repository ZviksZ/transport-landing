import * as $ from 'jquery';
import { numberFormat, declOfNum } from '../helpers/index';
import 'ion-rangeslider';

export class Calculator {
   constructor() {
      this.$calc = $('#calculator');

      if (this.$calc.length === 0) return false;

      this.JSON = JSON.parse(this.$calc.attr('data-settings'));

      this.$sumInput = $('#calculator-input');
      this.$sumRangeInput = $('#calculator-range-value');
      this.$sendBtn = $('#calculator-send-btn');

      this.sumSlider = this.initSumRangeSlider();

      this.init();
   }

   init = () => {
      this.getCalculatorSummary();

      this.sumSlider.on('change', e => {
         setTimeout(() => {
            this.getCalculatorSummary();
         }, 10);
      });

      this.$sumInput.on('input', this.inputChange);
      this.$sumInput.on('blur', this.getRoundedValue);
   };

   getRoundedValue = (e) => {
      let sumVal = parseInt($(e.currentTarget).val());
      let roundedSum = Math.round(sumVal / 100) * 100;

      if (sumVal > this.JSON.values.maxPrice) {
         roundedSum = this.JSON.values.maxPrice;
      } else if (sumVal < this.JSON.values.minPrice) {
         roundedSum = this.JSON.values.minPrice;
      }

      $(e.currentTarget).val(roundedSum)
   }

   inputChange = e => {
      let value = +e.target.value;

      const initialFeeSlider = $('[name="mortgage_sum_range"]').data('ionRangeSlider');

      let newVal = value;

      if (value > this.JSON.values.maxPrice) {
         newVal = this.JSON.values.maxPrice;
      } else if (value < this.JSON.values.minPrice) {
         newVal = this.JSON.values.minPrice;
      }

      initialFeeSlider.update({
         from: newVal
      });
   };

   getCalculatorSummary = () => {
      let roundedSum = parseInt(this.$sumRangeInput.val());
/*
      let dateString = this.getDateString(termVal);
      let percentPerDay = 0.01;

      let totalVal = roundedSum + roundedSum * (termVal * percentPerDay);

      $('#calculator-sum-get').text(numberFormat(roundedSum, 0, '', ' ') + ' ₽');
      $('#calculator-sum-get__input').val(roundedSum);
      $('#calculator-sum-term').text(termVal + ` ${declOfNum(termVal, ['день', 'дня', 'дней'])}`);
      $('#calculator-sum-term__input').val(termVal);
      $('#calculator-sum-date').text(dateString);
      $('#calculator-sum-date__input').val(dateString);
      $('#calculator-sum-total').text(numberFormat(totalVal, 0, '', ' ') + ' ₽');
      $('#calculator-sum-total__input').val(totalVal);*/

      //this.$sumInput.val(roundedSum)

      //this.$sendBtn.attr('href', `https://new.kredito24.ru/entry?total_amount=${roundedSum}&number_of_installments=${termVal}&product_type=K24`);
      //this.$sendBtn.attr('href', `http://kredito24.pro/start/credit?amount=${roundedSum}&period=${termVal}&periodUnit=DAYS&creditProductId=345&utm`);
      //this.$sendBtn.attr('href', ` https://lk.kredito24.pro/start/credit?amount=${roundedSum}&period=${termVal}&periodUnit=DAYS&creditProductId=345&utm`);
   };

   getDateString = term => {
      let currentDate = new Date();
      let newDate = new Date();
      let termValNum = +term;
      newDate.setDate(currentDate.getDate() + termValNum);

      return newDate.getDate() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getFullYear();
   };

   initSumRangeSlider = () => {
      const mortgageSumInput = this.$sumInput;

      console.log(this.JSON)

      mortgageSumInput[0].value = numberFormat(this.JSON.default.price, 0, ' ');
      this.$sumRangeInput[0].value = this.JSON.default.price;

      mortgageSumInput
         .closest('.calculator-item')
         .find('.calculator-min')
         .text(numberFormat(this.JSON.values.minPrice, 0, ' ') + ' ₽');
      mortgageSumInput
         .closest('.calculator-item')
         .find('.calculator-max')
         .text(numberFormat(this.JSON.values.maxPrice, 0, ' ') + ' ₽');

      return $('[name="mortgage_sum_range"]').ionRangeSlider({
         type: 'single',
         min: this.JSON.values.minPrice,
         max: this.JSON.values.maxPrice,
         from: this.JSON.default.price,
         step: 100,
         drag_interval: true,
         prettify_enabled: true,
         prettify_separator: ' ',
         onChange: data => {
            mortgageSumInput[0].value = data.from_pretty;
            this.$sumRangeInput[0].value = data.from_pretty;
         },
         onUpdate: data => {
            this.$sumRangeInput[0].value = data.from_pretty;
            setTimeout(() => {
               this.getCalculatorSummary();
            }, 10);
         }
      });
   };
}
