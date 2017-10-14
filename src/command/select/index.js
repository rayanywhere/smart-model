const sqlstring = require('sqlstring');
const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name, fields) {
        super(helper, name);
        this._validateFields(fields);
        this._fields = fields;
        this._logic = undefined;
        this._range = undefined;
        this._sorts = undefined;
    }

    where(logic) {
        this._logic = logic;
        return this;
    }

    sort(field, order) {
        if (this._sorts === undefined) {
            this._sorts = [];
        }
        this._sorts.push({field, order});
        return this;
    }

    range(offset, number) {
        this._range = {offset, number};
        return this;
    }

    async run() {
        let sql = 'SELECT ' + this._fields.map(field => `\`${field}\``).join(',') + ` FROM ${this._table}`;
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
        }
        if (this._sorts !== undefined) {
            sql += ' ORDER BY ' + this._sorts.map(sort => `\`${sort.field}\` ${sort.order}`).join(',');
        }
        if(this._range !== undefined) {
            sql += ` LIMIT ${sqlstring.escape(this._range.offset)},${sqlstring.escape(this._range.number)}`;
        }

        let connection = await this._getConnection();
        const [rows] = await connection.execute(sql);
        this._releaseConnection(connection);
        return rows;
    }
}