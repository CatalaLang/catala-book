# Basic blocks of a Catala program

In this section, the tutorial introduces the basic blocks of a Catala program :
the difference between law and code, data structures, scopes, variables and
formulas. By the end of the section, you should be able to write a simple Catala
program equivalent to a single function with local variables whose definitions
can refer to one another.

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
by a line with `` ```catala `` and ended by a line with `` ``` ``.

Before writing any Catala code, we must introduce the specification of the
code for this tutorial. This specification will be based on a fictional Tax Code
defining a simple income tax. But in general, anything can be used as a
specification for a Catala program: laws, executive orders, court cases
motivations, legal doctrine, internal instructions, technical specifications,
etc. These sources can be mixed to form a complete Catala program that
relies on these multiple sources. Concretely, incorporating a legal source
of specification into the Catala program amounts to copy-pasting the
text and formatting it in Markdown syntax inside the source code file.

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

Catala is a
[strongly-typed](https://blog.merigoux.ovh/en/2017/07/19/static-or-dynamic.html),
statically compiled language, so all data structures and function signatures
have to be explicitly declared. So, we begin by declaring the type information
for the individual, the taxpayer that will be the subject of the tax
computation. This individual has an income and a number of children, both pieces
of information which will be needed for tax purposes :

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
the powerful notion of [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type).

Notice that these data structures that we have declared cannot always be
attached naturally to a particular piece of the specification text. So, where to
put these declarations in your literate programming file? Since you will be
often going back to these data structure declarations during programming, we
advise you to group them together in some sort of prelude in your code source
file. Concretely, this prelude section containing the data structure declaration
will be your one stop shop when trying to understand the data manipulated by the
rules elsewhere in the source code file.

## Scopes as basic computation blocks

We've defined and typed the data that the program will manipulate. Now, we have
to define the logical context in which this data will evolve. Because Catala is
a [functional programming](https://en.wikipedia.org/wiki/Functional_programming)
language, all code exists within a function. And the equivalent to a function in
Catala is called a *scope*. A scope is comprised of :
* a name,
* input variables (similar to function arguments),
* internal variables (similar to local variables),
* output variables (that together form the return type of the function).

For instance, Article 1 declares a scope for computing the income tax:

```catala
declaration scope IncomeTaxComputation:
  # Scope names use the CamelCase naming convention, like names of structs
  # or enums Scope variables, on the other hand, use the snake_case naming
  # convention, like struct fields.
  input individual content Individual
  # This line declares an input variable of the scope, which is akin to
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
of all the arguments along with their types. But in Catala, scope variables can
be `input`, `internal` or `output`. `input` means that the variable has to be
provided whenever the scope is called, and cannot be defined within the scope.
`internal` means that the variable is defined within the scope and cannot be
seen from outside the scope; it's not part of the return value of the scope.
`output` means that a caller can retrieve the computed value of the variable.
Note that a variable can also be simultaneously an input and an output of the
scope, in that case it should be annotated with `input output`.

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

Similarly to struct field access, Catala lets you inspect the contents of
a enumeration value with pattern matching, as it is usual in functional programming
language. Concretely, if `tax_credit` is a variable whose type is `TaxCredit` as
declared above, then you can define the amount of a tax credit that depends
on a number of eligible children with the following pattern matching:

```catala
match tax_credit with pattern
-- NoTaxCredit: $0
-- ChildrenTaxCredit of number_of_eligible_children:
  $10,000 * number_of_eligible_children
```

In the branch `-- ChildrenTaxCredit of number_of_eligible_children:`, you know
that `tax_credit` is in the variant `ChildrenTaxCredit`, and
`number_of_eligible_children` lets you bind the `integer` payload of the
variant. Like in a regular functional programming language, you can give any
name you want to `number_of_eligible_children`, which is useful if you're
nesting pattern matching and want to differentiate the contents of two different
variant payloads.

Now, back to our scope `IncomeTaxComputation`. at this point we're still missing
the definition of `fixed_percentage`. This is a common pattern when coding the
law: the definitions for various variables are scattered in different articles.
Fortunately, the Catala compiler automatically collects all the definitions for
each scope and puts them in the right order. Here, even if we define
`fixed_percentage` after `income_tax` in our source code, the Catala compiler
will switch the order of the definitions internally because `fixed_percentage`
is used in the definition of `income_tax`. More generally, the order of toplevel
definitions and declarations in Catala source code files does not matter, and
you can refactor code around freely without having to care about dependency
order.

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

## Common values and computations in Catala

So far, we have seen values that have types like `decimal`, `money`, `integer`.
One could object that there is no point in distinguishing these three concepts,
as they are merely numbers. However, the philosophy of Catala is to make every
choice that affects the result of the computation explicit, and the
representation of numbers does affect the result of the computation. Indeed,
financial computations vary according to whether we consider money amount as an
exact number of cents, or whether we store additional fractional digits after
the cent. Since the kind of programs [Catala is designed for](./0-intro.md)
implies heavy consequences for a lot of users, the language is quite strict
about how numbers are represented. The rule of thumb is that, in Catala,
numbers behave exactly according to the common mathematical semantics one
can associate to basic arithmetic computations (`+`, `-`, `*`, `/`).

In particular, that means that `integer` values are unbounded and can never
[overflow](https://en.wikipedia.org/wiki/Integer_overflow). Similarly, `decimal`
values can be arbitrarily precise (although they are always rational, belonging
to ℚ) and do not suffer from floating-point imprecisions. For `money`, the
language makes an opinionated decision: a value of type `money` is always
an integer number of cents.

These choices has several consequences:
* `integer` divided by `integer` gives a `decimal` ;
* `money` cannot be multiplied by `money` (instead, multiply `money` by `decimal`) ;
* `money` multiplied (or divided) by `decimal` rounds the result to the nearest cent ;
* `money` divided by `money` gives a `decimal` (that is not rounded whatsoever).

Concretely, this gives:

```catala
10 / 3 = 3.333333333...
$10 / 3.0 = $3.33
$20 / 3.0 = $6.67
$10 / $3 = 3.33333333...
```

The Catala compiler will guide you into using the correct operations explicitly,
by reporting compiler errors when that is not the case. For instance, when
trying to add an `integer` and a `decimal`:

```text
┌─[ERROR]─
│
│  I don't know how to apply operator + on types integer and decimal
│
├─➤ tutorial_en.catala_en
│    │
│    │   definition x equals 1 + 2.0
│    │                       ‾‾‾‾‾‾‾
│
│ Type integer coming from expression:
├─➤ tutorial_en.catala_en
│    │
│    │   definition x equals 1 + 2.0
│    │                       ‾
│
│ Type decimal coming from expression:
├─➤ tutorial_en.catala_en
│    │
│    │   definition x equals 1 + 2.0
│    │                           ‾‾‾
└─
```

To fix this error, you need to use explicit casting, for instance by replacing
`1` by `decimal of 1`. Refer to the [language reference](./5-catala.md) for all
possible casting, operations and their associated semantics.

## Checkpoint

This concludes the first section of the tutorial. By setting up data structures
like `structure` and `enumeration`, representing the types of `scope`
variables, and `definition` of formulas for these variables, you should now be able to
code in Catala the equivalent of single-function programs that perform common
arithmetic operations and define local variables.
