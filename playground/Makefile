.PHONY: typecheck grammar test dev lint fetch-interpreter link-interpreter

# Type-check JavaScript modules
typecheck:
	npm run typecheck

# Lint JavaScript
lint:
	npm run lint

# Fetch keywords from tree-sitter-catala and generate js/grammar.js
grammar:
	node scripts/fetch-grammar.cjs

# Run integration test (requires playwright: npx playwright install chromium)
test:
	node scripts/integration-test.cjs

# Fetch web interpreter from catala assets
fetch-interpreter:
	curl -L -o catala_web_interpreter.js https://assets.catala-lang.org/catala_web_interpreter.js

# For local dev: symlink to local catala build
link-interpreter:
	ln -sf ../../catala/_build/default/compiler/web/catala_web_interpreter.bc.js catala_web_interpreter.js

# Check for missing files, then serve
dev:
	@if [ ! -f catala_web_interpreter.js ]; then \
		echo "Fetching interpreter from CDN..."; \
		rm -f catala_web_interpreter.js; \
		$(MAKE) fetch-interpreter; \
	fi
	@if [ ! -f js/grammar.js ]; then $(MAKE) grammar; fi
	@echo "Starting server at http://localhost:8080"
	python3 -m http.server 8080
