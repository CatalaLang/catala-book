# Tutorial : computing your taxes

Welcome to this tutorial, whose objective is to guide you through the features
of the Catala language and teach you how to annotate a simple legislative text
using the language, and get out an executable program that compute your taxes!

This tutorial does not cover the installation of Catala. For more information
about this to the [Getting started chapter](./1-0-getting_started.md). If you
want follow this tutorial locally, simply create an empty file with the
extension `.catala_en`, which you will be filling as you read the tutorial by
copy-pasting the relevant section. This tutorial itself is written as a Catala
program, whose source code is [available
online](https://github.com/CatalaLang/catala-book/blob/main/src/2-tutorial.md).

## Mixing law and code

Catala is a language designed around the concept of *literate programming*, that
is the mixing between the computer code and its specification in a single
document. Hence, a Catala source code file looks like a regular Markdown
document, with the specification written down and styled as Markdown text,
with the Catala code only present in well-bounded Catala code blocks introduced
by `` ```catala ``.

Before writing any Catala code, we must then introduce the specification of the
code for this tutorial. This specification will be based on a fictional Tax Code
defining a simple income tax. But in general, anything can be used as a
specification for a Catala program: laws, executive orders, court cases
motivations, legal doctrine, internal instructions, technical specifications,
etc. These sources can also be mixed to form a complete Catala program that
relies on multiple sources of specification. Concretely, just copy-paste the
text of the specification and format it in Markdown syntax inside a Catala
source code file.

Without further ado, let us introduce the first bit of specification for
our fictional income tax, Article 1 of the CTTC (Catala Tutorial Tax Code):

> #### Article 1
>
> The income tax for an individual is defined as a fixed percentage of the
> individual's income over a year.

The spirit of writing code in Catala is to stick to the specification at all
times in order to put the code snippets where they belong. Hence, we will
introduce below the Catala code snippets that translate Article 1, which
should be put just below Article 1 in the Catala source code file.

These code
snippets should describe the program that computes the income tax, and contain
the rule defining it as a multiplication of the income as rate. It is time
to dive into Catala as a programming language.


```catala
# We will soon learn what to write here in order to translate the meaning
# of Article 1 into Catala code.

# To create a block of Catala code in your file, bound it with Markdown-style
# "```catala" and "```" delimiters. You can write comments in Catala code block
# by prefixing lines with "#"
```

## Setting up data structures


The content of article 1 uses a lot of implicit context: there exists an
individual with an income, as well as an income tax that the individual has
to pay each year. Even if this implicit context is not verbatim in the law,
we have to explicit it for programming purposes. Concretely, we need a
"metadata" section that defines the shape and types of the data used
inside the law.

Let's start our metadata section by declaring the type information for the
individual, the taxpayer that will be the subject of the tax computation.
This individual has an income and a number of children, both pieces of
information which will be needed for tax purposes :

```catala
declaration structure Individual:
  # The name of the structure "Individual", must start with an
  # uppercase letter: this is the CamelCase convention.
  data income content money
  # In this line, "income" is the name of the structure field and
  # "money" is the type of what is stored in that field.
  # Available types include: integer, decimal, money, date, duration,
  # and any other structure or enumeration that you declare.
  data number_of_children content integer
  # "income" and "number_of_children" start by a lowercase letter,
  # they follow the snake_case convention.
```

This structure contains two data fields, "income" and "number_of_children".
Structures are useful to group together data that goes together. Usually, you
get one structure per concrete object on which the law applies (like the
individual). It is up to you to decide how to group the data together,
but you should aim to optimize code readability.

Sometimes, the law gives an enumeration of different situations. These
enumerations are modeled in Catala using an enumeration type, like:

```catala
declaration enumeration TaxCredit:
# The name "TaxCredit" is also written in CamelCase.
-- NoTaxCredit
# This line says that "TaxCredit" can be a "NoTaxCredit" situation.
-- ChildrenTaxCredit content integer
# This line says that alternatively, "TaxCredit" can be a
# "ChildrenTaxCredit" situation. This situation carries a content
# of type integer corresponding to the number of children concerned
# by the tax credit. This means that if you're in the "ChildrenTaxCredit"
# situation, you will also have access to this number of children.
```

In computer science terms, such an enumeration is called a "sum type" or simply
an enum. The combination of structures and enumerations allow the Catala
programmer to declare all possible shapes of data, as they are equivalent to
the powerful notion of "algebraic data types".

## Scopes as basic computation blocks

We've defined and typed the data that the program will manipulate. Now we have
to define the logical context in which this data will evolve. This is done in
Catala using "scopes". Scopes are close to functions in terms of traditional
programming. Scopes also have to be declared in metadata, so here we go:

```catala
declaration scope IncomeTaxComputation:
  # Scope names use CamelCase.
  input individual content Individual
  # This line declares a scope variable of the scope, which is akin to
  # a function parameter in computer science term. This is the piece of
  # data on which the scope will operate.
  internal fixed_percentage content decimal
  output income_tax content money
```

The scope is the basic abstraction unit in Catala programs, and the declaration
of the scope is akin to a function signature: it contains a list of all the
arguments along with their types. But in Catala, scopes' variables stand
for three things: input arguments, local variables and outputs. The difference
between these three categories can be specified by the different input/output
attributes preceding the variable names. "input" means that the variable has to
be defined only when the scope IncomeTaxComputation is called. "internal" means
that the variable cannot be seen from outside the scope: it is neither an input
nor an output of the scope. "output" means that a caller scope can retrieve the
computed value of the variable. Note that a variable can also be simultaneously
an input and an output of the scope, in that case it should be annotated with
"input output".

## Defining variables and formulas

We now have everything to annotate the contents of article 1, which is copied
over below.


```catala
scope IncomeTaxComputation:
  definition income_tax equals
    individual.income * fixed_percentage
```
