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

Some attributes affect the Catala compiler itself and have built-in support.

### `#[test]`

Used on scope declarations to mark them for testing. See [the "Test"
section](./3-3-test-ci.md#assertion-testing).

### `#[doc]` or `##`

Attached to declarations, structure fields, enumeration cases, or function
arguments, the `#[doc = "documentation text"]` attribute can be used to document
them. This information will be available to the users of the module and should
explain the purpose and usage of its linked element.

The alternative syntax `### documentation text` (a code comment starting with a
double `#` character) is available and preferred for readability. Like the
attribute, it must be present just above its target.

### `#[error.message]`

The `#[error.message = "informative message"]` attribute can be attached to
assertions or to the `impossible` keyword. The given message will be printed
alongside the normal error message and the code location when the error is
triggered, both in the interpreter and other backends.

### `#[debug.print]`

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

### `#[implicit_position_argument]`

The `#[implicit_position_argument]` is used when declaring a function (often
useful in conjunction with [external modules](./5-8-2-external-modules.md)), to
mark one of its arguments of type `code_location` as _implicit_. The argument
will not appear when calling the function, and will automatically be filled with
the code position where the function was called from.

This enables functions from libraries that can fail in some definite conditions
to report the error where it happens in the user code, rather than point to the
library.
