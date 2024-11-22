window.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');

    content.innerHTML = `<style>
.icon {
    font-family: hydro-icons !important;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
}

.data-table {
    width: 100%;
    table-layout: fixed;
    white-space: nowrap;
    font-size: .8125rem;
    font-weight: 400
}

.data-table th {
    font-size: .875rem
}

.data-table tr {
    border-top: 1px solid #2b2b2b;
    border-bottom: 1px solid #2b2b2b
}

.data-table tr:nth-child(2n) {
    background-color: #1b1b1b
}

.data-table tr.highlight {
    background: #fae8ed
}

.data-table.is--full-row tr {
    cursor: pointer
}

.data-table.is--full-row tr:hover {
    background: #e7f1f9
}

.data-table thead>tr {
    color: #888;
    border-top: 0;
    border-bottom: 1px solid #2b2b2b;
}

.data-table td,
.data-table th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.data-table td {
    padding: .3125rem .625rem
}

.data-table th {
    padding: .8125rem .625rem
}

.data-table .empty-row {
    color: #aaa;
    font-size: .8125rem
}

.compiler-text {
    padding: 1.25rem 0;
    font-size: .8125rem
}

.compiler-text:empty {
    display: none
}

.compiler-text-mask {
    display: none
}

.col--case { width: 4.375rem; }
.col--time { width: 4.375rem; }
.col--memory { width: 6.25rem; }

.col--case,
.col--status {
    border-right: 1px solid #e4e4e4
}

.subtask {
    background-color: #fff !important;
}

.subtask td {
    padding-top: 0;
    padding-bottom: 0
}

.record-status--text.pass { color: #25ad40 !important; }
.record-status--text.fail { color: #fb5555 !important; }
.record-status--text.progress { color: #f39800 !important; }
.record-status--text.ignored, .record-status--text.pending { color: #9fa0a0 !important; }

.record-status--icon { display: inline-block; width: 1.15em; }
.record-status--icon.pass:before { content: "\ea0a"; color: #25ad40; }
.record-status--icon.fail:before { content: "\ea0e"; color: #fb5555; }
.record-status--icon.progress:before { content: "\ea2d"; color: #f39800; }
.record-status--icon.ignored:before { content: "\ea0e"; color: #9fa0a0; }
.record-status--icon.pending:before { content: "\ea4a"; color: #9fa0a0; }

.record-status--border { border-left: .1875rem solid transparent; }
.record-status--border.pass { border-left: .1875rem solid #2ac649; }
.record-status--border.fail { border-left: .1875rem solid #fb6666; }
.record-status--border.progress { border-left: .1875rem solid #ffa50f; }
.record-status--border.ignored, .record-status--border.pending { border-left: .1875rem solid #a9aaaa; }

.record-status--background { color: #fff; }
.record-status--background.pass { background: #25ad40; }
.record-status--background.fail { background: #fb5555; }
.record-status--background.progress { background: #f39800; }
.record-status--background.ignored, .record-status--background.pending { background: #9fa0a0; }
</style>
<div id="detail"></div>`;

    const detail = document.getElementById("detail");

    window.onmessage = event => {
        loading.style.display = 'none';
        content.style.display = '';
        detail.innerHTML = event.data.status_html;
    };
});
