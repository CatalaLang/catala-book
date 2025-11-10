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

This book attempts to incorporate the principles laid out in the
[Diátaxis](https://diataxis.fr/) framework for writing good documentation.
