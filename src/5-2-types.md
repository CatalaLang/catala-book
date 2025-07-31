# Types, values and operations


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>

~~~admonish info title="Catala is a strongly-typed language"
Each value manipulated by the Catala programs have
a well-defined type that is either built-in or declared by the user. This
section of the language reference summarizes all the different kind of types,
how to declare them and how to build values of this type.
~~~

## Base types

The following types and values are built-in Catala, relying on keywords of the
language.

### Booleans

The type `boolean` has only two values, `true` and `false`.

#### Boolean operations

| Symbol | Type of first argument | Type of second argument | Type of result | Semantic            |
|--------|------------------------|-------------------------|----------------|---------------------|
| `and`  | boolean                | boolean                 | boolean        | Logical and (eager) |
| `or`   | boolean                | boolean                 | boolean        | Logical or (eager)  |
| `xor`  | boolean                | boolean                 | boolean        | Logical xor (eager) |
| `not`  | boolean                |                         | boolean        | Logical negation    |

#### Comparisons

| Symbol          | Type of first argument                  | Type of second argument | Type of result | Semantic                                          |
|-----------------|-----------------------------------------|-------------------------|----------------|---------------------------------------------------|
| `=, !=`         | anything but functions                  | same as first argument  | boolean        | Structural (in)equality                           |
| `>, >=, <, <=`  | integer, decimal, money, date           | same as first argument  | boolean        | Usual comparison                                  |
| `>, >=, <, <=`  | duration                                | duration                | boolean        | Usual comparison if same unit, else runtime error |

### Integer operations

The type `integer` represents mathematical integers, like `564,614` or `-2`.
Note that you can optionally use the number separator `,` to make large integers
more readable.

| Symbol | Type of first argument | Type of second argument | Type of result | Semantic               |
|--------|------------------------|-------------------------|----------------|------------------------|
| `+`    | integer                | integer                 | integer        | Integer addition       |
| `-`    | integer                | integer                 | integer        | Integer substraction   |
| `-`    | integer                |                         | integer        | Integer negation       |
| `*`    | integer                | integer                 | integer        | Integer multiplication |
| `/`    | integer                | integer                 | decimal        | Rational division      |

### Decimals

