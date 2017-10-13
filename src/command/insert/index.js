const sqlstring = require('sqlstring');
const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name, pairs) {
        super(helper, name);
        this._validatePairs(pairs);
        this._pairs = pairs;
    }

    run() {
        let sql = `INSERT INTO ${this._table} SET ` + Object.entries(this._pairs).map(([field, value]) => `\`${field}\`=${sqlstring.escape(value)}`).join(',');
        console.log(sql);
    }
}