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

### 📦 AI Merge Engine
Not just concatenation, but genuine synthesis:

1. **Key-term extraction** — TF-style Chinese keyword extraction (80+ stop words filtered)
2. **Similarity matrix** — Jaccard + overlap ratio scoring
3. **Greedy clustering** — auto-group related fragments
4. **Theme generation** — derive section titles from tags + keywords
5. **Narrative builder** — introduction → interleaved sections → smart bridges → conclusion → full Markdown

Optional **merge guide** textarea lets you specify output format (e.g. "blog post", "presentation outline", "action plan").

### 💾 Backup
JSON export/import for full data portability.

---

## Usage

Open `index.html` in any browser. All data stays in `localStorage`. No server, no setup.

---

## Tech

Pure frontend: HTML + CSS + JavaScript (ES6). Zero dependencies, zero backend.

---

## GitHub Pages

**https://share543.github.io/thought-puzzle/**
