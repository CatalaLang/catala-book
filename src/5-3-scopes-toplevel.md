# Scopes and toplevel declarations


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


~~~admonish info title="Catala code goes inside scopes"
Since Catala in a functional language, toplevel declarations in Catala
behave like functions. While Catala has true toplevel functions, we advice
to limit their use in practice and use scopes instead, as only scopes benefit
from the [exceptions](./5-4-definitions-exceptions.md) mechanism that is
the killer feature of Catala.
~~~

## Scopes

A scope is a function whose prototype (*i.e.* signature) is explicitly declared,
and whose body can be scattered in little pieces across the literate programming
codebase.

### Scope declarations

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

```catala
<input/output status> bar content <type> [<variable states list>]
```

Here are some examples of scope variable declarations:

```catala
input baz content boolean
internal fizz content date
  state before
  state after
input output content decimal
```

Explanations for input/output status and variable states follow below.

#### Input/output qualifiers

##### Input variables

##### Output variables and the scope output structure

##### Internal variables

##### Context variables

#### Variable state declarations

### Sub-scopes


## Global constant and functions declarations

### Constants

### Functions
