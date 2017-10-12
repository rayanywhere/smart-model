const fsx = require('fs-extra');
const Helper = require('../../lib/helper');
const helper = new Helper(process.cwd());
const mysql = require('mysql2/promise');

module.exports = async (env) => {
    try {
        const config = helper.config[env];
        if (config === undefined) {
            throw new Error(`no such env(${env})`);
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