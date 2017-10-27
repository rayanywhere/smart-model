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

    async run() {
        this._sql = `SELECT count(*) as cnt FROM \`${this._name}\``;
        if (this._joins.length > 0) {
            this._parseJoins(this._joins);
        }
        if (this._logic !== undefined) {
            this._parseLogic(this._logic);
        }
        
        let results = await this._execute();
        if (results.length < 1) {
            throw new Error('error when executing COUNT sql');
        }
        return parseInt(results[0]['cnt']);
    }    
}