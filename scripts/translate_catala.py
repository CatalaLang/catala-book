#!/usr/bin/env python3
"""
Diff-aware translation updater for Catala documentation.

Translates only the changed parts of a source file, preserving existing
translations in the target file.

Usage:
  # Update target based on uncommitted changes to src/en/foo.md
  python scripts/translate_catala.py src/en/tutorial.md

  # Update target based on changes since a specific ref
  python scripts/translate_catala.py src/en/tutorial.md --base main

  # Full translation (when target doesn't exist or you want a fresh start)
  python scripts/translate_catala.py src/en/tutorial.md --full

  # Dry run (print to stdout instead of writing)
  python scripts/translate_catala.py src/en/tutorial.md --dry-run

Setup:
  pip install requests
  export GITHUB_TOKEN=$(gh auth token)  # see scripts/README.md for details
"""

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

import requests

GITHUB_MODELS_URL = "https://models.inference.ai.azure.com/chat/completions"
MODEL = "gpt-4o-mini"
CONTEXT_LINES = 20
GRAMMAR_PATH = "treesitter/tree-sitter-catala/catala_en/grammar.js"
GLOSSARY_PATH = "scripts/translation_glossary.txt"


def find_repo_root() -> Path:
    """Find repository root by looking for .git directory."""
    current = Path(__file__).resolve().parent
    while current != current.parent:
        if (current / ".git").exists():
            return current
        current = current.parent
    raise RuntimeError("Could not find repository root")


def parse_catala_keywords() -> dict[str, str]:
    """Parse Catala EN->FR keyword mappings from tree-sitter grammar."""
    repo_root = find_repo_root()
    grammar_file = repo_root / GRAMMAR_PATH

    if not grammar_file.exists():
        print(f"Warning: Grammar file not found at {grammar_file}", file=sys.stderr)
        return {}

    content = grammar_file.read_text(encoding="utf-8")

    en_match = re.search(r'en:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', content, re.DOTALL)
    fr_match = re.search(r'fr:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', content, re.DOTALL)

    if not en_match or not fr_match:
        print("Warning: Could not parse EN/FR blocks from grammar.js", file=sys.stderr)
        return {}

    token_pattern = re.compile(r'(\w+):\s*(?:"([^"]+)"|/([^/]+)/)')

    en_tokens = {
        m.group(1): (m.group(2) or m.group(3)).replace("\\s+", " ").replace("\\s*", " ").strip()
        for m in token_pattern.finditer(en_match.group(1))
    }
    fr_tokens = {
        m.group(1): (m.group(2) or m.group(3)).replace("\\s+", " ").replace("\\s*", " ").strip()
        for m in token_pattern.finditer(fr_match.group(1))
    }

    return {
        en_tokens[k]: fr_tokens[k]
        for k in en_tokens
        if k in fr_tokens and en_tokens[k] != fr_tokens[k]
    }


def load_glossary() -> str:
    """Load the translation glossary file."""
    repo_root = find_repo_root()
    glossary_file = repo_root / GLOSSARY_PATH

    if not glossary_file.exists():
        return ""

    lines = []
    for line in glossary_file.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            lines.append(f"  {stripped}")

    return "\n".join(lines)


def get_rosetta_stone(from_lang: str, to_lang: str) -> str:
    """Generate keyword reference for translation prompt."""
    keywords = parse_catala_keywords()

    if not keywords:
        return "(Keyword mappings unavailable - translate keywords contextually)"

    lines = ["Catala keyword translations (use these EXACTLY in code blocks):"]

    if from_lang == "en":
        for en, fr in sorted(keywords.items()):
            lines.append(f"  {en} -> {fr}")
        lines.extend([
            "",
            "Literal format changes:",
            "  Decimals: 1.5 -> 1,5 (dot to comma)",
            "  Money: $100.00 -> 100,00 € (dollar prefix to euro suffix)",
        ])
    else:
        for en, fr in sorted(keywords.items()):
            lines.append(f"  {fr} -> {en}")
        lines.extend([
            "",
            "Literal format changes:",
            "  Decimals: 1,5 -> 1.5 (comma to dot)",
            "  Money: 100,00 € -> $100.00 (euro suffix to dollar prefix)",
        ])

    glossary = load_glossary()
    if glossary:
        lines.extend(["", "Terminology glossary (use these consistently in prose):", glossary])

    return "\n".join(lines)


