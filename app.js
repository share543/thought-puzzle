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
    'scamper': {
        title: 'SCAMPER — 創新發想檢核表',
        questions: [
            (topic) => `Substitute：關於「${topic}」，有什麼元素可以被替代？材料、流程、人或角色？`,
            (topic) => `Combine：可以跟什麼其他東西結合？功能合併、跨界整合？`,
            (topic) => `Adapt：有什麼既有的做法可以借鏡或改編來用？`,
            (topic) => `Modify：放大、縮小、改變形狀或形式會怎樣？`,
            (topic) => `Put to other uses：這個東西還能被用在其他地方嗎？不同場景？`,
            (topic) => `Eliminate：如果要把事情變簡單，可以減去什麼？`,
            (topic) => `Rearrange：調換順序、翻轉因果、改變節奏會發生什麼？`,
            (topic) => `總結：以上哪個方向最有潛力？下一步該怎麼驗證？`,
        ]
    },
    'first-principles': {
        title: '第一性原理 — 拆解到基本元素',
        questions: [
            (topic) => `關於「${topic}」，你目前已知的事實是什麼？哪些是確定的？`,
            (topic) => `有哪些是「大家都這樣做」但沒有被驗證過的假設？`,
            (topic) => `把這個問題拆到不能再拆 — 最基本、不可否認的元素是什麼？`,
            (topic) => `如果從零開始建構，不參考現有做法，你會怎麼設計？`,
            (topic) => `現有方案的限制在哪裡？哪些是非必要的？`,
            (topic) => `有沒有其他領域的基礎原理也可以套用過來？`,
            (topic) => `基於這些基本元素，重新推導一次 — 新的結論是什麼？`,
            (topic) => `這次拆解有沒有幫你看到以前沒注意到的盲點？`,
        ]
    },
    'reverse': {
        title: '逆思維 — 反向思考與失敗預演',
        questions: [
            (topic) => `如果「${topic}」注定失敗，你覺得最可能的原因是什麼？`,
            (topic) => `反過來想：你追求的反面是什麼？不去做會有什麼結果？`,
            (topic) => `如果你要刻意讓這個計畫搞砸，你會做哪些事？`,
            (topic) => `有什麼是你假設為真，但如果它是錯的，整個結論就翻盤？`,
            (topic) => `你的競爭對手或反對者會怎麼批評這個想法？`,
            (topic) => `如果目標不是「成功」而是「最小化損失」，決策會改變嗎？`,
            (topic) => `從避免失敗的角度來看，你現在應該優先做哪件事？`,
        ]
    },
    'pyramid': {
        title: '金字塔原理 — 結論先行的邏輯架構',
        questions: [
            (topic) => `關於「${topic}」，如果只能用一句話總結你的核心結論，是什麼？`,
            (topic) => `支持這個結論的關鍵論點有哪些？（列 3 個就夠）`,
            (topic) => `每個論點底下，有哪些事實或數據支撐？`,
            (topic) => `這些論點之間是因果關係還是並列關係？`,
            (topic) => `有沒有哪個論點是弱連結？如果去掉它會動搖結論嗎？`,
            (topic) => `聽眾可能在哪個環節提問反駁？你需要準備什麼證據？`,
            (topic) => `用 MECE 檢查 — 這些分類有沒有重疊或遺漏？`,
            (topic) => `把結論放到最前面 — 你覺得這樣的架構說服力夠嗎？`,
        ]
    },
    'grow': {
        title: 'GROW 模型 — 目標與行動計畫',
        questions: [
            (topic) => `Goal：針對「${topic}」，你具體想達成什麼目標？用 SMART 來檢核。`,
            (topic) => `Goal：這個目標的衡量標準是什麼？你怎麼知道自己達成了？`,
            (topic) => `Reality：目前實際情況如何？你已經做了哪些努力？`,
            (topic) => `Reality：從現在到目標之間，主要障礙是什麼？`,
            (topic) => `Options：你有什麼可能的解決方案？列出來，先不評判。`,
            (topic) => `Options：哪個方案最有機會？還有沒有其他你沒想到的選項？`,
            (topic) => `Will：你決定採取哪個行動？第一步具體要做什麼？`,
            (topic) => `Will：你需要什麼資源或支持？如果有人幫你，會是誰？`,
        ]
    },
    'pmi': {
        title: 'PMI — 利弊與有趣點分析',
        questions: [
            (topic) => `Plus：推廣「${topic}」有哪些優點和正面效益？`,
            (topic) => `Minus：有哪些缺點、風險或成本？壞處是什麼？`,
            (topic) => `Interesting：有哪些有趣但非單純好壞的延伸效應或啟發？`,
            (topic) => `權衡：如果把優點和缺點放在天秤上，你傾向哪一邊？`,
            (topic) => `隱藏假設：你評估優缺點時，背後依賴了哪些假設？`,
            (topic) => `時間維度：短期和長期的利弊分布會不會完全相反？`,
            (topic) => `誰受影響：對不同利害關係人來說，利弊感受有何不同？`,
            (topic) => `綜合判斷：考慮所有 Plus、Minus 和 Interesting 之後，你的決定是什麼？`,
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
    },
    'synthesis': {
        title: '🧠 全局分析 — 從碎片提煉主題',
        questions: [] // dynamically built in startGuide()
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

// ===== LLM Settings State =====
const LLM_SETTINGS_KEY = 'thought-puzzle-llm-settings';
let llmClient = null;
let llmSettings = {
    enabled: false,
    endpoint: '',
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4096
};

// Settings DOM refs
const settingsBtn = $('settingsBtn');
const settingsModal = $('settingsModal');
const llmEnabledCheck = $('llmEnabled');
const settingsFields = $('settingsFields');
const llmEndpoint = $('llmEndpoint');
const llmApiKey = $('llmApiKey');
const toggleKeyBtn = $('toggleKeyBtn');
const llmModel = $('llmModel');
const llmTemperature = $('llmTemperature');
const tempValue = $('tempValue');
const llmMaxTokens = $('llmMaxTokens');
const testConnectionBtn = $('testConnectionBtn');
const testResult = $('testResult');
const saveSettingsBtn = $('saveSettingsBtn');
const cancelSettingsBtn = $('cancelSettingsBtn');

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
    const allChecked = sorted.length > 0 && sorted.every(f => document.querySelector(`.merge-check[value="${f.id}"]`));
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
    // Bind select-all
    const selectAll = document.getElementById('selectAllMerge');
    if (selectAll) {
        selectAll.checked = sorted.length > 0 && document.querySelectorAll('.merge-check:checked').length === sorted.length;
        selectAll.onchange = () => {
            document.querySelectorAll('.merge-check').forEach(cb => cb.checked = selectAll.checked);
            updateMergeBtn();
        };
    }
    updateMergeBtn();
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

// ===== ✨ AI 思緒融合引擎 =====

// Chinese language-aware significance scoring
const MERGE_STOP_WORDS = new Set([
    '這個','那個','什麼','一個','可以','沒有','不是','就是','如果','因為',
    '所以','但是','而且','然後','覺得','知道','應該','可能','需要','想要',
    '他們','自己','我們','你們','還有','之後','之前','目前','現在','已經',
    '不會','就是說','意思','方式','東西','時候','部分','方面','地方','問題',
    '開始','最後','完全','直接','其實','起來','成為','只是','一些','以後',
    '的話','一樣','一起','比較','甚至','主要','包括','以下','來自','之間',
    '很多','透過','不同','看到','這些','發現','這邊','還是','因為','還是',
    '或是','或是','真的','還是','這樣','那樣','什麼','如何','什麼'
]);

function extractKeyTerms(text) {
    if (!text) return [];
    const raw = text.split(/[\s,，。、！？\n：；:;()（）「」『』""''【】《》…—·]+/)
        .filter(w => w.length >= 2 && !MERGE_STOP_WORDS.has(w))
        .filter(w => /^[\u4e00-\u9fff_a-zA-Z0-9]+$/.test(w));
    const freq = {};
    raw.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    // Return unique terms sorted by frequency, capped at 15
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(e => e[0]);
}

function calcSimilarity(termsA, termsB) {
    if (!termsA.length || !termsB.length) return 0;
    const intersect = termsA.filter(t => termsB.includes(t)).length;
    const union = new Set([...termsA, ...termsB]).size;
    if (union === 0) return 0;
    // Jaccard × weight boost for strong overlap
    const jaccard = intersect / union;
    const overlapRatio = intersect / Math.min(termsA.length, termsB.length);
    return Math.round((jaccard * 0.6 + overlapRatio * 0.4) * 100);
}

function clusterFragments(fragments) {
    // Extract key terms per fragment
    const withTerms = fragments.map(f => ({
        ...f,
        keyTerms: extractKeyTerms(f.content)
    }));

    // Build similarity matrix
    const n = withTerms.length;
    const sim = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            sim[i][j] = sim[j][i] = calcSimilarity(withTerms[i].keyTerms, withTerms[j].keyTerms);
        }
    }

    // Greedy clustering (threshold 25, flexible)
    const threshold = 25;
    const assigned = new Set();
    const clusters = [];
    for (let i = 0; i < n; i++) {
        if (assigned.has(i)) continue;
        const cluster = [i];
        assigned.add(i);
        for (let j = i + 1; j < n; j++) {
            if (assigned.has(j)) continue;
            // Check similarity to ANY member in the cluster
            const maxSim = Math.max(...cluster.map(m => sim[m][j]));
            if (maxSim >= threshold) {
                cluster.push(j);
                assigned.add(j);
            }
        }
        clusters.push(cluster);
    }

    return { clusters, withTerms, sim };
}

