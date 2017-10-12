const Ajv = require('ajv');
const ajv = new Ajv();
const Helper = require('../../lib/helper');

module.exports = (param) => {
    const helper = new Helper(param.modelsDir, param.configDir); 
    if (!ajv.validate({
        type: "object",
        properties: {
            host: {type: "string"},
            port: {type: "integer"},
            user: {type: "string"},
            password: {type: "string"},
            database: {type: "string"}
        },
        additionalProperties: false,
        required: ["host", "port", "user", "password", "database"]
    }, helper.config[param.environment])) {
        throw new Error(`bad config file, details: ${ajv.errorsText()}`);
    }

    helper.models.forEach(name => {
        const {current, obsolete} = helper.model(name);
        if (!diagnoseModel(current)) {
            throw new Error(`bad model ${name}, details: ${ajv.errorsText()}`);
        }
        if (obsolete !== undefined && !diagnoseModel(obsolete)) {
            throw new Error(`bad obsolete model ${name}, details: ${ajv.errorsText()}`);
        }
    });
}

function diagnoseModel(model) {
    return ajv.validate({
        type: 'object',
        patternProperties: {
            '.+': {
                anyOf: [
                    {
                        type: 'object',
                        properties: {
                            type: {enum: ["string"]},
                            length: {type: "integer", minimum: 1},
                            default: {type: "string"},
                            index: {enum: ["unique", "ordinary"]}
                        },
                        additionalProperties: false,
                        required: ["type", "length", "default"]
                    },
                    {
                        type: 'object',
                        properties: {
                            type: {enum: ["integer"]},
                            default: {type: "integer"},
                            index: {enum: ["unique", "ordinary"]}
                        },
                        additionalProperties: false,
                        required: ["type", "default"]
                    }
                ]
            }
        }
    }, model);
}