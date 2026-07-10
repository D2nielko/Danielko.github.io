# Content authoring guide

This directory is content only — it is not itself a route. The site reads
`content/posts/` and `content/icpc/` (via `src/lib/content.ts`); nothing in
`content/` root (including this file) is picked up as a page.

## Adding a post

1. Create a new file in `content/posts/` (general writing: frontier AI,
   SWE, quant) or `content/icpc/` (competitive programming prep notes).
2. Name the file after the slug you want, e.g. `content/posts/my-post.mdx`
   becomes `/posts/my-post`.
3. Add frontmatter (see templates below).
4. Write the body in GitHub-flavored Markdown. Fenced code blocks are
   shiki-highlighted (python and cpp verified); inline math uses
   `$...$` and display math uses `$$...$$` (KaTeX).
5. Run `npm run build` and check the route appears where you expect.

### Frontmatter template — `content/posts/`

```yaml
---
title: "Post title"
date: "yyyy-mm-dd"
description: "One sentence, optional."
category: "frontier-ai" # or "swe" | "quant"
draft: false # optional, omit if not a draft
---
```

### Frontmatter template — `content/icpc/`

```yaml
---
title: "Note title"
date: "yyyy-mm-dd"
description: "One sentence, optional."
topics: ["graphs", "shortest-paths"] # array of strings, optional
draft: false # optional, omit if not a draft
---
```

`title` and `date` are required in both sections. `date` must be a quoted
`"yyyy-mm-dd"` string.

## `.md` vs `.mdx`

Use `.mdx` by default. MDX parses raw `<` and `{` characters in prose as
JSX, so if your prose (outside of fenced code blocks) contains things like
`vector<int>`, `a < b`, or literal `{` braces, switch the file extension to
`.md` instead — plain Markdown doesn't try to parse those as JSX, and the
content pipeline picks the parser based on file extension.

Fenced code blocks (```cpp, ```python, etc.) are safe in both `.md` and
`.mdx` — the JSX parser doesn't run on code fence contents. The problem is
only ever `<` or `{` appearing directly in prose text.

If unsure, write in `.mdx` and only switch to `.md` if the build fails on
that file.

## Draft behavior

Set `draft: true` in frontmatter to hide a post. Drafts are:

- **Excluded** from the page list, the individual route, RSS feed, and
  sitemap in production builds (`npm run build`).
- **Visible** when running `npm run dev`, so you can preview drafts
  locally before publishing.

To publish, remove `draft: true` (or set it to `false`) and rebuild.

## Where things render

- `content/posts/*` → `/posts` (index) and `/posts/[slug]` (individual
  posts).
- `content/icpc/*` → `/icpc` (index) and `/icpc/[slug]` (individual notes).
- Both sections feed into the home page, the site-wide and per-section RSS
  feeds (`/feed.xml`, `/posts/feed.xml`, `/icpc/feed.xml`), and
  `/sitemap.xml`.
