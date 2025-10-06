# External modules

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

## Implementing external modules

External modules need to precisely match the interface expected by the Catala
code.

~~~admonish danger title="Low-level feature"
External modules are very dependent on details of the backends implemented by Catala.
You may expect updates to the external code to be needed with the next versions of the compiler.
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
