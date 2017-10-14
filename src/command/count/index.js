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
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
        }
        
        let connection = await this._getConnection();
        const [rows] = await connection.execute(sql);
        this._releaseConnection(connection);

        return parseInt(rows[0]['cnt']);
    }
}