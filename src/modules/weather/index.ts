import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import config from '@/config';
import json from 'json';
import fetch from 'node-fetch';

export default class extends Module {
	public readonly name = 'weather';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.text.includes('天気') && msg.text.includes('天気')) {
			
			
			const weather = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${config.weatherlocation}.json`);
			const weatherJson = await weather.json();
			
			const todaydate = new Date(weatherJson[0].timeSeries[0].timeDefines[0]);
			const todayweather = weatherJson[0].timeSeries[0].areas[1].weathers[0];
			const todaytemphigh = weatherJson[0].timeSeries[2].areas[1].temps[1];
			const todaytemplow = weatherJson[0].timeSeries[2].areas[1].temps[0];

			msg.reply(todaydate + 'の天気は\n' + todayweather + `\n` + '最高気温' + todaytemphigh + '℃、最低気温' + todaytemplow + `℃です！`, {
				immediate: true
				});

			
			


			return true;
		} else {
			return false;
		}
	}
}
