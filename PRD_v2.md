# Product Requirements Document
## Website: *Digital Privacy is a Myth\** by Himanshu Jangra
**Version:** 1.0  
**Author:** Himanshu Jangra  
**Date:** May 2026  
**Status:** Draft

---

## 1. Overview

A static multi-page website for the book *Digital Privacy is a Myth\** — hosted on GitHub Pages — serving as the book's primary online home. The site offers a free PDF download, hard-copy purchase links to international Amazon marketplaces, a privacy awareness quiz with a shareable score card, a feedback channel, and an audiobook waitlist. The design is dark-themed, privacy-first, and consistent with the book's visual identity.

---

## 2. Goals

- Drive PDF downloads and hard-copy orders internationally.
- Build an audience for the upcoming audiobook via a waitlist.
- Create a viral, shareable privacy quiz that promotes the book organically.
- Collect optional reader feedback (not for marketing) via Google Sheets.
- Embody the book's values: zero tracking, zero cookies, zero hidden data collection.

---

## 3. Non-Goals

- No Kindle or India Amazon links (quality concerns, intentionally excluded).
- No newsletter, marketing emails, or promotional outreach.
- No user accounts or authentication.
- No server-side infrastructure — 100% static + Google Apps Script.
- No third-party analytics or tracking pixels of any kind.

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages | Free, reliable, already used for BetaReads |
| Architecture | Multi-page static HTML (separate `.html` files) | Simple, fast, no build step |
| Styling | Vanilla CSS with CSS variables | No framework dependency |
| Interactivity | Vanilla JavaScript | Keeps bundle zero |
| Backend | Google Apps Script (Web App) | Same pattern as BetaReads |
| Data store | Google Sheets | Single sheet, two tabs |
| Score card image | HTML5 Canvas API | In-browser image generation, no server |
| Routing | Standard page navigation | No hash router needed for multi-page |

---

## 5. Site Map

```
/
├── index.html          → Home
├── read.html           → Book Preview (Reading Page)
├── quiz.html           → Privacy Awareness Quiz
├── download.html       → Download Modal / Thank You
├── feedback.html       → Reader Feedback
└── privacy.html        → Privacy Policy
```

---

## 6. Design System

### 6.1 Theme
Dark, minimal, slightly editorial. Inspired by surveillance aesthetics — think terminal screens, redacted documents, and encrypted text. No bright colours. Every design choice should feel like it belongs in a book about digital surveillance.

### 6.2 Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-secondary` | `#111111` | Cards, panels |
| `--bg-elevated` | `#1a1a1a` | Modals, hover states |
| `--text-primary` | `#e8e8e8` | Body text |
| `--text-secondary` | `#888888` | Captions, metadata |
| `--accent` | `#00ff9d` | CTAs, highlights — neon green, like a terminal cursor |
| `--accent-dim` | `#00cc7a` | Hover state for accent |
| `--danger` | `#ff4444` | Wrong answers in quiz |
| `--border` | `#222222` | Dividers, card borders |

### 6.3 Typography
- **Primary font:** `JetBrains Mono` (Google Fonts) — monospace, reinforces the technical/hacker aesthetic.
- **Display font:** `Space Grotesk` (Google Fonts) — for headings and display text.
- **Body size:** 16px / 1.7 line height.

### 6.4 Loader
A full-screen loader appears on every page load. Animation concept: a lock icon that assembles itself → then "unlocks" and fades out. Text beneath reads: `Initializing secure connection...` in monospace. Duration: ~1.8s. Implemented in pure CSS/JS, no library.

### 6.5 Cookie Banner
Pinned to bottom of viewport, appears once per session (no localStorage — just a CSS class toggle on `<body>`).

> `🔒 This site uses zero cookies and collects no tracking data. What you read here stays with you.`

Single button: `Got it` — dismisses and hides the banner.

---

## 7. Pages — Detailed Requirements

---

### 7.1 Home (`index.html`)

**Purpose:** First impression. Drive the reader toward downloading, quizzing, or buying.

**Sections:**

**Hero**
- Full-screen, dark. Book cover image (left) + headline (right).
- Headline: *"Your digital life is an open book. This one isn't."*
- Subheadline: author name, ISBN, year.
- Two primary CTAs: `Download Free PDF` → links to `download.html` | `Test Your Privacy IQ` → links to `quiz.html`
- A subtle animated background: slowly scrolling binary/hex data in very low opacity — purely decorative.

**About the Book**
- Short 3–4 sentence description drawn from the book's introduction.
- Pulls out 3 key themes as icon+text cards: Surveillance, Data Harvesting, Reclaiming Control.

