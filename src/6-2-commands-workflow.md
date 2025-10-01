# Commands and workflow


<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>

## `clerk build`

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

## `clerk test`

### Running the tests

`clerk test` can be used without any arguments at the root directory of
a Catala project, with the following output:

```shell-session
$ clerk test
┏━━━━━━━━━━━━━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                    ┃
┃             FAILED     PASSED      TOTAL                           ┃
┃   files          0         37         37                           ┃
┃   tests          0        261        261                           ┃
┃                                                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

The `tests` line of this report counts the number of failed and passed
tests. The `files` line displays the number of files where either all tests
pass, or there is at least one failing test.

You can print the details about the files containing passing and failing tests
with the `--verbose` flag. In addition, it is possible to run the
command with the flag `--xml` to obtain a JUnit-compatible report.

You can restrict the scope of which tests are executed by `clerk test` by providing another argument:
* `clerk test <file>` will run only the tests in `<file>`;
* `clerk test <folder>` will run only the tests inside files in `<folder>` (or its sub-directories);
* `clerk test <target>` will run only the tests related to the [build `<target>`](./6-1-clerk-toml.md).


~~~admonish info title="What does `clerk test` use for running tests?"
`clerk test` executes the tests with the Catala interpreter. If your deployment
uses a specific backend, say python, it is highly recommended that you also
include a run of `clerk test --backend=python` in your CI. With this option,
`clerk test` runs Python on the generated Python code by the Catala compiler.
 This way, you will be shielded from the eventuality that a bug in the backend
you use leads to a different outcome for the same Catala program. Trust does
not exclude checking throughouly!
~~~

### Declaring the tests

Catala supports two distinct flavors of tests, tailored for different purposes:

- **Scope tests** should be the main way to write tests that validate
  expected results on a given computation. This is the natural way to automate the
  `clerk run --scope=TestXxx` commands you use to run your tests manually.
- **CLI tests** provide a way to run custom catala commands and check their
  output on `stdout` and `stderr`. They are sometimes useful for more specific
  needs, like ensuring the correct error is triggered in a given situation.

The command `clerk test` can be run on any file or directory holding catala
files, will process both kinds of tests and print a report.

#### Scope tests

A **test scope** is a scope that is marked with the "test" [attribute](./5-7-extra-features.md#attributes-and-extensionsq): simply
write `#[test]` just before its `declaration` keyword.

```catala
#[test]
declaration scope TestMoneyRounding:
  output result content money
```

There are two requirements for a test scope:
- The scope must be public (declared in a `` ```catala-metadata`` section) so
  that it can be run and checked in real conditions
- It must not require any input: only `internal`, `output` and `context`
  variables are allowed

The expected output of the test should be validated with `assertion` statements.
Without them, the only thing the test would validate is that the computation
doesn't trigger an error.

```catala
scope TestMoneyRounding:
  definition result equals $100 / 3
  assertion result = $33.33
```

As seen in [the tutorial](2-1-basic-blocks.html#testing-the-code), a test scope
almost always take the form of a call to the real scope you want to test,
providing it with specific inputs and an expected result:

```catala
#[test]
declaration scope Test_IncomeTaxComputation_1:
  output computation content IncomeTaxComputation

scope Test_IncomeTaxComputation_1:
  # Define the computation as IncomeTaxComputation applied to specific inputs
  definition computation equals
    output of IncomeTaxComputation with {
      -- individual:
        Individual {
          -- income: $20,000
          -- number_of_children: 0
        }
    }
  # Check that the result is as expected
  assertion computation.income_tax = $4,000
```

### Command-line interface (CLI) tests

This second flavor of tests provides a means to validate the output of a given
Catala command, which may be useful in more specific integration scenarios. It
is inspired by the [Cram](https://bitheap.org/cram/) test system, in that a
single source file includes both the test command and its expected output.

For example, checking that an error happens when expected cannot be done with
test scopes, which must succeed. You may want to include tests that make use of
`catala proof`. Or you could want, for a simple test, to validate that the trace is
exactly as intended. For this, a `` ```catala-test-cli`` section should be
introduced in the source Catala file. The first line always starts with
`$ catala `, followed by the Catala command to run on the current file ; the
rest is the expected output from the command ; additionally, if the command
terminated with an error, the last line will show the error code.

    ```catala-test-cli
    $ catala interpret --scope=Test --trace
    [LOG] ☛ Definition applied:
          ─➤ tutorial.catala_en:214.14-214.25:
              │
          214 │   definition computation equals
              │              ‾‾‾‾‾‾‾‾‾‾‾
          Test
    [LOG] →  IncomeTaxComputation.direct
       ...
    [LOG]   ≔  IncomeTaxComputation.direct.output: IncomeTaxComputation { -- income_tax: $4,000.00 }
    [LOG] ←  IncomeTaxComputation.direct
    [LOG] ≔  Test.computation: IncomeTaxComputation { -- income_tax: $4,000.00 }
    ┌─[RESULT]─ Test ─
    │ computation = IncomeTaxComputation { -- income_tax: $4,000.00 }
    └─
    ```

When running `clerk test`, the specified command is run on the file or directory (truncated
to that point). If the output exactly matches what is in the file, the tests
passes. Otherwise, it fails, and the precise differences are shown side-by-side.

Beware, CLI tests this cannot be used to test backend-generated code; so `clerk
  test --backend=...` won't run CLI tests.

~~~admonish tip title="Resetting the expected output of a CLI test"
If a CLI test fail, but due to a legitimate difference (for example, a line
number change in the example above), it is possible to run
`clerk test --reset` to automatically update the expected result. This will
immediately make the CLI test pass, but versionning
systems and a standard code review will highlight the changes.

`clerk test --reset` can also be used to initialise a new test, from a
`` ```catala-test-cli`` section that only provides the command without expected
output.
~~~

## `clerk ci`

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

## `clerk run`

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

## `clerk clean`

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~
