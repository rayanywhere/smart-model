const assert = require('assert');
const mysql = require('mysql');
let config = undefined;
let models = {};

module.exports = class {
    constructor(name) {
        this._model = this._findModel(name);
        this._name = name;
        this._data = undefined;
        this._logic = undefined;
        this._join = undefined;
        this._sorts = undefined;
        this._range = undefined;
        this._limit = undefined;
        this._sql = '';
        this._params = [];
    }

    static set config(cfg) {
        config = cfg;
    }

    static set models(mlds) {
        models = mlds;
    }

    run() {
        throw new Error('run is supposed to be implemented by subclass');    
    }
    
    _findModel(name) {
        assert(models[name] !== undefined, `no such model named ${name}`);
        return models[name];
    }

    _parseData(data) {
        this._sql += ' SET ' + Object.keys(data).map(field => `\`${field}\`=?`).join(',');
        this._params = this._params.concat(Object.values(data));
    }

    _parseJoin(join) {
        switch(join.type.toLowerCase()) {
            case 'left':
            case 'right':
            case 'inner':
                this._sql += ` ${join.type.toUpperCase()} JOIN ${join.name} ON ${this._name}.${join.fieldLeft}=${join.name}.${join.fieldRight}`;
                break;
            default:
                throw new Error(`unknown join type ${join.type}`);
        }
    }

    _parseLogic(logic) {
        this._sql += ` WHERE ${logic.toSql()}`;
        this._params = this._params.concat(logic.toParams());      
    }

    _parseSorts(sorts) {
        this._sql += ' ORDER BY ' + sorts.map(sort => `\`${sort.field}\` ${sort.order}`).join(',');
    }

    _parseRange(range) {
        this._sql += ` LIMIT ?,?`;
        this._params = this._params.concat([range.offset, range.number]);
    }

    _parseLimit(limit) {
        this._sql += ` LIMIT ?`;
        this._params = this._params.concat(limit);
    }

    _execute() {
        assert(config !== undefined, 'You need to call setup before making any practical calls');
        let connection = mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        });

        return new Promise((resolve, reject) => {
            connection.query(this._sql, this._params, function (error, results, fields) {
                connection.end();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
}
