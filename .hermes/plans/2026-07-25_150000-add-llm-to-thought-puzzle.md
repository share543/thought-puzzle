# 思維拼圖 LLM 整合實作計畫

> **For Hermes:** 使用 subagent-driven-development 逐步實作

**目標：** 為思維拼圖加入可選的 LLM 支援，讓對話引導更聰明、思緒融合更豐富，且完全由使用者自備 API 端點，適合 GitHub Pages 等靜態託管。

**架構原則：**
- 純前端，無後端 — 瀏覽器直接 `fetch()` LLM API
- LLM 交由**使用者自備**（BYOK — Bring Your Own Key/Endpoint）
- 原始演算法保留為「離線模式」，LLM 為可選升級
- 設定存 `localStorage`，不寫入任何檔案

**CORS 策略**（前端直接 call LLM 的最大挑戰）：

| 服務 | CORS 支援 | 適用性 |
|------|-----------|--------|
| **OpenRouter** | ✅ 允許瀏覽器 CORS，支援多種模型 | ✅ **預設推薦** |
| **Groq** | ✅ 允許瀏覽器 CORS，速度快 | ✅ |
| **Together AI** | ✅ 允許 CORS | ✅ |
| **Ollama (本地)** | 需自訂 CORS 設定 | ✅ 使用者自行設定 |
| **OpenAI / Anthropic** | ❌ 瀏覽器端 CORS 不開放 | ⚠️ 需透過 proxy |

架構設計為**通用 OpenAI-compatible 介面**，只要端點支援 `/v1/chat/completions` 格式都可使用。

---

## 設計細節

### 設定面板（Settings）

HTML 中新增齒輪圖示 → 彈出 Modal，內容：

```
┌─ LLM 設定 ─────────────────────────────┐
│ ☑ 啟用 LLM 功能                        │
│                                         │
│ API 端點 URL *                          │
│ [ https://openrouter.ai/api/v1        ] │
│                                         │
│ API 金鑰 *                              │
│ [ •••••••••••••••••••••••            ] │
│                                         │
│ 模型名稱                                │
│ [ gpt-4o-mini                         ] │
│                                         │
│ 進階設定  ▼                             │
│ 溫度：[────●────────] 0.7              │
│ 最大 Token：[4096                     ] │
│                                         │
│ [🔌 測試連線]  [💾 儲存]  [✕ 關閉]    │
└─────────────────────────────────────────┘
```

- 所有欄位（含 API Key）存 `localStorage`
- **不留金鑰在 code 或檔案中**，使用者自行輸入
- 測試連線按鈕：實際 call 一次模型，顯示成功/失敗

### LLM API 客戶端（新的 js/llm-client.js）

統一封裝 OpenAI-compatible `/v1/chat/completions` 呼叫：

```javascript
class LLMClient {
  constructor(config) { /* endpoint, apiKey, model, temperature, maxTokens */ }

  async chat(messages, options = {})
    → { content: string, usage?: { prompt_tokens, completion_tokens } }

  async testConnection()
    → { ok: boolean, message: string }

  isConfigured()
    → boolean

  // 系統提示模板
  static SYSTEM_PROMPTS = { ... }
}
```

支援 streaming（可選），但考慮到 UI 整合複雜度，初期先做非 streaming。

### 對話引導 LLM 強化（`app.js` 修改）

**目前：** 固定 11 框架，問句模板寫死

**LLM 模式（可選切換）：**

當使用者選取若干碎片後：
1. 把碎片內容 + 當前框架名稱送給 LLM
2. LLM 產出 2-3 道**針對性追問**
3. 顯示在引導區，取代模板問句

Prompt 設計：

```markdown
你是一個思維引導教練。使用者正在使用「{框架名稱}」思考框架。
以下是他們已經寫下的想法碎片：

{碎片列表}

請根據這些內容，提出 2-3 個有深度、能引導使用者繼續深化的追問。
每個問題要簡潔直接，不要問重複的。
請用 JSON 陣列回覆：["問題1", "問題2", "問題3"]
```

**降級機制：** LLM 呼叫失敗 → 自動退回原模板問句，使用者無感。

### 思緒融合 LLM 強化（`app.js` 修改）

**目前：** 詞頻統計 + 樣板拼接

**LLM 模式：**

將選取的碎片 + 整併指引送給 LLM，產出真正的文章段落：

```markdown
你是一個思維整併專家。請將以下 {N} 個思維碎片融合成一篇流暢、
有邏輯的完整文章。

{碎片列表}

{指引（如果有）}

請回覆格式：
- 一段引人入勝的開頭
- 依主題分段的正文（每個段落 2-4 句）
- 一段有洞察的總結

使用台灣正體中文，語氣自然不僵硬。
```

產出取代目前的樣板拼接輸出。

**降級機制：** LLM 失敗 → 自動退回演算法模式輸出。

---

## 實作步驟

### Task 1: 建立 LLM 設定面板（HTML + CSS）

**檔案：** `index.html`
**範圍：**
- 在 toolbar 加入齒輪 ⚙️ 按鈕
- 新增設定 Modal（settings-modal）的 HTML 結構
- 所有表單欄位（啟用 toggle、端點、金鑰、模型、溫度、max tokens）
- 測試連線按鈕、狀態顯示區
- 儲存/關閉按鈕
- CSS 樣式（與現有主題一致，暗色系）