**Chapter Snapshot**
- List of all 8 chapters with one-liner descriptions. Links through to `read.html`.
- Chapters:
  - Chapter Zero — The Introduction
  - Chapter One — The Illusion of Privacy
  - Chapter Two — The Data Harvesting Machine
  - Chapter Three — Shattering the Privacy Mirage
  - Chapter Four — Navigating the Threat Landscape
  - Chapter Five — The Regulatory Maze
  - Chapter Six — A World Without Secrets
  - Chapter Seven — Taking Back Control

**Buy Hard Copy**
- Section heading: `Own a Physical Copy`
- Grid of Amazon marketplace cards — flag icon + country name + `Buy on Amazon ↗` button (opens in new tab).
- International marketplaces to include: US, UK, DE, FR, ES, IT, NL, JP, PL, SE, IE, BE, CA.
- Each links to the book's Amazon listing in the respective store.
- Note: No India, No Kindle links.

**Audiobook Waitlist**
- Section heading: `Coming Soon: Audiobook Edition`
- Short teaser copy: *"The audiobook version is in the works. Be the first to know when it drops."*
- A single email input field + `Join Waitlist` button.
- On submit: data is sent to Google Apps Script (same sheet, `waitlist` tab). No validation beyond basic email format check. Confirmation message shown inline: *"You're on the list. We'll reach out when it's ready."*
- Fields sent to sheet: `email`, `source: "waitlist"`, `timestamp`.

**Footer**
- Book name + author.
- Links: Home | Read | Quiz | Feedback | Privacy Policy.
- `© 2025 Himanshu Jangra. All rights reserved.`
- A small line: `Made with zero tracking.`

---

### 7.2 Reading Page (`read.html`)

**Purpose:** Give the reader enough to decide they want the full book — without giving the whole book away.

**Sections:**

**Page Header**
- Book title + subtitle.
- CTA: `Download Free PDF` (sticky on scroll).

**Book Summary**
- 3–4 paragraph summary of the book's core argument and thesis.
- Sourced from the Introduction: the erosion of digital privacy, the data harvesting machine, and the call to action.

**Chapter-by-Chapter Breakdown**
- Expandable accordion for each of the 8 chapters.
- Each entry shows: chapter number, chapter title, a 2–3 sentence summary of what the chapter covers.
- Closed by default; click to expand.

**Sample Excerpt**
- One short passage from the book (from the Introduction — pre-selected, irrevocable).
- Displayed in a styled `<blockquote>` with a subtle left border in the accent colour.
- Below it: `Want to read more? Download the full book free.` → CTA button.

**Download CTA**
- Full-width banner at the bottom of the page.
- `Free. No signup required. Download instantly.`
- Button: `Get the PDF` → links to `download.html`.

---

### 7.3 Privacy Quiz (`quiz.html`)

**Purpose:** Viral, educational, and promotional. Visitors test their digital privacy knowledge, get a scored persona, and share it.

#### 7.3.1 Quiz Flow

1. **Landing state** — Quiz title: *"How Exposed Are You?"* | Subheading: *"5 questions. Real answers. No tracking."* | `Start Quiz` button.

2. **Question state** — One question at a time. Progress indicator: `Question 2 of 5`. Each question has 4 multiple choice options. 

3. **Answer reveal** — Immediately after selecting an answer, the correct answer is highlighted in accent green, wrong answers in red. An explanation card slides in below: 2–3 sentences explaining why that answer is correct or why common assumptions are wrong. A `Next Question` button advances.

4. **Result state** — Score, persona, verdict, and share card.

#### 7.3.2 Question Pool

Questions are randomised from a pool of at least 15, with 5 drawn per session. Questions must be directly grounded in the book's themes.

**Sample questions (representative, not exhaustive — devs should expand to 15+):**

| # | Question | Correct Answer |
|---|---|---|
| Q1 | Incognito/Private mode hides your activity from your internet provider. | False — it only hides from other users of the same device |
| Q2 | Which company type profits most from selling your behavioural data? | Data Brokers |
| Q3 | What is a "chilling effect" in digital surveillance? | Self-censorship due to the awareness of being watched |
| Q4 | GDPR gives EU citizens the right to: | Request deletion of their personal data |
| Q5 | Which action leaves the LEAST digital footprint? | Browsing via a VPN on a public Wi-Fi with DNS-over-HTTPS |
| Q6 | "I have nothing to hide, so I have nothing to fear." This argument is: | Flawed — privacy is a structural right, not just personal secrecy |
| Q7 | What does "data aggregation" mean in the context of privacy? | Combining small harmless data points into a revealing profile |
| Q8 | Which law requires companies to report data breaches within 72 hours? | GDPR (EU) |

#### 7.3.3 Scoring & Personas

Score = number of correct answers out of 5.

