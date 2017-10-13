module.exports = class {
    constructor(helper, name) {
        this._table = `${helper.config.database}.t_${name.replace(/\./g, '_')}`;
        this._model = helper.model(name).current;
    }

    run() {
        throw new Error('run is supposed to be implemented by subclass');    
    }

    _validateFields(fields) {
        const allFields = new Set(Object.keys(this._model));
        fields.forEach(field => {
            if (!allFields.has(field)) {
                throw new Error(`field(${field}) is not in specification`);
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
                        throw new Error(`expect value of field(${field}) to be a string`);
                    }
                    if (value.length > fieldConfig.length) {
                        throw new Error(`string too long in field(${field})`);
                    }
                    break;
                case 'integer':
                    if (!Number.isInteger(value)) {
                        throw new Error(`expect value of field(${field}) to be an integer`);
                    }
                    break;
            }
        })
    }
}