# Directory structure and configuration

In this section, we will describe the organization and configuration
of a `clerk` project.

To begin with, we strongly encourage you to setup a software
versioning system such as [git](https://git-scm.com/) when building
your project; this practice is broadly used in software development
and helps tracking and maintaining contributions to your code.

## Clerk project example

Let's say we have a mock project that has two main parts: one to
compute tax codes and one for housing benefits. The following file
hierarchy shows an example of a clerk project usual organization:

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

Our project is comprised of several directories and a `clerk.toml`
project configuration file:
- `src/`: contains the main Catala programs. These programs can be
  further splitted in sub-directories to properly separate your
  workflow. The sub-directory `src/common/`, here, contains some
  data-structures and utilities that are shared by the two other
  components.
- `tests/`: contains the dedicated tests of your Catala programs. In
  order not to bloat your logic with spurious tests, it is advised to
  create specific files intended to test your Catala programs.
- `clerk.toml`: the configuration file of a `clerk` project.

~~~~~~admonish info title="Declare your modules!"
We encourage that each file should declare its own Catala **module**
(see the [dedicated documentation](./5-6-modules.md) for declaring
and using modules). This helps to properly separate code namespaces
and allows for parallelization during the compilation phase.
~~~~~~

### The `clerk.toml` configuration file

This file is used to configure how and what the `clerk` tool is
supposed to build and run. This configuration file should be written
in the [TOML](https://toml.io/en/) configuration format. Here is an
example of what it should look like for our mock project (comments are
prefixed by the # character):

```toml
# Clerk configuration file for 'my-project'

[project]
include_dirs = [ "src/common",              # Configures which directories to include
                 "src/tax_code",            # when looking for dependencies
                 "src/housing_benefits" ]   # and test dependencies.
build_dir    = "_build"    # Defines where to output the generated compiled files.
target_dir   = "_target"   # Defines where to output the targets final files.

[[target]]
name     = "us-tax-code"                          # Target's specific name
modules  = [ "Section_121", "Section_132", ... ]  # Modules components
tests    = [ "tests/test_income_tax.catala_en" ]  # Related test(s)
backends = [ "c", "java" ]                        # Output language backends

[[target]]
name     = "housing-benefits"
modules  = [ "Section_8, ... ]
tests    = [ "tests/test_housing_benefits.catala_en" ]
backends = [ "ocaml", "c", "java" ]
```


This `clerk.toml` example file first describe two project-wide configuration
(under the `[project]` section): in which directories should clerk
look for Catala files when trying to resolve its dependencies and
where to output the generated compiled files when building the
project. The `build_dir` and `target_dir` options already defaults to
`"_build"` and `"_target"` when absent, hence, here they can safely be
omitted.

Then, the configuration file defines two `[[target]]` components which
are used to configure what and how to package them for future use.
For instance, the first target is named `"us-tax-code"` -- which is an
arbitrary name -- and will package all the declared data structures
and scopes defined in the given `modules` and their dependencies. We
also associate specific `tests` files (or directories) related to this
target so that we can execute them in isolation if needed. Lastly, we
define the language `backends` that this target should generate. In
our first example, we configured the target to translate our code as a
`C` library and as a `Java` package.

~~~~~~admonish info title="Clerk configuration options"
In this section, we only detailed a handful of `clerk` options.
For the full list, please refer to the [clerk full reference guide](./6-clerk.md).
~~~~~~

In the next section, we will detail how to build and deploy a project.