| Score | Persona | Verdict Line |
|---|---|---|
| 0–1 | 🔓 The Exposed | *"You're an open book online — and not in a good way. Time to read one."* |
| 2–3 | 👁 The Observed | *"You're aware, but still leaving doors open. You know what to do."* |
| 4 | 🛡 The Cautious | *"You're informed and careful. You'd enjoy the deeper dive."* |
| 5 | 🔐 The Encrypted | *"Rare. You think like a privacy advocate. Now spread the word."* |

#### 7.3.4 Score Card & Share

After results are shown:

**Score card (rendered via Canvas API):**
- Background: dark `#0a0a0a`
- Top: Book name `Digital Privacy is a Myth*` in accent green
- Centre: Persona emoji + name in large text
- Below: Score `4/5` + one-liner verdict
- Bottom: Website URL (e.g. `digitalprivacyisamyth.com`)
- Dimensions: 1080×1080px (square, Instagram/Twitter friendly)

**Buttons below the card:**
- `Save Image` — triggers canvas `toDataURL()` download as PNG.
- `Share` — if Web Share API is available (mobile), triggers native share sheet with the image. Fallback: copy link to clipboard.

**Book promo nudge below share buttons:**
- *"Want to understand every answer? Read the book — it's free."* → `Download PDF` button.

---

### 7.4 Download Page (`download.html`)

**Purpose:** Capture optional feedback contact info, then serve the PDF instantly.

#### 7.4.1 Download Flow

1. Page loads → PDF download **begins immediately** in the background (no gate).
2. Simultaneously, a form is displayed on-screen.

#### 7.4.2 Form

**Heading:** *"Your download has started."*  
**Subheading:** *"We'd love to hear your thoughts once you've read it. Sharing your details is completely optional — we won't use them for promotions."*

**Fields (all optional):**
- Name (text input)
- Email address (email input)
- Phone / WhatsApp number (tel input)
- A checkbox: `I'd also like to join the audiobook waitlist`

**Submit button:** `Send Details` (or skip — a `No thanks, just the download` text link closes/hides the form)

**On submit:**
- POST to Google Apps Script Web App.
- Data written to `readers` tab in Google Sheet.
- Fields written: `name`, `email`, `phone`, `waitlist_opt_in`, `source: "download"`, `timestamp`.
- If `waitlist_opt_in` is checked, also write a row to `waitlist` tab.
- Show thank you message inline: *"Thank you for reading. We'd love your feedback — share it at [feedback email] or visit our [Feedback page](/feedback.html)."*

#### 7.4.3 PDF File
- Hosted directly in the GitHub repo under `/assets/book/` or via a raw GitHub URL.
- Filename: `Digital_Privacy_is_a_Myth_Himanshu_Jangra.pdf`
- Triggered via JS: `window.location.href = '/assets/book/Digital_Privacy_is_a_Myth_Himanshu_Jangra.pdf'` on page load.

---

### 7.5 Feedback Page (`feedback.html`)

**Purpose:** Collect reader feedback post-read. Stored in the same Google Sheet.

**Sections:**

**Header**
- *"Tell us what you thought."*
- Short copy: *"No marketing. No follow-ups unless you ask. Just a human reading your message."*

**Form Fields:**
- Name (optional, text)
- Email (optional, email)
- Phone / WhatsApp (optional, tel)
- Star rating: 1–5 (styled as interactive stars, not a native `<select>`)
- Feedback text (textarea, max 1000 chars, character counter shown)
- `Would you recommend this book?` — Yes / No toggle
- Submit button: `Send Feedback`

**On submit:**
- POST to Google Apps Script Web App.
- Written to `feedback` tab in Google Sheet.
- Fields: `name`, `email`, `phone`, `rating`, `feedback_text`, `recommend`, `source: "feedback_page"`, `timestamp`.
- Inline confirmation: *"We received your message. Thank you for taking the time."*

---

### 7.6 Privacy Policy (`privacy.html`)

**Purpose:** Transparent, honest, and consistent with the book's values. Short and plain-English.

**Content:**

**What we collect (and why)**
- If you voluntarily submit the download or feedback form: name, email, phone/WhatsApp. Used only to read your feedback. Never sold, never shared, never used for marketing.
- If you join the waitlist: email address only. Used to notify you when the audiobook launches.

**What we do NOT collect**
- We use no cookies.
- We use no analytics scripts (no Google Analytics, no Meta Pixel, no tracking of any kind).
- We log no IP addresses.
- We do not use third-party advertising networks.

**Where data is stored**
- Form submissions are stored in a private Google Sheet accessible only to the author.

**Your rights**
- You can request deletion of your data at any time by emailing [contact email].

**Contact**
- [Author contact email]

---

## 8. Google Sheets Backend

### 8.1 Sheet Structure

Single Google Sheet with four tabs:

