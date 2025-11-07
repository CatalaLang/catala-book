# Definitions and exceptions

<div id="tocw"></div>

While the [previous reference section](./5-3-scopes-toplevel.md) covered the
declaration of scopes (introduced by `declaration scope Foo`) that have to be done once
for each scope in the codebase, this section covers the definition of scope
variables scattered across the literate programming codebase (introduced by
`scope Foo`).


~~~admonish info title="Everything happens inside a scope"
Scope variable definitions and assertions only make sense inside a given scope,
which is why all the examples below will show the feature inside a `scope Foo`
block that is assumed to have already been declared elsewhere.
~~~

The full syntax of what will be covered in this section is :

```catala-code-en
scope <scope_name>:
  [label <label_name>]
  [exception <label_name>]
  definition <scope_variable_name>
    [of <parameters>] [state <state_name>]
    [under condition <expression> consequence]
    equals <expression>

  assertion <expression>
```

## Scope variable definitions

Scope variable definitions is where the bulk of the Catala code will live.
Defining a variable `bar` inside scope `Foo` as the value 42 is as simple as:

```catala-code-en
scope Foo:
  definition bar equals 42
```

Of course, you can swap 42 by any [expression](./5-5-expressions.md) as long it
has the correct type with respect to the scope variable declaration.

### Scope variables that are functions

If the scope variable you are defining is a function variable, for instance if `bar`
is a function of scope `Foo` with arguments `x` and `y`, then the syntax
for definition the variable is:

```catala-code-en
scope Foo:
  definition bar of x,y equals x + y
```

### Scope variables with multiple states

