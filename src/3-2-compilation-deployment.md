# Project building and deployment

In the previous section, we defined a directory containing a Catala
project with a `clerk.toml` configuration file that contained two main
targets (`us-tax-code` and `housing-benefits`) that we aim to build
and export them as libraries in different languages.

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

<!-- TODO: package into static libraries and document it -->

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

Now that everything is properly built in the different backends, it is
time to integrate them in an existing project. From this point on, it
requires some manuel labor as it depends on your use-case. For
instance, if you want to integrate the Catala program as part of a
Java application, one way of doing this is to copy over the generated
Java source files from the `_target/<target_name>/java/` directory to
a sub-directory of your Java project.

~~~admonish warning title="Work in progress"
It is not recommended to manually edit the generated files. Instead,
it is best to modify the Catala code whenever possible.
~~~

### Catala runtime

For every backend, there exists a dedicated version of the Catala
runtime. This component is necessary for the compilation and execution
of the generated Catala programs. Runtimes will describe Catala types
and data-structures, specific errors as well as an API to manipulate
them from the targeted languages.

Let's illustrate with an example. Consider this very simple Catala program:
```catala
    > Module SimpleTax

    ```catala
    declaration scope IncomeTaxComputation:
      input income content money
      output income_tax content money

    scope IncomeTaxComputation:
      definition income_tax equals income * 10%
    ```
```

With its Java-compiled version:

~~~~~~admonish info collapsible=true title="Generated 'SimpleTax.java' file"
```Java
/* This file has been generated by the Catala compiler, do not edit! */

import catala.runtime.*;
import catala.runtime.exception.*;

public class Test {

    public static class IncomeTaxComputation implements CatalaValue {

        final CatalaMoney income_tax;

        IncomeTaxComputation (final CatalaMoney income_in) {
            final CatalaMoney income = income_in;
            final CatalaMoney
                incomeTax = income.multiply
                             (new CatalaDecimal(new CatalaInteger("1"),
                                                new CatalaInteger("5")));
            this.income_tax = incomeTax;
        }

        static class IncomeTaxComputationOut {
            final CatalaMoney income_tax;
            IncomeTaxComputationOut (final CatalaMoney income_tax) {
                this.income_tax = income_tax;
            }
        }

        IncomeTaxComputation (IncomeTaxComputationOut result) {
            this.income_tax = result.income_tax;
        }

        @Override
        public CatalaBool equalsTo(CatalaValue other) {
          if (other instanceof IncomeTaxComputation v) {
              return this.income_tax.equalsTo(v.income_tax);
          } else { return CatalaBool.FALSE; }
        }

        @Override
        public String toString() {
            return "income_tax = " + this.income_tax.toString();
        }
    }

}
```
~~~~~~

If you inspect the generated file, you will notice that the Catala
scopes will be translated as a Java class (and as functions in C or
Python). Scope computations are done in the class constructor. Hence,
to execute the scope, we need to instantiate this class and retrieve
the result. Here is a simple Java program that executes our scope:

```java
import catala.runtime.CatalaMoney;

class Main {
    public static void main(String[] args){
        CatalaMoney income_input = CatalaMoney.ofCents(50000*100);
        IncomeTaxComputation result = new IncomeTaxComputation(income_input);
        CatalaMoney tax_result = result.income_tax;
        System.out.println("Income tax: " + tax_result);
    }
}
```

As mentioned, Catala runtimes offer an API to build the
catala-specific values, e.g., the `CatalaMoney.ofCents` java static
method that build a `CatalaMoney` value equivalent to a money-type
value.

In this section, we have seen how to build a project, export it and
integrate it in an existing application. In the following section, we
will dive into Catala's tests and setting up continuous integration.
