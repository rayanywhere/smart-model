#!/usr/bin/env node
const opts = require('opts');
const path = require('path');

opts.parse([
	{
		short: 'c',
		long: 'config-dir',
		description: 'config directory',
		value: true,
		required: true
	},
	{
		short: 'm',
		long: 'models-dir',
		description: 'models directory',
		value: true,
		required: true
	},
	{
		short: 'e',
		long: 'environment',
		description: 'environment variable',
		value: true,
		required: true
	},
	{
		short: 'a',
		long: 'action',
		description: 'action : diagnose|setup|upgrade',
		value: true,
		required: true
	}
], true);

const params = {
	configDir: path.resolve(opts.get('config-dir')),
	modelsDir: path.resolve(opts.get('models-dir')),
	environment: opts.get('environment')
};

try {
	switch(opts.get('action')) {
		case 'diagnose':
			require('./diagnose')(params);
			break;
		case 'setup':
			require('./setup')(params);
			break;
		case 'upgrade':
			require('./upgrade')(params);
			break;
		default:
			opts.help();
			break;
	}
}
catch(err) {
	console.error(err.stack);
	process.exit(-1);
}