function generateTheme(clusterFrags) {
    // Collect all tags, pick top
    const tagFreq = {};
    const termFreq = {};
    clusterFrags.forEach(f => {
        (f.tags || []).forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; });
        (f.keyTerms || []).forEach(t => { termFreq[t] = (termFreq[t] || 0) + 1; });
    });

    const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    const topTerms = Object.entries(termFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

    // Build theme name
    if (topTags.length >= 2) return topTags.join('、');
    if (topTags.length === 1) {
        const extra = topTerms.length > 0 ? ' & ' + topTerms[0] : '';
        return topTags[0] + extra;
    }
    return topTerms.slice(0, 3).join('、') || '未歸類';
}

function buildNarrative(fragments, guide) {
    const { clusters, withTerms } = clusterFragments(fragments);
    const sorted = [...withTerms].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Stage 1: Understanding — what are we working with?
    const allTags = [...new Set(sorted.flatMap(f => f.tags || []))];
    const totalTerms = [...new Set(sorted.flatMap(f => f.keyTerms || []))];

    // Stage 2: Structure — generate sections
    const sections = [];

    clusters.forEach((indices) => {
        const cFrags = indices.map(i => sorted[i]).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const theme = generateTheme(cFrags);

        // Build section body: weave fragments into flowing paragraphs
        const body = cFrags.map(f => {
            const text = f.content.trim();
            // If content ends without period, add one
            return text.endsWith('。') || text.endsWith('！') || text.endsWith('？') || text.endsWith('…') || text.endsWith('.') || text.endsWith('!') || text.endsWith('?')
                ? text : text + '。';
        }).join(' ');

        sections.push({ theme, body, fragIds: cFrags.map(f => f.id) });
    });

    // Stage 3: Introduction — overall context
    const introParts = [];
    if (allTags.length) {
        introParts.push(`本文圍繞 ${allTags.map(t => '「' + t + '」').join('、')} 等面向展開`);
    }
    if (totalTerms.length > 2) {
        const topK = totalTerms.slice(0, 5).join('、');
        introParts.push(`關鍵概念包括 ${topK}`);
    }
    if (guide) {
        introParts.push(`以下是依照「${guide}」形式所整理的完整內容`);
    }
    const intro = introParts.length > 0
        ? `${introParts.join('，')}。`
        : '以下是將多個思維碎片融合後的完整整理。';

    // Stage 4: Conclusion
    let conclusion = '綜合以上所述，';
    if (clusters.length >= 2) {
        const themes = sections.map(s => '「' + s.theme + '」').join('與');
        conclusion += `從 ${themes} 等不同角度可以更全面地理解這個主題。`;
    } else if (sections.length === 1) {
        conclusion += `「${sections[0].theme}」是貫穿這些想法的核心線索。`;
    } else {
        conclusion += '這些想法共同勾勒出一個值得持續探索的方向。';
    }

    // Stage 5: Assemble markdown
    let output = `# 🧩 思維拼圖 — 融合輸出\n\n`;
    output += `> 🕐 ${new Date().toLocaleString('zh-TW')}  ·  ${fragments.length} 塊碎片融合\n`;
    if (guide) output += `> 🧭 形式：${guide}\n`;
    output += `\n---\n\n`;

    // Intro paragraph
    output += `${intro}\n\n---\n\n`;

    // Sections
    sections.forEach((s, i) => {
        output += `## ${i + 1}. ${s.theme}\n\n`;
        output += `${s.body}\n\n`;

        // Smart bridge between sections
        if (i < sections.length - 1 && sections.length > 1) {
            const next = sections[i + 1];
            output += `_從「${s.theme}」延伸來看，` +
                (next.theme ? `「${next.theme}」是另一個值得探討的角度。_` : `以下面向也很值得探討。_`) +
                `\n\n---\n\n`;
        }
    });

    // Conclusion
    output += `## 總結\n\n${conclusion}\n\n`;
    output += `---\n\n*🧩 ${fragments.length} 塊碎片經思緒融合引擎整併而成*\n`;

    return output;
}

