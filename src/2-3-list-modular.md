# Going modular with lists

In this section, the tutorial tackles a common pattern that significantly
increases the complexity of a codebase: the need to deal with lists and rules
applying to each element of the list. Here, Catala reuses all the common tricks
and patterns from functional programming to elegantly structure the code while
performing expressive operations on lists.

~~~~~~admonish info collapsible=true title="Recap of the previous section"
This section of the tutorial builds up on the [previous one](./2-2-conditionals-exceptions.md),
and will reuse the same running example, but all the Catala code necessary
to execute the example is included below for reference.

~~~
{{#include ../examples/tutorial_end_2_2.catala_en}}
~~~
~~~~~~

## Making a household from a list of invidivuals

Previously, the Catala Tutorial Tax Code (CTTC) has defined an income tax for
each individual and their children. But now, the CTTC is becoming greedier as a
new, separate tax similar to Thatcher's infamous [poll
tax](https://en.wikipedia.org/wiki/Poll_tax_(Great_Britain)). At its inception,
the household tax is such that each individual in a household is taxed a fixed
sum, with a reduced rate for the children:

~~~admonish quote title="Article 7"
When several individuals live together, they are collectively subject to
the household tax. The household tax owed is $1000 per individual of the household,
and half the amount per children.
~~~

Now, implementing this in Catala requires going beyond the
`IncomeTaxComputation` scope that we used earlier. Indeed, this new tax requires
a new scope, `HouseholdTaxComputation`! While it is fairly evident that the
`output` of this new scope should be the `household_tax`, its `input` is the
collection of individuals that make up the household.

Fortunately, Catala has a built-in type for collection of things, called `list`,
even though it behaves more like an array in traditionnal Computer Science
jargon.

~~~admonish note title="Declaring a new scope with a list input"
```catala
declaration scope HouseholdTaxComputation:
  # The syntax "list of <X>" designates the type whose values are lists of
  # elements with type <X>.
  input individuals content list of Individual
  output household_tax content money
```
~~~

To define `household_tax`, we must now:
1. count the number of individuals in `individuals`;
2. count the number of children in each individual and add these counts together;
3. multiply these counts by the right amount of tax.

We will perform each one of these steps in the body of the `definition` of
`household_tax`, in the scope `HouseholdTaxComputation`, using local
variables.

~~~admonish tip title="`internal` scope variables and local variables in definitions"
When a variable definition gets complex like above, it is often useful to
separate each step by defining intermediate variables. There are two ways
of doing that.

First, you can declare inside the scope declaration an extra scope variable
with the label `internal` instead of `input` or `output`, as seen in
the [first section of the tutorial](./2-1-basic-blocks.md).

Second, if you are confident that you will only need the intermediate variable
in the narrow context of a single scope variable definition, you can use a
local variable inside the definition of the scope variable. These local variables
are introduced and used with the following syntax:

```catala
# The following line defines local variable "x" as begin equal to 4 * 5
let x equals 4 * 5 in
# We can then use "x" after the "in" keyword in the rest of the code
x + 2
```
~~~

For the first step,
