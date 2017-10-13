const fsx = require('fs-extra');
const Helper = require('../../lib/helper');
const mysql = require('mysql2/promise');

module.exports = async (param) => {
    try {
        const helper = new Helper(param.environment, param.modelsDir, param.configDir);
        
        if (helper.config === undefined) {
            throw new Error(`no config of environment(${param.environment})`);
        }
        const connection = await mysql.createConnection({
            host: helper.config.host,
            port: helper.config.port,
            user: helper.config.user,
            password: helper.config.password
        });
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${helper.config.database}`);

        for (let name of helper.models) {
            const {current, obsolete} = helper.model(name);
            if (obsolete !== undefined) {
                await require('./upgrade')(connection, helper.config.database, `t_${name.replace(/\./g, '_')}`, current, obsolete);
            }
            else {
                await require('./create')(connection, helper.config.database, `t_${name.replace(/\./g, '_')}`, current);
            }
        }

        connection.end();
    }
    catch(err) {
        console.log(err.stack);
        process.exit(-1);
    }
}