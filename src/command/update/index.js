const sqlstring = require('sqlstring');
const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name, pairs) {
        super(helper, name);
        this._validatePairs(pairs);
        this._pairs = pairs;
        this._logic = undefined;       
        this._number = undefined;
    }

    where(logic) {
        this._logic = logic;
        return this;
    }

    limit(number) {
        this._number = number;
        return this;
    }

    async run() {
        let sql = `UPDATE ${this._table} SET ` + Object.entries(this._pairs).map(([field, value]) => `\`${field}\`=${sqlstring.escape(value)}`).join(',');
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
        }
        if(this._number !== undefined) {
            sql += ` LIMIT ${sqlstring.escape(this._number)}`;
        }

        let connection = await this._getConnection();
        await connection.execute(sql);
        this._releaseConnection(connection);
    }
}