# Tutorial : computing your taxes

Welcome to this tutorial, whose objective is to guide you through the features
of the Catala language and teach you how to annotate a simple legislative text
using the language, and get out an executable program that compute your taxes!

This tutorial does not cover the installation of Catala. For more information
about this to the [Getting started chapter](./1-0-getting_started.md). If you
want follow this tutorial locally, simply create an empty file with the
extension `.catala_en`, which you will be filling as you read the tutorial by
copy-pasting the relevant section.

At any point, please refer to [the Catala syntax cheat
sheet](https://catalalang.github.io/catala/syntax.pdf) or the [reference
guide](./5-catala.md) for an exhaustive view of the syntax and features of
Catala; this tutorial is rather designed to ease you into the language and its
common use patterns.

## Mixing law and code

Catala is a language designed around the concept of *literate programming*, that
is the mixing between the computer code and its specification in a single
document. Why literate programming? Because it enables a fine-grained
correspondance between the specification and the code. Whenever the
specification is updated, knowing where to update the code is trivial with
literal programming. This is absolutely crucial for enabling long-term
maintenance of complex and high-assurance programs like tax or social benefits
computation.

Hence, a Catala source code file looks like a regular Markdown
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
# "```catala" and "```" delimiters. You can write comments in Catala code blocks
# by prefixing lines with "#"
```

## Setting up data structures


The content of Article 1 assumes a lot of implicit context: there exists an
individual with an income, as well as an income tax that the individual has
to pay each year. Even if this implicit context is not verbatim in the law,
we have to explicit it in the computer code, in the form of data structures
and function signatures.

Catala is a strongly-typed, statically compiled language, so all data structures
and function signatures have to be explicitly declared. So, we begin by
declaring the type information for the individual, the taxpayer that will be the
subject of the tax computation. This individual has an income and a number of
children, both pieces of information which will be needed for tax purposes :

```catala
# The name of the structure, "Individual", must start with an
# uppercase letter: this is the CamelCase convention.
declaration structure Individual:
  # In this line, "income" is the name of the structure field and
  # "money" is the type of what is stored in that field.
  # Available types include: "integer", "decimal", "money", "date",
  # "duration", and any other structure or enumeration that you declare.
  data income content money
  # The field names "income" and "number_of_children" start by a lowercase
  # letter, they follow the snake_case convention.
  data number_of_children content integer
```

This structure contains two data fields, `income` and `number_of_children`.
Structures are useful to group together data that goes together. Usually, you
get one structure per concrete object on which the law applies (like the
individual). It is up to you to decide how to group the data together, but we
advise you to aim at optimizing code readability.

Sometimes, the law gives an enumeration of different situations. These
enumerations are modeled in Catala using an enumeration type, like:

```catala
# The name "TaxCredit" is also written in CamelCase.
declaration enumeration TaxCredit:
  # The line below says that "TaxCredit" can be a "NoTaxCredit" situation.
  -- NoTaxCredit
  # The line below says that alternatively, "TaxCredit" can be a
  # "ChildrenTaxCredit" situation. This situation carries a content
  # of type integer corresponding to the number of children concerned
  # by the tax credit. This means that if you're in the "ChildrenTaxCredit"
  # situation, you will also have access to this number of children.
  -- ChildrenTaxCredit content integer
