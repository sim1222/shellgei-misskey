import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import serifs from '@/serifs';
import config from '@/config';
import json from '@/json';

export default class extends Module {
	public readonly name = '';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.text.includes('天気') && msg.text.includes('天気')) {
			
			msg.reply('PONG!', {
				immediate: true
			});
			return true;
		} else {
			return false;
		}
	}
}
