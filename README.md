# The Catala book

This book relies on the [mdbook](https://github.com/rust-lang/mdBook) utility
for creating HTML books from Markdown files.

The dependencies for building the book can be installed through `cargo` with:

    make cargo-deps

To get the tree-sitter parsers ready, either
- use an existing clone of tree-sitter-catala sitting alongside this repo:
      make -C treesitter link build
- use a fresh clone, locally to this project
      make -C treesitter init build

The book can then be previewed locally in a Web browser using the following
command:

    mdbook serve --open

## Building with Playground Integration

The book includes an integrated interactive playground for tutorial chapters.
To build the complete site with playground:

    make build

This creates `book/site/` with:
- `/en/` - English book
- `/fr/` - French book
- `/playground/` - Interactive playground

Tutorial chapters (2-1, 2-2, etc.) will show a floating "Try Tutorial" button
that launches the integrated learning environment.

## Documentation Framework

This book attempts to incorporate the principles laid out in the
[Diátaxis](https://diataxis.fr/) framework for writing good documentation.
