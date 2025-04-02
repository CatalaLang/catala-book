# Catala-specific questions

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been ully written, stay tuned for
future updates!
~~~

## List of questions

<!-- toc -->

## When to choose `condition`, `rule` *vs* booleans?

You may have noticed the keywords `condition` and `rule` in Catala scopes,
for instance:

```catala
declaration scope Foo:
  input i content integer
  output x condition

scope Foo:
  rule x under condition i = 42 consequence fulfilled
```

The above is strictly equivalent to the following program:

```catala
```catala
declaration scope Foo:
  input i content integer
  output x content boolean

scope Foo:
  definition x equals false

  exception definition x under condition i = 42 consequence equals true
```

As the example shows, `condition` is a [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)
for declaring a boolean scope variable whose default value is `false`. In the body
of the scope, you must use `rule` instead of `definition` for defining under which
conditions the `condition` should be `fulfilled` (`true`) or `not fulfilled` (`false`).
It is possible to use `exception` and `label` on rules like for definitions,
but all the `rule`s are implicitly exceptions of a base case where the condition
is `false`.

This behavior for `condition` and `rule` matches the legal intuition, making this
syntax easier to read for pieces of programs with complex code to set a boolean
variable.

## Why do I have to cast values?

Some programming languages, like Javascript, do not make any distinction between
decimals and integers (there is a unique `Number` type). In others, like Python,
the distinction is hidden because the compiler or interpreter inserts implicit
casts whenever you use an integer when a decimal was needed. This approach eases
programming as you do not need to worry how the number is represented in memory,
things just *work*.

However, this approach has a downside, precisely because the language decides
for you how the number is represented in memory. The downside is that you are
not in control of how precise the computations are, and how values are casted
from one representation to another. For instance, when casting a decimal to an
integer, you will lose precision because of rounding or truncating; there are
multiple ways to convert a number of months into a number of days depending on
what you are computing.

The philosophy of Catala is to give you full control over those choices, at
the expense of require explicit casting. Hence, Catala's base types (`boolean`,
`integer`, `decimal`, `money`, `date`, `duration`) strictly distinct and require
explicit casting between them. Using a `decimal` where an `integer` is needed
will yield a type error like the following:

```text
┌─[ERROR]─
│
│  I don't know how to apply operator + on types integer and decimal
│
├─➤ example.catala_en:
│    │
│ 13 │   1 + 2.0
│    │   ‾‾‾‾‾‾‾
│
│ Type integer coming from expression:
├─➤ example.catala_en:
│    │
│ 13 │  1 + 2.0
│    │  ‾
│
│ Type decimal coming from expression:
├─➤ example.catala_en:
│    │
│ 13 │   1 + 2.0
│    │       ‾‾‾
└─
```

This error can be fixed by tweaking `2.0` to `integer of 2.0`. See the
[Literals](./5-catala.md#literals) section of the language reference for more
details about how to create literals with the correct type.

## Why is there a distinct money type?

Correctly performing financial computations is hard. The precision and rounding
rules required may vary from application to application, and should be balanced
with performance requirements.

This is why Catala separates strictly the `money` type from `integer`s or
`decimal`s. Using `money` values in Catala, along with explicit casting (see
above), lets the compiler warn you when you're mixing money and non-money
numbers in your computation. Money, and the currency unit, becomes like a
dimensional unit in a physical formula that needs to check out coherently.

Once that we have these separate `money` value, we have to give them a behavior
that accommodates most uses and respects the philosophy of the language. Hence,
`money` values in Catala are a integer number of cents. Multiplying a `money`
value by a `decimal` can yield a value that is not an exact number of cent;
in that case Catala rounds the result to the nearest cent.

If you want more precision for values representing money amount, you should
represent them as `decimal` and cast them in (with the occasional rounding) and
out of `money` when you need to.


## How to round money up or down to a specific precision?

In Catala, monetary values are represented as an integer number of cents (see
above). A calculation with the catala `money` type always result in an amount
rounded to the nearest cent. This means, that, when performing intermediate
computations on money, rounding must be considered by the programmer at each
step. This aims at making review by domain experts easier, since for each
intermediate value, they can follow along and perform example computations with
a simple desk calculator.

To round to the nearest monetary unit, use `round of`. To round an amount to an
arbitrary multiple of a cent, you can perform a multiplication with that
multiple, round the amount and divide it by the same amount. For instance,
`(round of $4.13 * 10.) / 10. = $4.10`. To round up or down, add or subtract
half a unit before performing the computation and rounding. For instance, to
round down to a cent the result of a multiplication between a `money` value and
a decimal, you have to cast to `decimal`, subtract half a cent, and round back
to the nearest cent by casting again to `money`: `money of ((decimal of $149.26) * 0.5% - 0.005) = $0.74`
and not `0.75$`. This is a bit of a mouthful, but can
be adapted to any desired rounding rule. Encapsulate these computation tidbits
inside a [global function](./5-catala.md#global-constant-and-functions-declarations)
to reuse them across your codebase.


This technique can also be reused for `decimal` values that require rounding up
or down to a specific precision.

## Why mathematical integers and decimals instead of machine integers and floats?

Precision! Machine integers have a maximum and minimum value and wrap on overflow
or underflow. Floating-point values cannot represent arbitrary small intervals
between numbers and lose precision by accumulating errors, computation after
computation. These weaknesses are usually ignored by computer scientists, as
machine integers and floating points are precise enough for most applications,
but financial computations for automatic administrative decision-making should not
fail, even rarely, due to these low-level problems.

Hence, Catala uses the [GMP](https://gmplib.org/) library to feature true
mathematically sound integers and decimal values whose representation in memory
grows as more and more precision is needed from them. This choice adds some
performance overhead but GMP includes state-of-the-art optimizations tailored
for every architecture using assembly tricks to lower or even cancel this
overhead for computations that don't really require the extra precision.

For instance and under the hood, Catala's `decimal` are actually GMP rationals,
irreducible fractions made of two GMP infinite-precision integers.

## How to create dates and durations from integers?

To get a duration, simply multiply the desired duration unit by the integer or decimal:

```catala
1 month * 24 = 24 month

