# Attributes

<div id="tocw"></div>


The language can be extended with attributes, enabling a variety of extensions.
An attribute is of the form `#[key.of.extension]` or `#[key.of.extension = VALUE]`,
where `VALUE` can be of the form `"STRING"`, or an expression in Catala syntax.
An attribute is always bound to the element directly following it: an extension
could for example make use of them to retrieve labels to the input fields of a
scope in order to generate a web form:

```catala-code-en
declaration scope SomeComputation:
  #[form.label = "Enter the number of children satisfying the condition XXX"]
  input children_of_age content integer
```

## Built-in attributes

Some attributes affect the Catala compiler itself with built-in support.

## Debug print

By adding `#[debug.print]` in front of an expression in a Catala program, the
value of that expression will be printed upon computation by the interpreter,
when run with the `--debug` option. It is otherwise ignored by the other
backends.

It is also possible to print the value along with a specific tag using
`#[debug.print = "some debug tag"]`.

Note that, in some cases, due to how the compiler works, debug prints could
appear duplicated or not at all, especially if optimisations are enabled (with
the `-O` flag). If that happens, try to move the attribute to the root of the
definition.
