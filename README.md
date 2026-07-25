# 🧩 Thought Puzzle

> Collect fragmented thoughts, piece them into complete clarity.

[**中文版**](README.zh.md)

A browser-based thinking tool that helps you capture, organize, connect, and synthesize ideas — no server, no install.

---

## Features

### 📝 Capture
Write down fragments with tags and status (💡 idea / 🔍 to expand / ✅ done).

### 🧩 Board
Card-based browsing, filter by status or tag, full-text search, progress tracking.

### 💬 Guided Dialog — 11 frameworks

| Framework | Best for |
|-----------|----------|
| **5W1H** | Comprehensive inquiry (who/what/when/where/why/how) |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats |
| **Six Thinking Hats** | Multi-perspective (white/red/black/yellow/green/blue) |
| **SCAMPER** | Innovation checklist (substitute/combine/adapt/modify/put/eliminate/rearrange) |
| **First Principles ⚛️** | Deconstruct to fundamentals, rebuild from zero |
| **Reverse Thinking 🔄** | Inversion & premortem — uncover blind spots |
| **Pyramid Principle 📐** | Conclusion-first, MECE logical structure |
| **GROW Model 🎯** | Goal → Reality → Options → Will (SMART action plan) |
| **PMI ⚖️** | Plus / Minus / Interesting — three-column decision |
| **Free Dialog** | Casual Q&A |
| **🧠 Synthesis** | Auto-analyze all fragments → detect topic clusters → guide expansion |

### 🤖 LLM Enhancement (optional)

Supercharge your thinking with a large language model. BYOK (Bring Your Own Key) — you choose the API endpoint.

| Feature | Algorithm mode | LLM mode |
|---------|---------------|----------|
| **Guided Dialog** | Fixed template questions | LLM reads your fragments & history → generates **personalized follow-up questions** |
| **Merge Engine** | Keyword stats + template stitching | LLM writes a **coherent article** with introduction, body sections, and conclusion |

**How to use:**
1. Click ⚙️ (top-right corner)
2. Enter your API endpoint, key, and model
3. Click **Test Connection** to verify
4. Enable LLM and save

When LLM calls fail (network error, invalid key, timeout), the tool silently falls back to algorithm mode — your work is never blocked.

#### Recommended API providers

| Provider | CORS | Notes |
|----------|------|-------|
| [OpenRouter](https://openrouter.ai/) | ✅ Yes | **Recommended default** — works immediately in browser, many models |
| [Groq](https://console.groq.com/) | ✅ Yes | Very fast, good for smaller models |
| [Together AI](https://www.together.ai/) | ✅ Yes | Good model selection |
| Ollama (localhost) | ⚠️ Same-origin required | Serve page via local HTTP server (`python -m http.server`), not HTTPS or `file://` |
| Ollama (LAN IP) | ⚠️ Same-origin required | Same as above, or use a reverse proxy for CORS |

> ⚠️ OpenAI / Anthropic native APIs do **not** support browser-side CORS. Use OpenRouter as a proxy instead.

Settings are stored in `localStorage` only — never in code, never sent to any server except the API endpoint you configure.

### 📦 Merge Engine

Two modes:

**Algorithm mode** (default, no setup needed):
1. **Key-term extraction** — TF-style Chinese keyword extraction (80+ stop words filtered)
2. **Similarity matrix** — Jaccard + overlap ratio scoring
3. **Greedy clustering** — auto-group related fragments
4. **Theme generation** — derive section titles from tags + keywords
5. **Narrative builder** — introduction → interleaved sections → smart bridges → conclusion → full Markdown

**LLM mode** (when configured & enabled):
- Sends your fragments + optional guide to the LLM
- Returns a genuine article with flow and insight
- Falls back to algorithm mode on failure

Optional **merge guide** textarea lets you specify output format (e.g. "blog post", "presentation outline", "action plan").

### 💾 Backup
JSON export/import for full data portability.

---

## Usage

Open `index.html` in any browser. All data stays in `localStorage`. No server, no setup.

---

## Tech

Pure frontend: HTML + CSS + JavaScript (ES6). Zero dependencies, zero backend.

LLM client: OpenAI-compatible `/v1/chat/completions` — works with any provider that supports the standard.

---

## Version

**v2.0.0** — see [GitHub releases](https://github.com/share543/thought-puzzle/releases).

---

## GitHub Pages

**https://share543.github.io/thought-puzzle/**
