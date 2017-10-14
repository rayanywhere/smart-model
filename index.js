const Select = require('./src/command/select');
const Count  = require('./src/command/count');
const Insert = require('./src/command/insert');
const Update = require('./src/command/update');
const Delete = require('./src/command/delete');
const Helper = require('./lib/helper');
let helper = undefined;

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

    static setup(environment, modelsDir, configDir) {
        helper = new Helper(environment, modelsDir, configDir)
    }

    static select(name, fields) {
        return new Select(helper, name, fields);
    }

    static count(name) {
        return new Count(helper, name);
    }

    static insert(name, pairs) {
        return new Insert(helper, name, pairs);
    }

    static update(name, pairs) {
        return new Update(helper, name, pairs);
    }

    static delete(name) {
        return new Delete(helper, name);
    }
}