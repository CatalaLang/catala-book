# Expressions

<div id="tocw"></div>

Expressions in Catala represent the meat of computation rules, that appear in [scope variable
definitions](./5-4-definitions-exceptions.md#definitions-and-exceptions) or in [global constant
definitions](./5-3-scopes-toplevel.md#constants).

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
      and <expr>                                      #   and test on the variable
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

Inside an expression, you can refer to the name of other variables of the same
scope, or to [toplevel constants and functions](./5-3-scopes-toplevel.md#global-constant-and-functions-declarations-and-definitions).

~~~admonish info title="Accessing a particular state of a scope variable"
Some scope variables can have [multiple states](./5-4-definitions-exceptions.md#scope-variables-with-multiple-states).
Suppose you have scope variable `foo` has states `bar` and `baz` in this order.
You can either refer to `foo`, `foo state bar` or `foo state baz`, but the ability
or meaning of these reference depend on the context according to the following
rules.

* Inside the expression of `definition foo state bar`, you cannot refer to `foo`, nor `foo state bar`
  neither `foo state baz`, since `bar` is the first state and `foo` is being defined for the first state.
* Inside the expression of `definition foo state baz`, you can refer to `foo` and it will
  actually refer to the previously defined state for `foo`, here `bar`. So `foo`
  and `foo state bar` are equivalent in this context, and you cannot refer to
  `foo state baz` since it is being defined.
* Outside the definitions of `foo`, you can refer to `foo state bar` and
  `foo state baz`. It you refer simply to `foo`, it will default to the last
  state, here `baz`.
* If `foo` in an `input` variable of the scope, then its first state cannot
  be defined and will be valued by the argument of the scope when it is being
  called.
~~~

To reference a variable from another [module](./5-6-modules.md), use the syntax
`<name of module>.<name of variable>`.

## Values and operations

All the [values and operations](./5-2-types.md) previously presented are
fully-fledged expressions.

## Parenthesis

You can use parenthesis `(...)` around any part or sub-part of an expression
to make sure that the compiler will understand correctly what you are typing.

## Local variables and let-bindings

Inside a complex `definition` of a scope variable, it is often useful to give a name to an
intermediate quantity to promote its reuse, or simply to make the [code more
readable](https://www.amazon.fr/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). While it
is always possible to introduce a new [scope
variable](./5-3-scopes-toplevel.md#scope-variable-declarations) to that effect, you can also use a
lighter local variable that only affects the current expression. The syntax for these is `let foo
equals ... in ...`. For instance :

```catala-code-en
scope Bar:
  definition baz equals
    let foo equals [4; 6; 5; 1] in
    sum integer of foo - maximum of foo
```

~~~admonish info title="Tuples and local let-bindings"
If you have a value `x` of type `(integer, boolean)`, you can use
`x.0` and `x.1` to access the two components of the tuple. But you can also
bind the two components to two new variables `y` and `z` with:

```catala-expr-en
let (y, z) = x in
if z then y else 0
```

This syntax mirrors the more general use of patterns in let-bindings in functional programming
languages like OCaml and Haskell. However, for the moment, only tuples can be
destructured like that.
~~~

## Conditionals

You are encouraged to use [exceptions to scope variable
definitions](./5-4-definitions-exceptions.md#exceptions-and-priorities) to encode the base
case/exception logic of legal texts. Only exceptions and conditional definitions of scope variables
allow you to split your Catala code into [small
chunks](./5-1-literate-programming.md#literate-programming), each attached to the piece of legal
text it encodes.

However, sometimes, it makes just sense to use a regular old conditional inside an expression to
distinguish between two cases. In that case, use the traditional `if ... then ... else ...`. Note
that you have to include the `else` everytime since this conditional is an expression always
yielding a value and not a statement that conditionally updates some memory cell.

## Structures

As explained [previously](./5-2-types.md#structures), structure values are built with the following
syntax:

```catala-expr-en
Individual {
  -- birth_date: |1930-09-11|
  -- income: $100,000
  -- number_of_children: 2
}
```
To access the field of a structure, simply use the syntax <struct value>.<field name>, like
`individual.income`.

~~~admonish tip title="Updating structures concisely"
Suppose you have a value `foo` containing a big structure `Bar` with a dozen fields,
including `baz`. You want to obtain a new structure value similar to `foo`
but with a different value for bar. You could write:

```catala-expr-en
Bar {
  -- baz: 42
  -- fizz: foo.fizz
  -- ...
}
```

But this is very tedious as you have to copy over all the fields. Instead, you can
write:

```catala-expr-en
foo but replace { -- baz: 42 }
```
~~~

## Enumerations

As explained [previously](./5-2-types.md#enumerations), the type of each case of the enumeration is
mandatory and introduced by `content`. It is possible to nest enumerations (declaring the type of a
field of an enumeration as another enumeration or structure), but not recursively.

Enumeration values are built with the following syntax:

```catala-expr-en
# First case
NoTaxCredit,
# Second case
TaxCreditForIndividual content Individual {
    -- birth_date: |1930-09-11|
    -- income: $100,000
    -- number_of_children: 2
},
# Third case
TaxCreditAfterDate content |2000-01-01|
```

## Pattern matching

Pattern matching is a popular programming language feature that comes from functional programming,
introduced in the mainstream by [Rust](https://doc.rust-lang.org/book/ch19-00-patterns.html), but
followed by other languages like
[Java](https://docs.oracle.com/en/java/javase/17/language/pattern-matching.html) or
[Python](https://peps.python.org/pep-0636/). In Catala, pattern matching works
on enumeration values whose type has been [declared by the user](./5-2-types.md#enumerations).
Suppose you have declared the type

```catala-code-en
declaration enumeration NoTaxCredit:
  -- NoTaxCredit
  -- TaxCreditForIndividual content Individual
  -- TaxCreditAfterDate content date
```

and you have a value `foo` of type `NoTaxCredit`. `foo` is either an instance
of `NoTaxCredit`, or `TaxCreditForIndividual`, or `TaxCreditAfterDate`. If
you want to use `foo`, you have to provide instructions for what to do in each of
the three cases, since you don't know in advance which one it will be. This
is the purpose of pattern matching; in each of the case, provide an
expression yielding what should be the result in this case. These case-expressions
can also use the contents stored inside the case of the enumerations, making
pattern matching a powerful an intuitive way to "inspect" nested content.
For instance, here is the pattern matching syntax to compute the tax credit
in our example:

```catala-expr-en
match foo with pattern
-- NoTaxCredit: $0
-- TaxCreditForIndividual content individual: individual.income * 10%
-- TaxCreditAfterDate content date: if today >= date then $1000 else $0
```

In `TaxCreditForIndividual content individual`, while `TaxCreditForIndividual` is
the name of the enumeration case being inspected, `individual` is a user-chosen
variable name standing for the content of this enumeration case. In other words:
you can choose your own name for the variable in the syntax at this location!

Importantly, pattern matching also helps you avoid forgetting cases to handle.
Indeed, if you declare a case in the type but forget it in the pattern matching,
you will get a compiler error.

~~~admonish tip title="Match all case in pattern matching"
Often, the result of the pattern matching should be the same in a lot of cases,
leading you to repeat the same result expression for each enumeration case.
For conciseness and precision, you can use the `anything` catch-all case as
the last case of your pattern matching. For instance, here this computes whether
you should apply a tax credit or not:

```catala-expr-en
match foo with pattern
-- NoTaxCredit: true
-- anything: false
```
~~~

~~~admonish info title="Testing for a specific case"
You can create a boolean test for a specific case of an enum value with
pattern matching:

```catala-expr-en
match foo with pattern
-- TaxCreditForIndividual content individual: true
-- anything: false
```

However, writing this full pattern matching for a simple boolean test
of a specific case is cumbersome. Catala offers a [sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)
to make things more concise; the code below is exactly equivalent to the code
above.

```catala-expr-en
foo with pattern TaxCreditForIndividual
```

Now suppose you want to test whether `foo` is `TaxCreditForIndividual`
and that the `individual`'s income is greater than $10,000. You could write:

```catala-expr-en
match foo with pattern
-- TaxCreditForIndividual content individual: individual.income >= $10,000
-- anything: false
```

But instead you can also write the more concise:

```catala-expr-en
foo with pattern TaxCreditForIndividual content individual and individual.income >= $10,000
```
~~~

~~~admonish question title="Is Catala's pattern matching as powerful as OCaml or Haskell's?" collapsible=true
No, currently Catala's pattern matching is bare-bones and allows only to
match the outer-most enumeration type of the value. The Catala team has
[plans](https://github.com/CatalaLang/catala/issues/199)
to gradually implement more advanced pattern matching features, but they
have not yet been implemented.
~~~

## Tuples

As explained [previously](./5-2-types.md#tuples), you can build tuple values with the following
syntax:

```catala-expr-en
(|2024-04-01|, $30, 1%) # This values has type (date, money, decimal)
```

You can also access the `n`-th element of a tuple, starting at `1`, with the syntax `<tuple>.n`.

## Lists


You can build list values using the following syntax:

```catala-expr-en
[1; 6; -4; 846645; 0]
```

All the operations available for lists are [available on the relevant reference
page](./5-2-types.md#list-operations).

## Function calls

To call function `foo` with arguments `1`, `baz` and `true`, the syntax is:

```catala-expr-en
foo of 1, baz, true
```

The functions that you can call are either user-defined [toplevel functions](./5-3-scopes-toplevel.md#functions),
or builtin operators like [`get_day`](./5-2-types.md#date-operations). To call
a scope like a function, see just below.

## Direct scope calls

The Catala team advocates using [sub-scope
declarations](./5-3-scopes-toplevel.md#sub-scopes-declarations) and [sub-scope
calling](./5-4-definitions-exceptions.md#sub-scope-calling) when possible (with
a single, static sub-scope call), because it enables using conditional
definitions and exceptions on the arguments of the sub-scope. However, sometimes
a scope has to be called dynamically under certain conditions or inside a loop,
which makes impossible to use the former mechanism. In these situations, you can
use direct scope calls which are the equivalent of direct function calls, but
for scopes, as an expression. For instance, suppose you are inside an expression
and want to call scope `Foo` with arguments `bar` and `baz`; the syntax is:

```catala-expr-en
output of Foo with {
  -- bar: 0
  -- baz: true
}
```

Note that the value returned by the above is the [scope output
structure](./5-3-scopes-toplevel.md#scope-output-structure) of `Foo`, containing
one field per output variable. You can store this output value in a [local
variable](./5-5-expressions.md#local-variables-and-let-bindings) and then
[access its fields](./5-5-expressions.md#structures) to retrieve the values
for each output variable.


## "Impossible" cases

When some cases are not expected to happen in the normal execution flow of a
program, they can be marked as `impossible`. This makes the intent of the
programmer clear, and removes the need to write a place-holder value. If, during
execution, `impossible` is reached, the program will abort with a fatal error.

It is advised to always accompany `impossible` with a comment justifying why the
case is deemed impossible.

`impossible` has type `anything`, so that it can be used in place of any value.
For example:

```catala-expr-en
match foo with pattern
-- TaxCreditForIndividual content individual : individual.birth_date
-- anything :
   impossible # We know that foo is not in any other form at this point because...
```

Be careful that any value that is not guarded by conditions may be computed,
even if not directly needed to compute the result (in other words, Catala is not
a _lazy_ language). Therefore, `impossible` is not fit to initialise fields of
structures, for example, even if those fields are never used.
