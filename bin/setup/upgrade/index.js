module.exports = async (connection, database, table, current, recent) => {
    let sqls = [];
    Object.entries(current).forEach(([field, desc]) => {
        if (recent[field] === undefined) {
            sqls.push(addFieldSql(database, table, field, desc));
            return;
        }
    });
    Object.entries(recent).forEach(([field, desc]) => {
        if (current[field] === undefined) {
            sqls.push(dropFieldSql(database, table, field, desc));
            return;
        }
    });

    for (let sql of sqls) {
        await connection.execute(sql);
    }
};

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