function mergeFragments() {
    const selected = getSelectedFragments();
    if (selected.length === 0) return;

    const mergeStatus = document.getElementById('mergeStatus');
    mergeStatus.classList.remove('hidden');
    mergeBtn.disabled = true;

    const guide = document.getElementById('mergeGuide').value.trim();

    // Decide path: LLM or algorithm
    if (isLLMReady()) {
        // LLM path (async)
        mergeStatus.textContent = '🤖 LLM 正在融合思緒…';
        mergeBtn.textContent = '✨ LLM 整併中…';

        llmMergeFragments(selected, guide).then(output => {
            mergeStatus.classList.add('hidden');
            mergeBtn.disabled = false;
            mergeBtn.textContent = '✨ 重新整併';

            if (output) {
                mergeContent.textContent = output;
                mergeResult.classList.remove('hidden');
                const heading = mergeResult.querySelector('h3');
                if (!heading.querySelector('.llm-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'llm-badge';
                    badge.textContent = '🤖 LLM 生成';
                    heading.appendChild(badge);
                }
            } else {
                // LLM returned null — fallback to algorithm
                mergeStatus.textContent = '⚠️ LLM 生成失敗，降級為演算法模式…';
                setTimeout(() => {
                    const fallback = buildNarrative(selected, guide);
                    mergeContent.textContent = fallback;
                    mergeResult.classList.remove('hidden');
                    mergeStatus.classList.add('hidden');
                }, 100);
            }
        });
    } else {
        // Algorithm path (synchronous)
        mergeStatus.textContent = '🧠 正在分析碎片並融合思緒…';
        setTimeout(() => {
            const output = buildNarrative(selected, guide);
            mergeContent.textContent = output;
            mergeResult.classList.remove('hidden');
            mergeStatus.classList.add('hidden');
            mergeBtn.disabled = false;
            mergeBtn.textContent = '✨ 重新整併';
        }, 300);
    }
}

/**
 * LLM 思緒融合
 */
async function llmMergeFragments(fragments, guide) {
    try {
        const messages = LLMClient.makeMergePrompt(fragments, guide);
        const result = await llmClient.chat(messages, { temperature: 0.7, maxTokens: 4096 });

        let content = result.content.trim();

        // Ensure it has markdown heading if the LLM didn't include one
        if (!content.startsWith('#')) {
            content = '# 🧩 思維拼圖 — LLM 融合輸出\n\n' + content;
        }

        // Append metadata
        const metaLines = [];
        metaLines.push('');
        metaLines.push('---');
        metaLines.push(`*🧩 ${fragments.length} 塊碎片 • 🤖 LLM 生成 (${llmSettings.model})*`);
        if (result.usage) {
            metaLines.push(`*📊 ${result.usage.prompt_tokens} → ${result.usage.completion_tokens} tokens*`);
        }
        content += '\n' + metaLines.join('\n');

        return content;
    } catch (err) {
        console.error('LLM merge failed:', err);
        return null; // triggers fallback
    }
}

function exportMarkdown() {
    const selected = getSelectedFragments();
    if (selected.length === 0) return;

    // If merge was already run, export that result; otherwise run merge first
    if (mergeResult.classList.contains('hidden')) {
        mergeFragments();
        // Poll for result (merge runs asynchronously)
        const check = setInterval(() => {
            if (!mergeResult.classList.contains('hidden')) {
                clearInterval(check);
                const md = mergeContent.textContent;
                downloadFile('思維拼圖-融合輸出.md', md, 'text/markdown');
            }
        }, 100);
        return;
    }

    const md = mergeContent.textContent;
    downloadFile('思維拼圖-融合輸出.md', md, 'text/markdown');
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
    // Add BOM (\uFEFF) so editors recognise UTF-8 encoding on all platforms
    const blob = new Blob(['\uFEFF' + content], { type: type + ';charset=utf-8' });
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

function synthesizeTopics() {
    if (appData.fragments.length === 0) return null;
    const frags = appData.fragments;

    // Chinese stop words
    const stopWords = new Set([
        '這個','那個','什麼','一個','可以','沒有','不是','就是',
        '如果','因為','所以','但是','而且','然後','覺得','知道',
        '應該','可能','需要','想要','他們','自己','我們','你們',
        '還有','之後','之前','目前','現在','已經','不會','就是說',
        '意思','方式','東西','時候','部分','方面','地方','問題',
        '開始','最後','完全','直接','其實','起來','成為','只是',
        '一些','以後','的話','一樣','一起','比較','甚至','主要',
        '包括','以下','來自','之間','很多','透過','不同','看到',
        '這些','發現','這邊'
    ]);

    // === 1. Extract tags, content words ===
    const tagFreq = {};
    const tagPair = {};
    const fragData = [];

    frags.forEach(f => {
        const tags = (f.tags || []).filter(Boolean);
        const content = f.content || '';
        // Significant words: Chinese/alpha-numeric, ≥2 chars, not stop words
        const words = [...new Set(
            content.split(/[\s,，。、！？\n：；:;()（）「」『』""''【】《》…—·]+/)
                .filter(w => w.length >= 2 && !stopWords.has(w))
                .filter(w => /^[\u4e00-\u9fff_a-zA-Z0-9]+$/.test(w))
        )];

        tags.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; });
        tags.forEach((t1, i) =>
            tags.slice(i + 1).forEach(t2 => {
                const key = t1 < t2 ? t1 + '||' + t2 : t2 + '||' + t1;
                tagPair[key] = (tagPair[key] || 0) + 1;
            })
        );

        fragData.push({
            id: f.id, tags, words, status: f.status, content,
            updatedAt: f.updatedAt || f.createdAt || ''
        });
    });

    // === 2. Tag co-occurrence → topic clusters ===
    const adj = {};
    Object.entries(tagPair).forEach(([pair, count]) => {
        const [t1, t2] = pair.split('||');
        if (!adj[t1]) adj[t1] = [];
        if (!adj[t2]) adj[t2] = [];
        adj[t1].push({ tag: t2, w: count });
        adj[t2].push({ tag: t1, w: count });
    });

    const used = new Set();
    const clusters = [];
    Object.entries(tagFreq)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag]) => {
            if (used.has(tag)) return;
            const members = [tag];
            used.add(tag);
            (adj[tag] || [])
                .filter(n => !used.has(n.tag))
                .sort((a, b) => b.w - a.w)
                .slice(0, 3)
                .forEach(n => { members.push(n.tag); used.add(n.tag); });
            clusters.push(members);
        });

    // === 3. Assign tagged fragments ===
    const assign = clusters.map(() => []);
    const orphanSet = new Set();

    fragData.forEach(fd => {
        if (fd.tags.length === 0) { orphanSet.add(fd.id); return; }
        let best = -1, bestScore = 0;
        clusters.forEach((ctags, ci) => {
            const score = fd.tags.filter(t => ctags.includes(t)).length;
            if (score > bestScore) { bestScore = score; best = ci; }
        });
        bestScore > 0 ? assign[best].push(fd) : orphanSet.add(fd.id);
    });

    // === 4. Cluster keyword extraction ===
    const clusterKws = clusters.map((ctags, ci) => {
        const kw = {};
        assign[ci].forEach(fd => fd.words.forEach(w => { kw[w] = (kw[w] || 0) + 1; }));
        return Object.entries(kw).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
    });

    // Re-try orphans: match by content keyword (≥2 shared)
    fragData.filter(fd => orphanSet.has(fd.id) && fd.words.length > 0).forEach(fd => {
        let best = -1, bestScore = 0;
        clusterKws.forEach((kws, ci) => {
            const s = fd.words.filter(w => kws.includes(w)).length;
            if (s > bestScore) { bestScore = s; best = ci; }
        });
        if (bestScore >= 2) { assign[best].push(fd); orphanSet.delete(fd.id); }
    });

    const orphans = fragData.filter(fd => orphanSet.has(fd.id));

    // === 5. Cluster insights ===
    const clusterInfo = clusters.map((ctags, ci) => {
        const m = assign[ci];
        const done = m.filter(fd => fd.status === '已完成').length;
        const recent = m.filter(fd => {
            const t = new Date(fd.updatedAt).getTime();
            return t && Date.now() - t < 7 * 86400000;
        }).length;
        return {
            tags: ctags,
            memberCount: m.length,
            doneCount: done,
            pctDone: m.length > 0 ? Math.round(done / m.length * 100) : 0,
            topWords: clusterKws[ci].slice(0, 4),
            samples: m.slice(0, 3).map(fd => fd.content.substring(0, 35)),
            recent
        };
    }).filter(c => c.memberCount > 0);

    // === 6. Global stats ===
    const total = frags.length;
    const totalDone = frags.filter(f => f.status === '已完成').length;
    const totalExpand = frags.filter(f => f.status === '待擴展').length;
    const totalIdea = frags.filter(f => f.status === '靈感').length;

    const stuckCluster = clusterInfo.filter(c => c.memberCount >= 2)
        .sort((a, b) => a.pctDone - b.pctDone)[0];
    const largestCluster = clusterInfo.sort((a, b) => b.memberCount - a.memberCount)[0];

    // === 7. Suggest topic ===
    let suggestedTopic = '未分類想法';
    if (largestCluster && largestCluster.tags.length) {
        suggestedTopic = largestCluster.tags.join('、');
    } else if (orphans.length) {
        const wc = {};
        orphans.forEach(fd => fd.words.forEach(w => { wc[w] = (wc[w] || 0) + 1; }));
        const top = Object.entries(wc).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
        if (top.length) suggestedTopic = top.join('、');
    }

    return {
        total, totalDone, totalExpand, totalIdea,
        clusterInfo,
        orphans: orphans.map(fd => ({
            id: fd.id, snippet: fd.content.substring(0, 50) + (fd.content.length > 50 ? '…' : ''),
            words: fd.words.slice(0, 4), status: fd.status
        })),
        stuckCluster,
        largestCluster,
        suggestedTopic
    };
}

