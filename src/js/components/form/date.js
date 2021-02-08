import * as $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/datepicker.js';


$.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: 'Пред',
    nextText: 'След',
    currentText: 'Сегодня',
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
        'Июл','Авг','Сен','Окт','Ноя','Дек'],
    dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    weekHeader: 'Нед',
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''};
$.datepicker.setDefaults($.datepicker.regional['ru']);


import {validateField} from "./validator.js";

/**
 * Инициализация выбора периода
 * @param {HTMLElement} $startInput - инпат даты ОТ
 * @param {HTMLElement} $endInput - инпат даты ДО
 * @param {Date} minDate объект минимальной даты для выбора
 * @param {Date} maxDate объект максимальной даты для выбора
 */
export function initRangePicker($startInput, $endInput, {
    minDate,
    maxDate
} = {}) {
    if (!$startInput || !$endInput) return true;

    // настройки datepicker
    if (!minDate) {
        minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 50);
    }

    if (!maxDate) {
        maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 50);
    }

    const defaultSettingsDatepicker = {
        minDate: minDate,
        maxDate: maxDate,
        dateFormat: 'dd.mm.yy'
    };

    const $pickerStart = $startInput.datepicker(defaultSettingsDatepicker);
    const $pickerEnd = $endInput.datepicker(defaultSettingsDatepicker);



    $startInput.on('change', function () {
        checkRange('start');
        $(this).closest('.field').removeClass('empty');
    });



    $endInput.on('change', function () {
        checkRange('end');
        $(this).closest('.field').removeClass('empty');
    });

    /**
     * Проверка корректности выбранного периода
     * @param {String} changeDate - тип изменяемое даты start|end
     * @results в зависимости от типа изменяемой даты очищает не валидное поле
     */
    function checkRange(changeDate) {
        const dateStartVal = $startInput.val();
        const dateEndVal = $endInput.val();

        if (changeDate === 'start') {
            if (validateField($startInput, true)) {
                // ограничиваем календарь
                let dateStartObj = getDateObjFromString(dateStartVal);
                // проверяем введенную дату на min|max
                if (+dateStartObj < +minDate) {
                    $startInput.datepicker('setDate', minDate);
                    dateStartObj = minDate;

                } else if (+dateStartObj > +maxDate) {
                    $startInput.datepicker('setDate', maxDate);
                    dateStartObj = maxDate;
                }

                $endInput.datepicker('option', 'minDate', dateStartObj);

                if (validateField($endInput, true)) {
                    const dateEndObj = getDateObjFromString(dateEndVal);
                    if (+dateStartObj > +dateEndObj) {
                        $endInput.val('').trigger('blur').removeClass('invalid');
                    }
                }

                $endInput.parent().find('.invalid-feedback').html('').removeClass('d-block');

            } else {
                // сбрасываем ограничение на выбор даты
                $endInput.datepicker('option', 'minDate', minDate);
            }
        }

        if (changeDate === 'end') {

            if (validateField($endInput, true)) {
                // ограничиваем календарь
                let dateEndObj = getDateObjFromString(dateEndVal);
                // проверяем введенную дату на min|max
                if (+dateEndObj < +minDate) {
                    $endInput.datepicker('setDate', minDate);
                    dateEndObj = minDate;

                } else if (+dateEndObj > +maxDate) {
                    $endInput.datepicker('setDate', maxDate);
                    dateEndObj = maxDate;
                }

                $startInput.datepicker('option', 'maxDate', dateEndObj);

                if (validateField($startInput, true)) {
                    const dateStartObj = getDateObjFromString(dateStartVal);
                    if (+dateEndObj < +dateStartObj) {
                        $startInput.val('').trigger('blur').removeClass('invalid');
                        $startInput.parent().find('.invalid-feedback').removeClass('d-block');
                    }
                }

                $startInput.parent().find('.invalid-feedback').html('').removeClass('d-block');

            } else {
                // сбрасываем ограничение на выбор даты
                $startInput.datepicker('option', 'maxDate', maxDate);
            }
        }
    }
}

/**
 * Форматирование даты
 * @param {Date} date - формат 2020-01-17T05:53:32.6285222+00:00
 * @param {Number} type - тип форматируемого результата
 * @resulst {String} date - отформатированная строка даты
 */
function formatDateFromApi(date, type = 1) {
    if (!date) return '';

    const monthNames = ['', 'янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];

    const dateTimestamp = Date.parse(date);
    const dateObj = new Date(dateTimestamp);

    const day = +dateObj.getDate();
    const month = +dateObj.getMonth() + 1;
    const year = +dateObj.getFullYear();

    const hours  = +dateObj.getHours();
    const minutes = +dateObj.getMinutes();
    const seconds = +dateObj.getSeconds();

    const dayText = (day < 10) ? `0${day}` : day;
    const monthText = (month < 10) ? `0${month}` : month;

    let result = '';
    switch (type) {
        case 1:
            // дата в формате 21 янв. 2020
            const monthName = monthNames[month];
            result = `${day} ${monthName} ${year}`;
            break;

        case 2:
            result = `${dayText}.${monthText}.${year}`;
            break;
        case 3:
            result = `${day}.${month}.${year} ${hours}:${minutes}`;
            break;

        default:
            result = `${day}.${month}.${year}`;
            break;
    }

    return result;
}


/**
 * Форматирование даты строки для API
 * @param {Date} date - формат 10.10.2020
 * @resulst {String} date - отформатированная строка даты 2020-01-17T05:53:32.6285222+00:00
 */
function formatDateForApi(date) {
    if (!date) return '';

    const [day, month, year] = date.split('.');

    return `${year}-${month}-${day}T00:00:00.000Z`;
}

/**
 * Получение объекта даты из строки разных форматов
 * @param {String} date - строка с датой
 * @param {Number} type - тип строки date
 * @results {Date} date - JS объект даты
 */
function getDateObjFromString(date, type = 1) {
    if (!date || !type) return new Date();

    if (type === 1) {
        // из строки вида дд.мм.гггг
        const [day, month, year] = date.split('.');
        return new Date(+year, +month - 1, +day, 0, 0, 0, 0);
    }

    return new Date();
}


/**
 * Получение текущей даты +5 минут в формате для загрузки файлов
 * @returns { String } дата в формате 20191225T085232Z
 */
function getCurrentDateForFileUpload() {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() / 60;
    //yearTmp, monthTmp, dayTmp, hoursTmp + timezoneOffset, minutesTmp + 5, secondsTmp
    date.setHours(date.getHours() + timezoneOffset);
    date.setMinutes(date.getMinutes() + 5);

    const day = +date.getDate();
    const month = +date.getMonth() + 1;
    const year = +date.getFullYear();
    const hours = +date.getHours();
    const minutes = +date.getMinutes();
    const seconds = +date.getSeconds();

    const dayText = (day < 10) ? `0${day}` : day;
    const monthText = (month < 10) ? `0${month}` : month;
    const hoursText = (hours < 10) ? `0${hours}` : hours;
    const minutesText = (minutes < 10) ? `0${minutes}` : minutes;
    const secondsText = (seconds < 10) ? `0${seconds}` : seconds;

    return `${year}${monthText}${dayText}T${hoursText}${minutesText}${secondsText}Z`;
}
