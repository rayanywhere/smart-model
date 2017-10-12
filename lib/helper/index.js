const fs = require('fs');
const walk = require('klaw-sync');

module.exports = class {
    constructor(path) {
        this._path = path;
    }

    get models() {
        return walk(`${process.cwd()}/models`, {
            nodir: true,
            filter: item => item.path.endsWith('.js') && !item.path.endsWith('.obsolete.js')
        }).map(item => item.path.replace(`${process.cwd()}/models/`, '').replace(/\.js$/g, '').replace(/\//g, '.'));
    }

    model(name) {
        return {
            current: require(`${this._path}/models/${name.replace(/\./g, '/')}.js`),
            obsolete: fs.existsSync(`${this._path}/models/${name.replace(/\./g, '/')}.obsolete.js`) ? require(`${this._path}/models/${name.replace(/\./g, '/')}.obsolete.js`) : undefined
        };
    }

    get config() {
        return require(`${this._path}/config`);   
    }
}