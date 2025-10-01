# Test and continuous integration workflow

<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>


In the previous section, we defined a directory containing a Catala project with
a `clerk.toml` configuration file that contained two main targets (`us-tax-code`
and `housing-benefits`), that we learn to compile and deploy in C and Java. Now,
let's make sure the deployed code is correct and practice some test-driven
development!

~~~~~~admonish info collapsible=true title="Recap from previous section: `clerk.toml` configuration file and project hierarchy"
`clerk.toml` configuration file of our mock project
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
~~~~~~


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
on the best fit for your use case.

### Assertion testing

### Cram testing

## Continuous integration workflow

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

<!-- TODO:
  - (prerequisite) have some dev docker images
  - give a yaml file example (mention clerk ci)
  - generate Catala target's archives artifact (requires standalone archives)
-->
