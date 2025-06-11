# Definitions and exceptions


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


While the [previous reference section](./5-3-scopes-toplevel.md) covered the
declaration of scopes (introduced by `declaration scope Foo`) that have to be done once
for each scope in the codebase, this section covers the definition of scope
variables scattered across the literate programming codebase (introduced by
`scope Foo`).


~~~admonish info title="Everything happens inside a scope"
Scope variable definitions and assertions only make sense inside a given scope,
which is why all the examples below will show the feature inside a `scope Foo`
block that we assume has been already declared elsewhere.
~~~

## Scope variable definitions

Scope variable definitions is where the bulk of the Catala code will live.
Defining a variable `bar` inside scope `Foo` as the value 42 is as simple as:

```catala
scope Foo:
  definition bar equals 42
```

Of course, you can swap 42 by any [expression](./5-5-expressions.md) as long it
has the correct type with respect to the scope variable declaration.

If the scope variable you are defining is a function variable, for instance if `bar`
is a function of scope `Foo` with arguments `x` and `y`, then the syntax
for definition the variable is:

```catala
scope Foo:
  definition bar of x,y equals x + y
```

Lastly, if the scope variable has several [states](./5-3-scopes-toplevel.md#variable-state-declarations),
for instance if `bar` has states `beginning`, `middle` and `last`, then the syntax for defining
the state `middle` of the variable is:

```catala
scope Foo:
  definition bar state middle equals bar * 2
  # "bar" above refers to the value of bar in the previous state,
  # here "beginning"
```

Variable states and functions mix this way:

```catala
scope Foo:
  definition bar of x, y state middle equals (bar of x, y) * 2 + x + y
```


## Conditional definitions

## Exceptions and priorities

## Assertions
