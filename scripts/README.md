# Scripts

## `translate_catala.py` — Diff-aware translation

Translates documentation between EN and FR, preserving existing translations
by only updating sections that changed. Aware of Catala keyword mappings
(parsed from the tree-sitter grammar) and number/currency format conventions.

```bash
# Update French translation based on uncommitted changes
python scripts/translate_catala.py src/en/tutorial.md

# Update based on changes since a specific ref
python scripts/translate_catala.py src/en/tutorial.md --base main

# Full translation (when target doesn't exist or for a fresh start)
python scripts/translate_catala.py src/en/tutorial.md --full

# Preview to stdout without writing
python scripts/translate_catala.py src/en/tutorial.md --dry-run
```

### Requirements

```bash
pip install requests
```

### GitHub Models token

The script uses [GitHub Models](https://docs.github.com/en/github-models) for
LLM inference. You need a GitHub personal access token.

**Option 1 — GitHub CLI (easiest):**

```bash
export GITHUB_TOKEN=$(gh auth token)
```

**Option 2 — Personal Access Token (classic):**

Classic PATs have implicit access to GitHub Models (no special scope required).

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. `export GITHUB_TOKEN="ghp_..."`

**Option 3 — Fine-grained Personal Access Token:**

1. Go to https://github.com/settings/personal-access-tokens/new
2. Under "Permissions" > "Account permissions", set "Models" to "Read"
3. `export GITHUB_TOKEN="github_pat_..."`

### Translation glossary

The file `scripts/translation_glossary.txt` contains terminology conventions
that are always included in the translation prompt. Edit it to add domain terms,
style choices (e.g. tu/vous), or recurring expressions that should be translated
consistently.

Format:
```
# Comments start with #
EN term -> FR term
```

## `check_struct_consistency.py` — SUMMARY.md structure check (CI)

Used in CI to verify that `SUMMARY.md` link structures are consistent across
languages (same files, same order). Not typically run locally.
