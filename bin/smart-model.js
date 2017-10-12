#!/usr/bin/env node
const opts = require('opts');

opts.parse([], [
	{name: 'command', required: true},
	{name: 'param', required: false}
], true);

try {
	switch(opts.arg('command')) {
		case 'init':
			require('./init')();
			break;
		case 'diagnose':
			require('./diagnose')();
			break;
		case 'setup':
			require('./setup')(opts.arg('param'));
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