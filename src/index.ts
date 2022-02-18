// AiOS bootstrapper

import 'module-alias/register';

import * as chalk from 'chalk';
import * as request from 'request-promise-native';
const promiseRetry = require('promise-retry');

import 藍 from './ai';
import config from './config';
import _log from './utils/log';
const pkg = require('../package.json');

import CoreModule from './modules/core';
import PingModule from './modules/ping';
import FollowModule from './modules/follow';
import ShellGeiModule from './modules/shellgei';

console.log('   __    ____  _____  ___ ');
console.log('  /__\\  (_  _)(  _  )/ __)');
console.log(' /(__)\\  _)(_  )(_)( \\__ \\');
console.log('(__)(__)(____)(_____)(___/\n');

function log(msg: string): void {
	_log(`[Boot]: ${msg}`);
}

log(chalk.bold(`Ai v${pkg._v}`));

promiseRetry(retry => {
	log(`Account fetching... ${chalk.gray(config.host)}`);

	// アカウントをフェッチ
	return request.post(`${config.apiUrl}/i`, {
		json: {
			i: config.i
		}
	}).catch(retry);
}, {
	retries: 3
}).then(account => {
	const acct = `@${account.username}`;

	log(chalk.green(`Account fetched successfully: ${chalk.underline(acct)}`));

	log('Starting AiOS...');

	// 藍起動
	new 藍(account, [
		new CoreModule(),
		new PingModule(),
		new FollowModule(),
		new ShellGeiModule(),
	]);
}).catch(e => {
	log(chalk.red('Failed to fetch the account'));
});
