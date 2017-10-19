const fsx = require('fs-extra');
const Helper = require('../../lib/helper');
const mysql = require('mysql');

function executeSql(connection, sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

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
        await executeSql(connection, `CREATE DATABASE IF NOT EXISTS ${helper.config.database}`);

        for (let name of helper.models) {
            const {current} = helper.model(name);

            let sql = '';
            Object.entries(current).forEach(([field, desc]) => {
                sql += sql.length > 0 ? `,\`${field}\`` : `\`${field}\``;
                switch(desc.type.toLowerCase()) {
                    case 'string':
                        sql += ` VARCHAR(${desc.length}) NOT NULL DEFAULT '${desc.default}'`;
                        break;
                    case 'integer':
                        sql += ` INTEGER NOT NULL DEFAULT ${desc.default}`;
                        break;
                }
            });
            Object.entries(current).forEach(([field, desc]) => {
                switch (desc.index) {
                    case 'unique':
                        sql += `,UNIQUE INDEX(\`${field}\`)`;
                        break;
                    case 'ordinary':
                        sql += `,INDEX(\`${field}\`)`;
                        break;
                }
            })

            sql = `CREATE TABLE IF NOT EXISTS ${helper.config.database}.t_${name.replace(/\./g, '_')}(${sql})`;
            await executeSql(connection, sql);
        }

        connection.end();
    }
    catch(err) {
        console.log(err.stack);
        process.exit(-1);
    }
}