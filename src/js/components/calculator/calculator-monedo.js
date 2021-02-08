import * as $ from 'jquery';
import { numberFormat } from '../helpers/index';
import 'ion-rangeslider';

export class CalculatorMonedo {
   constructor() {
      this.$calc = $('#calculator-monedo');

      if (this.$calc.length === 0) return false;

      this.JSON = JSON.parse(this.$calc.attr('data-settings'));

      this.$sumInput = $('#calculator-input');
      this.$sumRangeInput = $('#calculator-range-value');

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

      this.$calc.find('.calculator-monedo__term .item').on('click', this.changeTerm);
   };

   getRoundedValue = (e) => {
      let sumVal = parseInt($(e.currentTarget).val());
      let roundedSum = Math.round(sumVal / 500000) * 500000;

      if (sumVal > this.JSON.values.maxPrice) {
         roundedSum = this.JSON.values.maxPrice;
      } else if (sumVal < this.JSON.values.minPrice) {
         roundedSum = this.JSON.values.minPrice;
      }

      $(e.currentTarget).val(roundedSum)
   }

   changeTerm = e => {
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {
         this.$calc.find('.calculator-monedo__term .item').removeClass('active');
         $(e.target).addClass('active');

         this.getCalculatorSummary();
      }
   };

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
      let sumVal = +this.$sumRangeInput.val();
      let roundedSum = Math.round(sumVal / 500000) * 500000;

      let percent = +this.$calc.find('.calculator-monedo__term .item.active').attr('data-percent');
      let term = +this.$calc.find('.calculator-monedo__term .item.active').attr('data-term');

      let income = Math.ceil(roundedSum / 100 * percent / 12 * term);

      $('#calculator-monedo-percent__text').text(percent + '% *');
      $('#calculator-monedo-income__text').text(numberFormat(income, 0, '', ' ') + ' ₽');

      $('#calculator-monedo-term').val(term);
      $('#calculator-monedo-percent').val(percent);
      $('#calculator-monedo-income').val(income);
      $('#calculator-monedo-sum').val(roundedSum);
   };

   initSumRangeSlider = () => {
      const mortgageSumInput = this.$sumInput;

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
         step: 500000,
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
