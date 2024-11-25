import * as vscode from 'vscode';
import * as utils from '../utils';
import fetch from '../fetch';
import path from 'path';
import settings from '../settings';
import treeView from './treeView';
import rWs from '../websocket/rWs';

export default class extends treeView<Record> {
    private records: Record[] = [];
    private pendingRecords: Record[] = [];

    constructor() {
        super('record', async ({ page, setPageCounter }) => {
            setPageCounter(1145141919810);
            if (this.pendingRecords.length) {
                while (this.pendingRecords.length) {
                    const pendingRecord = this.pendingRecords.shift()!;
                    var replace: boolean = false;
                    for (let i = 0; i < this.records.length; i++) {
                        if (this.records[i].id === pendingRecord.id) {
                            this.records[i] = pendingRecord;
                            replace = true;
                            break;
                        }
                    }
                    if (!replace) {
                        this.records.unshift(pendingRecord);
                    }
                }
                return this.records;
            }
            const response = await new fetch({ path: `/d/${settings.domain}/record?page=${page}`, addCookie: true }).start();
            this.records = [];
            for (const rdoc of response.json.rdocs) {
                this.records.push(new Record(rdoc, response.json.pdict[rdoc.pid], response.json.udict[rdoc.uid]));
            }
            return this.records;
        });

        new rWs((record) => {
            this.pendingRecords.push(record);
            this._onDidChangeTreeData.fire(undefined);
        }).start();
    }
}

export class Record extends vscode.TreeItem {
    constructor(rdoc: utils.RecordDoc, pdoc: utils.ProblemDoc | string, udoc: utils.UserDoc | string) {
        if (typeof pdoc !== 'string') {
            pdoc = pdoc.title;
        }
        if (typeof udoc !== 'string') {
            udoc = udoc.uname;
        }

        super(rdoc.score + ' ' + utils.statusName[rdoc.status], vscode.TreeItemCollapsibleState.None);
        this.id = rdoc._id;
        this.contextValue = 'record';
        if (rdoc.pid) {
            this.description = `P${rdoc.pid} ${pdoc}  ${udoc}`;
        }
        else {
            this.description = '*';
        }
        this.iconPath = path.join(__dirname, '..', '..', 'res', 'icons', utils.statusIcon[rdoc.status] + '.svg');
        const TooltipDoc = new vscode.MarkdownString();
        TooltipDoc.appendMarkdown(`- **Status**: ${utils.statusName[rdoc.status]}\n`);
        TooltipDoc.appendMarkdown(`- **User**: ${udoc}\n`);
        TooltipDoc.appendMarkdown(`- **Score**: ${rdoc.score}\n`);
        if (rdoc.time) { TooltipDoc.appendMarkdown(`- **Time**: ${utils.toTime(rdoc.time)}\n`); }
        if (rdoc.memory) { TooltipDoc.appendMarkdown(`- **Memory**: ${utils.toMemory(rdoc.memory)}\n`); }
        TooltipDoc.appendMarkdown(`- **Lang**: ${utils.languageDisplayName[rdoc.lang]}\n`);
        TooltipDoc.appendMarkdown(`- **Judge At**: ${utils.toRelativeTime(new Date(rdoc.judgeAt).getTime())}\n`);
        this.tooltip = TooltipDoc;
        this.command = {
            command: 'cyezoi.openT',
            title: 'Open Record',
            arguments: [rdoc._id],
        };
    }
}