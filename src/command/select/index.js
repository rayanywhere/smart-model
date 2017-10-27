const assert = require('assert');
const Command = require('../');
const Logic = require('../../logic');

module.exports = class extends Command {
    join(name, type, fieldLeft, fieldRight) {
        this._joins.push({name, model: this._findModel(name), type, fieldLeft, fieldRight});
        return this;
    }

    where(logic) {
        assert(logic instanceof Logic, 'expect param to be an instance of Logic class');
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
        //step 1. prepare fields
        let fields = [];
        for (let field of Object.keys(this._model)) {
            fields.push(`\`${this._name}\`.\`${field}\` as \`${this._name}^${field}\``);
        }
        this._joins.forEach(join => {
            for (let field of Object.keys(join.model)) {
                fields.push(`\`${join.name}\`.\`${field}\` as \`${join.name}^${field}\``);
            }
        });

        //step 2. build & run query
        this._sql = `SELECT ${fields.join(',')} FROM \`${this._name}\``;
        if (this._joins.length > 0) {
            this._parseJoins(this._joins);
        }
        if(this._logic !== undefined) {
            this._parseLogic(this._logic);
        }
        if (this._sorts !== undefined) {
            this._parseSorts(this._sorts);
        }
        if(this._range !== undefined) {
            this._parseRange(this._range);
        }

        let rows = await this._execute();

        //step 3. parse fields
        return rows.map(row => {
            let formattedRow = {};
            for (let [rawfield, value] of Object.entries(row)) {
                const parts = rawfield.match(/^(.+?)\^([^\^]+)$/);
                assert(parts instanceof Array, 'internal error, cannot parse field');
                const name = parts[1];
                const field = parts[2];
                if (formattedRow[name] === undefined) {
                    formattedRow[name] = {};
                }
                formattedRow[name][field] = value;
            };
            return formattedRow;
        });
    }
}