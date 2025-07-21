# Project building and deployment

In the previous section, we defined a directory containing a Catala
project with a `clerk.toml` configuration file that contained two main
targets (`us-tax-code` and `housing-benefits`) that we aim to build
and export as standalone libraries in different languages.

~~~~~~admonish info collapsible=true title="Recap from previous section: `clerk.toml` configuration file and project hierarchy"
`clerk.toml` configuration file of our mock project
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
Project hierarchy of our mock project:
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
~~~~~~


## Building the project

Now that we have everything setup, we can build our project. In order
to do that, we can use the `clerk`'s build command:

```bash
$ clerk build
...
┌─[RESULT]─
│ Build successful. The targets can be found in the following files:
│     [us-tax-code] → _targets/us-tax-code
│     [housing-benefits] → _targets/housing-benefits
└─
```

If we now inspect these directories, we will find both directories
that contains all compiled code for all the declared backends ready to
be exported as libraries.

```
_targets/
├───us-tax-code/
│   ├───c/
│   │   │   Section_121.c
│   │   │   Section_121.h
│   │   │   Section_121.o
│   │   │   ...
│   │
│   ├───java/
│   │   │   Section_121.java
│   │   │   Section_121.class
│   │   │   ...
│   housing-benefits/
│   │   ...
```

If we now want to test our project, we can use the `clerk test`
command which will scan all of our project and detect every test:

```bash
$ clerk test
┏━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━┓
┃                                             ┃
┃             FAILED     PASSED      TOTAL    ┃
┃   files          0          2          2    ┃
┃   tests          0         17         17    ┃
┃                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

If we wish to only run a target's specific test, we can do that by
invoking `clerk test <target-name>` -- the same goes for `clerk build
<target-name>`.

~~~~~~admonish info title="Backend testing"
It is also possible to run tests in a backend-specific language. For
instance, `clerk test us-tax-code --backend c` will run the target's
testsuite translated in C in order to check for eventual inconsistencies.
~~~~~~

## Project deployement

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

In the next section, we will dive into writing Catala's tests and
deploying continuous integration.
