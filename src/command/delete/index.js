const sqlstring = require('sqlstring');
const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name) {
        super(helper, name);
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

    run() {
        let sql = `DELETE FROM ${this._table}`;
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
        }
        if(this._number !== undefined) {
            sql += ` LIMIT ${sqlstring.escape(this._number)}`;
        }
        console.log(sql);
    }
}