### Task 2: 建立 LLM API 客戶端

**檔案：**
- 新增 `js/llm-client.js`
- 修改 `index.html` 加入 `<script src="js/llm-client.js">`

**內容：**
- `LLMClient` class 完整實作
- `chat()` 方法：call `/v1/chat/completions`，回傳 content
- `testConnection()` 方法：發送簡單請求驗證
- `isConfigured()` 方法
- 系統提示模板常數
- 完整的錯誤處理（timeout、HTTP error、JSON parse error）

### Task 3: 設定面板 + LLM Client 接合（持久化 & 測試）

**檔案：** `app.js`

**範圍：**
- 設定 Modal 的 DOM 事件綁定（開關、填值、儲存、關閉）
- `localStorage` 讀寫（載入時自動填入儲存值）
- 「測試連線」按鈕邏輯 → 呼叫 `LLMClient.testConnection()`
- 啟用/停用 toggle 控制 LLM 功能開關
- UI 狀態反饋（連線中、成功、失敗、未設定）

### Task 4: 對話引導 LLM 強化

**檔案：** `app.js`

**範圍：**
- 在對話引導區新增「LLM 模式」toggle（或依附於全域 LLM 開關）
- 當 LLM 啟用且使用者選取碎片後，點「追問」按鈕：
  1. 收集已選碎片的內容
  2. 呼叫 `LLMClient.chat()` 帶入框架提示
  3. 將 LLM 回覆（問題陣列）渲染到對話引導區
  4. 若失敗則降級為模板問句
- 非 LLM 模式行為完全不變

### Task 5: 思緒融合 LLM 強化

**檔案：** `app.js`

**範圍：**
- 在「AI 智慧整併」按鈕邏輯中增加分支：
  - LLM 啟用 + 已設定 → 使用 LLM 融合
  - 否則 → 使用原演算法
- 新增 `llmMergeFragments()` 函數：
  1. 收集選取碎片內容
  2. 呼叫 `LLMClient.chat()` 帶入融合提示
  3. 將 LLM 回覆顯示在結果區
  4. 若失敗降級回演算法
- 整併指引（guide）也一併送入 LLM
- 結果區 UI 加入「這是 LLM 生成」標示

### Task 6: 檔案整理 & README 更新

**檔案：**
- `README.md` / `README.zh.md`
- `index.html`（確保所有 script 加載順序正確）

**範圍：**
- 更新功能列表，說明 LLM 整合功能
- 新增「LLM 設定」使用說明（支援的端點、如何取得 API Key、CORS 注意事項）
- 推薦 OpenRouter / Groq 等免 CORS 煩惱的服務
- 在 README 加入 LLM 架構圖或說明
- 繁體中文與英文版同步更新

---

## 檔案更動總覽

| 檔案 | 操作 | 說明 |
|------|------|------|
| `index.html` | 修改 | 加設定 Modal HTML、script 引用 |
| `js/llm-client.js` | **新增** | LLM API 客戶端封裝 |
| `app.js` | 修改 | 設定邏輯、對話 LLM、融合 LLM |
| `style.css` | 修改 | 設定 Modal 樣式 |
| `README.md` | 修改 | 英文說明更新 |
| `README.zh.md` | 修改 | 中文說明更新 |

---

## 驗證方式

1. **離線模式**：不填 LLM 設定 → 所有功能與現在完全一致，不受影響
2. **設定持久化**：填好設定 → 關閉 Modal → 重整頁面 → 設定應自動載入
3. **測試連線**：點測試按鈕 → 應顯示「連線成功」或明確錯誤訊息
4. **LLM 對話引導**：啟用 LLM → 選碎片 → 點追問 → 應出現 LLM 生成的相關問題
5. **LLM 融合**：啟用 LLM → 選碎片 → 點整併 → 應產出流暢文章而非拼接
6. **降級測試**：填入錯誤金鑰 → LLM 呼叫失敗 → 自動退回原演算法，不報錯
7. **CORS 兼容**：測試 OpenRouter / Groq / Ollama (localhost) 三種端點

---

## 風險與取捨

| 風險 | 影響 | 緩解 |
|------|------|------|
| **CORS 限制** | 部分 API（OpenAI 原生）無法瀏覽器直連 | 預設推薦 OpenRouter，說明中列出 CORS-friendly 服務 |
| **API Key 暴露** | 存 localStorage，XSS 風險 | 純靜態站無後端，XSS 攻擊面低；說明建議用受限金鑰 |
| **LLM 延遲** | 使用者等回應 | 加入 loading spinner；提供 cancel 按鈕 |
| **Token 費用** | 使用者負擔 | 顯示 token 用量估算；可選模型（便宜模型如 gpt-4o-mini 為預設） |
| **離線優先** | LLM 不該是必要依賴 | 所有 LLM 功能都是選擇性增強，失敗自動降級 |

---

## 開放問題

- **Streaming 支援？** 初期不做 streaming，讓 UX 簡潔。可在後續版本加入打字機效果。
- **快取 LLM 回應？** 暫不實作，避免使用者混淆「為什麼改了碎片但結果一樣」。
- **多輪對話？** LLM 對話引導目前是單輪追問。進階版本可支援多輪對話歷史。
