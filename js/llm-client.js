// ===== LLM Client — OpenAI-compatible API 封裝 =====
// 支援任何相容 /v1/chat/completions 的端點（OpenRouter、Groq、Together、Ollama 等）

class LLMClient {
    constructor(config = {}) {
        this.endpoint = config.endpoint || '';
        this.apiKey = config.apiKey || '';
        this.model = config.model || 'gpt-4o-mini';
        this.temperature = config.temperature !== undefined ? config.temperature : 0.7;
        this.maxTokens = config.maxTokens || 4096;
        this.abortController = null;
    }

    /**
     * 從設定物件更新所有參數
     */
    update(config) {
        if (config.endpoint !== undefined) this.endpoint = config.endpoint;
        if (config.apiKey !== undefined) this.apiKey = config.apiKey;
        if (config.model !== undefined) this.model = config.model;
        if (config.temperature !== undefined) this.temperature = config.temperature;
        if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens;
    }

    /**
     * 是否已完成基本設定
     */
    isConfigured() {
        return !!(this.endpoint && this.model);
    }

    /**
     * 取得完整的 API URL（加上 /chat/completions）
     */
    getApiUrl() {
        let url = this.endpoint.replace(/\/+$/, '');
        if (!url.endsWith('/chat/completions')) {
            url += '/chat/completions';
        }
        return url;
    }

    /**
     * 測試 API 連線
     * @returns {{ ok: boolean, message: string }}
     */
    async testConnection() {
        if (!this.endpoint) return { ok: false, message: '請輸入 API 端點 URL' };

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }
            const resp = await fetch(this.getApiUrl(), {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: this.model || 'gpt-4o-mini',
                    messages: [
                        { role: 'user', content: 'Hello, respond with just "ok".' }
                    ],
                    max_tokens: 10,
                    temperature: 0
                }),
                signal: AbortSignal.timeout(15000)
            });

            if (!resp.ok) {
                const errBody = await resp.text().catch(() => '');
                let msg = `HTTP ${resp.status}`;
                try {
                    const err = JSON.parse(errBody);
                    msg = err.error?.message || err.message || msg;
                } catch {}
                return { ok: false, message: msg };
            }

            const data = await resp.json();
            const model = data.model || this.model;
            return { ok: true, message: `✅ 連線成功！使用模型：${model}` };
        } catch (err) {
            if (err.name === 'TimeoutError' || err.name === 'AbortError') {
                return { ok: false, message: '⏱️ 連線逾時（15 秒），請檢查端點 URL 是否正確' };
            }
            if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
                return { ok: false, message: '🌐 網路連線失敗 — 可能是 CORS 限制或端點不可達' };
            }
            return { ok: false, message: `❌ ${err.message || '未知錯誤'}` };
        }
    }

    /**
     * 發送聊天請求
     * @param {Array} messages - [{ role: 'system'|'user'|'assistant', content: string }]
     * @param {Object} options - { temperature?, maxTokens?, signal? }
     * @returns {{ content: string, usage?: { prompt_tokens, completion_tokens } }}
     */
    async chat(messages, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('LLM 尚未設定 — 請先在設定面板填入 API 端點和模型');
        }

        this.abortController = new AbortController();
        const signal = options.signal || this.abortController.signal;

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }
            const resp = await fetch(this.getApiUrl(), {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    temperature: options.temperature !== undefined ? options.temperature : this.temperature,
                    max_tokens: options.maxTokens || this.maxTokens
                }),
                signal
            });

            if (!resp.ok) {
                const errBody = await resp.text().catch(() => '');
                let msg = `HTTP ${resp.status}`;
                try {
                    const err = JSON.parse(errBody);
                    msg = err.error?.message || err.message || msg;
                } catch {}
                throw new Error(msg);
            }

            const data = await resp.json();
            return {
                content: data.choices?.[0]?.message?.content || '',
                usage: data.usage ? {
                    prompt_tokens: data.usage.prompt_tokens,
                    completion_tokens: data.usage.completion_tokens
                } : undefined
            };
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('請求已取消');
            }
            throw err;
        } finally {
            this.abortController = null;
        }
    }

    /**
     * 取消進行中的請求
     */
    cancel() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    // ===== 系統提示模板 =====

    /**
     * 對話引導 — 產生針對性追問
     */
    static makeGuidePrompt(frameworkName, topic, fragments, history) {
        const fragmentText = fragments
            .map((f, i) => `碎片 ${i + 1}：${f.content}`)
            .join('\n');

        return [
            {
                role: 'system',
                content: `你是一個思維引導教練，擅長使用各種思考框架幫助使用者深化想法。

使用者正在使用「${frameworkName}」框架探討「${topic}」。
你的任務是根據他們已經寫下的想法碎片，提出 2-3 個有深度、能引導他們繼續深化的追問。

要求：
- 每個問題要簡潔直接，一題一個問句
- 問題要根據碎片內容來設計，不要問與碎片無關的空泛問題
- 不要問重複的問題
- 語氣鼓勵、開放，像一個有經驗的教練
- 使用台灣正體中文

回覆格式：回傳純 JSON 陣列，例如：
["問題一", "問題二", "問題三"]

不要包含其他說明文字。`
            },
            {
                role: 'user',
                content: `主題：${topic}
框架：${frameworkName}

使用者已寫下的想法碎片：
${fragmentText}

${history.length ? `對話歷史（近 5 則）：\n${history.slice(-5).map(m => `${m.role === 'user' ? '使用者' : '引導員'}：${m.content}`).join('\n')}` : ''}

請根據以上內容，提出 2-3 道能引導使用者繼續深化的追問。`
            }
        ];
    }

    /**
     * 思緒融合 — 將碎片整併成流暢文章
     */
    static makeMergePrompt(fragments, guide) {
        const fragmentText = fragments
            .map((f, i) => `碎片 ${i + 1}${f.tags?.length ? ` [${f.tags.join(', ')}]` : ''}：${f.content}`)
            .join('\n\n');

        return [
            {
                role: 'system',
                content: `你是一個思緒整併專家。你的工作是將使用者的多個思維碎片融合成一篇流暢、有邏輯的完整文章。

要求：
- 開頭一段引人入勝（導入主題背景）
- 正文依主題分段，每個段落 2-4 句
- 段落之間有過渡與銜接
- 結尾一段有洞察的總結
- 使用台灣正體中文
- 語氣自然不僵硬，像人類寫的文章
- 保留碎片中的具體細節和例子

${guide ? `整併指引：使用者要求將這些碎片整併成「${guide}」的形式，請依此調整文章的結構與語氣。` : '無特定格式要求，請自動整合為流暢文章。'}

直接輸出完整的 Markdown 文章即可，不需要額外說明。`
            },
            {
                role: 'user',
                content: `請將以下 ${fragments.length} 塊思維碎片融合成一篇完整的文章：\n\n${fragmentText}`
            }
        ];
    }
}

// 匯出為全域變數（無 ES module 的環境）
window.LLMClient = LLMClient;
