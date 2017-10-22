const mysql = require('mysql')

module.exports = class {
    constructor(helper, name) {
        this._helper = helper;
        this._table = `${helper.config.database}.t_${name.replace(/\./g, '_')}`;
        this._model = helper.model(name).current;
    }

    run() {
        throw new Error('run is supposed to be implemented by subclass');    
    }

    _execute(sql, params) {
        let connection = mysql.createConnection({
            host: this._helper.config.host,
            port: this._helper.config.port,
            user: this._helper.config.user,
            password: this._helper.config.password,
            database: this._helper.config.database
        });

        return new Promise((resolve, reject) => {
            connection.query(sql, params, function (error, results, fields) {
                connection.end();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    _validateFields(fields) {
        const allFields = new Set(Object.keys(this._model));
        fields.forEach(field => {
            if (!allFields.has(field)) {
                throw new Error(`field(${field}) is not in specification of table(${this._table})`);
            }
        });
    }

    _validatePairs(pairs) {
        this._validateFields(Object.keys(pairs));
        Object.entries(pairs).forEach(([field, value]) => {
            const fieldConfig = this._model[field];
            switch(fieldConfig.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        throw new Error(`expect value of field(${field}) of table(${this._table}) to be a string`);
                    }
                    if (value.length > fieldConfig.length) {
                        throw new Error(`string too long in field(${field}) of table(${this._table})`);
                    }
                    break;
                case 'integer':
                    if (!Number.isInteger(value)) {
                        throw new Error(`expect value of field(${field}) of table(${this._table}) to be an integer`);
                    }
                    break;
            }
        })
    }
}
