import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
const promiseRetry = require('promise-retry');
import * as chalk from "chalk/index";
import config from "@/config";
import * as request from "request-promise-native";
import {account} from "../../../test/__mocks__/account";

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


		const fetch = request.post(`${config.apiUrl}/i`, {
			json: {
				i: config.i
			}})

			const acct = `@${fetch.username}`;



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
