build: treesit-prepare
	# Fresh output root
	rm -rf book/site
	mkdir -p book/site
	# Build English version
	rm -rf book/site/en
	MDBOOK_BOOK__LANGUAGE="en" \
	MDBOOK_BOOK__SRC="src/en" \
	mdbook build -d book/site/en
	# Move HTML content to root of language dir to avoid /html/ in URL
	mv book/site/en/html/* book/site/en/ && rm -rf book/site/en/html
	# Build French version
	rm -rf book/site/fr
	# TEMP: Remove ADDITIONAL_JS and src/fr/fr-banner.js when translation stabilizes
	# Note: ADDITIONAL_JS env var replaces (not appends), so must include all base scripts
	MDBOOK_BOOK__LANGUAGE="fr" \
	MDBOOK_BOOK__SRC="src/fr" \
	MDBOOK_BOOK__TITLE="Le langage de programmation Catala" \
	MDBOOK_OUTPUT__HTML__ADDITIONAL_JS='["mermaid.min.js", "mermaid-init.js", "playground-button.js", "fr-banner.js"]' \
	mdbook build -d book/site/fr
	# Move HTML content to root of language dir
	mv book/site/fr/html/* book/site/fr/ && rm -rf book/site/fr/html
	# Create root redirect to English
	echo '<meta http-equiv="refresh" content="0; url=en/index.html">' > book/site/index.html
	echo '<script>window.location.href = "en/index.html"</script>' >> book/site/index.html
	# Integrate playground
	./scripts/integrate-playground.sh book/site

dev: treesit-prepare
	@# Ensure interpreter is available
	@if [ ! -f playground/catala_web_interpreter.js ]; then \
		echo "Fetching interpreter from CDN..."; \
		rm -f playground/catala_web_interpreter.js; \
		curl -L -o playground/catala_web_interpreter.js \
			https://assets.catala-lang.org/catala_web_interpreter.js; \
	fi
	@if [ ! -f playground/js/grammar.js ]; then \
		$(MAKE) -C playground grammar; \
	fi
	$(MAKE) build
	@echo ""
	@echo "  Playground: http://localhost:8000/playground/index.html"
	@echo "  Tutorial:   http://localhost:8000/playground/learn.html"
	@echo ""
	cd book/site && python3 -m http.server 8000

serve: treesit-prepare
	# Default: serve English version
	mdbook serve -d book/site/en

servefr: treesit-prepare
	# TEMP: Remove ADDITIONAL_JS and src/fr/fr-banner.js when translation stabilizes
	MDBOOK_BOOK__LANGUAGE="fr" \
	MDBOOK_BOOK__SRC="src/fr" \
	MDBOOK_BOOK__TITLE="Le langage de programmation Catala" \
	MDBOOK_OUTPUT__HTML__ADDITIONAL_JS='["fr-banner.js"]' \
	mdbook serve -d book/site/fr

clean:
	mdbook clean

cargo-deps-nomdbook:
	cargo install mdbook-admonish mdbook-mermaid@0.16.2 mdbook-toc@0.14.2 mdbook-tocjs@0.1.4 mdbook-linkcheck mdbook-cmdrun
	cargo install mdbook-treesitter --git https://github.com/AltGr/mdbook-treesitter.git

cargo-deps: cargo-deps-nomdbook
	cargo install mdbook@0.4.52

treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so:
	make -C treesitter build

treesit-prepare: treesitter/tree-sitter-catala/libtree-sitter-catala_expr_fr.so
