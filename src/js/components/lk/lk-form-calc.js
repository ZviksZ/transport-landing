import * as $ from 'jquery';
import { toCurrency } from '../helpers';

export class LkFormCalc {
   constructor() {
      this.$calc = $('#lk-request-form-calc');

      if (this.$calc.length === 0) return false;

      this.$sumInput = this.$calc.find('input');

      this.init();
   }

   init = () => {
      this.getCalculatorSummary();

      this.$sumInput.on('input', this.getCalculatorSummary);
      this.$sumInput.on('blur', this.getCalculatorSummary);
   };

   getCalculatorSummary = () => {
      const enteredSum = parseInt(this.$sumInput.val() || 0);

      const firstPaid = parseInt(enteredSum * 0.7);
      const closePaid = parseInt(enteredSum * 0.3);
      const closePaidCrossed = parseInt(enteredSum * 0.2);
      const commissionPaid = parseInt(enteredSum * 0.1);

      $('#calc-first-paid').text(toCurrency(firstPaid));
      $('#calc-close-paid').text(toCurrency(closePaid));
      $('#calc-close-paid-crossed').text(toCurrency(closePaidCrossed));
      $('#calc-commission-paid').text(toCurrency(commissionPaid));
   };
}
