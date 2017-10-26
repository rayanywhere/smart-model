const assert = require('assert');
const Command = require('../');

module.exports = class extends Command {
    data(data) {
        assert(typeof data === 'object', 'expect data to be an object');  
        this._data = data;
        return this;
    }

    async run() {
        this._sql = `INSERT INTO \`${this._name}\``;
        this._parseData(this._data);        

        return await this._execute();
    }
}