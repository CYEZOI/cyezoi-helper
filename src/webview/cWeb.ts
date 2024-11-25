import { io } from '../io';
import fetch from '../fetch';
import settings from '../settings';
import webview from './webview';

export default class cWeb extends webview {
    constructor(extensionPath: string, tid: string, homework: boolean = false) {
        const type: string = homework ? 'homework' : 'contest';
        super({
            name: 'contest',
            extensionPath,
            data: { tid },
            getTitle: () => `T${tid}`,
            fetchData: ({ postMessage, addTempFile, parseMarkdown }) => {
                new fetch({
                    path: `/d/${settings.domain}/${type}/${tid}`, addCookie: true
                }).start().then(async (contestDetail) => {
                    if (contestDetail?.json !== undefined) {
                        const data = contestDetail.json;
                        data.tdoc.content = await parseMarkdown(data.tdoc.content, extensionPath);
                        for (const [id, url] of Object.entries(data.tdoc.content.fetchData)) {
                            addTempFile(id);
                        }
                        const message = {
                            command: 'info',
                            data,
                        };
                        postMessage(message);
                    }
                }).catch(async (e: Error) => {
                    io.error(e.message);
                });
                new fetch({
                    path: `/d/${settings.domain}/${type}/${tid}/scoreboard`, addCookie: true
                }).start().then(async (contestDetail) => {
                    if (contestDetail?.json !== undefined) {
                        const message = {
                            command: 'scoreboard',
                            data: contestDetail.json,
                        };
                        postMessage(message);
                    }
                }).catch(async (e: Error) => {
                    io.error(e.message);
                });
            },
        });
    }
}