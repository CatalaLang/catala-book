# Test and continuous integration workflow

## Testing Catala programs

Catala supports two distinct flavors of tests, tailored for different purposes:

- **Test scopes** should be the main way to write tests that validate
  expectations on a given computation. This is the natural way to automatise the
  `catala interpret --scope=TestXxx` commands we have been running so far.
- **Cli tests** provide a way to run custom catala commands and check their
  output. They make the computation output visible, and are sometimes useful for
  more specific needs, like ensuring the correct error is triggered in a given
  situation.

The command `clerk test` can be run on any file or directory holding catala
files, will process both kinds of tests and print a report.

### Test scopes

#### Declaration

A **test scope** is a scope that is marked with the "test" attribute: simply
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

#### Definition

The expected output of the test should be validated with `assertion` statements. (Without them, the only thing the test would validate is that the computation doesn't trigger an error).

```catala
scope TestMoneyRounding:
  definition result equals $100 / 3
  assertion result = $33.33
```

Most often, as seen in [2.1](2-1-basic-blocks.html#testing-the-code),
a test scope is used to run a more generic computation scope, providing it with
specific inputs and an expected result.

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

#### Running the tests

Simply use `clerk test tutorial.catala_en`. You can specify a directory to test
everything below this directory; if you don't specify anything, the current
directory is used.

```shell-session
$ clerk test --verbose
██ tutorial.catala_en: 1 / 1 tests passed
   ■ scope Test passed

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃             FAILED     PASSED      TOTAL                                     ┃
┃   tests          0          1          1                                     ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

The summary will detail any failures. In addition, it is possible to run the
command with the flag `--xml` to obtain a JUnit-compatible report.

~~~admonish note title="Validating the backend-generated code"
The above tests the Catala code as run by the Catala interpreter (and through
the OCaml backend, for compiled modules). If your deployment uses a specific
backend, say python, it is highly recommended that you also include a run of
`clerk test --backend=python` in your CI.

This command will compile the tests into an executable that validates the
consistency of all outputs with what the interpreter returned, using the given
backend; then run that target. This way, you will be shielded from the
eventuality that a bug in the backend you use leads to a different outcome for
the same Catala program.
~~~


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
    [LOG]   ≔  IncomeTaxComputation.direct.input: IncomeTaxComputation_in { -- current_date_in: 1999-01-01 -- individual_in: Individual { -- income: $20,000.00 -- number_of_children: 0 } -- overseas_territories_in: false }
    [LOG]   ☛ Definition applied:
            ─➤ tutorial.catala_en:33.5-33.32:
               │
            33 │     current_date < |2000-01-01|
               │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 2 (old version before 2000)
    [LOG]   ≔  IncomeTaxComputation.tax_rate: 0.2
    [LOG]   ☛ Definition applied:
            ─➤ tutorial.catala_en:21.14-21.24:
               │
            21 │   definition income_tax equals
               │              ‾‾‾‾‾‾‾‾‾‾
            Article 1
    [LOG]   ≔  IncomeTaxComputation.income_tax: $4,000.00
    [LOG]   ☛ Definition applied:
            ─➤ tutorial.catala_en:215.5-223.6:
                │
            215 │     output of IncomeTaxComputation with {
                │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            216 │       -- individual:
                │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            217 │         Individual {
                │         ‾‾‾‾‾‾‾‾‾‾‾‾
            218 │           -- income: $20,000
                │           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            219 │           -- number_of_children: 0
                │           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            220 │         }
                │         ‾
            221 │       -- overseas_territories: false
                │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            222 │       -- current_date: |1999-01-01|
                │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            223 │     }
                │     ‾
            Test
    [LOG]   ≔  IncomeTaxComputation.direct.output: IncomeTaxComputation { -- income_tax: $4,000.00 }
    [LOG] ←  IncomeTaxComputation.direct
    [LOG] ≔  Test.computation: IncomeTaxComputation { -- income_tax: $4,000.00 }
    ┌─[RESULT]─ Test ─
    │ computation = IncomeTaxComputation { -- income_tax: $4,000.00 }
    └─
    ```

When running `clerk test`, the specified command is run on the file (truncated
to that point). If the output exactly matches what is in the file, the tests
passes. Otherwise, it fails, and the precise differences are shown side-by-side.

There are two additional big differences with the "test scopes" approach:
- this cannot be used to test backend-generated code, only `catala` commands:
  `clerk test --backend=...` won't run CLI tests.
- if the tests fail, but due to a legitimate difference (for example, a line
  number change in the example above), it is possible to run
  `clerk test --reset` to automatically update the expectations. This will
  immediately make the CLI test pass, but versionning
  systems and a standard code review will highlight the changes.

`clerk test --reset` can also be used to initialise a new test, from a
`` ```catala-test-cli`` section that only provides the command without expected
output.
