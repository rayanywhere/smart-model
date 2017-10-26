const assert = require('assert');
const Command = require('../');
const Logic = require('../../logic');

module.exports = class extends Command {
    join(name, type, fieldLeft, fieldRight = undefined) {
        this._join = {name, model: this._findModel(name), type, fieldLeft, fieldRight: fieldRight === undefined ? fieldLeft : fieldRight};
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
        if (this._join !== undefined) {
            for (let field of Object.keys(this._join.model)) {
                fields.push(`\`${this._join.name}\`.\`${field}\` as \`${this._join.name}^${field}\``);
            }
        }

        //step 2. build & run query
        this._sql = `SELECT ${fields.join(',')} FROM \`${this._name}\``;
        if (this._join !== undefined) {
            this._parseJoin(this._join);
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
                const parts = rawfield.match(/^(.+?)\^([^_]+)$/);
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