| Tab Name | Purpose | Columns |
|---|---|---|
| `readers` | Download form submissions | `timestamp`, `name`, `email`, `phone`, `waitlist_opt_in`, `source` |
| `waitlist` | Audiobook waitlist signups | `timestamp`, `email`, `source` |
| `feedback` | Feedback page submissions | `timestamp`, `name`, `email`, `phone`, `rating`, `feedback_text`, `recommend`, `source` |
| `_config` | (Reserved for future use) | — |

### 8.2 Apps Script Web App

- Single deployed Web App URL (`doPost` handler).
- Accepts JSON body with a `type` field: `"download"`, `"waitlist"`, `"feedback"`.
- Routes data to the correct sheet tab based on `type`.
- Returns `{ status: "ok" }` on success.
- CORS headers set to allow requests from the GitHub Pages domain.

**Payload shapes:**

```json
// Download form
{ "type": "download", "name": "...", "email": "...", "phone": "...", "waitlist_opt_in": true }

// Waitlist (from homepage)
{ "type": "waitlist", "email": "..." }

// Feedback page
{ "type": "feedback", "name": "...", "email": "...", "phone": "...", "rating": 4, "feedback_text": "...", "recommend": true }
```

---

## 9. Amazon Marketplace Links

Links open in a new tab. Each should deep-link to the book's specific listing page (ASIN-based URL). Placeholder format until ASINs are confirmed:

| Country | Marketplace | URL Pattern |
|---|---|---|
| United States | amazon.com | `https://www.amazon.com/dp/[ASIN]` |
| United Kingdom | amazon.co.uk | `https://www.amazon.co.uk/dp/[ASIN]` |
| Germany | amazon.de | `https://www.amazon.de/dp/[ASIN]` |
| France | amazon.fr | `https://www.amazon.fr/dp/[ASIN]` |
| Spain | amazon.es | `https://www.amazon.es/dp/[ASIN]` |
| Italy | amazon.it | `https://www.amazon.it/dp/[ASIN]` |
| Netherlands | amazon.nl | `https://www.amazon.nl/dp/[ASIN]` |
| Japan | amazon.co.jp | `https://www.amazon.co.jp/dp/[ASIN]` |
| Poland | amazon.pl | `https://www.amazon.pl/dp/[ASIN]` |
| Sweden | amazon.se | `https://www.amazon.se/dp/[ASIN]` |
| Ireland | amazon.ie | `https://www.amazon.ie/dp/[ASIN]` |
| Belgium | amazon.com.be | `https://www.amazon.com.be/dp/[ASIN]` |
| Canada | amazon.ca | `https://www.amazon.ca/dp/[ASIN]` |

> **Note:** ISBN is `9798305075588`. Use this to locate the ASIN on each marketplace.

---

## 10. Performance & Accessibility

- All pages must score 90+ on Lighthouse (Performance, Accessibility, Best Practices, SEO).
- Images use `loading="lazy"` and have `alt` text.
- All interactive elements are keyboard-accessible.
- Colour contrast ratio ≥ 4.5:1 for all body text.
- No render-blocking resources. Fonts loaded with `font-display: swap`.
- Total page weight target: under 500KB per page (excluding the PDF asset).

---

## 11. SEO & Meta

Each page has:
- Unique `<title>` and `<meta name="description">`.
- Open Graph tags: `og:title`, `og:description`, `og:image` (book cover), `og:url`.
- Twitter Card tags.
- `<link rel="canonical">`.
- `robots.txt` allowing full crawl.
- `sitemap.xml` listing all 6 pages.

---

## 12. Future Scope (v2)

These are intentionally out of scope for v1 but should be architected to allow easy addition:

- **Online reader** — Read the book in-browser without downloading (likely a paginated HTML view or embedded PDF viewer).
- **Audiobook page** — Full page for the audiobook once it launches, converting waitlist members.
- **Multilingual support** — Hindi or other language versions.
- **Quiz expansion** — More question pools, timed mode, leaderboard.
- **Dark/Light toggle** — Optional, since dark is the default and primary experience.

---

## 13. Open Items / Decisions Needed Before Dev

| # | Item | Owner |
|---|---|---|
| 1 | Confirm Amazon ASIN for each marketplace | Himanshu |
| 2 | Confirm final website domain/URL | Himanshu |
| 3 | Provide contact email for privacy policy + feedback nudge | Himanshu |
| 4 | Confirm GitHub repo name (affects GitHub Pages URL) | Himanshu |
| 5 | Confirm book cover image file (high-res PNG/JPG) | Himanshu |
| 6 | Write 15 quiz questions with answer options + explanations | Himanshu + Claude |
| 7 | Write 8 chapter summaries for the Reading page accordion | Himanshu + Claude |
| 8 | Confirm Apps Script deployment URL once sheet is set up | Himanshu |

---

*PRD v1.0 — Digital Privacy is a Myth\* Website — Himanshu Jangra — May 2026*
