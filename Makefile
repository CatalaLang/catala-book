
build: treesit-prepare
	mdbook build

serve: treesit-prepare
	mdbook serve

clean:
	mdbook clean

cargo-deps:
	cargo install mdbook mdbook-admonish mdbook-mermaid mdbook-toc mdbook-tocjs mdbook-linkcheck mdbook-cmdrun
	cargo install mdbook-treesitter --git https://github.com/AltGr/mdbook-treesitter.git

treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so:
	make -C treesitter build

treesit-prepare: treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so