The type `decimal` represents mathematical decimal numbers (or *rationals*),
like `0.21` or `-988,453.6842541`. Note that you can optionally use the number
separator `,` to make large decimals more readable. Decimal numbers are stored
with infinite precision in Catala, but you can
[round](./5-5-expressions.md#rounding) them at will.

~~~admonish tip title="Percentages"
A percentage is just a decimal value, so in Catala you will have `30% = 0.30`
and you can use the `%` notation if this makes your code easier to read.
~~~

#### Decimal operations

| Symbol     | Type of first argument | Type of second argument | Type of result | Semantic                |
|------------|------------------------|-------------------------|----------------|-------------------------|
| `+`        | decimal                | decimal                 | decimal        | Rational addition       |
| `-`        | decimal                | decimal                 | decimal        | Rational substraction   |
| `-`        | decimal                |                         | decimal        | Rational negation       |
| `*`        | decimal                | decimal                 | decimal        | Rational multiplication |
| `/`        | decimal                | decimal                 | decimal        | Rational division       |
| `round of` | decimal                |                         | decimal        | Round to nearest unit   |

### Money

The type `money` represents an amount of money, positive or negative, in a
currency unit (in the English version of Catala, the `$` currency
symbol is used), with a precision down to the cent and not below. Money values are
noted like decimal values with maximum two fractional digits and the currency
symbol, like `$12.36` or `-$871,84.1`.


#### Money operations

| Symbol     | Type of first argument | Type of second argument | Type of result | Semantic                |
|------------|------------------------|-------------------------|----------------|-------------------------|
| `+`        | money                  | money                   | money          | Money addition          |
| `-`        | money                  | money                   | money          | Money substraction      |
| `-`        | money                  |                         | money          | Money negation          |
| `/`        | money                  | money                   | decimal        | Rational division       |
| `round of` | money                  |                         | money          | Round to nearest unit   |


### Dates

The type `date` represents dates in the [gregorian
calendar](https://en.wikipedia.org/wiki/Gregorian_calendar). This type
cannot represent invalid dates like `2025-02-31`. Values of this type are
noted following the [ISO8601](https://fr.wikipedia.org/wiki/ISO_8601) notation (`YYYY-MM-DD`)
enclosed by vertical bars, like `|1930-09-11|` or `|2012-02-03|`.

#### Semantic of date addition

~~~admonish info title="Date addition is ambiguous and poorly defined in other languages"
During the design of Catala, the Catala team noticed that the question
"*What is Jan 31st + 1 month?*" had no consensual answer in Computer Science.

* In Java, it will be Feb 28/29th depending on the leap year.
* In Python, it is impossible to add months with the standard library.
* In `coreutils`, it gives March 3rd (!).

Given how important date computations are in legal implementations, the Catala
team decided to sort this mess out and described our results in a research paper:

[Monat, R., Fromherz, A., Merigoux, D. (2024). Formalizing Date Arithmetic and Statically Detecting Ambiguities for the Law. In: Weirich, S. (eds) Programming Languages and Systems. ESOP 2024. Lecture Notes in Computer Science, vol 14577. Springer, Cham. https://doi.org/10.1007/978-3-031-57267-8_16](https://rmonat.fr/data/pubs/2024/2024-04-08_esop_dates.pdf)
~~~

Date addition in Catala is adding a duration to a date, yielding a new date in the past or in the future
depending whether the duration is negative or positive. The value of this new date depends on the
content of the duration:
* if the duration is a number of days, then Catala will simply add or subtract this amount of days to the day in the original date,
  wrapping to previous or next months if need be;
* if the duration is a number of years (say, `x`), then Catala will behave as if the duration was `12 * x months`;
* if the duration is a number of months, Catala will simply add or subtract this amount of months to the month in the original date,
  wrapping to previous or next year if need be; but this operation might yield an invalid date (like Jan 31st + 1 month -> Feb 31st),
  which needs to be rounded.

There are three rounding modes in Catala, whose description is below:


| Rounding mode     | Semantic                      | Example                                                     |
|-------------------|-------------------------------|-------------------------------------------------------------|
| No rounding       | Runtime error if invalid date | `Jan 31st + 1 month = AmbiguousDateComputation`             |
| Rounding up       | First day of next month       | `Jan 31st + 1 month = March 1st`                            |
| Rounding down     | Last day of previous month    | `Jan 31st + 1 month = Feb 28/29th` (depending on leap year) |

By default, Catala is in the "No rounding" mode. To set the rounding mode to either up or down, for all the date operations
inside a whole scope, see the [relevant reference section](./5-4-definitions-exceptions.md#date-rounding-mode).

Lastly, if the duration to add is comprised of multiple units (like `2 month + 21 day`), then Catala will start by adding
the component with the largest unit (here, `month`), then the component with the smallest unit (here, `day`).

#### Date operations

| Symbol                   | Type of first argument | Type of second argument | Type of result | Semantic                      |
|--------------------------|------------------------|-------------------------|----------------|-------------------------------|
| `+`                      | date                   | duration                | date           | Date addition (see above)     |
| `-`                      | date                   | date                    | duration       | Number of days between dates  |
| `get_day of`             | date                   |                         | integer        | Day in month (1..31)          |
| `get_month of`           | date                   |                         | integer        | Month in year (1..12)         |
| `get_year of`            | date                   |                         | integer        | Year number                   |
| `first_day_of_month of`  | date                   |                         | date           | First day in the month        |
| `last_day_of_month of`   | date                   |                         | date           | Last day in the month         |

### Durations

The type `duration` represents durations in terms of days, months and/or years,
like `254 day`, `4 month` or `1 year`. Durations can be negative and combine
a number of days and months together, like `1 month + 15 day`.

~~~admonish danger title="Durations in days and in months are incomparable"
Is it always true that in terms of durations, `1 year = 12 month`. However,
because months have a variable number of days, comparing durations in days
to durations in months is ambiguous and requires legal interpretations.

For this reason, Catala will raise a runtime error when trying to perform such a comparison.
Moreover, the difference between two dates will always yield a duration expressed
in days.
~~~

#### Duration operations

| Symbol                   | Type of first argument | Type of second argument | Type of result | Semantic                                  |
|--------------------------|------------------------|-------------------------|----------------|-------------------------------------------|
| `+`                      | duration               | duration                | date           | Add the number of days, months, years     |
| `-`                      | duration               | duration                | date           | Add the opposed duration                  |
| `-`                      | duration               |                         | duration       | Negate the duration components            |
| `*`                      | duration               | integer                 | duration       | Multiply the number of days, month, years |


## Casting base number types

Casting between base types is explicit; the syntax is `<name of desired type> of <argument>`.

| Type of argument | Type of result | Semantic                   |
|------------------|----------------|----------------------------|
| decimal          | integer        | Truncation                 |
| integer          | decimal        | Value conserved            |
| decimal          | money          | Round to nearest cent      |
| money            | decimal        | Value conserved            |
| money            | integer        | Truncation to nearest unit |
| integer          | money          | Value conserved            |
| decimal          | integer        | Truncation                 |

## User-declared types

User-declared types have to be declared before being used in the rest of the
program. However, the declaration needs not be placed before the use in textual
order.

### Structures

Structures combine multiple pieces of data together into a single type. Each
piece of data is a "field" of the structure. If you have a structure, you can
access each of its fields, but you need all the fields to build the structure
value.

Structure types are declared by the user, and each structure type has a name
chosen by the user. Structure names begin by a capital letter and should follow
the `CamlCase` naming convention. An example of structure declaration is:

```catala
declaration structure Individual:
  data birth_date content date
  data income content money
  data number_of_children content integer
```

The type of each field of the structure is mandatory and introduced by `content`.
It is possible to nest structures (declaring the type of a field of a structure
as another structure or enumeration), but not recursively.

Structure values are built with the following syntax:

```catala
Individual {
    -- birth_date: |1930-09-11|
    -- income: $100,000
    -- number_of_children: 2
}
```

To access the field of a structure, simply use the syntax `<struct value>.<field
name>`, like `individual.income`.

### Enumerations

Enumerations represent an alternative between different choices, each
encapsulating a specific pattern of data. In this sense, enumerations are
fully-fledged ["sum types"](https://en.wikipedia.org/wiki/Sum_type) like
in functional programming languages, and more powerful than C-like enumerations
that just list alternative codes a value can have. Each choice or alternative
of the enumeration is called a "case" or a "variant".

Enumeration types are declared by the user, and each enumeration type has a name
chosen by the user. Enumeration names begin by a capital letter and should follow
the `CamlCase` naming convention. An example of enumeration declaration is:

```catala
declaration enumeration NoTaxCredit:
  -- NoTaxCredit
  -- TaxCreditForIndividual content Individual
  -- TaxCreditAfterDate content date
```


The type of each case of the enumeration is mandatory and introduced by
`content`. It is possible to nest enumerations (declaring the type of a field of
an enumeration as another enumeration or structure), but not recursively.

Enumeration values are built with the following syntax:

```catala
# First case
NoTaxCredit
# Second case
TaxCreditForIndividual content (Individual {
    -- birth_date: |1930-09-11|
    -- income: $100,000
    -- number_of_children: 2
})
# Third case
TaxCreditAfterDate content |2000-01-01|
```

To inspect enumeration values, see in which case you are and use the associated
data, use [pattern matching](./5-5-expressions.md#pattern-matching).

## Lists

The type `list of <another type>` represents a fixed-size array of another type.
For instance, `list of integer` represents a fixed-size array of integers.

You can build list values using the following syntax:

```catala
[1; 6; -4; 846645; 0]
```

### List operations

| Syntax                                                       | Type of result   | Semantic                                                          |
|--------------------------------------------------------------|------------------|------------------------------------------------------------------ |
| `<list> contains <element>`                                  | boolean          | `true` if `<list>` contains `<element>`, false otherwise          |
| `number of <list>`                                           | integer          | Length of the list                                                |
| `exists <var> among <list> such that <expr>`                 | boolean          | `true` if at least one element of `list` satisfies `<expr>`       |
| `for all <var> among <list> we have <expr>`                  | boolean          | `true` if all elements of `list` satisfy `<expr>`                 |
| `map each <var> among <list> to <expr>`                      | list             | Element-wise mapping, creating a new list with `<expr>`           |
| `list of <var> among <list> such that <expr>`                | list             | Creates a new list with only the elements satisfying `<expr>`     |
| `map each <var> among <list> such that <expr1>` to <expr2>`  | list             | Combines the filter and map (see two last operations)             |
| `<list1> ++ <list2>`                               | list             | Concatenate two lists                                             |
| `sum <type> of <list>`                             | `<type>`         | Aggregates the contents (`money`, `integer`, `decimal`) of a list |
| `maximum of <list> (or if list empty then <expr>)` | type of elements | Returns the maximum element of the list (or an optional default)  |
| `minimum of <list> (or if list empty then <expr>)` | type of elements | Returns the minimum element of the list (or an optional default)  |
| `content of <var> among <list> such that <expr1> is maximum (or if list empty then <expr2>)` | type of elements | Returns the arg-maximum element of the list (or an optional default) |
| `content of <var> among <list> such that <expr1> is minimum (or if list empty then <expr2>)` | type of elements | Returns the arg-minimum element of the list (or an optional default) |
| `combine all <var> among <list> in <acc> initially <expr1> with <expr2>` | type of elements | [Folds](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) `<list>`, starting with `<expr1>` and accumulating with `<expr2>` |

~~~admonish tip title="Iterating on multiple lists at the same time"
These list operations mirror the contents of a [basic list library for a functional
programming language](https://ocaml.org/manual/latest/api/List.html). But in
such a list library, a key feature is the ability to iterate on two or more
lists at the same time to combine them element-wise. In Catala, this can be
done simply by writing a [tuple](./5-5-expressions.md#tuples) of lists intead
of one `<list>` inside the operations; then you have a tuple of `<var>` instead
of one to match the elements of each list in the tuple of lists. For instance,

```catala
map each (x, y) among (lst1, lst2) to x + y
```

This also works with `exists`, `for all`, `list of`, `combine`, etc.
Note that if `lst1` and `lst2` don't have the same lenght, the Catala program
will halt with a runtime error.
~~~

## Tuples

The type `(<type 1>, <type 2>)` represents a pair of elements, the first being
of `type 1`, the second being `type 2`. It is possible to extend the pair type
into a triplet type, or even an `n`-uplet for an arbitrary number `n` by
 repeating elements after `,`.

You can build tuple values with the following syntax:

```catala
(|2024-04-01|, $30, 1%) # This values has type (date, money, decimal)
```
You can access the `n`-th element of a tuple, starting at `1`, with the syntax `<tuple>.n`.

## Optional values

The type `optional of <type>` can be used to hold a value of `<type>` that could
be absent. For instance, `optional of integer` equivalent to the enumeration:

```catala
declaration enumeration OptionalInteger:
  -- Absent
  -- Present content integer
```

But the advantage of `optional of integer` over such an `OptionalInteger` is
that doesn't need to be declared for each type that it is used with. Like an
enumeration, values of type `optional` can be created using `Present content
<expr>`, and used in the forms `match <expr> with pattern` and `<expr> with
pattern <constr>`, e.g.

```catala
if foo with pattern Present of bar and bar > 3 then ...
```

## Functions

Function types represent function values, *i.e* values that require being called
with some arguments to yield a result. Functions are first-class values because
Catala is a [functional programming
language](https://en.wikipedia.org/wiki/Functional_programming).

The general syntax for describing a function type is :

```catala
<type of result> depends on
  <name of argument 1> content <type of argument 1>,
  <name of argument 2> content <type of argument 2>,
  ...
```

For instance, `money depends on income content money, number_of_children content
integer` can be the type of a tax-computing function.

However, unlike most programming language, it is not possible to directly build
a function as a value; functions are created and passed around with other
language mechanisms.

### Polymorphic functions

A key feature of a programming language is its ability to avoid code
duplication; the programmer should reuse as much code as possible through
abstractions, such as functions and modules. Moreover, a standard feature of
modern software engineering is
[polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)),
*i.e.* writing pieces of code that can operate on multiple types of values at
once, saving the programmer the necessity to duplicate the same code multiple
times depending on the type of the arguments.


~~~admonish question title="What does polymorphism mean in different programming languages?"
Polymorphism can be implemented in several ways depending on the programming
language. Java has abstract classes and interfaces, C++ has templates, Python
and Javascript have dynamic method resolution. Catala, being a statically
typed functional programming language, has a way of doing polymorphism that
is inspired by basic mechanisms present in OCaml.
~~~

Concretely, when defining a function in Catala, you can give the `anything` type
to an argument or the return type. This means that when you call the function,
you can call it with an argument that has any of the possible types. We can call
such an argument "generic", or say it has a "wildcard" type. For instance, it is
convenient to be able to write the `is_empty` function once for lists of
elements of any type:

```catala
declaration is_empty content boolean
  depends on argument content list of anything
  equals (number of argument = 0)
```

While generic arguments are powerful, they also have the downside that
you cannot really "do" anything with a value that has `anything` type since
you don't know what type it has. In particular, it is impossible to use
the operators like `+`, `*`, `-`, `/`, `<=`, etc. since these operators only
work for the basic types (`integer`, `decimal`, etc.) and not all the other
types that can be defined by the user (structures, enumerations, etc.).

Sometimes, there are multiple generic arguments or return types in the same
function but you want them to *share the same generic type*. For instance, if a
function reverses the elements of a list, the type of the list elements will be
the same in and out the function. The `anything` types can be _named_ for this
purpose, using `anything of type <name>`. For example:

```catala
declaration reverse content list of anything of type element_type
  depends on argument content list of anything of type element_type
```

If you don't name the `anything` type explicitly, it will be assumed that
each `anything` is a fresh, independent `anything` from the other `anythings`.
This may lead to complex error messages from the compiler, so remember to give
the same name to `anything` types that you know have to be linked together.

Polymorphic function signatures can be really useful when defining interfaces to
[externally-implemented modules](./5-6-modules.md#declaring-external-modules).
