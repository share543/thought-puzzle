# 🧩 思維拼圖 Thought Puzzle

Collect fragmented thoughts, piece them into complete clarity.  
收集碎片想法，拼出完整思維。

A browser-based thinking tool that helps you capture, organize, connect, and synthesize ideas — no server, no install.

---

## Features / 功能

### 📝 Capture / 輸入想法
Write down fragments with tags and status (💡 idea / 🔍 to expand / ✅ done).

### 🧩 Board / 拼圖牆
Card-based browsing, filtering by status/tag, full-text search, progress tracking.

### 💬 Guided Dialog / 對話引導 — 11 frameworks

| Framework | Use case | 適用場景 |
|-----------|----------|----------|
| **5W1H** | Who/What/When/Where/Why/How — comprehensive inquiry | 全面提問 |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats | 優劣勢分析 |
| **Six Thinking Hats** | White/Red/Black/Yellow/Green/Blue — multi-perspective | 多角度思考 |
| **SCAMPER** | Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Rearrange — innovation checklist | 創新發想 |
| **First Principles ⚛️** | Deconstruct to fundamentals, rebuild from zero | 拆解重構 |
| **Reverse Thinking 🔄** | Inversion & premortem — find blind spots | 反向思考 |
| **Pyramid Principle 📐** | Conclusion-first, MECE logical structure | 金字塔邏輯 |
| **GROW Model 🎯** | Goal → Reality → Options → Will (SMART action plan) | 目標行動 |
| **PMI ⚖️** | Plus, Minus, Interesting — three-column decision | 利弊決策 |
| **Free Dialog** | Casual Q&A | 自由問答 |
| **🧠 Synthesis** | Auto-analyze all fragments → discover topic clusters → guide expansion | 全局分析 |

### 📦 AI Merge / 整併產出
**AI-powered fusion engine** — not just concatenation, but genuine synthesis:

1. **Key-term extraction** — TF-style Chinese keyword extraction (80+ stop words filtered)
2. **Similarity matrix** — Jaccard + overlap ratio scoring
3. **Greedy clustering** — auto-group related fragments
4. **Theme generation** — derive section titles from tags + keywords
5. **Narrative builder** — introduction → interleaved sections → smart bridges → conclusion → full Markdown

Optional **merge guide** textarea lets you specify output format (e.g. "blog post", "presentation outline", "action plan").

### 💾 Backup / 備份
JSON export/import for full data portability.

---

## Usage / 使用方式

Open `index.html` in any browser. All data is stored in `localStorage`. No server, no setup.

直接用瀏覽器打開 `index.html` 即可，資料存在瀏覽器 `localStorage`。

---

## Tech / 技術

Pure frontend: HTML + CSS + JavaScript (ES6). Zero dependencies, zero backend.

---

## GitHub Pages

**https://share543.github.io/thought-puzzle/**
