# Scopes, functions and constants


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


~~~admonish info title="Catala code goes inside scopes"
Since Catala in a functional language, toplevel declarations in Catala
behave like functions. While Catala has true toplevel functions, we advice
to limit their use in practice and use scopes instead, as only scopes benefit
from the [exceptions](./5-4-definitions-exceptions.md) mechanism that is
the killer feature of Catala.
~~~

## Scope declarations

A scope is a function whose prototype (*i.e.* signature) is explicitly declared,
and whose body can be scattered in little pieces across the literate programming
codebase.

~~~admonish warning title="This section only cover scope declarations"
For information about the scope body, including definitions of scope
variables, check out the reference sections about [definition and exceptions](./5-4-definitions-exceptions.md)
or [expressions](./5-5-expressions.md).
~~~

### Scope name

Scope names begin by a capital letter and follow the CamlCase convention. A
scope declaration is a toplevel item inside a Catala code block. For instance,
you want to name your scope `Foo`, then its declaration begins by:

```catala
declaration scope Foo:
   ...
```

The contents of the scope declaration (inside the `...`) is comprised of:
* scope variable declarations ;
* sub-scopes called in the scope.

These two items are described below.

### Scope variable declarations

Scope variables are akin to local variables in a function. Their declaration
features:
* their input/output status;
* their name;
* their type;
* optionally, a list of states for the variable.

Variable names begin by a lowercase letter and follow the snake_case convention.
The syntax for the declaration of variable `bar` is:

```text
<input/output status> bar content <type> [<variable states list>]
```

```admonish info title="A scope declaration example"
Here is the syntax to declare scope `Foo` with local variables
`baz`, `fizz` and `buzz`; `baz` is a boolean input, `fizz` is an internal
date variable with two states `before` and `after`, and `buzz` is a decimal
that is both input and output to the scope:

~~~catala
declaration scope Foo:
  input baz content boolean
  internal fizz content date
    state before
    state after
  input output buzz content decimal
~~~
```

Explanations for input/output status and variable states follow below.

#### Input/output qualifiers

There are six kind of input/output qualifiers :
* `input`
* `output`
* `internal`
* `context`
* `input output`
* `context output`

##### Input variables

Input variables require a value to be provided when the scope is called,
like a function argument. They cannot be redefined inside the scope.


##### Output variables

Output variables are defined inside the scope, and their value is returned
as part of the scope call's result.

##### Internal variables

When a variable is neither an input nor an output of the scope, it needs to be
qualified as `internal`.

##### Context variables

Context variables are basically optional inputs to the scope with a default
value defined inside the scope. Suppose scope `Foo` has a context variable
`bar`. If you provide a value `x` for `bar` when calling `Foo`, `Foo`'s
computation will consider that `bar = x`. But if you do not provide a value
for `bar` when calling `Foo`, `Foo` will pick up as the value `bar` the existing
definition of `bar` inside `Foo`.

~~~admonish question title="Why context variables ?"
This curious behavior for `context` variable is motivated by use cases where
we want to create an exception for a scope variable from *outside* the scope.
See the Catala [FAQ](./4-2-catala-specific.md#how-do-i-add-an-exception-from-outside-a-scope)
for more explanations.
~~~

##### Input and output variables

Sometimes, we want a scope's input to be copied and transmitted as part of the
scope call's result. That is, such a variable would be both `input` and
`output`, which is why the syntax for this is `input output`. In this case,
the variable cannot be defined inside the scope (as it is an input). This also
works when swapping `input` by `context`.

#### Variable state declarations

As mentioned in the [tutorial](./2-4-states-dynamic.md#variable-states),
it is possible to distinguish several states during the computation of the
final value of the variable. The states behave like a chain of variables,
the next one using the value of the previous for its computation.

The ordered list of states the variable assumes during computation is declared
alongside the variable. For instance, if the internal integer variable `foo` has states
`a`, `b` and `c` in this order, then `foo` shall be declared with:

```catala
internal foo content integer
  state a
  state b
  state c
```

The order of the `state` clauses in the declaration determines the computation
order between states for the variable. We can write `foo state a` for the value of
variable `foo` during state `a`. With this order between `a`, `b` and `c`, `foo
state b` can depend on `foo state a` and `foo state c` can depend on `foo state
b`, but not the converse.

### Scope output structure

All variables qualified as `output` in a scope will be part of the result of
the scope call. This result is materialized as a structure, with each
output variable mapping to a field of the structure. This output structure
of the scope is usable like any other structure type declared by the user.

For instance, if I have the scope declaration:

```catala
declaration scope Foo:
  output bar content integer
  output baz content decimal

  internal fizz content boolean
  input buzz content date
```

Then implicitly, an output structure also named `Foo` will be usable as if it had the
following declaration:

```catala
declaration structure Foo:
  data bar content integer
  data baz content decimal
```

This implicit output structure declaration is useful to carry around the
result of a scope call in another variable and re-use them later in the code.

### Sub-scopes

Scopes are functions, and as such they can be called like functions. Calling
a scope can be done inside any [expression](./5-5-expressions.md#direct-scope-call)
by simply providing the input variables as arguments.

But sometimes, we know that we will always call perform a single, static *sub-scope*
call from a calling scope. For this situation, Catala has a special declarative
syntax making it easier for lawyers to understand what is going on.

Sub-scopes are declared in the scope declaration like scope variables.
For instance, is inside scope `Foo` you will call scope `Bar` exactly one time,
then you will write:

```catala
declaration scope Foo:
  bar_call scope Bar
```

`bar_call` is the name (of your choosing) that will designate this specific
instance of calling `Bar` inside `Foo`. You can have multiple, static calls to the
same scope like:

```catala
declaration scope Foo:
  first_bar_call scope Bar
  second_bar_call scope Bar
```

You can also prefix by `output` the line `bar_call scope Bar`, ensuring
that the output structure of the call to `Bar` will be present as field
`bar_call` of the output structure of the call to `Foo`.

As with structures and enumerations, it is not possible for these scope calls
to be recursive.

## Global constant and functions declarations

While scopes are the workhorse of Catala implementations, there are sometimes
small things that need not be inside a fully-fledged scope. For instance,
declaring small utility functions like `excess_of` that computes the excess of the
first argument compared to the second, or declaring a constant for the number of
seconds in a day.

~~~admonish danger title="Not using scopes means missing out on the core of Catala"
Since scopes are akin to functions, it is possible to use regular function
declarations to emulate all the features of scopes. Why do scope exist in the
first place then?

Because scopes allow the definition of exceptions for their variables, which
is impossible with regular function and constant declarations. Exceptions are
the killer feature of Catala, and using Catala without using exceptions makes
no sense; use a regular programming language instead.

Hence, constant and functions declaration should only be used for their
intended use. The rule of thumb is: if a constant or variable definition
takes up more than a few lines of code, it should be turned into a scope!
~~~

### Constants

### Functions