function buildSynthesisIntro(analysis, topic) {
    const lines = ['🧠 開始「全局分析」！\n'];
    lines.push(`📊 ${analysis.total} 塊碎片`);

    if (analysis.clusterInfo.length) {
        lines.push('');
        lines.push('📌 思考方向：');
        analysis.clusterInfo.forEach(c =>
            lines.push(`   ${c.tags.join('、')}（${c.memberCount} 塊）`)
        );
    }

    if (analysis.orphans.length) {
        lines.push('');
        lines.push(`🫥 ${analysis.orphans.length} 塊未歸類`);
    }

    lines.push(`\n💡 建議主題：${topic}`);
    return lines.join('\n');
}

function buildSynthesisQuestions(analysis, topic) {
    const t = topic || '你的想法';
    const qs = [];

    // Q1: 方向一覽 → 關聯
    if (analysis.clusterInfo.length >= 2) {
        const names = analysis.clusterInfo.map(c => '「' + c.tags.join('、') + '」').join('、');
        qs.push(`你的碎片分成 ${analysis.clusterInfo.length} 個方向：${names}。你覺得它們之間有關聯嗎？`);
    } else if (analysis.clusterInfo.length === 1) {
        const c = analysis.clusterInfo[0];
        qs.push(`碎片集中在「${c.tags.join('、')}」這個方向。是什麼契機開始這個方向的？`);
    } else {
        qs.push(`碎片還沒形成明確方向，你覺得它們可能有什麼潛在連結？`);
    }

    // Q2: 缺口 → 還缺什麼
    if (analysis.clusterInfo.length) {
        const mostStuck = [...analysis.clusterInfo].sort((a, b) => a.pctDone - b.pctDone)[0];
        if (mostStuck.pctDone < 30) {
            qs.push(`「${mostStuck.tags.join('、')}」才剛起步，你覺得卡在哪裡？`);
        } else {
            qs.push(`你覺得「${t}」還有哪些面向沒有想到？`);
        }
    } else {
        qs.push(`你覺得現在最缺的是哪一塊？`);
    }

    // Q3: 優先級 → 最值得深入
    if (analysis.largestCluster) {
        const c = analysis.largestCluster;
        qs.push(`${c.tags.join('、')} 這條線的碎片最多，你覺得最有價值的產出是什麼？`);
    } else {
        qs.push(`這麼多碎片，你覺得哪一塊最值得先深入？`);
    }

    // Q4: 行動 → 下一步
    qs.push(`針對「${t}」，你接下來的第一步要做什麼？`);

    return qs;
}

