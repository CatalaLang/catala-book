
SRC = $(wildcard *.catala_en)

%.typecheck: %
	catala typecheck -I src $^
.PHONY: %.typecheck

typecheck: $(addsuffix .typecheck,$(SRC))
