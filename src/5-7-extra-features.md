# Extra features


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>


## Attributes and extensions

The language can be extended with attributes, enabling a variety of extensions.
An attribute is of the form `#[key.of.extension]` or `#[key.of.extension = VALUE]`,
where `VALUE` can be of the form `"STRING"`, or an expression in catala syntax.
An attribute is always bound to the element directly following it: an extension
could for example make use of them to retrieve labels to the input fields of a
scope in order to generate a web form:

```catala
declaration scope SomeComputation:
  #[form.label = "Enter the number of children satisfying the condition XXX"]
  input children_of_age content integer
```

### Built-in attributes

Some attributes affect the Catala compiler itself with built-in support.

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

## Implementing external modules

External modules need to precisely match the interface expected by the Catala
code.

~~~admonish danger title="Low-level feature"
External modules are very dependent on details of the backends implemented by Catala. You may expect updates to the external code to be needed with the next versions of the compiler.
~~~

To help with this, the `catala` command supports a `--gen-external` flag that
will generate a template implementation in the given backend:

```shell-session
$ catala ocaml --gen-external foo.catala_en
┌─[RESULT]─
│ Generated template external implementations:
│   "foo.template.ml"
│   "foo.template.mli"
└─
```

Rename the files (removing the `.template` part), and edit them to replace the
`Impossible` error placeholders by your implementation.

- The type definitions, interface and module registration parts should be left
  unchanged
- Proceed in the same way for every backend your project will be compiled to. An
  OCaml implementation is required to run the Catala interpreter on the project,
  and strongly recommended.

~~~admonish danger title="Keep it functional"
The Catala runtime expects function calls to be "pure": a call to a given
function should not depend on any context. In other words, calling the same
function with the same arguments should always yield the same result, and it is
unadvised to store any persistent state in an external module.
~~~

Upon compilation, the Clerk build-system will automatically pick up the provided
implementation.

In case of changes to the Catala interface (or upon update of the Catala
compiler), you should re-run the `--gen-external` command and resolve
discrepancies between your implementation and the new `.template` file.
