# Test and continuous integration workflow

<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>


In the previous section, we defined a directory containing a Catala project with
a `clerk.toml` configuration file that contained two main targets (`us-tax-code`
and `housing-benefits`), that we learn to compile and deploy in C and Java. Now,
let's make sure the deployed code is correct and practice some test-driven
development!

~~~admonish info collapsible=true title="Recap from previous section: `clerk.toml` configuration file and project hierarchy"
Here is the `clerk.toml` configuration file of our mock project:
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
Project file hierarchy:
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
~~~


## Setting up tests

We encourage Catala developers to write lots of tests in their projects!
Though you can write tests anywhere in your Catala source code files, we
advise you to group them together in a `tests` folder a the root of
your project, with specific files full of tests for a specific module in `src`,
for instance.

### What is a test ?

In Catala, a test is a [scope](./5-3-scopes-toplevel.md) with no input
variables, that calls the scope of function that you want to test with hardcoded
inputs. For instance, imagine that one of your `src` files,
`src/income_tax.catala_en`, contains the following scope declaration (adapted
and expanded from [earlier](./3-2-compilation-deployment.md))

```catala
> Module

declaration enumeration Filing:
  -- Single
  -- Joint content date

declaration scope IncomeTaxComputation:
  input income content money
  input number_of_children content integer
  input filing content Filing

  output income_tax content money

```

Then, in the file `tests/tests_income_tax.catala_en`, you can write a test
for the scope `IncomeTaxComputation`. While there is no constrained format
for tests in Catala, we recommend that you follow this pattern:

```catala
# First, declare your test
declaration scope TestIncomeTax1: # You can choose any name for your test
  computation content IncomeTaxComputation # Put here the scope you want to test

# Then, fill the inputs of your test
scope TestIncomeTax1:
  definition computation equals
    result of IncomeTaxComputation {
      # The inputs of this test to IncomeTaxComputation are below :
      -- income: $20,000
      -- number_of_children: 2
      -- filing: Joint content |1998-04-03|
    }
```

This test is now a valid program. You can run it with :

```text
$ clerk run tests/tests_income_tax.catala_en --scope=TestIncomeTax1
┌─[RESULT]─ Exemple2 ─
│ income_tax = $5,000
└─
```

Now, this test should indicate what are the *expected* outputs, to be compared
with the *computed* outputs. There are ways to do it with Catala, depending
on the best fit for your use case. The starting point for both methods is
exactly what we've described just above. Both methods are supported by the
test system of Catala, accessible through the `clerk test` command.

### Assertion testing

