const fs = require('fs');
const walk = require('klaw-sync');

module.exports = class {
    constructor(environment, modelsDir, configDir) {
        this._environment = environment;
        this._modelsDir = modelsDir;
        this._configDir = configDir;
    }

    get models() {
        return walk(this._modelsDir, {
            nodir: true,
            filter: item => item.path.endsWith('.js') && !item.path.endsWith('.obsolete.js')
        }).map(item => item.path.replace(`${this._modelsDir}/`, '').replace(/\.js$/g, '').replace(/\//g, '.'));
    }

    model(name) {
        return {
            current: require(`${this._modelsDir}/${name.replace(/\./g, '/')}.js`),
            obsolete: fs.existsSync(`${this._modelsDir}/${name.replace(/\./g, '/')}.obsolete.js`) ? require(`${this._modelsDir}/${name.replace(/\./g, '/')}.obsolete.js`) : undefined
        };
    }

    get config() {
        return require(this._configDir)[this._environment];
    }
}