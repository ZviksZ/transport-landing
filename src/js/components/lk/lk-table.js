import * as $ from 'jquery';
import { CustomSelect } from '../custom-select';
import { initRangePicker } from '../form';
import { lockBodyOnModalOpen, toCurrency } from '../helpers';
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

      this.resizeHandlers();

      if ($('#lk-table__filter-sort').length > 0) {
         this.sortSelectChoices = new CustomSelect(true, 'lk-table__filter-sort');
      }
      if ($('#lk-table__filter-status').length > 0) {
         this.statusSelectChoices = new CustomSelect(true, 'lk-table__filter-status');
      }

      $(window).on('resize', this.resizeHandlers);

      this.initMobileFilter();
      this.getFilteredTemplates();
   };

   resizeHandlers = () => {
      if ($(window).width() < 1000) {
         this.$tableWrapper.find('.filter-btn').on('click', this.filterBtnHandler);
         this.$tableWrapper.find('select').off('change', this.getFilteredTemplates);
         this.$tableWrapper.find('input').off('change', this.getFilteredTemplates);
      } else {
         this.$tableWrapper.find('.filter-btn').off('click', this.filterBtnHandler);
         this.$tableWrapper.find('select').on('change', this.getFilteredTemplates);
         this.$tableWrapper.find('input').on('change', this.getFilteredTemplates);
      }

      this.$tableWrapper.find('#lk-table__filter-direction .item').off('click', this.changeDirection);
      this.$tableWrapper.find('#lk-table__filter-direction .item').on('click', this.changeDirection);
   };

   filterBtnHandler = () => {
      $('.lk-table__filter__block').removeClass('open-filter');
      lockBodyOnModalOpen(false);
      $('.body').removeClass('z-index-high');

      this.getFilteredTemplates();
   };

   initMobileFilter = () => {
      this.$tableWrapper.find('.lk-table__filter-btn-mob').on('click', this.openMobileFilter);
      this.$tableWrapper.find('.lk-table__filter__block .close-icon').on('click', this.closeMobileFilter);
   };

   openMobileFilter = (e) => {
      $('.lk-table__filter__block[data-filter="' + $(e.currentTarget).attr('data-filter') + '"]').addClass('open-filter');
      lockBodyOnModalOpen(true);
      $('.body').addClass('z-index-high');

      this.getStateInOpen();
   };

   closeMobileFilter = (e) => {
      $(e.currentTarget).closest('.lk-table__filter__block').removeClass('open-filter');
      lockBodyOnModalOpen(false);
      $('.body').removeClass('z-index-high');

      this.setStateInOpen();
   };

   getStateInOpen = () => {
      this.getFilter();

      this.stateInOpen = this.filter;
   };

   setStateInOpen = () => {
      console.log(this.stateInOpen);
      if (this.stateInOpen.dateFrom) {
         this.$tableWrapper.find('#date-from').val(this.stateInOpen.dateFrom || '');
      }
      if (this.stateInOpen.dateTo) {
         this.$tableWrapper.find('#date-to').val(this.stateInOpen.dateTo || '');
      }
      if (this.stateInOpen.sortBy) {
         console.log(this.sortSelectChoices.getInstance())
         this.sortSelectChoices.getInstance().setChoiceByValue(this.stateInOpen.sortBy);
      }
      if (this.stateInOpen.status) {
         console.log(this.statusSelectChoices.getInstance())
         this.statusSelectChoices.getInstance().setChoiceByValue(this.stateInOpen.status);
      }



    /*  if ($('#lk-table__filter-sort').length > 0) {

      }
      if ($('#lk-table__filter-status').length > 0) {


      }*/



      if (this.stateInOpen.direction) {
         this.$tableWrapper.find('#lk-table__filter-direction .item').removeClass('active');
         this.$tableWrapper.find('#lk-table__filter-direction .item[data-sort="' + this.stateInOpen.direction + '"]').addClass('active');
      }
   };

   changeDirection = (e) => {
      this.$tableWrapper.find('#lk-table__filter-direction .item').removeClass('active');
      $(e.currentTarget).addClass('active');

      if ($(window).width() >= 1000) {
         this.getFilteredTemplates();
      }
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
      const parsedDateFrom = this.getParsedDate(dateFrom) ? new Date(this.getParsedDate(dateFrom)) : null;
      const parsedDateTo = this.getParsedDate(dateTo) ? new Date(this.getParsedDate(dateTo)) : null;

      this.filteredData = this.data.filter((item) => {
         const parsedDate = new Date(this.getParsedDate(item.date));

         if ((!parsedDateFrom || parsedDate >= parsedDateFrom) && (!parsedDateTo || parsedDate <= parsedDateTo) && (!status || status === 'all' || item.status === status)) {
            return item;
         }
      });
   };

   sortData = () => {
      const sortedField =
         this.filter.sortBy === 'date'
            ? (item) => {
                 return new Date(this.getParsedDate(item.date));
              }
            : this.filter.sortBy;

      this.filteredData = _.orderBy(this.filteredData, [sortedField], [this.filter.direction]);
   };

   getParsedDate = (date) => {
      if (!date) return null;
      if (!date.split(',')[1]) {
         return date.split('.').reverse().join('.');
      }
      return date.split(',')[0].split('.').reverse().join('.') + ' ' + date.split(',')[1];
   };

   getTableTemplate = () => {
      let template = '';

      this.filteredData.forEach((item) => {
         template += this.getTableRowTemplate(item);
      });

      if (!this.filteredData.length) {
         template += `<div class="body18 color-gray text-align-center">По данному фильтру ничего не найдено</div>`;
      }

      this.$tableWrapper.find('.lk-table').html(template);
   };

   getTableRowTemplate = (item) => {
      const statusText = item.status === 'success' ? 'Исполнена' : item.status === 'error' ? 'Ошибка' : 'В процессе';
      const operationBlock = item.operation
         ? `
         <div class="item operation">
                <div class="title nowrap">Операция</div>
                <div class="value">${item.operation}</div>
            </div>
      `
         : '';

      return `
         <div class="lk-table__row" data-id='${item.id}'>
            <div class="item number">
                <div class="title nowrap">№ операции</div>
                <div class="value">${item.number}</div>
            </div>
            <div class="item date">
                <div class="title nowrap">дата и время</div>
                <div class="value nowrap">${item.date}</div>
            </div>
            ${operationBlock}
            <div class="item contractor">
                <div class="title nowrap">контрагент</div>
                <div class="value">${item.contractor}</div>
            </div>
            <div class="item amount">
                <div class="title nowrap">Сумма</div>
                <div class="value nowrap">${toCurrency(item.amount)}</div>
            </div>
            <div class="item status">
                <div class="title nowrap">Статус</div>
                <div class="value">
                    <span class="status ${item.status}"></span>
                    <span>${statusText}</span>
                </div>
            </div>
        </div>
      `;
   };
}
