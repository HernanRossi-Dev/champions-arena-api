'use strict'

export default class ActionResult {
    constructor(data = null, error = null, message = '') {
        this._status = 'Processed';
        this._errors = [error];
        this._data = data
        this._message = message;
    };

    get data() {
        return this._data;
    };

    set data(newData) {
        this._data = newData;
    };

    get errors() {
        return this._errors;
    };

    addErrors(error) {
        this._errors.push(error);
    };

    get message() {
        return this._message;
    }
}
