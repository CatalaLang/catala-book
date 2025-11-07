# The Catala book

This book relies on the [mdbook](https://github.com/rust-lang/mdBook) utility
for creating HTML books from Markdown files.

The dependencies for building the book can be installed through `cargo` with:

    make cargo-deps

For the tree-sitter highlighting to work, you need to have a clone of
tree-sitter-catala fully built in `../tree-sitter-catala`.

The book can be previewed locally
in a Web browser using the following command:

    mdbook serve --open

This book should incorporate the principles laid out in the
[Diátaxis](https://diataxis.fr/) framework for writing good documentation.
