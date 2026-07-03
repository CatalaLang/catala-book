# Project building and deployment

<div id="tocw"></div>

In the previous section, we defined a directory containing a Catala project with
a `clerk.toml` configuration file that contained two main targets (`us-tax-code`
and `housing-benefits`) that we aim to build and export as source libraries
in different languages.

~~~admonish info collapsible=true title="Recap from previous section: `clerk.toml` configuration file and project hierarchy"
Here is the `clerk.toml` configuration file of our mock project:
```toml
[project]
build_dir    = "_build"    # Defines where to output the generated compiled files.
target_dir   = "_target"   # Defines where to output the targets final files.

# Each [[target]] section describes a build target for the project

[[target]]
name         = "us-tax-code"                          # The name of the target
modules      = [ "Section_121", "Section_132", ... ]  # Modules components
tests        = [ "tests/test_income_tax.catala_en" ]  # Related test(s)
backends     = [ "c", "java" ]                        # Output language backends
dependencies = [ "common" ]                           # Explicit target's dependencies

[[target]]
name         = "housing-benefits"
modules      = [ "Section_8", ... ]
tests        = [ "tests/test_housing_benefits.catala_en" ]
backends     = [ "ocaml", "c", "java" ]
dependencies = [ "common" ]

[[target]]
name     = "common"
modules  = [ "Prorata", "Household", ... ]
backends = [ "ocaml", "c", "java", "python" ]
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

## Building the project

Now that you have everything setup, you can build the project, which means
compiling the Catala source code files into the different target programming
languages. That is the job of the `clerk build` command:

~~~admonish question title="Where to run `clerk`?"
`clerk` can be run from anywhere within your project hierarchy, but the
generated files will always be put to the build and target directories at the
root of the project.

You should not refer to sibling directories (`../bar`) pointing outside of the
project: this would cause path resolution failures in the Catala tooling.
~~~

```console
$ clerk build
┌─[RESULT]─
│ Build successful. The artefacts can be found at the following:
│
│ [common]
│   "_target/python/common"
│   "_target/ocaml/common"
│   "_target/java/common"
│   "_target/c/common"
│ [housing-benefits]
│   "_target/ocaml/housing-benefits"
│   "_target/java/housing_benefits"
│   "_target/c/housing-benefits"
│ [us-tax-code]
│   "_target/java/us_tax_code"
│   "_target/c/us-tax-code"
└─
```

The output of the command shows you where to find the results. Each `[[target]]`
section yields a subdirectory in the `_targets/` directory, which the compilation
artefacts inside. In our example, it could look like this:

```
_target/
├── c/
│   ├── common/
│   ├── housing-benefits/
│   ├── libcatala/
│   ├── Makefile
│   └── us-tax-code/
│       ├── Section_121.c
│       ├── Section_121.h
│       ├── Section_132.c
│       ├── ...
├── java/
│   ├── common/
│   ├── housing_benefits/
│   ├── libcatala/
│   ├── pom.xml
│   └── us_tax_code/
│       ├── pom.xml
│       ├── Section_121.java
│       └── Section_132.java
├── ocaml/
│   ├── ...
├── python/
│   ├── ...
```

Each target is compiled according its declared `backends` in our
configuration. Note that each `<backend>` directory also contains an
extra `libcatala` target. This directory contains the Catala runtime
and standard library needed for our artefacts to be executed.

## Deploying the generated code

Now that everything is properly built in the different backends, it is time to
integrate them! The purpose of Catala is to provide ready-to-use source
libraries in a target programming language; Catala does not make a whole
user-facing app for you. Hence, you usually take what Catala builds and
integrate it in another existing project.

From this point on, the deployment requires some manual labor as it depends on
the specifics of your use cases. Basically, it is up to you to copy the
artefacts in `_targets` to your other project, compile them and link them to
your existing codebase.

However, we provide a standard build mechanism depending on the
backend that can be used to generate exportable libraries. For
instance, if you want to integrate the Catala program as part of a
Java application, you have two solutions:

- The first one is to simply copy over the target's directories
  containing the generated Java sources from `_target/java` to your
  main project. Each `target` is declared as a separate Java
  `package`.

- The second one is to use [`maven`](https://maven.apache.org/) which
  will read the generated `pom.xml` project configuration file: `mvn
  package` will compile each target as a `jar` file which can be
  linked to your project. You could also automatize this packaging
  using a Continuous Integration (CI/CD) job to build and publishing the
  artefacts automatically.

Note that Catala offers similar capabilities for each backend.

~~~admonish danger title="Can I tweak the generated files to fit my workflow?"
The Catala team does not recommend tweaking the files generated by the Catala
compiler, for two reasons:
1. every time you will update the source Catala files, the compiler will
  re-generate a new file in your target programming language that you will have
  to re-tweak by hand;
2. even if you automate the tweaking, every tweak of the generated file
  might introduce a difference in behavior with how the original source Catala
  file behaves with the Catala interpreter.

Indeed, the Catala compiler guarantees that the generated file in your target
programming language behaves exactly as the source Catala file run with the
Catala interpreter. Any tweak to the generated file might break that guarantee.

To fit the generated files to your workflow, we recommend instead that you build
"glue" code in your target programming language on top of the generated files.
This "glue" code is likely to contain some utilities to convert your existing
data structures into the data structures expected by the generated files, and
back.
~~~

## Calling the generated functions in the target programming languages

Let's illustrate with an example. Consider this very simple Catala program:

~~~catala-en
> Module SimpleTax

```catala
declaration scope IncomeTaxComputation:
  input income content money
  output income_tax content money

scope IncomeTaxComputation:
  definition income_tax equals income * 10%
```
~~~

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
the result.

As mentioned, for every backend, there exists a dedicated version of
the Catala runtime. This component is necessary for the compilation
and execution of the generated Catala programs. Runtimes will describe
Catala types and data-structures, specific errors as well as an API to
manipulate them from the targeted languages. The files for the runtime
should be included in the `_targets/<backend>/<target-name>`; you can
also copy them over to your project and reference their types and
functions from your app.

Putting this all together, here is for instance a simple Java program that
executes our scope:

```java
import catala.runtime.CatalaMoney;

class Main {
    public static void main(String[] args){
        CatalaMoney income_input = new CatalaMoney(55012.52);
        IncomeTaxComputation result = new IncomeTaxComputation(income_input);
        CatalaMoney tax_result = result.income_tax;
        System.out.println("Income tax: " + tax_result);
    }
}
```

Catala runtimes offer an API to build the catala-specific values,
e.g., `CatalaMoney` objects are the equivalent of a money-type Catala
value. Only sky is the limit afterwards as to what you can build!

In this section, we have seen how to build a project, export it and
integrate it in an existing application. In the following section, we
will dive into Catala's tests and setting up continuous integration.
