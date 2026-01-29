# Variable states and dynamic scope calls

<div id="tocw"></div>

## Introduction

In this section, the tutorial picks up where the previous section left,
that is to say implementing the computation of the household tax for
one individual. Now, we still have to aggregate the computations
for individuals at the household level to generate the whole household tax.

Doing this aggregation will require calling the scope `HouseholdTaxInvidualComputation`
multiple times for a list aggregation inside `HouseholdTaxComputation`. We
will cover this topic, but first we have to wrap up unfinished business
from the last section of the tutorial!

~~~~~~admonish info collapsible=true title="Recap of the previous section"
This section of the tutorial builds up on the [previous one](./2-3-list-scopes.md),
and will reuse the same running example, but all the Catala code necessary
to execute the example is included below for reference.

~~~catala-en
{{#include ../../examples/tutorial_end_2_3.catala_en}}
~~~
~~~~~~

## Variable states

Recall that we have defined `household_tax` in a single sweep
inside `HouseholdTaxIndividualComputation`:

```catala-code-en
scope HouseholdTaxIndividualComputation:
  definition household_tax equals
    let tax equals
      $10,000 * (1.0 + individual.number_of_children / 2)
    in
    let deduction equals income_tax_computation.income_tax in
    # Don't forget to cap the deduction!
    if deduction > tax then $0 else tax - deduction
```

However, doing so merges together the specifications of article 7 and article 8,
which goes against the spirit of Catala to split the code in the same structure
as the legal text. So, instead of using two local variables inside the definition
of `household_tax`, we want to split the formula into two distinct `definition`.
Intuitively, this implies creating two scope variables in
`HouseholdTaxIndividualComputation`, `household_tax_base` (for article 7) and
`household_tax_with_deduction` (article 8). But really, this amounts to giving
two consecutive states for the variable `household_tax`, and lawyers understand
the code better this way! So Catala has a feature to let you do exactly that:

~~~admonish note title="Defining multiple states for the same variable"
```catala-code-en
declaration scope HouseholdTaxIndividualComputation:
  input individual content Individual
  input overseas_territories content boolean
  input current_date content date

  income_tax_computation scope IncomeTaxComputation

  output household_tax content money
    # The different states for variable "household_tax" are declared here,
    # in the exact order in which you expect them to be computed!
    state base
    state with_deduction
```

With our two states `base` and `with_deduction`, we can code up articles 7 and
8:

#### Article 7

When several individuals live together, they are collectively subject to
the household tax. The household tax owed is $10,000 per individual of the household,
and half the amount per children.

```catala-code-en
scope HouseholdTaxIndividualComputation:
  definition household_tax state base equals
    $10,000 * (1.0 + individual.number_of_children / 2)
```

#### Article 8

The amount of income tax paid by each individual can be deducted from the
share of household tax owed by this individual.

```catala-code-en
scope HouseholdTaxIndividualComputation:
  definition household_tax state with_deduction equals
    # Below, "household_tax" refers to the value of "household_tax" computed
    # in the previous state, so here the state "base" which immediately precedes
    # the state "with_deduction" in the declaration.
    if income_tax_computation.income_tax > household_tax then $0
    else
      household_tax - income_tax_computation.income_tax
    # It is also possible to refer to variable states explicitely with the
    # syntax "household_tax state base".
```

Elsewhere in `HouseholdTaxIndividualComputation`, using `household_tax` will
implicitly refer to the last state of the variable (so here `with_deduction`),
matching the usual implicit convention in legal texts.
~~~

This completes our implementation of `HouseholdTaxIndividualComputation`! Its
output variable `household_tax` now contains the share of household tax owed by
each individual of the household, with the correct income tax deduction.
We can now use it in the computation of the global household tax in
`HouseholdTaxComputation`.

## Linking scopes together through list mapping

We can now finish coding up article 7 by adding together each share of the
household tax owned by all the individuals of the household. We will do
that through list aggregation, as previously, but the elements of the list to
aggregate are now the result of calling `HouseholdTaxIndividualComputation`
on each individual. Previously, we have showed how to call a sub-scope
statically and exactly one time. But here, this is not what we want: we want
to call the sub-scope as many times as there are individuals in the household.
We then have to use a different method for calling the sub-scope:

~~~admonish note title="Calling a sub-scope dynamically"
With all our refactorings, the declaration of the scope `HouseholdTaxComputation`
can be simplified (we don't need the function variable `share_household_tax`
anymore):

```catala-code-en
declaration scope HouseholdTaxComputation:
  input individuals content list of Individual
  output household_tax content money
```

Then, the definition of `household_tax` could be re-written as follows next
to article 7:

```catala-code-en
scope HouseholdTaxComputation:
  definition household_tax equals
    sum money of
      map each individual among individuals to (
        # Below is the syntax for calling the sub-scope
        # "HouseholdTaxIndividualComputation" dynamically, on the spot.
        # after "with" is the list of inputs of the scope.
        output of HouseholdTaxIndividualComputation with {
          # The next three lines are tautological in this example, because
          # the names of the parameters and the names of the scope variables
          # are identical, but the values of the scope call parameters can be
          # arbitrarily complex!
          -- individual: individual # <- this last "invididual" is the map variable
          -- overseas_territories: overseas_territories
          -- current_date: current_date
        }
        # The construction "output of <X> with { ... }" returns a structure
        # containing all the output variables of scope <X>. Hence, we access
        # output variable "household_tax" of scope
        # "HouseholdTaxIndividualComputation" with the field access syntax
        # ".household_tax".
        ).household_tax
```
~~~

That's it! We've finished implementing article 7 and article 8 in a clean,
extensible, future-proof fashion using a series of scopes that call
each other.

## Testing and debugging the computation

We have written quite complex code in this tutorial section, it is high
time to test and debug it. Similarly to the test presented in the
[first tutorial section](./2-1-basic-blocks.md), we can declare a new
test scope for the household tax computation, and execute it:

~~~admonish success title="New test for `HouseholdTaxComputation`"
```catala-code-en
declaration scope TestHousehold:
  output computation content HouseholdTaxComputation

scope TestHousehold:
  definition computation equals
    output of HouseholdTaxComputation with {
      -- individuals:
        [ Individual {
            -- income: $15,000
            -- number_of_children: 0
          } ;
          Individual {
            -- income: $80,000
            -- number_of_children: 2
          } ]
      -- overseas_territories: false
      -- current_date: |1999-01-01|
    }
```

```console
$ clerk run tutorial.catala_en --scope=TestHousehold
┌─[RESULT]─
│ computation = HouseholdTaxComputation { -- household_tax: $15,000.00 }
└─
```
~~~

Is the result of the test correct ? Let's see by unrolling the computation
manually:
* The household tax for two individuals and two children is `2 * $10,000 + 2 *
  $5,000`, so $30,000;
* The first individual earns more than $10,000, less than $100,000, has no
  children and we are before the year 2000, so the income tax rate is 20 %
  per article 2 and their income tax is $3,000;
* The share of household tax for the first individual is $10,000, so the deduction
  for the first individual is the full $3,000;
* The second individual earns more than $10,000, less than $100,000$, but has
  two children so the income tax rate is 15 % per article 3 and their
  income tax is $12,000;
* The share of household tax for the second individual is $20,000, so the
  deduction for the second individual is the full $12,000$;
* The total deduction is thus $15,000; applying the deduction to the base
  household tax yields $15,000.

So far so good, the test result is correct. But it might have gotten to the
right result by taking the wrong intermediate steps, so we'll want to
inspect them. Fortunately, the Catala interpreter can print the full
computation trace for that purpose. Here is the output on the interpretation
of `TestHousehold`:

~~~admonish abstract title="Trace of `TestHousehold`" collapsible=true
```console
$ clerk run tutorial.catala_en --scope=TestHousehold -c--trace
[LOG] ☛ Definition applied:
      ─➤ tutorial.catala_en
          │
          │   definition computation equals
          │              ‾‾‾‾‾‾‾‾‾‾‾
      Test
[LOG] →  HouseholdTaxComputation.direct
[LOG]   ≔  HouseholdTaxComputation.direct.
      input: HouseholdTaxComputation_in { -- current_date_in: 1999-01-01 -- overseas_territories_in: false -- individuals_in: [Individual { -- income: $15,000.00 -- number_of_children: 0 }; Individual { -- income: $80,000.00 -- number_of_children: 2 }] }
[LOG]   ☛ Definition applied:
        ─➤ tutorial.catala_en
            │
            │   definition household_tax equals
            │              ‾‾‾‾‾‾‾‾‾‾‾‾‾
        Article 7
[LOG]   →  HouseholdTaxIndividualComputation.direct
[LOG]     ≔  HouseholdTaxIndividualComputation.direct.
      input: HouseholdTaxIndividualComputation_in { -- individual_in: Individual { -- income: $15,000.00 -- number_of_children: 0 } -- overseas_territories_in: false -- current_date_in: 1999-01-01 }
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │   definition household_tax equals
              │              ‾‾‾‾‾‾‾‾‾‾‾‾‾
          Article 7
[LOG]     ≔  HouseholdTaxIndividualComputation.household_tax#base: $10,000.00
[LOG]     →  IncomeTaxComputation.direct
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.current_date equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.individual equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.overseas_territories equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ≔  IncomeTaxComputation.direct.
      input: IncomeTaxComputation_in { -- current_date_in: 1999-01-01 -- individual_in: Individual { -- income: $15,000.00 -- number_of_children: 0 } -- overseas_territories_in: false }
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
               │
               │     current_date < |2000-01-01|
               │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 2 (old version before 2000)
[LOG]       ≔  IncomeTaxComputation.tax_rate: 0.2
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
               │
               │   definition income_tax equals
               │              ‾‾‾‾‾‾‾‾‾‾
            Article 1
[LOG]       ≔  IncomeTaxComputation.income_tax: $3,000.00
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   income_tax_computation scope IncomeTaxComputation
                │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 7
[LOG]       ≔  IncomeTaxComputation.direct.output: IncomeTaxComputation { -- income_tax: $3,000.00 }
[LOG]     ←  IncomeTaxComputation.direct
[LOG]     ≔  HouseholdTaxIndividualComputation.income_tax_computation: IncomeTaxComputation { -- income_tax: $3,000.00 }
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │   definition household_tax equals
              │              ‾‾‾‾‾‾‾‾‾‾‾‾‾
          Article 8
[LOG]     ≔  HouseholdTaxIndividualComputation.household_tax#with_deduction: $7,000.00
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │         (
              │         ‾
              │           output of HouseholdTaxIndividualComputation with {
              │           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- individual: individual
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- overseas_territories: overseas_territories
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- current_date: current_date
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │           }
              │           ‾
              │         ).household_tax
              │         ‾
          Article 7
[LOG]     ≔  HouseholdTaxIndividualComputation.direct.output: HouseholdTaxIndividualComputation { -- household_tax: $7,000.00 }
[LOG]   ←  HouseholdTaxIndividualComputation.direct
[LOG]   →  HouseholdTaxIndividualComputation.direct
[LOG]     ≔  HouseholdTaxIndividualComputation.direct.
      input: HouseholdTaxIndividualComputation_in { -- individual_in: Individual { -- income: $80,000.00 -- number_of_children: 2 } -- overseas_territories_in: false -- current_date_in: 1999-01-01 }
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │   definition household_tax
              │              ‾‾‾‾‾‾‾‾‾‾‾‾‾
          Article 7
[LOG]     ≔  HouseholdTaxIndividualComputation.household_tax#base: $20,000.00
[LOG]     →  IncomeTaxComputation.direct
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.current_date equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.individual equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   definition income_tax_computation.overseas_territories equals
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ≔  IncomeTaxComputation.direct.
      input: IncomeTaxComputation_in { -- current_date_in: 1999-01-01 -- individual_in: Individual { -- income: $80,000.00 -- number_of_children: 2 } -- overseas_territories_in: false }
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
               │
               │     individual.number_of_children >= 2
               │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 3
[LOG]       ≔  IncomeTaxComputation.tax_rate: 0.15
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
               │
               │   definition income_tax equals
               │              ‾‾‾‾‾‾‾‾‾‾
            Article 1
[LOG]       ≔  IncomeTaxComputation.income_tax: $12,000.00
[LOG]       ☛ Definition applied:
            ─➤ tutorial.catala_en
                │
                │   income_tax_computation scope IncomeTaxComputation
                │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 7
[LOG]       ≔  IncomeTaxComputation.direct.output: IncomeTaxComputation { -- income_tax: $12,000.00 }
[LOG]     ←  IncomeTaxComputation.direct
[LOG]     ≔  HouseholdTaxIndividualComputation.income_tax_computation: IncomeTaxComputation { -- income_tax: $12,000.00 }
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │   definition household_tax
              │              ‾‾‾‾‾‾‾‾‾‾‾‾‾
          Article 8
[LOG]     ≔  HouseholdTaxIndividualComputation.household_tax#with_deduction: $8,000.00
[LOG]     ☛ Definition applied:
          ─➤ tutorial.catala_en
              │
              │         (
              │         ‾
              │           output of HouseholdTaxIndividualComputation with {
              │           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- individual: individual
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- overseas_territories: overseas_territories
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │             -- current_date: current_date
              │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │           }
              │           ‾
              │         ).household_tax
              │         ‾
          Article 7
[LOG]     ≔  HouseholdTaxIndividualComputation.direct.output: HouseholdTaxIndividualComputation { -- household_tax: $8,000.00 }
[LOG]   ←  HouseholdTaxIndividualComputation.direct
[LOG]   ≔  HouseholdTaxComputation.household_tax: $15,000.00
[LOG]   ☛ Definition applied:
        ─➤ tutorial.catala_en
            │
            │     output of HouseholdTaxComputation with {
            │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │       -- individuals:
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │         [
            │         ‾
            │           Individual {
            │           ‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- income: $15,000
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- number_of_children: 0
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │           };
            │           ‾‾
            │           Individual {
            │           ‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- income: $80,000
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- number_of_children: 2
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │           }
            │           ‾
            │         ]
            │         ‾
            │       -- current_date: |1999-01-01|
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │       -- overseas_territories: false
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │     }
            │     ‾
        Test
[LOG]   ≔  HouseholdTaxComputation.direct.output: HouseholdTaxComputation { -- household_tax: $15,000.00 }
[LOG] ←  HouseholdTaxComputation.direct
[LOG] ≔  TestHousehold.computation: HouseholdTaxComputation { -- household_tax: $15,000.00 }
```
~~~

Inspecting the trace reveals the structure of the computation that matches
closely the legal reasonning we did just above to compute the test output
manually. With this powerful tool, it is possible to debug and maintain
Catala programs at scale.

## Conclusion

Congratulations for finishing the Catala tutorial! The last two sections have not
presented features that are unique to Catala, unlike the exceptions from [the
second section](./2-2-conditionals-exceptions.md). Rather, in Catala we use
the classic software engineering techniques from functional programming to split
the code into multiple functions that call each other at the right level of
abstraction, with the goal of keeping the code close where it is specified in the
law. There are various ways to express something in Catala, but the proximity
between the code and the legal specification should be the proxy for what is the
idiomatic way to do things.

Refactoring Catala code continuously as new legal requirements are added or
updated is the key to maintaining the codebase efficiently over the long term,
and avoiding the spaghetti code that is common when translating law to code. We
hope this tutorial put you on the right track for your journey into Catala
and the wonderful world of safely and faithfully automating legal provisions.

We encourage you to read the next chapters of this book to continue learning how
to use Catala, as the tutorial is not set in [a real-world software development
projet setup](./3-project.md), and misses a [lot of tips](./4-0-howto.md) about
coding in Catala but also interacting with lawyers.

~~~~~~admonish info collapsible=true title="Recap of the current section"
For reference, here is the final version of the Catala code consolidated at
the end of this section of the tutorial.

~~~catala-en
{{#include ../../examples/tutorial_end_2_4.catala_en}}
~~~
~~~~~~