One way to check the computed result is to assert that it should be equal to
an expected value, using Catala's [`assertion`s](./5-4-definitions-exceptions.md#assertions).
To register an assertion test into `clerk test`, simply put the `#[test]` [attribute](./5-7-extra-features.md#attributes-and-extensions) to the test scope declaration. For instance, here
is our test example set up as an assertion test:

```catala
#[test]
declaration scope TestIncomeTax1:
  computation content IncomeTaxComputation

scope TestIncomeTax1:
  definition computation equals
    result of IncomeTaxComputation {
      # The inputs of this test to IncomeTaxComputation are below :
      -- income: $20,000
      -- number_of_children: 2
      -- filing: Joint content |1998-04-03|
    }
  assertion (computation.income_tax = $5,000)
```

Of course, the `assertion` can be as complex as you want. You can check
the result exhaustively or partially, check whether some property depending
on the input is satisfied, etc. At test time, `clerk test` will only check
whether all the assertions that you defined hold.

~~~admonish danger title="Don't forget the assertions!"
Assertion-based testing needs assertions. If you just put `#[test]` without
any assertions in your test, it will always succeed (since no assertions fail),
which isn't probably what you want for a test.
~~~

~~~admonish success title="The Catala team approves assertion-testing"
The Catala team recommends the use of assertion-based testing as the primary
method for testing projects, for unit or end-to-end testing. The reasons are
the following :
~~~

### Cram testing

The second way to check the expected result of a computation is simply to
check the textual output of running the command in the terminal. This is
called [cram testing](https://bitheap.org/cram/). To enable cram testing 
in Catala, you need to specify : 
1. what is the command you want to test;
2. what should be the expected terminal output.

Cram tests are directly embedded in Catala source code files, under the form of
a `` ```catala-test-cli `` Markdown code block. Inside, you specify which
command to test after the prompt `$ catala ...`. For instance, the `test-scope
TestIncomeTax1` command is equivalent to running `clerk run
--scope=TestIncomeTax1`. Then, you provide the expected result as it is spit out
by running the command on the terminal. 

For instance, here is how to create a cram test from our `IncomeTaxComputation`
example above:

~~~markdown
```catala
declaration scope TestIncomeTax1:
  computation content IncomeTaxComputation

scope TestIncomeTax1:
  definition computation equals
    result of IncomeTaxComputation {
      # The inputs of this test to IncomeTaxComputation are below :
      -- income: $20,000
      -- number_of_children: 2
      -- filing: Joint content |1998-04-03|
    }
```

```catala-test-cli
$ catala test-scope TestIncomeTax1
┌─[RESULT]─ Exemple1 ─
│ computation = IncomeTaxComputation {
│   -- income_tax: $5000,0
│ }
└─
```
~~~

`clerk test` will pick up the `` ```catala-test-cli `` blocks, run the command
inside, and compare the output with the expected output. 

Remember that beyond `test-scope`, you can put any acceptable Catala 
command on a cram test. See the [reference](./6-2-commands-workflow.md#clerk-test) 
for more details.


~~~admonish info title="Use cram testing only when assertion-based testing is not enough"
Checking the terminal output of a command instead of asserting values is brittle
and can introduce a lot of noise when checking the test outputs. For instance,
changing the name of a type can break the terminal output while having no 
effect on an assertion in your test. 

Hence, the Catala team recommends using assertion-based testing when possible,
and only use cram testing for checking what the compiler outputs with specific 
options and commands different from `clerk run`.
~~~

## Running the tests and getting reports

Simple: just run `clerk test`! By default, it will scan you whole project looking
for `#[test]` or `` ```catala-test-cli `` in your files, execute the test,
check the expected output. If all is good, you will get in your terminal 
a report like:

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                       ┃
┃             FAILED     PASSED      TOTAL                              ┃
┃   files          0         34         34                              ┃
┃   tests          0        245        245                              ┃
┃                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Of course, the numbers depend on how many tests and test files there are in your 
project (don't worry if they're lower for you). 

If an assertion-base `#[test]` fails, you will get an extra report printing why
the assertion has failed, with the exact command you can run to reproduce the
failure:

```text
■ scope Test TestIncomeTax1
  $ ../.opam/catala/bin/catala interpret -I tax_code --scope=TestIncomeTax1
    tests/tests_income_tax.catala_en:34 Assertion failed: $5,0000 = $4,500
```

Failed cram tests will also yield a detailed report with a diff between the 
expected and computed terminal output.

## Continuous integration workflow

Now that you learned to declare your tests, run them and read the reports, 
you're good to go for the local test-driven development. But modern software
engineering requires a third-party check of the tests before code is merged 
into the main codebase. This is one of the purpose of continuous integration
setups, and we'll discuss here how to set them up with Catala.

### Docker images

A continuous integration setup usually start by deploying a cloud-based
virtual machine or container equipped with all the dependencies necessary 
to build your code and run your tests. 

~~~admonish info title="Catala CI images"
To avoid you the hassle of manually installing Catala and configuring your
virtual machine, the Catala team provides ready-to-use [Docker](https://www.docker.com/) images for 
CI based on [Alpine Linux](https://www.alpinelinux.org/).

You can browse them [here](https://gitlab.inria.fr/catala/ci-images/container_registry/4100)
or pull them with:

```text
$ docker pull registry.gitlab.inria.fr/catala/ci-images:latest
```

Note that `latest-c` is a version of the CI image supplemented with the 
dependencies necessary to compile and run C code; likewise for `latest-java`,
`latest-python`. Choose the image that suits your needs, or build upon it in 
your own Dockerfile.
~~~

### Actions workflows

Now, this step depends on what you use as a software development forge. Nowadays,
all of them have some way of declaring workflows triggered at certain events
(commits on a branch, on a PR, on a merge, etc). These workflows spin up runners
that execute certain commands, typically to run the test or build an artifact.

This walkthrough will not teach you how to write these workflow files, please
refer to the documentation of your software forge. However, to give you a quick
idea, here is an example workflow file using the Github format for our 
example Catala project:

```yaml
name: CI

on:
  push:
    branches: [main]
    tags: ["*.*.*"]
  workflow_dispatch:
  pull_request:

jobs:
  tests:
    name: Test suite and build
    runs-on: self-hosted
    container:
      image: registry.gitlab.inria.fr/catala/ci-images:latest-c
      options: --user root
    steps:
      - name: Fix home
        # Workaround Github actions issue, see
        # https://github.com/actions/runner/issues/863
        run: sudo sh -c "echo HOME=/home/ocaml >> ${GITHUB_ENV}"
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run test suite with the Catala interpreter and backends
        run: |
          opam --cli=2.1 exec -- clerk ci 
```

The `opam --cli=2.1 exec` is important because `clerk` and `catala` are installed
via opam and the OCaml software toolchain in the CI images.

~~~admonish question title="What does `clerk ci` do?"
Tailored for putting inside a CI run, `clerk ci` is simply a shorthand for :
* `clerk test` on all your project;
* `clerk build` for all the targets declared in your `clerk.toml`
* `clerk test --backend=...` for all the backends declared in each one of 
  your targets in `clerk.toml`.

This makes sure everything builds, and all the test pass with the interpreter
**and** inside the generated code in each backend. Difficult to get more assurance
than that!
~~~

### Retrieving artifacts and deploying them

Inside your CI workflow, after a `clerk ci` or `clerk build` run, you should
find the generated source code for each backend of each target inside the 
`_targets` folder (remember the [previous section of the walkthrough](./3-2-compilation-deployment.md)).
From there, you can customize your workflow file to retrieve the artifact,
package it how you like, transfer it to another repo, build a bigger application
that integrates it, etc. 

## Conclusion

Thank you for following this walkthrough! We hope it puts you on the tracks 
of a successful Catala project. Please read the [`clerk` reference](./6-clerk.md)
for more information about what our build system can do to help you.