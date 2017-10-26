const Logic = require('../');
const assert = require('assert');
const sqlstring = require('sqlstring');

class LogicStatement extends Logic {
    constructor(field, op, value) {
        super();
        assert(typeof field === 'string' && typeof op === 'string' && (typeof value === 'string' || typeof value === 'number'), 'bad statement');
        this._field = field;
        this._op = op;
        this._value = value;
    }

    toSql() {
        return `(?? ${this._op} ?)`;
    }

    toParams() {
        return [this._field, this._value];
    }
}

module.exports = (field, op, value) => {
    return new LogicStatement(field, op, value);
}