declaration duration_of_days content duration
  depends on number_of_days content integer
  equals
    1 day * number_of_days
```

However, you cannot build a `YYYY-MM−DD` by directly concatenating together the
`integer` values of `YYYY-MM-DD`. Instead, convert the integer values to
durations, and add the durations to a starting date:

```catala
declaration date_of_YMD content date depends on
  year_number content integer,
  month_number content integer,
  day_number content integer
  equals
    |0000-01-01| +
      1 year * year_number +
      1 month * (month_number - 1) +
      1 day * (day_number - 1)
```

Using this helper function helps you avoid building invalid dates; for instance
`date_of_YMD of 2025,4,31 = |2025-01-01|` because there are only 30 days in
April.

## Why are there no strings?

The absence of strings in Catala is *a feature, not a bug*. Catala is meant to
be a domain-specific programming language for computations described in legal
texts, that lawyers understand. If you find a legal text that requires actual
string manipulation operations to be automated, please tell the Catala team!
In absence of such a legal text, the decision was made to not include strings,
for several reasons.

First, the common operations present in legal texts that can be done with
strings, can also be done better with other Catala features. For instance,
it is better to represent tags and codes with `enumeration`s that can contain
payload and have a built-in exhaustiveness check in pattern matching. We thus
advise to really think your problem through and see whether it really requires
strings as a first-class value type in Catala to be solved.

Second, the preferred way of performing low-level, computation-intensive
operations not described by legal text but used in a Catala program is to simply
to them outside of Catala and provide their output as inputs of a Catala scope,
or define an [external module](./5-catala.md#external-modules).

Third, including string manipulations in the Catala runtime will heavily
increase the size and complexity of the runtime, as it will probably require a
fully-fledged regexp library as a dependency. Moreover, this regexp library dependency
should be available in every backend programming language that Catala supports,
to ensure that the semantics of string operations is absolutely the same whatever
the backend. This is a lot of work and later, maintenance, for the Catala team.

## How do I add an exception from *outside* a scope?

Sometimes, the law is quite convoluted. For instance, [article 1731
bis](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044981364) of
the French tax code describes how to compute fines for tax fraud or late income
declaration. This article specifies that, when computing the fine amount, the
main tax computation should be tweaked to neutralize certain deductions. If you
were to implement this in Catala, you would have two scopes `FinesComputation`
and `IncomeTaxComputation`; article 1731 bis requires you to call
`IncomeTaxComputation` from `FinesComputation` while tweaking certain
computation rules inside `IncomeTaxComputation`.

This pattern amounts to declaring an exception to a variable of
`IncomeTaxComputation`, from the outside of `IncomeTaxComputation`. Turns out
there is a specific Catala feature to handle this case, extending the
`exception`s in a principled way across scopes : [context
variables](./5-catala.md#context-variables).

## Do I have to repeat every field in a struct when I want to only change one of them?

No! See [updating structs](./5-catala.md#updating-structures).

## Which programming language can Catala target?
