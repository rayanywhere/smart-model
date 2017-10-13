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

    run() {
        let sql = `SELECT count(*) FROM ${this._table}`;
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
        }
        console.log(sql);
    }
}