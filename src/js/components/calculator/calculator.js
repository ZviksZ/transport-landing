import * as $                      from 'jquery';
import {toCurrency}                from "../helpers";
import { numberFormat, declOfNum } from '../helpers/index';
import 'ion-rangeslider';

export class Calculator {
   constructor() {
      this.$calc = $('#calculator');

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
   };

   getRoundedValue = (e) => {
      let sumVal = parseInt($(e.currentTarget).val());
      let newValue;

      if (sumVal > this.JSON.values.maxPrice) {
         newValue = this.JSON.values.maxPrice;
      } else if (sumVal < this.JSON.values.minPrice || !sumVal) {
         newValue = this.JSON.values.minPrice;
      }

      $(e.currentTarget).val(newValue)
   }

   inputChange = e => {
      let newVal = +e.target.value;

      const initialFeeSlider = $('[name="mortgage_sum_range"]').data('ionRangeSlider');

      if (newVal > this.JSON.values.maxPrice) {
         newVal = this.JSON.values.maxPrice;
      } else if (newVal < this.JSON.values.minPrice || !newVal) {
         newVal = this.JSON.values.minPrice;
      }

      initialFeeSlider.update({
         from: newVal
      });
   };

   getCalculatorSummary = () => {
      const enteredSum = parseInt(this.$sumRangeInput.val());

      const firstPaid = parseInt(enteredSum * 0.7);
      const closePaid = parseInt(enteredSum * 0.3);
      const closePaidCrossed = parseInt(enteredSum * 0.2);
      const commissionPaid = parseInt(enteredSum * 0.1);

      $('#calc-first-paid').text(toCurrency(firstPaid))
      $('#calc-close-paid').text(toCurrency(closePaid))
      $('#calc-close-paid-crossed').text(toCurrency(closePaidCrossed))
      $('#calc-commission-paid').text(toCurrency(commissionPaid))
   };

   initSumRangeSlider = () => {
      const mortgageSumInput = this.$sumInput;

      mortgageSumInput[0].value = numberFormat(this.JSON.default.price, 0, ' ');
      this.$sumRangeInput[0].value = this.JSON.default.price;


      return $('[name="mortgage_sum_range"]').ionRangeSlider({
         type: 'single',
         min: this.JSON.values.minPrice,
         max: this.JSON.values.maxPrice,
         from: this.JSON.default.price,
         step: 1000,
         drag_interval: true,
         prettify_enabled: true,
         prettify_separator: ' ',
         onChange: data => {
            mortgageSumInput[0].value = data.from;
            this.$sumRangeInput[0].value = data.from;
         },
         onUpdate: data => {
            this.$sumRangeInput[0].value = data.from;
            setTimeout(() => {
               this.getCalculatorSummary();
            }, 10);
         }
      });
   };
}
