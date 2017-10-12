const fsx = require('fs-extra');
const Helper = require('../../lib/helper');
const mysql = require('mysql2/promise');

module.exports = async (param) => {
    try {
        const helper = new Helper(param.modelsDir, param.configDir);
        
        const config = helper.config[param.environment];
        if (config === undefined) {
            throw new Error(`no such environment(${param.environment})`);
        }
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password
        });
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);

        for (let name of helper.models) {
            const {current, obsolete} = helper.model(name);
            if (obsolete !== undefined) {
                await require('./upgrade')(connection, config.database, `t_${name.replace(/\./g, '_')}`, current, obsolete);
            }
            else {
                await require('./create')(connection, config.database, `t_${name.replace(/\./g, '_')}`, current);
            }
        }

        connection.end();
    }
    catch(err) {
        console.log(err.stack);
        process.exit(-1);
    }
}