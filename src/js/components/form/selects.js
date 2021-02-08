import * as $  from 'jquery';
import Choices from "choices.js";

export default class Selects {
    constructor() {
        this.init();
    }

    init() {
        $('select.select').each((key, item) => this.initChoices(item));
    }

    initChoices($element, options = {
        searchEnabled:false,
        itemSelectText: ''
    }) {
        if(!$element) return;

        return new Choices($element, options);
    }
}
