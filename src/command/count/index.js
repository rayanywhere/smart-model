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
        
        let results = await this._execute(sql, params);
        if (results.length < 1) {
            throw new Error('error when executing COUNT sql');
        }
        return parseInt(results[0]['cnt']);
    }
}