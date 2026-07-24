// ===== 思維拼圖 — app.js v2 =====

// ===== Framework Question Generators =====
const FRAMEWORKS = {
    '5w1h': {
        title: '5W1H — 全面提問法',
        questions: [
            (topic) => `關於「${topic}」，你想要解決什麼問題？`,
            (topic) => `為什麼「${topic}」對你來說很重要？`,
            (topic) => `這件事情的來龍去脈是什麼？`,
            (topic) => `涉及哪些人或角色？`,
            (topic) => `你的具體目標是什麼？要做到什麼程度？`,
            (topic) => `要如何實現？有什麼具體方法或步驟？`,
            (topic) => `需要多少時間？預算或資源有多少？`,
            (topic) => `還有沒有其他沒提到的面向？`,
        ]
    },
    'swot': {
        title: 'SWOT — 優勢劣勢機會威脅',
        questions: [
            (topic) => `以「${topic}」來說，你認為最大的優勢是什麼？`,
            (topic) => `你的弱點或不足之處在哪裡？`,
            (topic) => `現在有什麼機會可以利用？`,
            (topic) => `潛在的威脅或風險有哪些？`,
            (topic) => `你的核心競爭力是什麼？別人沒有的？`,
            (topic) => `哪些劣勢其實可以轉化為優勢？`,
            (topic) => `如果錯過這個機會，會怎麼樣？`,
            (topic) => `總結來說，你認為下一步該怎麼走？`,
        ]
    },
    'hats': {
        title: '六頂思考帽 — 多角度思考',
        questions: [
            (topic) => `白帽：關於「${topic}」，你已經掌握了哪些事實和數據？`,
            (topic) => `紅帽：直覺告訴你什麼？你的第一感受是什麼？`,
            (topic) => `黑帽：哪裡可能出錯？有哪些風險和問題？`,
            (topic) => `黃帽：正面來看，有哪些好處和機會？`,
            (topic) => `綠帽：有沒有創新的想法？跳出框架的解法？`,
            (topic) => `藍帽：整體來說，下一步的行動計畫是什麼？`,
        ]
    },
    'free': {
        title: '自由對話 — 隨意問答',
        questions: [
            (topic) => `你為什麼會想到「${topic}」？`,
            (topic) => `你對這個主題的第一印象是什麼？`,
            (topic) => `你想深入探討哪個面向？`,
            (topic) => `有沒有什麼讓你困惑的地方？`,
            (topic) => `還有什麼想補充的嗎？`,
        ]
    }
};

// ===== Data Layer =====
const STORAGE_KEY = 'thought-puzzle-data';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { fragments: [], tags: [] };
    } catch { return { fragments: [], tags: [] }; }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let appData = loadData();

// ===== DOM refs =====
const $ = id => document.getElementById(id);

// Nav
const navTabs = document.querySelectorAll('.nav-tab');
const panels = {
    input: $('panelInput'),
    board: $('panelBoard'),
    guide: $('panelGuide'),
    merge: $('panelMerge')
};

// Input
const thoughtInput = $('thoughtInput');
const tagInput = $('tagInput');
const tagBtns = $('tagBtns');
const statusSelect = $('statusSelect');
const addBtn = $('addBtn');

// Board
const puzzleBoard = $('puzzleBoard');
const emptyState = $('emptyState');
const totalBadge = $('totalBadge');
const filterStatus = $('filterStatus');
const filterTag = $('filterTag');
const searchInput = $('searchInput');
const progressFill = $('progressFill');
const progressText = $('progressText');

// Guide
const frameworkSelect = $('frameworkSelect');
const topicInput = $('topicInput');
const startGuideBtn = $('startGuideBtn');
const dialogArea = $('dialogArea');
const dialogMessages = $('dialogMessages');
const guideReplyInput = $('guideReplyInput');
const guideReplyBtn = $('guideReplyBtn');
const nextQuestionBtn = $('nextQuestionBtn');
const skipQuestionBtn = $('skipQuestionBtn');
const saveDialogBtn = $('saveDialogBtn');
const endDialogBtn = $('endDialogBtn');

// Merge
const mergeList = $('mergeList');
const mergeBtn = $('mergeBtn');
const exportBtn = $('exportBtn');
const mergeResult = $('mergeResult');
const mergeContent = $('mergeContent');
const copyBtn = $('copyBtn');

