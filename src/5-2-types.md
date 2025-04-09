# Types and values


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>

~~~admonish info
Catala is a strongly-typed language: each value manipulated by the programs have
a well-defined type that is either built-in or declared by the user. This
section of the language reference summarizes all the different kind of types,
how to declare them and how to build values of this type.
~~~

## Base types

The following types and values are built-in Catala, relying on keywords of the
language.

### Booleans

The type `boolean` has only two values, `true` and `false`.

### Integers

The type `integer` represents mathematical integers, like `564,614` or `-2`.
Note that you can optionally use the number separator `,` to make large integers
more readable.

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

### Money

The type `money` represents an amount of money, positive or negative, in a
currency unit (in the English version of Catala, we use the `$` currency
symbol), with a precision down to the cent and not below. Money values are
noted like decimal values with maximum two fractional digits and the currency
symbol, like `$12.36` or `-$871,84.1`.

### Dates

The type `date` represents dates in the [gregorian
calendar](https://en.wikipedia.org/wiki/Gregorian_calendar). This type
cannot represent invalid dates like `2025-02-31`. Values of this type are
noted following the [ISO8601](https://fr.wikipedia.org/wiki/ISO_8601) notation (`YYYY-MM-DD`)
enclosed by vertical bars, like `|1930-09-11|` or `|2012-02-03|`.

### Durations

The type `duration` represents durations in terms of days, months and/or years,
like `254 day`, `4 month` or `1 year`. Durations can be negative and combine
a number of days and months together, like `1 month + 15 day`.

~~~admonish danger title="Durations in days and in months are incomparable"
Is it always true that in terms of durations, `1 year = 12 month`. However,
because months have a variable number of days, comparing durations in days
to durations in months is ambiguous and requires legal interpretations.

For this reason, Catala will crash when trying to perform such a comparison.
Moreover, the difference between two dates will always yield a duration expressed
in days.
~~~

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
a enumeration as another enumeration or structure), but not recursively.

Enumeration values are built with the following syntax:

```catala
NoTaxCredit
TaxCreditForIndividual content (Individual {
    -- birth_date: |1930-09-11|
    -- income: $100,000
    -- number_of_children: 2
})
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

## Tuples

The type `(<type 1>, <type 2>)` represents a pair of elements, the first being
of `type 1`, the second being `type 2`. It is possible to extend the pair type
into a triplet type, or even an `n`-uplet for an arbitrary number `n` by
 repeating elements after `,`.

You can build tuple values with the following syntax:

```catala
(|2024-04-01|, $30, 1%) # This values has type (date, money, decimal)
```

## Functions

Function types represent function values, *i.e* values that require being called
with some arguments to yield a result. Functions are first-class value because
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


