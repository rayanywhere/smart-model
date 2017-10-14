const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name) {
        super(helper, name);
        this._logic = undefined;
    }

    where(logic) {
        this._logic = logic;
        return this;
    }

    async run() {
        let sql = `SELECT count(*) as cnt FROM ${this._table}`;
        let params = [];
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
            params = params.concat(this._logic.toParams());
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
        return parseInt(result[0][0]['cnt']);
    }
}