```

In computer science terms, such an enumeration is called a "sum type" or simply
an enum. The combination of structures and enumerations allow the Catala
programmer to declare all possible shapes of data, as they are equivalent to
the powerful notion of "algebraic data types".

Notice that these data structures that we have declared cannot always be
attached naturally to a particular piece of the specification text. So, where to
put these declarations in your literate programming file? Since you will be
often going back to these data structure declarations during programming, we
advise you to group them together in some sort of prelude in your code source
file.

## Scopes as basic computation blocks

We've defined and typed the data that the program will manipulate. Now we have
to define the logical context in which this data will evolve. Because Catala is
a functional programming language, all code exists within a function. And the
equivalent to a function in Catala is called a *scope*. Every scope has a name,
input variables (similar to function arguments), internal variables (similar to
local variables), and output variables (that together form the return type of
the function). For instance, Article 1 defines a scope for computing the income
tax:

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

The scope is the basic abstraction unit in Catala programs, and scopes
can be composed. Since a function can call other functions, scopes can also
call other scopes. We will see later how to do this, but first let us focus
on the inputs and outputs of scopes.

The declaration of the scope is akin to a function signature: it contains a list
of all the arguments along with their types. But in Catala, scopes' variables
can be input, local or output. `input` means that the variable is provided
whenever the scope is called, and cannot be defined within the scope. `internal`
means that the variable is defined within the scope and cannot be seen from
outside the scope; it's not part of the return value of the scope. `output`
means that a caller can retrieve the computed value of the variable. Note that a
variable can also be simultaneously an input and an output of the scope, in that
case it should be annotated with `input output`.

Once the scope has been declared, we can use it to define our computation
rules and finally code up Article 1!


## Defining variables and formulas

Article 1 actually gives the formula to define the `income_tax` variable of
scope `IncomeTaxComputation`.

> #### Article 1
>
> The income tax for an individual is defined as a fixed percentage of the
> individual's income over a year.
>
> ```catala
> scope IncomeTaxComputation:
>   definition income_tax equals
>     individual.income * fixed_percentage
> ```

Let us unpack the code above. Each `definition` of a variable  (here,
`income_tax`) is attached to a scope that declares it (here,
`IncomeTaxComputation`). After `equals`, we have the actual expression for the
variable : `individual.income * fixed_percentage`. The syntax for formulas uses
the classic arithmetic operators. Here, `*` means multiplying an amount of
`money` by a `decimal`, returning a new amount of `money`. The exact behavior of
each operator depends on the types of values it is applied on. For instance,
here, because a value of the `money` type is always an integer number of cents,
`*` rounds the result of the multiplication to the nearest cent to provide the
final value of type `money` (see [the FAQ](./4-1-design.md) for more information
about rounding in Catala). About `individual.income`, we see that the `.` notation
lets us access the `income` field of `individual`, which is actually a structure
of type `Individual`.

However, at this point we're still missing the definition of `fixed_percentage`.
This is a common pattern when coding the law: the definitions for various
variables are scattered in different articles. Fortunately, the Catala compiler
automatically collects all the definitions for each scope and puts them
in the right order. Here, even if we define `fixed_percentage` after
`income_tax` in our source code, the Catala compiler will switch the order
of the definitions internally because `fixed_percentage` is used in the
definition of `income_tax`. More generally, the order of toplevel definitions
and declarations in Catala source code files does not matter, and you can
refactor code around freely without having to care about dependency order.

In this tutorial, we'll suppose that our fictional CTTC specification defines
the percentage in the next article. The Catala code below should not surprise
you at this point.

> #### Article 2
>
> The fixed percentage mentioned at article 1 is equal to 20 %.
>
> ```catala
> scope IncomeTaxComputation:
>   # Writing 20% is just an alternative for the decimal "0.20".
>   definition fixed_percentage equals 20 %
> ```

## Conditional definitions and exceptions

So far so good, but specifications coming from legal text do not always
neatly combine articles dans variable definitions. Sometimes, and this
is a very common pattern, a later article redefines a variable already
defined previously, but with a twist in a certain exceptional situation.
For instance, Article 3 of CTTC:

> #### Article 3
>
> If the individual is in charge of 2 or more children, then the fixed
> percentage mentioned at article 1 is equal to 15 %.


This article actually gives another definition for the fixed percentage, which
was already defined in article 2. However, article 3 defines the percentage
conditionally to the individual having more than 2 children. How to redefine
`fixed_percentage`? Catala allows you precisely to redefine a variable under a
condition with the `under condition ... consequence` syntax:

```catala
scope IncomeTaxComputation:
  definition fixed_percentage under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```

What does this mean? If the individual has more than two children, then
`fixed_percentage` will be `15 %`. Conditional definitions let you define
your variables piecewise, one case at a time; the Catala compiler stitches
everything together for execution. More precisely, at runtime, we look at
the conditions of all piecewise definitions for a same variable, and pick
the one that is valid.

But what happens if no conditional definition is valid at runtime? Or multiple
valid definitions at the same time? In these cases, Catala will abort
execution and return an error message like the one below:

```text
┌─[ERROR]─
│
│  During evaluation: conflict between multiple valid consequences for assigning the same variable.
│
├─➤ tutorial_en.catala_en
│     │
│     │   definition fixed_percentage equals 20 %
│     │                                      ‾‾‾‾
├─ Article 2
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals 15 %
│     │                      ‾‾‾‾
└─ Article 3
```

If the specification is correctly drafted, then these error situations should
not happen, as one and only one conditional definition should be valid at all
times. Here, however, our definition of `fixed_percentage` conflicts with the
more general definition that we gave above. To correctly model situations like
this, Catala allows us to define precedence of one conditional definitions
over another. It is as simple as adding `exception` before the definition.
For instance, here is a more correct version of the code for Article3 :

> #### Article 3
>
> If the individual is in charge of 2 or more children, then the fixed
> percentage mentioned at article 1 is equal to 15 %.
>
> ```catala
> scope IncomeTaxComputation:
>   exception definition fixed_percentage under condition
>     individual.number_of_children >= 2
>   consequence equals 15 %
> ```

With `exception`, the conditional definition at Article 3 will be picked over
the base case at Article 1 when the individual has two children or more. This
`exception` mechanism is modeled on the logic of legal drafting: it is the key
mechanism that lets us split our variables definition to match the structure of
the specification. Without `exception`, it is not possible to use the literate
programming style. This is precisely why writing and maintaining computer
programs for taxes or social benefits is very difficult with mainstream
programming languages. So, go ahead and use `exception` as much as possible,
since it is a very idiomatic Catala concept.


## Composing scopes and functions together

Catala is a functional language and encourages using functions to describe
relationships between data. As part of our ongoing CTTC specification,
we will now imagine an alternative tax system with two progressive brackets.
This new example will illustrate how to write more complex Catala programs
by composing abstractions together.

First, let us start with the data structure and new scope for our new
two-brackets tax computation.

```catala
# This structure describes the parameters of a tax computation formula that
# has two tax brackets, each with their own tax rate.
declaration structure TwoBrackets:
  data breakpoint content money
  data rate1 content decimal
  data rate2 content decimal