def call_llm(messages: list[dict], max_tokens: int = 8000) -> str:
    """Call GitHub Models API."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise RuntimeError(
            "GITHUB_TOKEN required. Run: export GITHUB_TOKEN=$(gh auth token)"
        )

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.2,
    }

    resp = requests.post(GITHUB_MODELS_URL, headers=headers, json=payload, timeout=180)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def detect_language(file_path: str) -> tuple[str, str]:
    """Detect source/target language from file path. Returns (from, to)."""
    if "/en/" in file_path or file_path.startswith("src/en/"):
        return "en", "fr"
    elif "/fr/" in file_path or file_path.startswith("src/fr/"):
        return "fr", "en"
    raise ValueError(f"Cannot detect language from path: {file_path}")


def get_target_path(source_path: str, from_lang: str, to_lang: str) -> str:
    """Convert source path to target language path."""
    return source_path.replace(f"src/{from_lang}/", f"src/{to_lang}/")


def validate_path_in_repo(repo_root: Path, file_path: str, label: str) -> Path:
    """Ensure a path resolves within the repository root.

    Raises ValueError if the path escapes the repository (e.g., via ..).
    """
    resolved = (repo_root / file_path).resolve()
    if not resolved.is_relative_to(repo_root):
        raise ValueError(f"{label} path escapes repository: {file_path}")
    return resolved


def get_source_diff(repo_root: Path, source_path: str, base_ref: str) -> str:
    """Get unified diff of source file against base_ref with context."""
    try:
        result = subprocess.run(
            ["git", "diff", f"-U{CONTEXT_LINES}", base_ref, "--", source_path],
            capture_output=True, text=True, check=True, cwd=repo_root
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Warning: git diff failed: {e.stderr or e}", file=sys.stderr)
        return ""


LANG_NAMES = {"en": "English", "fr": "French"}


def system_prompt(from_lang: str, to_lang: str) -> str:
    """Build the shared system prompt for translation."""
    rosetta = get_rosetta_stone(from_lang, to_lang)

    return f"""You are a technical translator for Catala programming language documentation.

CRITICAL: Catala has LANGUAGE-SPECIFIC KEYWORDS. Code in ```catala blocks must use the correct keywords for the target language.

{rosetta}

Rules:
1. Translate prose naturally and fluently
2. In ```catala code blocks, translate keywords (listed above) AND variable/scope/field names to natural equivalents in the target language (e.g. IncomeTax -> ImpôtSurLeRevenu, income -> revenu)
3. Convert number formats (decimal separator) and currency formats as specified
4. Preserve all markdown formatting exactly
5. Keep URLs, file paths, and technical identifiers unchanged
6. Maintain the same structure (headings, lists, code blocks)"""


def translate_diff(
    diff: str, target_content: str, from_lang: str, to_lang: str
) -> str:
    """Update target file based on source diff."""
    user_prompt = f"""Below is a diff showing changes made to the {LANG_NAMES[from_lang]} source file,
followed by the current {LANG_NAMES[to_lang]} translation.

Apply the equivalent changes to the {LANG_NAMES[to_lang]} translation.
Only modify the parts that correspond to the diff — preserve everything else exactly.

The diff includes {CONTEXT_LINES} lines of context around each change to help you
locate the corresponding section in the translation.

SOURCE DIFF ({LANG_NAMES[from_lang]} changes):
{diff}

CURRENT TRANSLATION ({LANG_NAMES[to_lang]}):
{target_content}

Output the COMPLETE updated {LANG_NAMES[to_lang]} file. Preserve all unchanged sections exactly."""

    return call_llm([
        {"role": "system", "content": system_prompt(from_lang, to_lang)},
        {"role": "user", "content": user_prompt},
    ])


def translate_full(content: str, from_lang: str, to_lang: str) -> str:
    """Full file translation (when no target exists)."""
    user_prompt = f"""Translate this {LANG_NAMES[from_lang]} documentation to {LANG_NAMES[to_lang]}.

Output ONLY the translated content, no explanations or markers.

{content}"""

    return call_llm([
        {"role": "system", "content": system_prompt(from_lang, to_lang)},
        {"role": "user", "content": user_prompt},
    ])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Diff-aware translation for Catala documentation."
    )
    parser.add_argument("source", help="Source file path (e.g. src/en/tutorial.md)")
    parser.add_argument(
        "--base", default="HEAD",
        help="Git ref to diff against (default: HEAD for uncommitted changes)"
    )
    parser.add_argument(
        "--full", action="store_true",
        help="Force full translation (ignore existing target)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print result to stdout instead of writing to target file"
    )
    args = parser.parse_args()

    repo_root = find_repo_root()
    source_path = args.source

    try:
        full_path = validate_path_in_repo(repo_root, source_path, "Source")
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

    if not full_path.exists():
        print(f"Error: {source_path} not found", file=sys.stderr)
        return 1

    from_lang, to_lang = detect_language(source_path)
    target_path = get_target_path(source_path, from_lang, to_lang)

    try:
        target_full = validate_path_in_repo(repo_root, target_path, "Target")
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    target_exists = target_full.exists() and not args.full

    if target_exists:
        # Diff-aware mode
        diff = get_source_diff(repo_root, source_path, args.base)
        if not diff.strip():
            print(f"No changes in {source_path} relative to {args.base}")
            return 0

        print(f"Updating {target_path} based on diff of {source_path} "
              f"(vs {args.base})...", file=sys.stderr)

        target_content = target_full.read_text(encoding="utf-8")
        result = translate_diff(diff, target_content, from_lang, to_lang)
    else:
        # Full translation mode
        if not target_exists and not args.full:
            print(f"Target {target_path} does not exist, doing full translation.",
                  file=sys.stderr)

        print(f"Translating {source_path} -> {target_path}...", file=sys.stderr)

        content = full_path.read_text(encoding="utf-8")
        result = translate_full(content, from_lang, to_lang)

    # Strip markdown fences if the LLM wrapped the output
    result = re.sub(r'^```(?:markdown)?\s*\n', '', result)
    result = re.sub(r'\n```\s*$', '', result)

    if args.dry_run:
        print(result)
    else:
        target_full.parent.mkdir(parents=True, exist_ok=True)
        target_full.write_text(result, encoding="utf-8")
        print(f"Written: {target_path}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
