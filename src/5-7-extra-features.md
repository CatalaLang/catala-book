# Extra features


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


## Attributes and extensions

We have already been confronted with attributes in [3.2](3-2-test-ci.html): the
`#[test]` annotation was indeed just a particular case of attribute. Attributes
are in fact more general than that, enabling a variety of extensions to the
language. Catala plugins can leverage them for custom uses.

An attribute is of the form `#[key.of.extension]` or
`#[key.of.extension = VALUE]`, where `VALUE` can be of the form `"STRING"`, or
an expression in catala syntax. An attribute is always bound to the element
directly following it: an extension could for example make use of them to
retrieve labels to the input fields of a scope in order to generate a web form:

```catala
declaration scope SomeComputation:
  #[form.label = "Enter the number of children satisfying the condition XXX"]
  input children_of_age content integer
```

### Built-in attributes

Some attributes affect the Catala compiler itself with built-in support.

### Test scopes

See [3.2](3-2-test-ci.html#declaration). The `#[test]` attribute doesn't accept any
arguments, and is only allowed on scope declarations.

### Debug print

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