declaration scope TwoBracketsTaxComputation:
  # This input variable contains the description of the
  # parameters of the tax formula.
  input brackets content TwoBrackets
  # But for declaring the tax_formula variable, we declare it as
  # a function: "content money depends on income content money" means a function
  # that returns money as output (the tax) and takes the "income" money
  # parameter as input.
  output tax_formula content money depends on income content money
```

The scope `TwoBracketsTaxComputation` is a generic scope that takes as input
the parameters of a two-brackets tax computation, and returns a function
that effectively computes the amount of tax under this given two-brackets
system. Passing around functions as values is a powerful tool to gain
in expressivity when programming, and reduce code duplication and boilerplate
to instantiate the same concept multiple times. More importantly, functions
as values allow us to sometimes stick closer to the text of the specification
that might be very general. Imagine the following Article 4 of the CTTC:

> #### Article 4
>
> The tax amount for a two-brackets computation is equal to the amount
> of income in each bracket multiplied by the rate of each bracket.
>
> ```catala
> scope TwoBracketsTaxComputation :
>   # This is the formula for implementing a two-brackets tax system.
>   definition tax_formula of income equals
>     if income <= brackets.breakpoint then
>       income * brackets.rate1
>     else (
>       brackets.breakpoint * brackets.rate1 +
>       (income - brackets.breakpoint) * brackets.rate2
>     )
> ```

The above formula for the two-brackets tax system computation also introduces
the `if ... then ... else ...` syntax, that is still available in Catala even if
the language encourages the use of conditional definitions and exceptions. Here,
we could have defined `tax_formula` with two conditional definitions, one for
`income <= brackets.breakpoint`, and one for `income > brackets.breakpoint`.
However, the legal specification here does not split the definition of
`tax_formula` in two different article, so it does not make sense to split the
definition of `tax_formula` in the code.

More generally, a rule of thumb for deciding when to split or not variable
definitions into conditional definitions is to simply follow what the
specification text does. If the specification text splits it definition in
multiple paragraphs or sentence, then you can annotate each paragraph or
sentence with the corresponding conditional definition. But if the specification
introduces the definition in a single block of text, then no need to split the
code. For instance, it is more compact to translate a table of values in a
specification with `if ... then ... else ...` statements than conditional
definitions, so it may be better to proceed that way.

Now that we've defined our helper new scope for computing a two-brackets tax, we
want to use it in our main tax computation scope. As mentioned before, Catala's
scope can also be thought of as functions. And sometimes, the specification 
does implicity translates into a function call, like the article below.

> #### Article 5
> 
> For individuals in charge of zero children, the income
> tax of Article 1 is defined as a two-brackets computation with rates 20% and 
> 40%, with an income breakpoint of $100,000. 

To translate Article 5 into Catala code, we need the scope `IncomeTaxComputation`
to call the scope `TwoBracketsTaxComputation`. One way to write that is to 
declare `TwoBracketsTaxComputation` as a static sub-scope of `IncomeTaxComputation`.
This is done by updating the declaration of `IncomeTaxComputation` and 
adding a line for the `TwoBracketsTaxComputation` sub-scope:

```catala
declaration scope IncomeTaxComputation:
  # This line says that we add the "two_brackets" as a scope variable.
  # However, the "scope" keyword tells that this item is not a piece of data
  # but rather a subscope that we can use to compute things.
  two_brackets scope TwoBracketsTaxComputation
  input individual content Individual
  output income_tax content money