function startGuide() {
    const framework = frameworkSelect.value;
    const fw = FRAMEWORKS[framework];
    const fwTitle = fw.title;

    let topic = topicInput.value.trim();
    let questions;
    let intro;

    if (framework === 'synthesis') {
        const analysis = synthesizeTopics();
        if (!analysis || analysis.total < 2) {
            alert('🧩 至少需要 2 塊碎片才能進行全局分析，先去「輸入想法」加入一些內容吧！');
            return;
        }
        topic = topic || analysis.suggestedTopic;
        questions = buildSynthesisQuestions(analysis, topic);
        intro = buildSynthesisIntro(analysis, topic);
    } else {
        if (!topic) { topicInput.focus(); return; }
        questions = fw.questions.map(q => q(topic));
        intro = `開始 ${fwTitle} 關於「${topic}」的對話！\n\n${questions[0]}`;
    }

    guideState = {
        topic,
        framework,
        fwTitle,
        questions,
        currentQ: 0,
        answers: [],
        messages: [
            { role: 'assistant', content: intro }
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

// ===== LLM Dialogue Follow-up =====
const llmFollowUpBtn = $('llmFollowUpBtn');

llmFollowUpBtn.addEventListener('click', async () => {
    if (!guideState) return;
    if (!isLLMReady()) {
        alert('⚠️ LLM 功能未啟用或尚未設定。請點右上角 ⚙️ 設定 API 端點和金鑰。');
        return;
    }

    // Gather context: selected fragments + current dialogue history
    const recentFrags = appData.fragments.slice(0, 10);
    const history = guideState.messages.slice(-8);
    const frameworkName = guideState.fwTitle;

    // Show loading state
    llmFollowUpBtn.disabled = true;
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'dialog-llm-loading';
    loadingMsg.textContent = '🤖 LLM 正在思考追問…';
    dialogMessages.appendChild(loadingMsg);
    dialogMessages.scrollTop = dialogMessages.scrollHeight;

    try {
        const messages = LLMClient.makeGuidePrompt(
            frameworkName,
            guideState.topic,
            recentFrags,
            history
        );
        const result = await llmClient.chat(messages);
        let questions;
        try {
            questions = JSON.parse(result.content);
            if (!Array.isArray(questions)) throw new Error('not array');
        } catch {
            // If LLM didn't return clean JSON, try extracting from text
            const match = result.content.match(/\[[\s\S]*?\]/);
            if (match) {
                questions = JSON.parse(match[0]);
            } else {
                // Fallback: split by newlines as questions
                questions = result.content.split('\n')
                    .filter(l => l.trim().endsWith('？') || l.trim().endsWith('?'))
                    .map(l => l.replace(/^\d+[.、\s]+/, '').trim())
                    .slice(0, 3);
            }
        }

        if (!questions || questions.length === 0) {
            questions = ['關於這個主題，你還有什麼想補充的嗎？'];
        }

        // Add LLM-generated questions to the dialog flow
        // We insert them as additional questions right after current position
        const llmLabel = `🤖 LLM 追問（共 ${questions.length} 題）`;
        guideState.messages.push({ role: 'assistant', content: llmLabel });
        questions.forEach((q, i) => {
            const text = q.trim().replace(/^[""']|[""']$/g, '');
            // Insert after current position
            guideState.questions.splice(guideState.currentQ + i, 0, text);
        });

        // Show first question now if all original questions were done
        if (guideState.currentQ >= guideState.questions.length - questions.length) {
            guideState.messages.push({ role: 'assistant', content: questions[0].trim().replace(/^[""']|[""']$/g, '') });
        }

    } catch (err) {
        guideState.messages.push({
            role: 'assistant',
            content: `⚠️ LLM 追問暫時無法使用（${err.message}）\n\n請繼續使用原本的引導問題。`
        });
    } finally {
        loadingMsg.remove();
        llmFollowUpBtn.disabled = false;
        renderDialog();
    }
});

// ===== LLM Settings Logic =====

function loadLLMSettings() {
    try {
        const raw = localStorage.getItem(LLM_SETTINGS_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            llmSettings = { ...llmSettings, ...saved };
        }
    } catch {}
}

function saveLLMSettings() {
    // Don't save empty apiKey (avoid overwriting with blank)
    const toSave = { ...llmSettings };
    if (!toSave.apiKey) delete toSave.apiKey;
    localStorage.setItem(LLM_SETTINGS_KEY, JSON.stringify(toSave));
}

function initLLMClient() {
    const ClientClass = window.LLMClient;
    if (!ClientClass) return;
    if (!llmClient) {
        llmClient = new ClientClass({
            endpoint: llmSettings.endpoint,
            apiKey: llmSettings.apiKey,
            model: llmSettings.model,
            temperature: llmSettings.temperature,
            maxTokens: llmSettings.maxTokens
        });
    } else {
        llmClient.update({
            endpoint: llmSettings.endpoint,
            apiKey: llmSettings.apiKey,
            model: llmSettings.model,
            temperature: llmSettings.temperature,
            maxTokens: llmSettings.maxTokens
        });
    }
}

function isLLMReady() {
    return llmSettings.enabled && llmClient && llmClient.isConfigured();
}

// Populate settings UI from state
function populateSettingsUI() {
    llmEnabledCheck.checked = llmSettings.enabled;
    llmEndpoint.value = llmSettings.endpoint || '';
    llmApiKey.value = llmSettings.apiKey || '';
    llmModel.value = llmSettings.model || 'gpt-4o-mini';
    llmTemperature.value = llmSettings.temperature;
    tempValue.textContent = llmSettings.temperature;
    llmMaxTokens.value = llmSettings.maxTokens;
    updateSettingsFieldsDisabled();
}

// Read UI back into state
function readSettingsFromUI() {
    llmSettings.enabled = llmEnabledCheck.checked;
    llmSettings.endpoint = llmEndpoint.value.trim();
    llmSettings.apiKey = llmApiKey.value.trim();
    llmSettings.model = llmModel.value.trim() || 'gpt-4o-mini';
    llmSettings.temperature = parseFloat(llmTemperature.value) || 0.7;
    llmSettings.maxTokens = parseInt(llmMaxTokens.value) || 4096;
}

function updateSettingsFieldsDisabled() {
    settingsFields.classList.toggle('disabled', !llmEnabledCheck.checked);
}

// Open settings modal
settingsBtn.addEventListener('click', () => {
    populateSettingsUI();
    testResult.textContent = '';
    testResult.className = 'test-result';
    settingsModal.classList.remove('hidden');
});

// Close settings modal
function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}
cancelSettingsBtn.addEventListener('click', closeSettingsModal);
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
});

