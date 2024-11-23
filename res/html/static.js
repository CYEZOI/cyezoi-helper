const statusName = {
    0: 'Waiting',
    1: 'Accepted',
    2: 'Wrong Answer',
    3: 'Time Exceeded',
    4: 'Memory Exceeded',
    5: 'Output Exceeded',
    6: 'Runtime Error',
    7: 'Compile Error',
    8: 'System Error',
    9: 'Cancelled',
    10: 'Unknown Error',
    11: 'Hacked',
    20: 'Running',
    21: 'Compiling',
    22: 'Fetched',
    30: 'Ignored',
    31: 'Format Error',
    32: 'Hack Successful',
    33: 'Hack Unsuccessful'
};
const statusShortName = {
    1: 'AC',
    2: 'WA',
    3: 'TLE',
    4: 'MLE',
    5: 'OLE',
    6: 'RE',
    7: 'CE',
    8: 'SE',
    9: 'IGN',
    11: 'HK',
    30: 'IGN',
    31: 'FE'
};
const statusIcon = {
    0: 'pending',
    1: 'pass',
    2: 'fail',
    3: 'fail',
    4: 'fail',
    5: 'fail',
    6: 'fail',
    7: 'fail',
    8: 'fail',
    9: 'ignored',
    10: 'fail',
    11: 'fail',
    20: 'progress',
    21: 'progress',
    22: 'progress',
    30: 'ignored',
    31: 'ignored',
    32: 'pass',
    33: 'fail'
};
const statusEnded = {
    0: false,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    20: false,
    21: false,
    22: false,
    30: true,
    31: true,
    32: true,
    33: true
};
const languageDisplayName = {
    "bash": "Bash",
    "c": "C",
    "cc": "C++",
    "cc.cc98": "C++98",
    "cc.cc98o2": "C++98(O2)",
    "cc.cc11": "C++11",
    "cc.cc11o2": "C++11(O2)",
    "cc.cc14": "C++14",
    "cc.cc14o2": "C++14(O2)",
    "cc.cc17": "C++17",
    "cc.cc17o2": "C++17(O2)",
    "cc.cc20": "C++20",
    "cc.cc20o2": "C++20(O2)",
    "pas": "Pascal",
    "java": "Java",
    "kt": "Kotlin",
    "kt.jvm": "Kotlin/JVM",
    "py": "Python",
    "py.py2": "Python 2",
    "py.py3": "Python 3",
    "py.pypy3": "PyPy3",
    "php": "PHP",
    "rs": "Rust",
    "hs": "Haskell",
    "js": "NodeJS",
    "go": "Golang",
    "rb": "Ruby",
    "cs": "C#",
    "r": "R",
};
const contestRuleName = {
    "acm": "ACM/ICPC",
    "oi": "OI",
    "ioi": "IOI",
    "strictioi": "IOI(Strict)",
    "ledo": "Ledo",
    "homework": "Assignment",
};
const scoreColor = [
    '#ff4f4f',
    '#ff694f',
    '#f8603a',
    '#fc8354',
    '#fa9231',
    '#f7bb3b',
    '#ecdb44',
    '#e2ec52',
    '#b0d628',
    '#93b127',
    '#25ad40',
];