If the scope variable has several [states](./5-3-scopes-toplevel.md#variable-state-declarations),
for instance if `bar` has states `beginning`, `middle` and `last`, then the syntax for defining
the state `middle` of the variable is:

```catala-code-en
scope Foo:
  definition bar state middle equals bar * 2
  # "bar" above refers to the value of bar in the previous state,
  # here "beginning"
```

Variable states and functions mix this way:

```catala-code-en
scope Foo:
  definition bar of x, y state middle equals (bar of x, y) * 2 + x + y
```

### Scope variables that are `condition`

The `condition` scope variables (boolean scope variables with a default
value of `false`) have a different, lawyer-friendly syntax for the definitions:
`definition` is replaced by `rule` and `equals <expression>` is replaced
by `fulfilled` or `not fulfilled`:

```catala-code-en
scope Foo:
  # Rules usually always come in the form of conditional definitions, see below
  rule bar under condition ... consequence not fulfilled
```


## Conditional definitions

The main feature of Catala is to be able to break down scope variable
definitions into multiple pieces. Indeed, legal texts often define things
piece-wise in several articles, each article dealing with one specific situation
yielding one specific definition for a quantity. This pattern is reflected in
Catala under the form of conditional definitions.

~~~admonish success title="You can define a variable multiple times !"
As covered in the [tutorial](./2-2-conditionals-exceptions.md), it is totally
expected in Catala for a given scope variable to have *multiple* definitions
in the codebase. The code will "work" because those multiple definitions
are conditional, and each will only trigger if its condition is met.
~~~

Conditions are introduced in scope variable definitions just before
the `equals` keyword with the following syntax :

```catala-code-en
scope Foo:
  definition bar under condition fizz >= 0 consequence 42
```

Follow the [relevant tutorial section](./2-2-conditionals-exceptions.md) for
more information about how to use conditional definitions for encoding legal
provisions.

~~~admonish tip title="Repeating the same condition over multiple definitions"
Sometimes, the same condition will apply to several definitions grouped in the
same `scope` block. This often comes from a temporal condition over which
the definitions apply, like:

```catala-code-en
scope Foo:
  definition bar under condition current_date >= |2025-01-01|
  consequence equals x...

  definition baz under condition current_date >= |2025-01-01|
  consequence equals x...
```

To avoid duplicating `current_date >= |2025-01-01|`, you can put the
condition directly to the scope block with:

```catala-code-en
scope Foo under condition current_date >= |2025-01-01|:
  definition bar equals ...

  definition baz equals ...
```
~~~

## Exceptions and priorities

When there are multiple conditional or non-conditional definitions for a given
scope variables, it is sometimes necessary to disambiguate which is going to
prevail when the conditions for 2 or more definitions trigger at the same time.
This is done by defining a structure of exceptions between the multiple
definitions of the same scope variable. This structure of exceptions is actually
a tree, because you can have exceptions of exceptions.

Follow the [relevant tutorial section](./2-2-conditionals-exceptions.md) for
more information about how to use exceptions for encoding legal provisions.

### Declaring one exceptional definition to a single base case definition

Let us start with the most basic case. Each node of the exceptions tree for a
given scope variable starts with a conditional or non-conditional definitions.
You can give a label to this node of the tree with the `label` syntax:

```catala-code-en
scope Foo:
  label base_case definition bar equals 42
```

Then, later in the codebase, if you want to add an exception to this `base_case`
of the definition of `bar`, you will do so with the syntax:

```catala-code-en
scope Foo:
  # The line below means that the current definition is an exception *to*
  # the other definition with the "base_case" label.
  exception base_case
  definition bar under condition
    fizz = 0
  consequence equals 0
```

~~~admonish tip title="Do I have to give a label to each definition all the time?"
In this setting with only one base case definition and one exceptional definition,
there is only one choice as to what the `exception` is referring to (the other
definition). In those cases where it is unambiguous what you are defining
an exception to, you can drop the `label` and simply write:

```catala-code-en
scope Foo:
  definition bar equals 42

...

scope Foo:
  exception definition bar under condition
    fizz = 0
  consequence equals 0
```

If there is any ambiguity with your setup using this short-hand format, the
Catala compiler will warn you. Anyway, it is always clearer and better practice
to give labels to definitions, especially with complex exception structures.
~~~

### Declaring multiple definitions as one exception to a single definition

In the previous example, `bar` was set exceptionnally to `0` if `fizz = 0`. What
if you want to expand that behavior with two more exceptional definitions that
set `bar` to `1` and `-1` respectively when `fizz > 0` and `fizz < 0`? These
three exceptional definitions cannot conflict with each other because `fizz` is
either positive, negative or 0. So, these three exceptional definitions behave
like one big exception to the base case (where `bar` is set to `42`).

To group the three exceptional definitions together in Catala and set them as an
exception to the base case, it suffices to give the three exceptional
definitions the same label `fizz_exn` (you can choose the label name) and
exception indication:

```catala-code-en
scope Foo:
  label base_case definition bar equals 42

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar under condition
    fizz = 0
  consequence equals 0

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar under condition
    fizz > 0
  consequence equals 1

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar under condition
    fizz < 0
  consequence equals -1
```

~~~admonish tip title="Could I drop some labels here?"
The two labels `base_case` and `fizz_exn` above make very clear what is
happening, at the expense of being a bit verbose. In this example, since
there is only one definition in the base case, it is unambiguous to what
the exceptional definitions are `exception` to, and if they're all exceptions
to the same thing without any labels, they will be grouped implicitly together.
So, you could have dropped all the labels are write:

```catala-code-en
scope Foo:
  definition bar equals 42

...

scope Foo:
  exception definition bar under condition
    fizz = 0
  consequence equals 0

...

scope Foo:
  exception definition bar under condition
    fizz > 0
  consequence equals 1

...

scope Foo:
  exception definition bar under condition
    fizz < 0
  consequence equals -1
```
~~~

### Declaring multiple definitions as one exception to a group of definitions

To build on our running example, imagine now that the value of `bar` in the
base case drifts over time: `42` before 2025 but `43` after. Then, you need
two conditional definitions in the base case (those two grouped definitions
are still mutually exclusive). This is achieved in Catala simply by giving
the samel label `base_case` to the two base case definitions:

```catala-code-en
scope Foo:
  label base_case definition bar
  under condition current_date < |2025-01-01|
  consequence equals
    42

...

scope Foo:
  label base_case definition bar
  under condition current_date >= |2025-01-01|
  consequence equals
    43

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar
  under condition fizz = 0
  consequence equals
    0

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar
  under condition fizz > 0
  consequence equals
    1

...

scope Foo:
  label fizz_exn
  exception base_case
  definition bar
  under condition fizz < 0
  consequence equals
    -1
```

~~~admonish tip title="Could I drop some labels here?"
No; here the situation is already complex enough to create ambiguity as
to what the exceptional rules are an exception of.
~~~

### Stacking exceptions, and more

The previous examples show how to use the `label` and `exception` syntax
to group definitions together and declare exceptional priorities. This syntax
is all you need! In particular, you can stack exceptions by defining chains
and branches of `exception` relationship, etc. This is covered extensively
in the [relevant section of the tutorial](./2-2-conditionals-exceptions.md).

## Sub-scope calling

Once you have [declared a sub-scope](./5-3-scopes-toplevel.md#sub-scopes-declarations),
you will need to define its arguments by defining the input variables of the
sub-scope in the scope. For instance, if scope `Foo` has sub-scope `bar` calling
scope `Bar` that has input variables `fizz` and `buzz`, you will need to define
`bar.fizz` and `bar.fuzz` with this syntax:

```catala-code-en
scope Foo:
  definition bar.fizz equals ...

  definition bar.fuzz equals ...
```

Of course, you can use exceptions and conditional definitions for these
sub-scope input variable definitions.

Once you have defined all the [input variables](./5-3-scopes-toplevel.md#input-variables) of the scope
(as well as some [context variables](./5-3-scopes-toplevel.md#context-variables) if need be),
you can simply refer to the sub-scope's [output variables](./5-3-scopes-toplevel.md#output-variables)
in later expressions. For instance, if `Bar` has output variable `fizzbuzz`, then
you can refer to `bar.fizzbuzz` as the result of `fizzbuzz` when calling `Bar`
with arguments `bar.fizz` and `bar.fuzz`.

## Assertions

Assertions in Catala are [expressions](./5-5-expressions.md) attached to scopes
(they can depend on scope variables) that should *always be true*. They can be
used for:
* input sanitization and scope preconditions;
* checking logical invariants;
* testing an expected output.

Their syntax is as simple as:

```catala-code-en
scope Foo:
  assertion bar + 2 = fizz * 4
```

## Date rounding mode

To set the date computation rounding mode to either up or down (see the
[relevant reference section](./5-2-types.md#semantic-of-date-addition)), for
all the date operations inside a whole scope, use this syntax:

```catala-code-en
# Let us suppose you want to set the rounding more for date operations
# inside scope Foo declared elsewhere
scope Foo:
  date round decreasing # rounding down
  # or
  date round increasing # rounding up
```
