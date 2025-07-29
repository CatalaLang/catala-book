# Directory structure and configuration

<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>

The first step when creating your Catala projet is to lay out the structure of
the directories and files that will contain your source code. In this section,
we will describe the organization and configuration of a Catala project
containing source code files managed by the `clerk` build system.

To begin with, we strongly encourage you to setup a software versioning system
such as [git](https://git-scm.com/) when building your project; this practice is
broadly used in software development and helps tracking and maintaining
contributions to your code.

## Clerk project example

Let's say you have a mock project that has two main parts: one to
compute tax codes and one for housing benefits. The following file
hierarchy shows an example of the usual organization for a Catala project:

```
my-project/
│   clerk.toml
├───src/
│   ├───tax_code/
│   │   │   section_121.catala_en
│   │   │   section_132.catala_en
│   │   │   ...
│   │
│   ├───housing_benefits/
│   │   │   section_8.catala_en
│   │   │   ...
│   │
│   └───common/
│       │   prorata.catala_en
│       │   household.catala_en
│       │   ...
│
└───tests/
    │   test_income_tax.catala_en
    │   test_housing_benefits.catala_en
```

The project is comprised of several directories and a `clerk.toml`
project configuration file:
- `src/`: contains the main Catala programs. These programs can be
  further splitted in sub-directories to properly separate your
  workflow. The sub-directory `src/common/`, here, contains some
  data-structures and utilities that are shared by the two other
  components.
- `tests/`: contains the dedicated tests of your Catala programs. In
  order not to bloat your logic with spurious tests, it is advised to
  create specific, separate files containing your tests.
- `clerk.toml`: the configuration file of a `clerk` project.

~~~~~~admonish danger title="Declare your modules!"
Each source file in your Catala project is bound to be its own, separate
logical module (except in cases of [textual inclusion](./5-1-literate-programming.md#textual-inclusion)).
Catala modules are collections of scopes, toplevel constants and functions
that share the same namespace. Moreover, modules can be imported in other
modules, allowing you to modularize your codebase and keep it clean and tidy.

But, alone and unprepared, a Catala source file is not yet a Catala module! You have
to declare the title of the module inside the source file and craft the
public interface first; see the [dedicated documentation](./5-6-modules.md) for declaring
and using modules.
~~~~~~

Having a bunch of Catala source code files (properly declared as modules) stored
inside the sub-directories of the project is not yet sufficient for `clerk` to
find its marks and know what to do. You need to guide it with a declarative
configuration file, `clerk.toml`.


### The `clerk.toml` configuration file

This file is used to configure how and what the `clerk` tool is
supposed to build and run. This configuration file should be written
in the [TOML](https://toml.io/en/) configuration format. Here is an
example of what it should look like for our mock project (comments are
prefixed by the # character):

~~~admonish note title="`clerk.toml` configuration file for `my-project`"
```toml
[project]
include_dirs = [ "src/common",              # Which directories to include
                 "src/tax_code",            # when looking for Catala modules
                 "src/housing_benefits" ]   # and dependencies.
build_dir    = "_build"    # Defines where to output the generated compiled files.
target_dir   = "_target"   # Defines where to output the targets final files.

# Each [[target]] section describes a build target for the project

[[target]]
name     = "us-tax-code"                          # The name of the target
modules  = [ "Section_121", "Section_132", ... ]  # Modules components
tests    = [ "tests/test_income_tax.catala_en" ]  # Related test(s)
backends = [ "c", "java" ]                        # Output language backends

[[target]]
name     = "housing-benefits"
modules  = [ "Section_8, ... ]
tests    = [ "tests/test_housing_benefits.catala_en" ]
backends = [ "ocaml", "c", "java" ]
```
~~~

This `clerk.toml` example file first describes two project-wide configuration items
(under the `[project]` section):
* in which directories `clerk` should look for Catala source files when trying to find modules
  and dependencies;
* where to output the generated compiled files when building the project and
  its targets.

The `build_dir` and `target_dir` options already defaults to `"_build"` and
`"_target"` when absent, hence, here they can safely be omitted.

Then, the configuration file defines two `[[target]]` components. A target in a
Catala project is a bundle of Catala modules that will be compiled to one or
multiple target programming languages, creating ready-to-use source libraries
that you can them import and distribute to other applications in your IT system.

For instance, the first target is named `"us-tax-code"` (you can choose it as
you like) and will package all the declared data structures and scopes defined
in the given `modules` and their dependencies. We also associate specific
`tests` files (or directories) related to this target so that we can execute
them in isolation if needed. Lastly, we define the language `backends` that this
target should generate. In our first example, we configured the target to
translate our code as a `C` library and as a `Java` package.


~~~admonish question title="Modules or files?"
The `modules` configuration field of a `[[target]]` section requires a list
of module names, while the `tests` section requires a list of files. Why is that?

The reason behind this difference is that the `modules` contain the logic of
the Catala code for your target; while a Catala module is usually contained
inside a single code file, [textual inclusion](./5-1-literate-programming.md#textual-inclusion)
is often used to split the code of a single module across multiple source files,
[corresponding to different legal sources](./3-5-lawyers-agile.md#why-you-should-pick-the-legal-texts-for-the-literate-programming-in-catala).
Hence, we supply the module names in `clerk.toml` and let `clerk` figure out
which source files belong to which module for simplicity.

Tests however, are a different beast. As we will see, a test is simply a
scope with a special `#[test]` mark in a file, it needs not be inside a properly
declared module. Which is why the `tests` field of the `[[target]]` section
inside `clerk.toml` is a list of files, and not modules.
~~~

Please refer to the full [`clerk.toml` reference](./6-1-clerk-toml.md) for
an exhaustive list of the configuration options and their possible values.

Now that we have our source files laid out nicely in their proper directories,
as well as a project configuration file, we will detail in the next section how
to build and deploy the deliverables for the project.
