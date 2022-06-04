import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import config from "@/config";
import fetch from 'node-fetch';
import * as buffer from "buffer";
import {Buffer} from "buffer";
import {randomUUID} from "crypto";




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


			const maxInputLength = 280


			const shellText = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct, '').replace(hostnameat, '');
			this.log(shellText);
			const shellgeiBody = { code: shellText , images: [] };
			const shellgeiOptions = { method: 'POST', body: JSON.stringify(shellgeiBody), headers: { 'Content-Type': 'application/json' } };
			const shellgeiURL = config.shellgeiUrl;



			const maxOutLength = 8192;

			const uploadImage = (shellgeiResultImages: any) => async () => {
				if (shellgeiResultImages.length === 0) return;
				const data = Buffer.from(shellgeiResultImages[0].image, 'base64');
				const file = await this.ai.upload(data, {
					filename: `${randomUUID().toString()}.${shellgeiResultImages[0].format}`,
					contentType: `image/${shellgeiResultImages[0].format}`
				});
				return file;
			}



			await (async () => {
				try {

					if (shellText.length > maxInputLength) {
						msg.reply(`シェル芸は ${maxInputLength} 文字以内です。`);
						return;
					}


					const shellgeiResult = await fetch(shellgeiURL, shellgeiOptions);
					const shellgeiResultJson: any = await shellgeiResult.json();
					const shellgeiResultStdOut = shellgeiResultJson.stdout;
					const shellgeiResultStdErr = shellgeiResultJson.stderr;

					const shellgeiResultImages = shellgeiResultJson.images;

					const image = await uploadImage(shellgeiResultImages);


					if (shellgeiResultStdOut === "" && shellgeiResultStdErr === ""){
						msg.reply(`結果がありません`, {
							immediate: true,
							file: await image()
						});
						return;
					}

					if (shellgeiResultStdOut + shellgeiResultStdErr > maxOutLength) {
						let befStr = shellgeiResultStdOut + shellgeiResultStdErr;
						let aftStr = befStr.substr(0, maxOutLength - 16) + "...";
						aftStr = aftStr + "一部のみ表示しています";
						msg.reply(aftStr, {
							immediate: true,
							file: await image()
						});
						return;
					}	else {
						msg.reply(shellgeiResultStdOut + shellgeiResultStdErr, {
							immediate: true,
							file: await image()
						});
						return;
					}


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
