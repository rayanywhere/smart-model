const fsx = require('fs-extra');

module.exports = () => {
    fsx.emptyDirSync(`${process.cwd()}/models`)
    fsx.emptyDirSync(`${process.cwd()}/config`)

    fsx.copySync(`${__dirname}/templates/config/index.js`, `${process.cwd()}/config/index.js`);
    fsx.copySync(`${__dirname}/templates/models`, `${process.cwd()}/models`);    
}