build: tree-sitter-catala/libtree-sitter-catala_expr_fr.so

tree-sitter-catala/libtree-sitter-catala_expr_fr.so:
	if ! [ -e tree-sitter-catala ]; then \
	  echo "Please run 'make -C treesitter init' or 'make -C treesitter link' first." >&2; \
	  echo "The former will do a fresh clone, the latter link an existing one in ../" >&2; \
	  exit 1; \
	fi
	make -C tree-sitter-catala full

link:
	ln -sf ../../tree-sitter-catala .

init:
	git clone git@github.com:CatalaLang/tree-sitter-catala

highlights:
	for lg in en fr; do \
	  rm -f catala-*$$lg/highlights.scm; \
	  cp tree-sitter-catala/queries/highlights.scm catala-$$lg/; \
	  sed '/law_\|block\|_METADATA\|_CODE/d' catala-$$lg/highlights.scm > catala-code-$$lg/highlights.scm; \
	  sed '/(label)\|toplevel_def\|SCOPE\|DECREASING\|rule\|rounding_mode\|(typ/d' catala-code-$$lg/highlights.scm > catala-expr-$$lg/highlights.scm; \
	done

relink_so:
	rm -f *.so
	for lg in en fr; do \
	  ln -sf tree-sitter-catala/libtree-sitter-catala_$$lg.so catala-$$lg.so; \
	  ln -sf tree-sitter-catala/libtree-sitter-catala_code_$$lg.so catala-code-$$lg.so; \
	  ln -sf tree-sitter-catala/libtree-sitter-catala_expr_$$lg.so catala-expr-$$lg.so; \
	done
