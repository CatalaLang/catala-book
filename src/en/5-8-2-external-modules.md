# External modules

<div id="tocw"></div>

External modules are a way to integrate external logic into a Catala
project. For instance, if a Catala program requires some logic which
is too cumbersome (or plain impossible) to be expressed in Catala, one
may fallback to external modules to implement them in the desired
backend targets language -- e.g., C, Java, OCaml. Users are required
to fill out the external module implementation for each desired
backend target. For instance, if a project only targets compilation to
Java, only a Java external module implementation has to be present.

~~~admonish warning
However, in order to interpret Catala program (`clerk run` or `clerk test`
without specifying the `--backend`option), the OCaml external module implementation is required.
~~~

## Declaring external modules

Some modules contain logic that cannot be implemented in Catala. This is OK,
since Catala is a Domain-Specific Language (DSL) and not a general-purpose
programming language. This means that the features of Catala are intentionally
limited; for instance you cannot write recursive functions or [manipulate strings](./4-2-catala-specific.md#why-are-there-no-strings) in Catala. But sometimes, you need to call
from a regular Catala module a function containing this piece of
unimplementable logic. This is the purpose of external module. An external
module in Catala is a Catala source code file containing a module with the
`external` annotation, like this:

~~~catala-en
> Module Foo external

```catala-metadata
declaration structure Period:
  data date_begin content date
  data date_end content date

declaration months_in_period content list of date
  depends on period content Period
```
~~~

This `external` module declares a type (`Period`), as well as a toplevel
function (`months_in_period`), but the latter has no implementation! This is by
design as external modules should not contain any Catala code, but merely type
declarations, scope declarations and toplevel constants and function
declarations. These declarations (inside `` ```catala-metadata `` blocks) expose
a public interface for the external module, that can be used by other modules.

However, to make all this run in practice, you will still need to implement
the external module in OCaml (for the interpreter) and in your target
language. See the [relevant reference section](./5-8-2-external-modules.md).

## Implementing external modules

External modules need to precisely match the interface expected by the Catala
code.

~~~admonish danger title="Low-level feature"
External modules are very dependent on details of the backends implemented by Catala.
You may expect updates to the external code to be needed with the next versions of the compiler.
~~~

To help with this, the `catala` command supports a `--gen-external` flag that
will generate a template implementation in the given backend:

```console
$ catala ocaml --gen-external foo.catala_en
┌─[RESULT]─
│ Generated template external implementations:
│   "foo.template.ml"
│   "foo.template.mli"
└─
```

Rename the files (removing the `.template` part), and edit them to
replace the `Impossible` error placeholders by your implementation.

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
