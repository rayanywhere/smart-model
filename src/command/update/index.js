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
        let sql = `UPDATE ${this._table} SET ` + Object.keys(this._pairs).map(field => `\`${field}\`=?`).join(',');
        let params = Object.values(this._pairs);
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
            params = params.concat(this._logic.toParams());
        }
        if(this._number !== undefined) {
            sql += ` LIMIT ?`;
            params = params.concat(this._number);
        }

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