// Footer
const exportJsonBtn = $('exportJsonBtn');
const importJsonBtn = $('importJsonBtn');
const importFile = $('importFile');
const clearAllBtn = $('clearAllBtn');

// Modal
const editModal = $('editModal');
const editContent = $('editContent');
const editTags = $('editTags');
const editStatus = $('editStatus');
const saveEditBtn = $('saveEditBtn');
const cancelEditBtn = $('cancelEditBtn');

// ===== Tab Navigation =====
let currentTab = 'input';

function switchTab(tabName) {
    currentTab = tabName;
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    Object.entries(panels).forEach(([key, el]) => el.classList.toggle('active', key === tabName));
}

navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// ===== Tag Management =====
let selectedTags = [];

function renderTagChips() {
    tagBtns.innerHTML = '';
    const allTags = getAllTags();
    allTags.forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip' + (selectedTags.includes(tag) ? ' active' : '');
        chip.textContent = tag;
        chip.onclick = () => {
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
            renderTagChips();
        };
        tagBtns.appendChild(chip);
    });
}

function getAllTags() {
    const tagSet = new Set(appData.tags || []);
    appData.fragments.forEach(f => (f.tags || []).forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
}

function updateFilterTags() {
    const current = filterTag.value;
    const allTags = getAllTags();
    filterTag.innerHTML = '<option value="">全部標籤</option>';
    allTags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        filterTag.appendChild(opt);
    });
    filterTag.value = allTags.includes(current) ? current : '';
}

// ===== Add Fragment =====
function addFragment(overrides = {}) {
    const content = overrides.content || thoughtInput.value.trim();
    if (!content) { if (!overrides.content) thoughtInput.focus(); return null; }

    const tags = overrides.tags || (() => {
        const raw = tagInput.value.trim();
        const result = [...selectedTags];
        if (raw) {
            raw.split(/[,，]/).forEach(t => {
                const td = t.trim();
                if (td && !result.includes(td)) result.push(td);
            });
            tagInput.value = '';
        }
        return result;
    })();

    const fragment = {
        id: overrides.id || generateId(),
        content,
        tags,
        status: overrides.status || statusSelect.value,
        createdAt: overrides.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: overrides.source || '手動輸入',
        conversationId: overrides.conversationId || null
    };

    appData.fragments.unshift(fragment);
    tags.forEach(t => {
        if (!appData.tags) appData.tags = [];
        if (!appData.tags.includes(t)) appData.tags.push(t);
    });

    saveData(appData);

    if (!overrides.content) {
        thoughtInput.value = '';
        selectedTags = [];
        statusSelect.value = '靈感';
    }

    render();
    if (!overrides.content) thoughtInput.focus();
    return fragment;
}

// ===== Render Board =====
function getFilteredFragments() {
    let frags = [...appData.fragments];
    const status = filterStatus.value;
    const tag = filterTag.value;
    const search = searchInput.value.trim().toLowerCase();

    if (status) frags = frags.filter(f => f.status === status);
    if (tag) frags = frags.filter(f => (f.tags || []).includes(tag));
    if (search) frags = frags.filter(f => f.content.toLowerCase().includes(search));
    return frags;
}

function renderBoard() {
    const frags = getFilteredFragments();
    puzzleBoard.innerHTML = '';
    emptyState.classList.toggle('hidden', frags.length > 0);
    totalBadge.textContent = appData.fragments.length;

    frags.forEach(f => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.status = f.status;

        const time = new Date(f.createdAt);
        const timeStr = time.toLocaleDateString('zh-TW') + ' ' +
            time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

        const tagsHtml = (f.tags || []).map(t => `<span class="piece-tag">#${t}</span>`).join('');
        const statusIcon = f.status === '靈感' ? '💡' : f.status === '待擴展' ? '🔍' : '✅';

        piece.innerHTML = `
            <div class="piece-header">
                <span class="piece-status ${f.status}">${statusIcon} ${f.status}</span>
                <div class="piece-actions">
                    <button class="edit-btn" title="編輯" data-id="${f.id}">✏️</button>
                    <button class="status-toggle" title="切換狀態" data-id="${f.id}">🔄</button>
                    <button class="delete-btn" title="刪除" data-id="${f.id}">🗑️</button>
                </div>
            </div>
            <div class="piece-content">${escapeHtml(f.content)}</div>
            <div class="piece-tags">${tagsHtml}</div>
            <div class="piece-time">${timeStr}</div>
        `;

        piece.querySelector('.edit-btn').onclick = (e) => { e.stopPropagation(); openEditModal(f.id); };
        piece.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteFragment(f.id); };
        piece.querySelector('.status-toggle').onclick = (e) => { e.stopPropagation(); cycleStatus(f.id); };

        puzzleBoard.appendChild(piece);
    });
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

