window.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');

    content.innerHTML = `<h1 id="title"></h1>
<vscode-button disabled icon="check" id="submitProblem">Submit</vscode-button>
<vscode-button disabled icon="refresh" id="refresh">Refresh</vscode-button>
<vscode-button disabled icon="send" id="openInProblemSet">Open in Problem Set</vscode-button>
<vscode-tabs selected-index="0">
    <vscode-tab-header slot="header">Problem</vscode-tab-header>
    <vscode-tab-panel>
        <div id="problem"></div>
    </vscode-tab-panel>
    <vscode-tab-header slot="header">Solution</vscode-tab-header>
    <vscode-tab-panel>
        <p id="solution">
            There is no solution available for this problem.
        </p>
    </vscode-tab-panel>
</vscode-tabs>`;

    const title = document.getElementById('title');
    const submitProblem = document.getElementById('submitProblem');
    const refresh = document.getElementById('refresh');
    const openInProblemSet = document.getElementById('openInProblemSet');
    const problem = document.getElementById('problem');
    const solution = document.getElementById('solution');

    window.onmessage = event => {
        const message = event.data;
        switch (message.command) {
            case 'problem':
                loading.style.display = 'none';
                content.style.display = '';

                title.innerText = '#' + message.data.pid + '. ' + message.data.title;

                submitProblem.onclick = () => {
                    vscode.postMessage({ command: 'submitProblem', data: [message.data.pid, message.data.tid] });
                };
                submitProblem.disabled = false;
                refresh.onclick = () => {
                    vscode.postMessage({ command: 'refresh' });
                    loading.style.display = 'flex';
                    content.style.display = 'none';
                };
                refresh.disabled = false;
                openInProblemSet.onclick = () => {
                    vscode.postMessage({ command: 'openP', data: [message.data.pid] });
                };
                openInProblemSet.disabled = message.data.tid === undefined;

                problem.innerHTML = parseMarkdown(message.data.markdownContent.zh);
                window.MathJax.typeset();
                renderPdf();
                const problemPre = problem.getElementsByTagName('pre');
                const problemEditors = [];
                for (let i = 0; i < problemPre.length; i++) {
                    const code = problemPre[i].innerText.trim();
                    const codeElement = document.createElement('div');
                    const copyButton = document.createElement('vscode-button');
                    copyButton.innerText = 'Copy';
                    copyButton.onclick = () => {
                        navigator.clipboard.writeText(code);
                        copyButton.innerText = 'Copied';
                        copyButton.disabled = true;
                        setTimeout(() => {
                            copyButton.innerText = 'Copy';
                            copyButton.disabled = false;
                        }, 1000);
                    };
                    codeElement.appendChild(copyButton);
                    const editorElement = document.createElement('div');
                    codeElement.appendChild(editorElement);
                    problemEditors.push(window.CodeMirror(editorElement, {
                        autoRefresh: true,
                        value: code,
                        readOnly: true,
                        theme: 'material',
                    }));
                    problemPre[i].parentNode.replaceChild(codeElement, problemPre[i]);
                }
                for (let i = 0; i < problemEditors.length; i++) {
                    problemEditors[i].setSize('100%', 'auto');
                }
                break;
            case 'solution':
                solution.innerHTML = '';
                if (message.data.psdocs.length === 0) {
                    solution.innerHTML = '<p>No solution yet.</p>';
                    break;
                }
                for (let i = 0; i < message.data.psdocs.length; i++) {
                    solution.innerHTML += `<vscode-badge style="background-color: var(--vscode-activityBarBadge-background);">${message.data.udict[message.data.psdocs[i].owner].uname}</vscode-badge>
                    <vscode-badge variant="counter">${message.data.psdocs[i].vote}</vscode-badge>`;
                    solution.innerHTML += `<p>${parseMarkdown(message.data.psdocs[i].content)}</p>`;
                    if (message.data.psdocs[i].reply.length > 0) {
                        const collapsible = document.createElement('vscode-collapsible');
                        solution.appendChild(collapsible);
                        collapsible.setAttribute('title', 'Reply');
                        for (let j = 0; j < message.data.psdocs[i].reply.length; j++) {
                            collapsible.innerHTML += `<div style="padding: 10px">
                            <vscode-badge>${message.data.udict[message.data.psdocs[i].reply[j].owner].uname}</vscode-badge>
                                ${parseMarkdown(message.data.psdocs[i].reply[j].content)}
                            </div>`;
                        }
                    }
                    solution.innerHTML += `<vscode-divider></vscode-divider>`;
                }
                window.MathJax.typeset();
                renderPdf();
                const solutionPre = solution.getElementsByTagName('pre');
                const solutionEditors = [];
                for (let i = 0; i < solutionPre.length; i++) {
                    const code = solutionPre[i].innerText.trim();
                    const codeElement = document.createElement('div');
                    const editorElement = document.createElement('div');
                    codeElement.appendChild(editorElement);
                    solutionEditors.push(window.CodeMirror(editorElement, {
                        autoRefresh: true,
                        value: code,
                        readOnly: true,
                        theme: 'material',
                        lineNumbers: true,
                        mode: 'text/x-c++src',
                        gutters: [
                            'CodeMirror-linenumbers',
                            'CodeMirror-foldgutter',
                        ],
                        foldGutter: true,
                        styleActiveLine: true,
                    }));
                    solutionPre[i].parentNode.replaceChild(codeElement, solutionPre[i]);
                }
                for (let i = 0; i < solutionEditors.length; i++) {
                    solutionEditors[i].setSize('100%', 'auto');
                }
                break;
            default:
                break;
        }
    };
});