const getUnit = (data, unit) => {
    if (data >= 1 && data < 2) { return data + ' ' + unit; }
    else { return data + ' ' + unit + 's'; }
};
const toTime = (time) => {
    if (time < 1000) { return time + 'ms'; } time = Math.floor(time / 1000);
    if (time < 60) { return time + 's'; } time = Math.floor(time / 60);
    if (time < 60) { return time + getUnit(time, 'minute'); } time = Math.floor(time / 60);
    if (time < 24) { return time + getUnit(time, 'hour'); } time = Math.floor(time / 24);
    if (time < 30) { return time + getUnit(time, 'day'); } time = Math.floor(time / 30);
    if (time < 12) { return 'about ' + Math.floor(time) + getUnit(time, 'month'); } time = Math.floor(time / 12);
    return 'about ' + Math.floor(time) + getUnit(time, 'year');
};
const toMemory = (time) => {
    if (time < 1024) { return time + 'B'; } time = Math.floor(time / 1024);
    if (time < 1024) { return time + 'KiB'; } time = Math.floor(time / 1024);
    if (time < 1024) { return time + 'MiB'; } time = Math.floor(time / 1024);
    return time + 'GiB';
};
const toRelativeTime = (time) => {
    const now = new Date().getTime();
    const suffix = (time > now ? 'later' : 'ago');
    var delta = Math.floor(Math.abs(now - time) / 1000);
    if (delta < 60) { return 'just now'; } delta = Math.floor(delta / 60);
    if (delta < 60) { return delta + getUnit(delta, 'minute') + ' ' + suffix; } delta = Math.floor(delta / 60);
    if (delta < 24) { return delta + getUnit(delta, 'hour') + ' ' + suffix; } delta = Math.floor(delta / 24);
    if (delta < 30) { return delta + getUnit(delta, 'day') + ' ' + suffix; } delta = Math.floor(delta / 30);
    if (delta < 12) { return 'about ' + delta + getUnit(delta, 'month') + ' ' + suffix; } delta = Math.floor(delta / 12);
    return 'about ' + delta + getUnit(delta, 'year') + ' ' + suffix;
};
const formatString = (str) => {
    if (typeof str === 'string') {
        return str;
    }
    var message = str.message;
    for (var i = 0; i < str.params.length; i++) {
        message = message.replace('{' + i + '}', str.params[i]);
    }
    return message;
};
const parseMarkdown = ({ content, fetchData }) => {
    return content.replace(/\{\{([a-z0-9]+)\}\}/g, (match, id) => {
        return fetchData[id];
    });
};
const renderPdf = async () => {
    const pdfData = document.getElementsByClassName('pdf');
    for (let i = 0; i < pdfData.length; i++) {
        const sourceUrl = pdfData[i].getAttribute('data-src');
        if (!sourceUrl) {
            continue;
        }
        pdfData[i].style.width = '100%';
        const pdf = await pdfjsLib.getDocument(sourceUrl).promise;

        for (let page = 1; page <= pdf.numPages; page++) {
            const canvas = document.createElement('canvas');
            pdfData[i].appendChild(canvas);

            const pageData = await pdf.getPage(page);
            const viewport = pageData.getViewport({
                scale: document.body.clientWidth / pageData.getViewport({ scale: 1.0 }).width,
            });


            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            pageData.render({
                canvasContext: canvas.getContext('2d'),
                viewport,
            });
        }

        pdfData[i].removeAttribute('data-src');
    }
};
const renderCode = () => {
    const pres = document.getElementsByTagName('pre');
    const editors = [];
    for (let i = 0; i < pres.length; i++) {
        if (pres[i].className.indexOf('CodeMirror') !== -1) {
            continue;
        }
        const code = pres[i].innerText.trim();
        const codeElement = document.createElement('div');
        const copyButtonContainer = document.createElement('div');
        copyButtonContainer.style.position = 'absolute';
        copyButtonContainer.style.width = 'calc(100% - 40px)';
        copyButtonContainer.style.display = 'flex';
        copyButtonContainer.style.flexDirection = 'row-reverse';
        copyButtonContainer.style.zIndex = '3';
        copyButtonContainer.style.pointerEvents = 'none';
        const copyButton = document.createElement('vscode-button');
        copyButton.innerText = 'Copy';
        copyButton.style.pointerEvents = 'auto';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(code);
            copyButton.innerText = 'Copied';
            copyButton.disabled = true;
            setTimeout(() => {
                copyButton.innerText = 'Copy';
                copyButton.disabled = false;
            }, 1000);
        };
        copyButtonContainer.appendChild(copyButton);
        codeElement.appendChild(copyButtonContainer);
        const editorElement = document.createElement('div');
        codeElement.appendChild(editorElement);
        editors.push(window.CodeMirror(editorElement, {
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
        pres[i].parentNode.replaceChild(codeElement, pres[i]);
    }
    for (let i = 0; i < editors.length; i++) {
        editors[i].setSize('100%', 'auto');
    }
};

const vscode = acquireVsCodeApi();

window.addEventListener('DOMContentLoaded', () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs';
});
