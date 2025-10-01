
SRC = $(wildcard *.catala_en)

%.typecheck: %
	clerk typecheck -I src $^
.PHONY: %.typecheck

typecheck: $(addsuffix .typecheck,$(SRC))
