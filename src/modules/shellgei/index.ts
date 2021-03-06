import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import config from "@/config";
import fetch from 'node-fetch';
import * as buffer from "buffer";
import { Buffer } from "buffer";
import { randomUUID } from "crypto";




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

			let images: string[] = [];

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

			const imageSet = (async () => {
				if (msg.files == null || msg.files.length == 0) return;
				
				const promises = msg.files.map(async (file) => {
					const res = await fetch(file.url).then(res => res.buffer());
					const base64 = buffer.Buffer.from(res).toString('base64');
					images.push(base64);
					console.log("push image");
				});

				await Promise.all(promises)
			});


			const shellText = msg.text.replace('#シェル芸', '').replace('#shellgei', '').replace(acct, '').replace(hostnameat, '');

			const shellgeiURL = config.shellgeiUrl;


			if (shellText.length > maxInputLength) {
				msg.reply(`シェル芸は ${maxInputLength} 文字以内です。`);
				return true;
			}

			try {

				await imageSet();

				const shellgeiBody = { code: shellText, images };
				const shellgeiOptions = { method: 'POST', body: JSON.stringify(shellgeiBody), headers: { 'Content-Type': 'application/json' } };

				const shellgeiResult = await fetch(shellgeiURL, shellgeiOptions);

				if (!shellgeiResult.ok) {
					msg.reply(`エラーが発生しました。`);
				}

				const shellgeiResultJson: any = await shellgeiResult.json();
				const shellgeiResultStdOut = shellgeiResultJson.stdout;
				const shellgeiResultStdErr = shellgeiResultJson.stderr;

				const shellgeiResultText = shellgeiResultStdOut + shellgeiResultStdErr;

				const shellgeiResultImages = shellgeiResultJson.images;

				const image = uploadImage(shellgeiResultImages);




				if (shellgeiResultText === "") {
					msg.reply(`結果がありません`, {
						immediate: true,
						file: await image()
					});
					return true;
				}

				if (shellgeiResultText.length > maxOutLength) {
					let aftStr = shellgeiResultText.substr(0, maxOutLength - 30) + "\n...一部のみ表示しています";
					msg.reply(aftStr, {
						immediate: true,
						file: await image()
					});
					return true;
				} else {
					msg.reply(shellgeiResultText, {
						immediate: true,
						file: await image()
					});
					return true;
				}


			} catch (e) {
				console.log(e);
				msg.reply(`エラーが発生しました。\n${e}`, {
					immediate: true
				});
			}



			return true;
		} else {
			return false;
		}
	}
}
