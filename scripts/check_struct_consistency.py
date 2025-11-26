#!/usr/bin/env python3
"""
Check that SUMMARY.md link structures are consistent across languages.

- Languages are configured in LANGS.
- For each language, parses src/<lang>/SUMMARY.md.
- Extracts all non-commented Markdown links to .md files (order-preserving).
- Compares each language to the first language in LANGS (baseline).
- If all match exactly (same items and same order), exits silently with code 0.
- Otherwise, prints discrepancies and exits with code 1.

Policy:
- We compare the relative link targets as written in SUMMARY.md (normalized path),
  ignoring HTML comments and code fences.
- We catch:
  a) misspellings / filename mismatches (filenames must be identical and English-based),
  b) content present in one language but not in another (missing/extra),
  c) ordering differences.

Limitations:
- Only inline Markdown links [title](path.md) are considered.
- HTML comment blocks <!-- ... --> are removed before parsing.
- Code fences ```...``` are ignored.
"""

from __future__ import annotations

import os
import re
import sys
import posixpath
from typing import List, Dict


LANGS: List[str] = ["en", "fr"]  # Extend by adding language codes here, keeping the first as baseline.


def read_text(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"ERROR: SUMMARY not found: {path}", file=sys.stderr)
        sys.exit(1)


def strip_html_comments(s: str) -> str:
    # Remove HTML comments, including multi-line
    return re.sub(r"<!--.*?-->", "", s, flags=re.DOTALL)


def strip_code_fences(s: str) -> str:
    # Remove fenced code blocks ```...```
    out_lines: List[str] = []
    fenced = False
    fence_re = re.compile(r"^\s*```")
    for line in s.splitlines():
        if fence_re.match(line):
            fenced = not fenced
            continue
        if not fenced:
            out_lines.append(line)
    return "\n".join(out_lines)


def extract_md_links(s: str) -> List[str]:
    """
    Return an ordered list of normalized .md link targets from the SUMMARY content.
    Only non-commented, non-fenced sections are considered.
    """
    # Remove HTML comments and fenced code
    s = strip_html_comments(s)
    s = strip_code_fences(s)

    # Regex for Markdown inline links: [label](target)
    link_re = re.compile(r"\[[^\]]*\]\(([^)]+)\)")

    links: List[str] = []
    for line in s.splitlines():
        for m in link_re.finditer(line):
            raw_target = m.group(1).strip()
            # Remove anchors or query parameters
            target = raw_target.split("#", 1)[0].split("?", 1)[0].strip()
            if not target.lower().endswith(".md"):
                continue
            # Normalize path to a posix-like relative path
            target = target.lstrip("./")
            target = target.lstrip("/")  # ensure relative
            target = posixpath.normpath(target)
            links.append(target)
    return links


def compare_sequences(baseline: List[str], other: List[str], base_lang: str, other_lang: str) -> List[str]:
    discrepancies: List[str] = []
    base_set = set(baseline)
    other_set = set(other)

    missing = [x for x in baseline if x not in other_set]
    extra = [x for x in other if x not in base_set]

    if missing:
        discrepancies.append(f"[{other_lang}] Missing entries compared to {base_lang}:")
        discrepancies.extend(f"  - {x}" for x in missing)
    if extra:
        discrepancies.append(f"[{other_lang}] Extra entries not present in {base_lang}:")
        discrepancies.extend(f"  - {x}" for x in extra)

    # If sets match, check order differences
    if not missing and not extra:
        if len(baseline) != len(other):
            discrepancies.append(
                f"[{other_lang}] Different number of entries (baseline={len(baseline)}, {other_lang}={len(other)})"
            )
        else:
            first_mismatch = None
            for i, (b, o) in enumerate(zip(baseline, other)):
                if b != o:
                    first_mismatch = i
                    break
            if first_mismatch is not None:
                i = first_mismatch
                discrepancies.append(
                    f"[{other_lang}] Order mismatch at index {i}: {base_lang}='{baseline[i]}' vs {other_lang}='{other[i]}'"
                )

    return discrepancies


def main() -> int:
    root = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(root, os.pardir))

    # Load links per language
    links_by_lang: Dict[str, List[str]] = {}
    for lang in LANGS:
        summary_path = os.path.join(project_root, "src", lang, "SUMMARY.md")
        text = read_text(summary_path)
        links = extract_md_links(text)
        links_by_lang[lang] = links

    base_lang = LANGS[0]
    baseline = links_by_lang[base_lang]

    all_discrepancies: List[str] = []
    for lang in LANGS[1:]:
        d = compare_sequences(baseline, links_by_lang[lang], base_lang, lang)
        all_discrepancies.extend(d)

    if all_discrepancies:
        print("SUMMARY.md discrepancies detected:")
        for line in all_discrepancies:
            print(line)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
