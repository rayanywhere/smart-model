const assert = require('assert');
const Command = require('../');
module.exports = class extends Command {
    where(logic) {
        assert(logic instanceof Logic, 'expect param to be an instance of Logic class');
        this._logic = logic;
        return this;
    }

    limit(number) {
        assert(Number.isInteger(number), 'expect param of limit function to be an integer');
        this._limit = number;
        return this;
    }

    async run() {
        this._sql = `DELETE FROM ${this._name}`;
        if(this._logic !== undefined) {
            this._parseLogic(this._logic);
        }
        if(this._limit !== undefined) {
            this._parseLimit(this._limit);
        }

        return await this._execute();
    }
}