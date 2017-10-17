const Command = require('../');
module.exports = class extends Command {
    constructor(helper, name, fields = undefined) {
        super(helper, name);
        if (fields !== undefined) {
           this._validateFields(fields);
        }
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
        let sql = 'SELECT ' + (this._fields === undefined ? '*' : this._fields.map(field => `\`${field}\``).join(',')) + ` FROM ${this._table}`;
        let params = [];
        if(this._logic !== undefined) {
            sql += ' WHERE ' + this._logic.toSql();
            params = params.concat(this._logic.toParams());
        }
        if (this._sorts !== undefined) {
            sql += ' ORDER BY ' + this._sorts.map(sort => `\`${sort.field}\` ${sort.order}`).join(',');
        }
        if(this._range !== undefined) {
            sql += ` LIMIT ?,?`;
            params = params.concat([this._range.offset, this._range.number]);
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
        return result[0];
    }
}