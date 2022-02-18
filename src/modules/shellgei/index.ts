import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import acct from 'index';

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

			const shelltext = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct.toString(), '');
			msg.reply('PONG!' + shelltext, {
				immediate: true
			});
			return true;
		} else {
			return false;
		}
	}
}
