const path = require('path');
const fs = require('fs');
const walk = require('klaw-sync');
const assert = require('assert');

const Command = require('./src/command');
const Select = require('./src/command/select');
const Count = require('./src/command/count');
const Insert = require('./src/command/insert');
const Update = require('./src/command/update');
const Delete = require('./src/command/delete');

const Logic = require('./src/logic');

module.exports = class {
    static get Ops() {
        return {
            EQ: '=',
            GT: '>',
            GE: '>=',
            LT: '<',
            LE: '<=',
            NE: '!=',
            LIKE: 'like'
        }
    }

    static get Logic() {
        return {
            not: require('./src/logic/not'),
            and: require('./src/logic/and'),
            or:  require('./src/logic/or'),
            statement: require('./src/logic/statement')
        };
    }

    static setup(modelsDir, configDir) {
        Command.config = require(path.resolve(configDir));
        Command.models = walk(path.resolve(modelsDir), {
            nodir: true,
            filter: item => item.path.endsWith('.js') && !item.path.endsWith('.obsolete.js')
        }).map(item => path.basename(item.path, '.js')).reduce((prev, curr) => {
            prev[curr] = require(`${path.resolve(modelsDir)}/${curr}.js`);
            return prev;
        }, {});
    }

    static select(name) {
        return new Select(name);
    }

    static count(name) {
        return new Count(name);
    }

    static insert(name) {
        return new Insert(name);
    }

    static update(name) {
        return new Update(name);
    }

    static delete(name) {
        return new Delete(name);
    }
}