# Going modular

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
