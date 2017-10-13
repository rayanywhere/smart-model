const Logic = require('../');
const assert = require('assert');
const sqlstring = require('sqlstring');

class LogicStatement extends Logic {
    constructor(field, op, value) {
        super();
        assert(typeof field === 'string' && typeof op === 'string', 'bad statement');
        this._field = field;
        this._op = op;
        this._value = value;
    }

    toSql() {
        return `(\`${this._field}\`${this._op}${sqlstring.escape(this._value)})`;
    }
}

module.exports = (field, op, value) => {
    return new LogicStatement(field, op, value);
}
