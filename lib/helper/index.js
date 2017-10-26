const fs = require('fs');
const walk = require('klaw-sync');

module.exports = class {
    constructor(modelsDir, configDir) {
        this._modelsDir = modelsDir;
        this._configDir = configDir;
    }

    get models() {
        return walk(this._modelsDir, {
            nodir: true,
            filter: item => item.path.endsWith('.js') && !item.path.endsWith('.obsolete.js')
        }).map(item => item.path.replace(`${this._modelsDir}/`, '').replace(/\.js$/g, ''));
    }

    model(name) {
        return {
            current: require(`${this._modelsDir}/${name}.js`),
            obsolete: fs.existsSync(`${this._modelsDir}/${name}.obsolete.js`) ? require(`${this._modelsDir}/${name}.obsolete.js`) : undefined
        };
    }

    get config() {
        return require(this._configDir);
    }
}