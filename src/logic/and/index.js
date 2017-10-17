const Logic = require('../');
const assert = require('assert');

class LogicAnd extends Logic {
    constructor(items) {
        super();
        assert(items instanceof Array, 'bad logic AND');
        for(let item of items) {
            assert(item instanceof Logic, 'bad logic AND');
        }
        this._items = items;
    }

    toSql() {
        return `(${this._items.map(item => item.toSql()).join(' AND ')})`;
    }

    toParams() {
				return this._items.reduce((acc, item) => acc.concat(item.toParams()), []);
    }
}

module.exports = (items) => {
    return new LogicAnd(items);
}