// ===== Fragment Actions =====
function deleteFragment(id) {
    if (!confirm('確定要刪除這塊拼圖嗎？')) return;
    appData.fragments = appData.fragments.filter(f => f.id !== id);
    saveData(appData);
    render();
}

function cycleStatus(id) {
    const f = appData.fragments.find(f => f.id === id);
    if (!f) return;
    const order = ['靈感', '待擴展', '已完成'];
    const idx = order.indexOf(f.status);
    f.status = order[(idx + 1) % order.length];
    f.updatedAt = new Date().toISOString();
    saveData(appData);
    render();
}

// ===== Edit Modal =====
let editingId = null;

function openEditModal(id) {
    const f = appData.fragments.find(f => f.id === id);
    if (!f) return;
    editingId = id;
    editContent.value = f.content;
    editTags.value = (f.tags || []).join(', ');
    editStatus.value = f.status;
    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editingId = null;
    editModal.classList.add('hidden');
}

function saveEdit() {
    if (!editingId) return;
    const f = appData.fragments.find(fg => fg.id === editingId);
    if (!f) return;

    f.content = editContent.value.trim();
    f.tags = editTags.value.split(/[,，]/).map(t => t.trim()).filter(Boolean);
    f.status = editStatus.value;
    f.updatedAt = new Date().toISOString();

    f.tags.forEach(t => {
        if (!appData.tags) appData.tags = [];
        if (!appData.tags.includes(t)) appData.tags.push(t);
    });

    saveData(appData);
    closeEditModal();
    render();
}

// ===== Progress =====
function renderProgress() {
    const total = appData.fragments.length;
    const done = appData.fragments.filter(f => f.status === '已完成').length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    progressFill.style.width = pct + '%';
    progressText.textContent = `${done} / ${total} 已完成`;
}

// ===== Merge =====
function renderMergeList() {
    mergeList.innerHTML = '';
    const sorted = [...appData.fragments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    sorted.forEach(f => {
        const item = document.createElement('label');
        item.className = 'merge-item';
        const se = f.status === '靈感' ? '💡' : f.status === '待擴展' ? '🔍' : '✅';
        item.innerHTML = `
            <input type="checkbox" value="${f.id}" class="merge-check">
            <span class="merge-item-label">${escapeHtml(f.content.substring(0, 55))}${f.content.length > 55 ? '…' : ''}</span>
            <span class="merge-item-tag">${se} ${(f.tags || []).map(t => '#' + t).join(' ')}</span>
        `;
        mergeList.appendChild(item);
    });
    document.querySelectorAll('.merge-check').forEach(cb => {
        cb.addEventListener('change', updateMergeBtn);
    });
}

function updateMergeBtn() {
    const checked = document.querySelectorAll('.merge-check:checked').length;
    mergeBtn.disabled = checked === 0;
    exportBtn.disabled = checked === 0;
}

function getSelectedFragments() {
    const ids = [...document.querySelectorAll('.merge-check:checked')].map(cb => cb.value);
    return ids.map(id => appData.fragments.find(f => f.id === id)).filter(Boolean);
}

function mergeFragments() {
    const selected = getSelectedFragments();
    if (selected.length === 0) return;

    const sorted = selected.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let output = `# 🧩 思維拼圖 — 整併輸出\n\n`;
    output += `> 整併時間：${new Date().toLocaleString('zh-TW')}\n`;
    output += `> 碎片數量：${sorted.length}\n\n---\n\n`;

    sorted.forEach((f, i) => {
        const tags = (f.tags || []).map(t => '`#' + t + '`').join(' ');
        const si = f.status === '靈感' ? '💡' : f.status === '待擴展' ? '🔍' : '✅';
        output += `## ${si} 碎片 ${i + 1}\n\n`;
        if (tags) output += `${tags}\n\n`;
        output += `${f.content}\n\n---\n\n`;
    });

    output += `\n*共 ${sorted.length} 塊碎片整併而成*\n`;
    mergeContent.textContent = output;
    mergeResult.classList.remove('hidden');
}

function exportMarkdown() {
    const selected = getSelectedFragments();
    if (selected.length === 0) return;

    const sorted = selected.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let md = `# 🧩 思維拼圖 — 整併輸出\n\n`;
    md += `> 整併時間：${new Date().toLocaleString('zh-TW')}\n`;
    md += `> 碎片數量：${sorted.length}\n\n---\n\n`;

    sorted.forEach((f, i) => {
        const tags = (f.tags || []).map(t => '`#' + t + '`').join(' ');
        const si = f.status === '靈感' ? '💡' : f.status === '待擴展' ? '🔍' : '✅';
        md += `## ${si} 碎片 ${i + 1}\n\n`;
        if (tags) md += `${tags}\n\n`;
        md += `${f.content}\n\n---\n\n`;
    });

    downloadFile('思維拼圖-整併.md', md, 'text/markdown');
}

// ===== Import / Export JSON =====
function exportJson() {
    downloadFile('思維拼圖-備份.json', JSON.stringify(appData, null, 2), 'application/json');
}

function importJsonClick() { importFile.click(); }

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.fragments && Array.isArray(data.fragments)) {
                if (confirm('確定 = 合併到現有資料\n取消 = 覆蓋現有資料')) {
                    const existIds = new Set(appData.fragments.map(f => f.id));
                    data.fragments.forEach(f => {
                        if (!existIds.has(f.id)) appData.fragments.push(f);
                    });
                } else {
                    appData = data;
                }
                saveData(appData);
                render();
                alert(`✅ 成功！共 ${data.fragments.length} 塊碎片`);
            } else {
                alert('❌ 無效的資料格式');
            }
        } catch { alert('❌ 無法解析 JSON 檔案'); }
    };
    reader.readAsText(file);
    importFile.value = '';
}

