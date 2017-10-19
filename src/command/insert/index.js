const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name, pairs) {
        super(helper, name);
        this._validatePairs(pairs);
        this._pairs = pairs;
    }

    async run() {
        let sql = `INSERT INTO ${this._table} SET ` + Object.keys(this._pairs).map(field => `\`${field}\`=?`).join(',');
        let params = Object.values(this._pairs);

        return await this._execute(sql, params);
    }
}