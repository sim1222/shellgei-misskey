import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
const promiseRetry = require('promise-retry');
import * as chalk from "chalk/index";
import config from "@/config";
import fetch from 'node-fetch';

export default class extends Module {
	public readonly name = 'shellgei';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (!msg.text) return false;
		if (msg.text && msg.text.includes('#シェル芸') || msg.text.includes('#shellgei')) {

			const myinfo = await fetch(`${config.apiUrl}/i`);
			const myinfoJson = await myinfo.json();
			const myid = myinfoJson.id;

			const acct = `@${myid}`;

			const shelltext = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct, '');
			msg.reply('PONG!' + shelltext, {
				immediate: true
			});
			return true;
		} else {
			return false;
		}
	}
}