function downloadFile(name, content, type) {
    const blob = new Blob([content], { type: type + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAll() {
    if (!confirm('⚠️ 確定要清除所有拼圖嗎？此操作無法復原！')) return;
    if (!confirm('真的真的確定嗎？')) return;
    appData = { fragments: [], tags: [] };
    saveData(appData);
    render();
}

// ===== Clipboard =====
function copyToClipboard() {
    const text = mergeContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅ 已複製！';
        setTimeout(() => { copyBtn.textContent = '📋 複製到剪貼簿'; }, 2000);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = '✅ 已複製！';
        setTimeout(() => { copyBtn.textContent = '📋 複製到剪貼簿'; }, 2000);
    });
}

// ===== 🌟 Guided Dialog Engine =====
let guideState = null;

function startGuide() {
    const topic = topicInput.value.trim();
    if (!topic) { topicInput.focus(); return; }

    const framework = frameworkSelect.value;
    const fw = FRAMEWORKS[framework];
    const questions = fw.questions;
    const fwTitle = fw.title;

    guideState = {
        topic,
        framework,
        fwTitle,
        questions: questions.map(q => q(topic)),
        currentQ: 0,
        answers: [],
        messages: [
            { role: 'assistant', content: `開始 ${fwTitle} 關於「${topic}」的對話！\n\n${questions.map(q => q(topic))[0]}` }
        ]
    };

    dialogArea.classList.remove('hidden');
    renderDialog();
    guideReplyInput.focus();
    startGuideBtn.textContent = '🔄 重新開始';
}

function renderDialog() {
    dialogMessages.innerHTML = '';
    guideState.messages.forEach((msg, i) => {
        const el = document.createElement('div');
        el.className = `dialog-msg ${msg.role}`;

        const avatar = msg.role === 'assistant' ? '🤖' : '👤';
        const label = msg.role === 'assistant' ? '引導者' : '我';

        el.innerHTML = `
            <div class="dialog-avatar">${avatar}</div>
            <div>
                <div class="dialog-bubble">${escapeHtml(msg.content)}</div>
                <div class="dialog-label">${label}</div>
            </div>
        `;
        dialogMessages.appendChild(el);
    });

    dialogMessages.scrollTop = dialogMessages.scrollHeight;

    // Update controls
    const isComplete = guideState.currentQ >= guideState.questions.length;
    const hasMore = !isComplete;
    guideReplyInput.disabled = !hasMore;
    guideReplyBtn.disabled = !hasMore;
    nextQuestionBtn.classList.toggle('hidden', !hasMore);
    skipQuestionBtn.classList.toggle('hidden', !hasMore);

    if (isComplete) {
        const finalMsg = guideState.messages[guideState.messages.length - 1];
        if (finalMsg && finalMsg.role !== 'assistant') {
            guideState.messages.push({ role: 'assistant', content: `🎉 對話到此告一段落！你回答了所有問題。\n\n點擊「儲存對話為碎片」將這些想法收集起來，或點「結束對話」關閉。` });
            renderDialog();
        }
    }
}

function guideReply() {
    const text = guideReplyInput.value.trim();
    if (!text || !guideState) return;

    guideState.messages.push({ role: 'user', content: text });

    const qIdx = guideState.currentQ;
    guideState.answers.push({ question: guideState.questions[qIdx], answer: text });
    guideState.currentQ++;

    guideReplyInput.value = '';

    if (guideState.currentQ < guideState.questions.length) {
        guideState.messages.push({ role: 'assistant', content: guideState.questions[guideState.currentQ] });
    }

    renderDialog();
}

function nextQuestion() {
    if (!guideState || guideState.currentQ >= guideState.questions.length) return;

    guideState.answers.push({ question: guideState.questions[guideState.currentQ], answer: '（跳過）' });
    guideState.currentQ++;

    if (guideState.currentQ < guideState.questions.length) {
        guideState.messages.push({ role: 'assistant', content: guideState.questions[guideState.currentQ] });
    } else {
        guideState.messages.push({ role: 'assistant', content: `🎉 所有問題已問完！用「儲存對話為碎片」收集你的想法吧。` });
    }

    renderDialog();
}

function skipQuestion() {
    if (!guideState) return;
    nextQuestion();
}

function saveDialogAsFragments() {
    if (!guideState) return;
    const topic = guideState.topic;
    let count = 0;

    guideState.answers.forEach((qa, i) => {
        if (qa.answer && qa.answer !== '（跳過）') {
            addFragment({
                content: qa.answer,
                tags: [guideState.framework, topic.substring(0, 10)],
                status: '待擴展',
                source: '對話引導',
                conversationId: 'guide-' + topic.substring(0, 8)
            });
            count++;
        }
    });

    alert(`✅ 已將 ${count} 個回答儲存為拼圖碎片！`);
    switchTab('board');
}

function endDialog() {
    if (!guideState) return;
    if (guideState.answers.length > 0) {
        if (!confirm('對話還有內容，確定要結束嗎？可先儲存為碎片。')) return;
    }
    guideState = null;
    dialogArea.classList.add('hidden');
    startGuideBtn.textContent = '🚀 開始對話';
    topicInput.value = '';
}

// Guide event bindings
guideReplyBtn.addEventListener('click', guideReply);
guideReplyInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); guideReply(); }
});
nextQuestionBtn.addEventListener('click', nextQuestion);
skipQuestionBtn.addEventListener('click', skipQuestion);
saveDialogBtn.addEventListener('click', saveDialogAsFragments);
endDialogBtn.addEventListener('click', endDialog);
startGuideBtn.addEventListener('click', startGuide);

// ===== Keyboard Shortcuts =====
thoughtInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); addFragment(); }
});

// ===== Event Bindings =====
addBtn.onclick = () => addFragment();
filterStatus.onchange = render;
filterTag.onchange = render;
searchInput.oninput = render;
mergeBtn.onclick = mergeFragments;
exportBtn.onclick = exportMarkdown;
copyBtn.onclick = copyToClipboard;
exportJsonBtn.onclick = exportJson;
importJsonBtn.onclick = importJsonClick;
importFile.onchange = handleImport;
clearAllBtn.onclick = clearAll;
saveEditBtn.onclick = saveEdit;
cancelEditBtn.onclick = closeEditModal;
editModal.onclick = (e) => { if (e.target === editModal) closeEditModal(); };

// ===== Master Render =====
function render() {
    renderTagChips();
    updateFilterTags();
    renderBoard();
    renderProgress();
    renderMergeList();
    mergeResult.classList.add('hidden');
    updateMergeBtn();
}

// ===== Init =====
render();
