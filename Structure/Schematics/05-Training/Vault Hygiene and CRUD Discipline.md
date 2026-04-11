---
title: Vault Hygiene and CRUD Discipline
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - training
  - vault
  - obsidian
  - hygiene
  - discipline
priority: high
status: active
---

# Vault Hygiene and CRUD Discipline

> Rules for keeping Structure/Schematics clean, navigable, and safe for Obsidian.

## Core Rules

### 1. Every Folder Has An index.md
No folder without an `index.md`. It explains what the folder is, lists its files, and cross-links to connected systems.

### 2. YAML Frontmatter Is Mandatory
Every note starts with YAML frontmatter:
```yaml
---
title:
created:
updated:
author:
tags:
priority:
status:
---
```
Never skip frontmatter. It is how Obsidian sorts, filters, and navigates.

### 3. Wiki Links Use Double Brackets
`[[Note Name]]` — not bare links, not relative paths when a wiki link will work.
For cross-vault or repo links: use the full relative path.

### 4. File Names Match Title
No spaces replaced with underscores in Schematics. Spaces are fine in filenames here.
Exception: Obsidian `index.md` is always lowercase.

### 5. Do Not Move Files Without Updating All Links
Moving a file without updating backlinks breaks Obsidian navigation.
If a file must move: update `index.md` in old folder, `index.md` in new folder, and the root `index.md`.

### 6. Dates In ISO Format
`YYYY-MM-DD`. Not `April 11` or `11-04`. Always ISO.

### 7. No Duplicate Content
If content exists in one note, link to it — do not copy it into a second note.
KasiLink Schematics → Anthropic Schematics for deep content. KasiLink holds KasiLink-specific content.

### 8. Deletion Is Permanent — Archive First
Before deleting a note, check if it has backlinks. If yes, archive it to the `06-Reference/Archive/` folder instead.

### 9. Templates Are In Templates/
Always use the templates in `Structure/Schematics/Templates/` when creating a new session, incident, idea, or plan-mode note.

### 10. CRUD Order
- **Create** only when the note is genuinely new content
- **Read** before editing — always read the file first
- **Update** existing notes before creating new ones on the same topic
- **Delete** only after archiving — and only with Master's instruction

## Connected Notes

- [[Templates Index]] — all available templates
- [[AI Editor Rules]] — mandatory pre-session reading
- [[Schematics Index]] — root vault map
