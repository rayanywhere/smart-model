const Logic = require('../');
const assert = require('assert');

class LogicOr extends Logic {
    constructor(items) {
        super();
        assert(items instanceof Array, 'bad logic OR');
        for(let item of items) {
            assert(item instanceof Logic, 'bad logic OR');
        }
        this._items = items;
    }

    toSql() {
        return `(${this._items.map(item => item.toSql()).join(' OR ')})`;
    }
}

module.exports = (items) => {
    return new LogicOr(items);
}