```

`two_brackets` is thus the name of the sub-scope call and we can provide its
arguments to code up the two-brackets computation parameters set by Article 5:

> ```catala
> scope IncomeTaxComputation :
>   # Since the subscope "two_brackets" is like a function we can call,
>   # we need to define its arguments. This is done below with the only 
>   # parameter "brackets" of sub-scope call "two_brackets" :
>   definition two_brackets.brackets equals TwoBrackets {
>     -- breakpoint: $100,000
>     -- rate1: 20%
>     -- rate2: 40%
>   }
>```

The sub-scope call `two_brackets` now has data flowing in to
`TwoBracketsTaxComputation`, letting it compute its output `tax_formula`,
which is the function that we will use to compute the income tax in 
the case of Article 5, that is when the individual has no children. As for 
Article 3, we will use an exceptional conditional definition for `income_tax`, 
that makes use of `two_brackets.tax_formula`:

> ```catala
> scope IncomeTaxComputation:
>   # The syntax of calling a function "f" with argument "x" is "f of x".
>   exception definition income_tax under condition 
>     individual.number_of_children = 0
>   consequence equals two_brackets.tax_formula of individual.income
> ```

The snippet of code below exceptionally calls the function
`two_brackets.tax_formula` when the individual has no children; but
`two_brackets.tax_formula` is itself the output of the scope
`TwoBracketsTaxComputation` called as a sub-scope within `IncomeTaxComputation`.
This pattern of scopes returning functions adheres to the spirit of functional
programming, where functions are passed around as values. We encourage you to
use this pattern for encoding complex specifications, as it is quite expressive,
and does not make use of shared mutable state in memory (which does not exist in
Catala anyway).

## Complex exceptions patterns

With our last code snippet, note that we introduced our third conditional
definition for `income_tax`: there is one base case, and two exceptions (one if
there is more than two children, another if there is zero children). So far,
the two exceptions have been simply declared with the `exception` keyword. That 
keyword alone suffices because there is only one base case that the `exception` 
is refering to. However, sometimes the specification implicitly sets up 
more complex exception patterns: 

> #### Article 6
> 
> Individuals earning less than $10,000 are exempted of the income tax mentioned
> at article 1.

At a first glance, this Article 6 merely defines another exceptional conditional
definition for variable `income_tax` of scope `IncomeTaxComputation`. But this
third exception is likely to conflict with the first one when the individual
earns less than $10,000, and has zero children! If such a conflict between
exceptions were to happen, the Catala program would crash with an error message
similar to the one we already saw when programming Article 3:

```text
┌─[ERROR]─
│
│  During evaluation: conflict between multiple valid consequences for assigning the same variable.
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals two_brackets.tax_formula of individual.income
│     │                      ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
├─ Article 5
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals $0
│     │                      ‾‾
└─ Article 6
```

In this situation, we need to prioritize the exceptions. This prioritization
requires legal expertise and research, as it is not always obvious which
exception should prevail in any given situation. Hence, Catala error messages
indicating a conflict during evaluation are an invitation to call the lawyer in
your team and have them interpret the specification, rather than fixing the
conflict yourself.

Here, because Article 6 follows Article 5, and because it is more favorable to
the taxpayer to pay $0 in tax rather than the result of the two-brackets
computation, we can make the legal decision to prioritize the exception of
Article 6 over the exception of Article 5. Now, let us see how to write that
with Catala. Because Article 1 is the base case for the exception of Article 5,
and Article 5 is the base case for the exception of Article 6, we need to give 
the definitions of `income_tax` at Articles 1 and 5 labels so that the 
`exception` keywords in Article 5 and 6 can refer to those labels:

> #### Article 1
>
> The income tax for an individual is defined as a fixed percentage of the
> individual's income over a year.
>
> ```catala
> scope IncomeTaxComputation:
>   label article_1 definition income_tax equals
>     individual.income * fixed_percentage
> ```
> #### Article 5
> 
> For individuals in charge of zero children, the income
> tax of Article 1 is defined as a two-brackets computation with rates 20% and 
> 40%, with an income breakpoint of $100,000. 
>
> ```catala
> scope IncomeTaxComputation:
>   label article_5 exception article_1 
>   definition income_tax under condition 
>     individual.number_of_children = 0
>   consequence equals two_brackets.tax_formula of individual.income
> ```
>
> #### Article 6
> 
> Individuals earning less than $10,000 are exempted of the income tax mentioned
> at article 1.
>
> ```catala
> scope IncomeTaxComputation:
>   exception article_5 definition income_tax under condition
>     individual.income <= $10,000
>   consequence equals $0
> ```

At runtime, here is how Catala will determine which of the three definitions 
to pick for `income_tax`: first, it will try the most exceptional 
exception (Article 6), and test whether the income is below $10,000;
if not, then it will default to the exception level below (Article 5), 
and test whether there are no children; if not, it will default to the 
base case (Article 1). 

This scenario defines an "exception chain", but it can get more complex than 
that. Actually, Catala lets you define "exception trees" as big as you want,
simply by providing `label` and `exception` tags that refer to each other 
for your conditional definitions. This expressive power will help you tame 
the complexity of legal specifications and keep your Catala code readable 
and maintainable.

## Conclusion and next steps