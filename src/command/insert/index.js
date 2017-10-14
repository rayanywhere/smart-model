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

        let connection = await this._getConnection();
        let result = undefined;
        try {
            result = await connection.execute(sql, params);
        }
        finally {
            this._releaseConnection(connection);
        }
        if (result === undefined) {
            throw new Error(`sql query error, ${sql} with params=${JSON.stringify(params)}`);
        }
    }
}