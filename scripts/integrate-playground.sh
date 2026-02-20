#!/usr/bin/env bash
#
# Integrate playground into mdbook output
#
# This script copies the built playground files into the mdbook output directory
# at /playground/ so they can be deployed together.
#
# Usage:
#   ./scripts/integrate-playground.sh [book-output-dir]
#
# If book-output-dir is not specified, defaults to 'book'

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
PLAYGROUND_DIR="$REPO_ROOT/playground"
BOOK_OUTPUT="${1:-$REPO_ROOT/book/site}"
PLAYGROUND_OUTPUT="$BOOK_OUTPUT/playground"

echo "Integrating playground into book output..."
echo "  Playground source: $PLAYGROUND_DIR"
echo "  Book output: $BOOK_OUTPUT"
echo "  Playground output: $PLAYGROUND_OUTPUT"

# Check that book output exists
if [ ! -d "$BOOK_OUTPUT" ]; then
  echo "Error: Book output directory not found: $BOOK_OUTPUT"
  echo "Build the book first with: mdbook build"
  exit 1
fi

# Check that playground exists
if [ ! -d "$PLAYGROUND_DIR" ]; then
  echo "Error: Playground directory not found: $PLAYGROUND_DIR"
  exit 1
fi

# Create playground output directory (remove if exists to avoid permission issues)
rm -rf "$PLAYGROUND_OUTPUT"
mkdir -p "$PLAYGROUND_OUTPUT"

# Copy playground files
# Include: HTML, JS (except node_modules), CSS, interpreter
echo "Copying playground files..."

# Copy HTML files
for f in "$PLAYGROUND_DIR"/*.html; do
  [ -f "$f" ] && cp -v "$f" "$PLAYGROUND_OUTPUT/"
done

# Copy exercises.json
if [ -f "$PLAYGROUND_DIR/exercises.json" ]; then
  cp -v "$PLAYGROUND_DIR/exercises.json" "$PLAYGROUND_OUTPUT/"
fi

# Copy JS files (catala_web_interpreter.js)
if [ -f "$PLAYGROUND_DIR/catala_web_interpreter.js" ]; then
  cp -vL "$PLAYGROUND_DIR/catala_web_interpreter.js" "$PLAYGROUND_OUTPUT/"
else
  echo "catala_web_interpreter.js not found locally, fetching from CDN..."
  curl -L -o "$PLAYGROUND_OUTPUT/catala_web_interpreter.js" \
    https://assets.catala-lang.org/catala_web_interpreter.js
fi

# Copy CSS directory
if [ -d "$PLAYGROUND_DIR/css" ]; then
  cp -rv "$PLAYGROUND_DIR/css" "$PLAYGROUND_OUTPUT/"
fi

# Copy JS directory
if [ -d "$PLAYGROUND_DIR/js" ]; then
  cp -rv "$PLAYGROUND_DIR/js" "$PLAYGROUND_OUTPUT/"
fi

# Copy Monaco editor if it exists (for local development)
# In production, Monaco CDN is used, so this is optional
if [ -d "$PLAYGROUND_DIR/node_modules/monaco-editor" ]; then
  echo "Copying Monaco editor assets..."
  mkdir -p "$PLAYGROUND_OUTPUT/node_modules"
  cp -r "$PLAYGROUND_DIR/node_modules/monaco-editor" "$PLAYGROUND_OUTPUT/node_modules/"
fi

# Copy examples directory (checkpoint files for exercises)
EXAMPLES_DIR="$REPO_ROOT/examples"
if [ -d "$EXAMPLES_DIR" ]; then
  echo "Copying examples (checkpoint files)..."
  cp -rv "$EXAMPLES_DIR" "$BOOK_OUTPUT/"
else
  echo "Warning: examples/ directory not found - exercises may not load"
fi

# Create symlinks in language dirs for mdbook serve compatibility
# (mdbook serve -d book/site/en makes /en/ the root, so /playground/ needs to be inside)
for lang_dir in "$BOOK_OUTPUT"/en "$BOOK_OUTPUT"/fr; do
  if [ -d "$lang_dir" ]; then
    ln -sfn ../playground "$lang_dir/playground"
    ln -sfn ../examples "$lang_dir/examples"
  fi
done

echo "✓ Playground integrated successfully"
echo "  Files copied to: $PLAYGROUND_OUTPUT"
echo ""
echo "To test locally:"
echo "  cd $BOOK_OUTPUT && python3 -m http.server 8000"
echo "  Open: http://localhost:8000/en/2-1-basic-blocks.html"
echo "  Click the 'Open in Playground' button"
