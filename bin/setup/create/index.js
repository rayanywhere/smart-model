module.exports = async (connection, database, table, current) => {
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

    sql = `CREATE TABLE IF NOT EXISTS ${database}.${table}(${sql})`;
    await connection.execute(sql);
};