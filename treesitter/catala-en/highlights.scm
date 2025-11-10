; highlights.scm

; Classes available (from mdbook-treesitter src):
; type
; constructor
; constant
; constant.builtin
; constant.character
; constant.character.escape
; string
; string.regexp
; string.special
; string.escape
; escape
; comment
; variable
; variable.parameter
; variable.builtin
; variable.other.member
; label
; punctuation
; punctuation.special
; keyword
; keyword.storage.modifier.ref
; keyword.control.conditional
; operator
; function
; function.macro
; tag
; attribute
; namespace
; special
; number


(COMMENT) @comment
(law_heading) @tag
(verb_block) @comment
(directive) @string

(variable) @symbol

(module_name) @namespace
(scope_name) @function
(constructor_name) @variable.parameter
(enum_struct_name) @function

(label) @tag

[(LBRACE) (RBRACE) (LPAREN) (RPAREN) (LBRACKET) (RBRACKET)] @punctuation.special

(toplevel_def [(DECLARATION) (CONTENT) (DEFINED_AS)]* @keyword)

;; upper level (only)
[(SCOPE) (CONSEQUENCE) (DATA) (DEPENDS) (LABEL) (DECLARATION) (CONTEXT) (ENUM) (DEFINITION) (EXCEPTION) (UNDER_CONDITION) (CONDITION) (STRUCT) (ASSERTION) (RULE) (INPUT) (INTERNAL)] @keyword

;; expression level
[(OF) (CONTAINS) (SUM) (STATE) (DEFINED_AS) (MATCH) (WITH_PATT) (BUT_REPLACE) (IF) (THEN) (ELSE) (CONTENT) (WITH) (LET) (IN) (NOT) (TO) (OUTPUT)] @keyword

[(DECREASING) (INCREASING)] @variable.builtin

(rule (NOT)? @constant (FILLED) @variable.builtin)

(rounding_mode (_)* @keyword . (_) @variable.builtin .)

(primitive_typ (WILDCARD) @function (OF)? @function)

(type_variable) @variable

(match_case (WILDCARD) @variable.parameter)

(e_fieldaccess (DOT)* @function)

[(field_name) (TUPLE_INDEX)] @string

(state_label) @tag

[(primitive_typ)] @function
(typ [(OPTION) (LIST)] @function)

(builtin) @keyword

(e_coll_filter [(LIST) (OF) (AMONG) (SUCH) (THAT)] @variable.builtin)
(e_coll_sum [(SUM) (OF) (primitive_typ)] @variable.builtin)
(e_coll_contains (CONTAINS) @operator)
(e_coll_map [(MAP_EACH) (AMONG) (TO)] @variable.builtin)
(e_coll_fold [(COMBINE) (ALL) (AMONG) (IN) (INITIALLY) (WITH)] @variable.builtin)
(e_coll_extremum [(MINIMUM) (MAXIMUM) (OF) (OR_EMPTY) (THEN)] @variable.builtin)
(e_coll_exists [(EXISTS) (AMONG) (SUCH) (THAT)] @variable.builtin)
(e_coll_forall [(FOR) (ALL) (AMONG) (WE_HAVE)] @variable.builtin)
(e_coll_filter_map [(MAP_EACH) (AMONG) (SUCH) (THAT) (TO)] @variable.builtin)
(e_coll_arg_extremum [(CONTENT) (OF) (AMONG) (SUCH) (THAT) (IS) (MINIMUM) (MAXIMUM) (OR_EMPTY) (THEN)] @variable.builtin)

(literal) @number
[(YEAR) (MONTH) (DAY)] @constant.builtin
(e_unop . (_) @function)
(e_binop op:(_) @function)

(ATTRIBUTE) @attribute

[(BEGIN_METADATA) (BEGIN_CODE) (END_CODE)] @comment

[(COMMA) (SEMICOLON)] @punctuation

[(ALT) (COLON)] @punctuation