// Toggle key visibility
let keyVisible = false;
toggleKeyBtn.addEventListener('click', () => {
    keyVisible = !keyVisible;
    llmApiKey.type = keyVisible ? 'text' : 'password';
    toggleKeyBtn.textContent = keyVisible ? '🙈' : '👁️';
});

// Temperature slider live display
llmTemperature.addEventListener('input', () => {
    tempValue.textContent = llmTemperature.value;
});

// Enable/disable fields toggle
llmEnabledCheck.addEventListener('change', updateSettingsFieldsDisabled);

// Test connection
testConnectionBtn.addEventListener('click', async () => {
    readSettingsFromUI();
    if (!llmSettings.endpoint) {
        testResult.textContent = '請輸入 API 端點 URL';
        testResult.className = 'test-result error';
        return;
    }
    if (!llmSettings.apiKey) {
        testResult.textContent = '請輸入 API 金鑰';
        testResult.className = 'test-result error';
        return;
    }

    testResult.textContent = '⏳ 測試中…';
    testResult.className = 'test-result';
    testConnectionBtn.disabled = true;

    try {
        initLLMClient();
        const result = await llmClient.testConnection();
        testResult.textContent = result.message;
        testResult.className = 'test-result ' + (result.ok ? 'success' : 'error');
    } catch (err) {
        testResult.textContent = '❌ ' + (err.message || '連線失敗');
        testResult.className = 'test-result error';
    } finally {
        testConnectionBtn.disabled = false;
    }
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    readSettingsFromUI();
    saveLLMSettings();
    initLLMClient();
    closeSettingsModal();
    // Show feedback toast
    const btn = saveSettingsBtn;
    const origText = btn.textContent;
    btn.textContent = '✅ 已儲存！';
    setTimeout(() => { btn.textContent = origText; }, 2000);
});

// Init LLM on load
loadLLMSettings();
initLLMClient();

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
