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

function addFieldSql(database, table, field, desc) {
    let sql = `ALTER TABLE ${database}.${table} ADD COLUMN \`${field}\``;
    switch(desc.type.toLowerCase()) {
        case 'string':
            sql += ` VARCHAR(${desc.length}) NOT NULL DEFAULT '${desc.default}'`;
            break;
        case 'integer':
            sql += ` INTEGER NOT NULL DEFAULT ${desc.default}`;
            break;
    }
    switch (desc.index) {
        case 'unique':
            sql += `,ADD UNIQUE INDEX(\`${field}\`)`;
            break;
        case 'ordinary':
            sql += `,ADD INDEX(\`${field}\`)`;
            break;
    }
    return sql;
}

function dropFieldSql(database, table, field, desc) {
    return `ALTER TABLE ${database}.${table} DROP COLUMN \`${field}\``;
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
            const {current, obsolete} = helper.model(name);
            if (obsolete !== undefined) {

            	let sqls = [];
			    Object.entries(current).forEach(([field, desc]) => {
			        if (obsolete[field] === undefined) {
			            sqls.push(addFieldSql(helper.config.database, `t_${name.replace(/\./g, '_')}`, field, desc));
			            return;
			        }
			    });
			    Object.entries(obsolete).forEach(([field, desc]) => {
			        if (current[field] === undefined) {
			            sqls.push(dropFieldSql(helper.config.database, `t_${name.replace(/\./g, '_')}`, field, desc));
			            return;
			        }
			    });

			    for (let sql of sqls) {
                    await executeSql(connection, sql);
			    }
            }
        }

        connection.end();
    }
    catch(err) {
        console.log(err.stack);
        process.exit(-1);
    }
}