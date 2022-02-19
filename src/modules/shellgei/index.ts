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

			const myInfoBody = { i: config.i };
			const myInfoOptions = { method: 'POST', body: JSON.stringify(myInfoBody), headers: { 'Content-Type': 'application/json' } };
			const myInfo = await fetch(`${config.apiUrl}/i`, myInfoOptions);
			const myInfoJson = await myInfo.json();
			const myId = myInfoJson.username;


			const acct = `@${myId}`;console.log(acct);


			const shellText = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct, '');

			const shellgeiBody = { code: shellText , images: [] };
			const shellgeiOptions = { method: 'POST', body: JSON.stringify(shellgeiBody), headers: { 'Content-Type': 'application/json' } };
			const shellgeiResult = await fetch(`https://websh.jiro4989.com/api/shellgei`, shellgeiOptions);
			const shellgeiResultJson = await shellgeiResult.json();
			const shellgeiResultText = shellgeiResultJson.stdout;


			msg.reply( shellgeiResultText , {
				immediate: true
			});
			return true;
		} else {
			return false;
		}
	}
}
