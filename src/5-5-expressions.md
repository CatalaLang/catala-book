# Expressions


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


Expressions in Catala represent the meat of computation rules, that appear in
[scope variable
definitions](./5-4-definitions-exceptions.md#definitions-and-exceptions) or in
[global constant definitions](./5-3-scopes-toplevel.md#constants).

~~~admonish tip title="Quick reference of the expressions' BNF grammar" collapsible=true
The Backus-Naur Form ([BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)) grammar
is a convenient format for summarizing what counts as an expression in Catala.
If you're familiar with this format, you can read it below:
```text
<expr> ::=
  | (<expr 1>, <expr 2>, ...)                         # Tuple
  | <expr>.<field name>                               # Structure field access
  | <expr>.<integer>                                  # Tuple component access
  | [<expr 1>; <expr 2>; ...]                         # List
  | <structure> { -- <field name 1>: <expr 1> -- ...} # Structure value
  | <enum variant> content <expr>                     # Enum value
  | <expr 1> of <expr 2>, <expr 3>, ...               # Function call
  | output of <scope name> with                       # Direct scope call
      {  -- <variable 1>: <expr 1> -- ... }
  | match <expr> with pattern                         # Pattern matching
    -- <enum variant 1>: <expr 1>
    -- <enum variant 2> of <variable>: <expr 2>
  | <expr> with pattern <enum variant>                # Pattern variant test
  | <expr> with pattern <enum variant> of <variable>  # Ditto with content binding
  | <expr> but replace                                # Structure partial updates
      {  -- <variable 1>: <expr 1> -- ... }
  | - <expr>                                          # Negation
  | <expr>
    < + - * / and or not xor > < >= <= == != > <expr> # Binary operations
  | if <expr 1> then <expr 2> else <expr 3>           # Conditionals
  | let <variable> equals <expr 1> in <expr 2>        # Local let-binding
  | ...                                               # Variable, literals,
                                                      # list operators, ...
```
~~~

## References to other variables

~~~admonish info title="Accessing a particular state of a scope variable"

~~~


## Values and operations

## Accessing items from other modules

## Local variables and let-bindings

## Structure field access and tuple element access

## Updating structures

## Conditionals

## Pattern matching

## Direct scope call


