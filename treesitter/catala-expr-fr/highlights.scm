; highlights.scm

(COMMENT) @comment

(literal) @constant

(variable) @variable

(module_name) @module
(scope_name) @type
(constructor_name) @constructor
(enum_struct_name) @type


[(LBRACE) (RBRACE) (LPAREN) (RPAREN) (LBRACKET) (RBRACKET)] @punctuation.bracket


;; upper level (only)

;; expression level
[(OF) (CONTAINS) (SUM) (STATE) (DEFINED_AS) (MATCH) (WITH_PATT) (BUT_REPLACE) (IF) (THEN) (ELSE) (CONTENT) (WITH) (LET) (IN) (NOT) (TO)] @keyword




(primitive_typ (WILDCARD) @type (OF)? @type)


(match_case (WILDCARD) @constructor)

(e_fieldaccess (DOT)* @operator)

[(field_name) (TUPLE_INDEX)] @constructor

(state_label) @string

[(primitive_typ)] @type.builtin

(builtin) @function.builtin

(e_coll_filter [(LIST) (OF) (AMONG) (SUCH) (THAT)] @function.builtin)
(e_coll_sum [(SUM) (primitive_typ)] @function.builtin)
(e_coll_contains (CONTAINS) @operator)
(e_coll_map [(MAP_EACH) (AMONG) (TO)] @function.builtin)
(e_coll_fold [(COMBINE) (ALL) (AMONG) (IN) (INITIALLY) (WITH)] @function.builtin)
(e_coll_extremum [(MINIMUM) (MAXIMUM) (OF) (OR_EMPTY) (THEN)] @function.builtin)
(e_coll_exists [(EXISTS) (AMONG) (SUCH) (THAT)] @function.builtin)
(e_coll_forall [(FOR) (ALL) (AMONG) (WE_HAVE)] @function.builtin)
(e_coll_filter_map [(MAP_EACH) (AMONG) (SUCH) (THAT) (TO)] @function.builtin)
(e_coll_arg_extremum [(CONTENT) (OF) (AMONG) (SUCH) (THAT) (IS) (MINIMUM) (MAXIMUM) (OR_EMPTY) (THEN)] @function.builtin)

(literal) @number
[(YEAR) (MONTH) (DAY)] @constant.builtin
(e_unop . (_) @operator)
(e_binop . _ . (_) @operator)

(ATTRIBUTE) @attribute


[(COMMA) (DOT) (SEMICOLON)] @punctuation

[(ALT) (COLON)] @punctuation

