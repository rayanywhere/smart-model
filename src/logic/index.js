const assert = require('assert');

module.exports = class {
    toSql() {
        throw new Error('this method is supposed to be implemented by subclass');
    }

    toParams() {
        throw new Error('this method is supposed to be implemented by subclass');
    }
}