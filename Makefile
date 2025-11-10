
build: treesit-prepare
	mdbook build

serve: treesit-prepare
	mdbook serve

clean:
	mdbook clean

cargo-deps-nomdbook:
	cargo install mdbook-admonish mdbook-mermaid mdbook-toc mdbook-tocjs mdbook-linkcheck mdbook-cmdrun tree-sitter-cli
	cargo install mdbook-treesitter --git https://github.com/AltGr/mdbook-treesitter.git

cargo-deps: cargo-deps-nomdbook
	cargo install mdbook

treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so:
	make -C treesitter build

treesit-prepare: treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so
