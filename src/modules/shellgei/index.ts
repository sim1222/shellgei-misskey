import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
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
			const myInfoJson: any = await myInfo.json();
			const myId = myInfoJson.username;


			const acct = `@${myId}`;
			const hostname = config.host.replace(/^https?:\/\//, '').replace(/\/$/, '');
			const hostnameat = `@${hostname}`;




			const shellText = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct, '').replace(hostnameat, '');
			this.log(shellText);
			const shellgeiBody = { code: shellText , images: [] };
			const shellgeiOptions = { method: 'POST', body: JSON.stringify(shellgeiBody), headers: { 'Content-Type': 'application/json' } };
			const shellgeiURL = `http://localhost:29999/api/shellgei`;
			await (async () => {
				try {
					const shellgeiResult = await fetch(shellgeiURL, shellgeiOptions);
					const shellgeiResultJson: any = await shellgeiResult.json();
					const shellgeiResultStdOut = shellgeiResultJson.stdout;
					const shellgeiResultStdErr = shellgeiResultJson.stderr;
					msg.reply(shellgeiResultStdOut + shellgeiResultStdErr, {
						immediate: true
					});

				} catch (e) {
					console.log(e);
					msg.reply(`エラーが発生しました。\n${e}`, {
						immediate: true
					});
				}
			})();


			return true;
		} else {
			return false;
		}
	}
}
