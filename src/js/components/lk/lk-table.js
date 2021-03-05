import * as $ from 'jquery';
import { initRangePicker } from '../form';
import { toCurrency } from '../helpers';
import * as _ from 'lodash';

export class LkTable {
   constructor() {
      this.$tableWrapper = $('.lk-table__wrapper');
      if (this.$tableWrapper.length === 0) return false;

      this.data = JSON.parse(this.$tableWrapper.attr('data-json'));

      this.filter = {
         dateFrom: null,
         dateTo: null,
         status: null,
         sortBy: 'status',
         direction: 'asc',
      };

      this.filteredData = this.data;

      this.init();
   }

   init = () => {
      this.initDateInputs();

      this.$tableWrapper.find('select').on('change', this.getFilteredTemplates);
      this.$tableWrapper.find('input').on('change', this.getFilteredTemplates);
      this.$tableWrapper.find('#lk-table__filter-direction .item').on('click', this.changeDirection);

      this.getFilteredTemplates();
   };

   changeDirection = (e) => {
      this.$tableWrapper.find('#lk-table__filter-direction .item').removeClass('active');
      $(e.currentTarget).addClass('active');

      this.getFilteredTemplates();
   };

   initDateInputs = () => {
      const $dateFrom = this.$tableWrapper.find('#date-from');
      const $dateTo = this.$tableWrapper.find('#date-to');

      const dateMin = new Date();
      dateMin.setDate(dateMin.getDate());

      initRangePicker($dateFrom, $dateTo, {});
   };

   getFilteredTemplates = () => {
      this.getFilter();
      this.filterData();
      this.sortData();
      this.getTableTemplate();
   };

   getFilter = () => {
      this.filter.dateFrom = this.$tableWrapper.find('#date-from').val() || null;
      this.filter.dateTo = this.$tableWrapper.find('#date-to').val() || null;
      this.filter.status = this.$tableWrapper.find('#lk-table__filter-status').val() || null;
      this.filter.sortBy = this.$tableWrapper.find('#lk-table__filter-sort').val() || 'date';
      this.filter.direction = this.$tableWrapper.find('#lk-table__filter-direction .item.active').attr('data-sort') || 'asc';
   };

   filterData = () => {
      const { dateFrom, dateTo, status } = this.filter;
      const parsedDateFrom = this.getParsedDate(dateFrom)
      const parsedDateTo = this.getParsedDate(dateTo)

      this.filteredData = this.data.filter((item) => {
         const parsedDate = this.getParsedDate(item.date);

         if ((!parsedDateFrom || parsedDate >= parsedDateFrom) && (!parsedDateTo || parsedDate <= parsedDateTo) && (!status || status === 'all' || item.status === status)) {
            return item;
         }
      });
   };

   sortData = () => {
      const sortedField = this.filter.sortBy === 'date' ? (item) => {
         return new Date(this.getParsedDate(item.date));
      } : this.filter.sortBy

      this.filteredData = _.orderBy(this.filteredData, [sortedField], [this.filter.direction]);
   };

   getParsedDate = (date) => {
      if (!date) return null;
      if (!date.split(',')[1]) {
         return date.split('.').reverse().join('.')
      }
      return date.split(',')[0].split('.').reverse().join('.') + ' ' + date.split(',')[1];
   };

   getTableTemplate = () => {
      let template = '';

      this.filteredData.forEach((item) => {
         template += this.getTableRowTemplate(item);
      });

      if (!this.filteredData.length) {
         template += `<tr><td colspan="300" class="text-align-center"><p class="body18 color-gray">По данному фильтру ничего не найдено</p></td></tr>`
      }

      this.$tableWrapper.find('.lk-table tbody').html(template);
   };

   getTableRowTemplate = (item) => {
      const statusText = item.status === 'success' ? 'Исполнена' : item.status === 'error' ? 'Ошибка' : 'В процессе';
      const operationBlock = item.operation
         ? `
         <td>
                <div class="title nowrap">Операция</div>
                <div class="value">${item.operation}</div>
            </td>
      `
         : '';

      return `
         <tr data-id='${item.id}'>
            <td>
                <div class="title nowrap">№ операции</div>
                <div class="value">${item.number}</div>
            </td>
            <td>
                <div class="title nowrap">дата и время</div>
                <div class="value nowrap">${item.date}</div>
            </td>
            ${operationBlock}
            <td>
                <div class="title nowrap">контрагент</div>
                <div class="value">${item.contractor}</div>
            </td>
            <td>
                <div class="title nowrap">Сумма</div>
                <div class="value nowrap">${toCurrency(item.amount)}</div>
            </td>
            <td>
                <div class="title nowrap">Статус</div>
                <div class="value">
                    <span class="status ${item.status}"></span>
                    <span>${statusText}</span>
                </div>
            </td>
        </tr>
      `;
   };
}
