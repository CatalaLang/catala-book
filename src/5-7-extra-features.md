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

### Implicit position arguments

This attribute is advanced and specific to defining libraries, in particular
with external modules. Some operations in Catala, like date addition and
division, can trigger runtime errors. When that happens, the location where the
error was triggered in the source code of the program is printed, so that it is
possible to track the origin of the error — for example, the point where a
division by zero was attempted.

When such an operation is done within a library, though, the user is often less
interested in the division that happened from within the library code than the
location, in the program, where the library function was called. This is what
this attribute addresses, by allowing a defined function to obtain the location
from where it was called as a parameter.

The attribute is put on the declaration of a function argument of type
`code_location`, making it implicit:

```catala
declaration custom_division content decimal depends on
    #[implicit_position_argument] pos content code_location,
    numerator content decimal,
    denominator content decimal
  equals ...
```

The argument `pos` can be used normally in the body of the declaration, but is
most likely useful to pass on to externally-implemented functions. When calling
`custom_division`, only the `numerator` and `denominator` arguments should be
provided.

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
