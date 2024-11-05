# FAQ: How to code the law?

## Money and rounding

In catala, monetary values are represented as an integer number of cents.

A calculation with the catala `money` type always result in an amount rounded to the nearest cent. This means, that, when performing intermediate computations on money, rounding must be considered by the programmer at each step. This aims at making review by domain experts easier, since for each intermediate value, they can follow along and perform example computations with a simple desk calculator.

The `round of` builtin will round to the nearest monetary unit (e.g. euro or dollar).

To round an amount to an arbitrary multiple of a cent, perform a multiplication with that multiple, round the amount and divide it by the same amount.

### Example: rounding to the nearest multiple of 10 cents

```catala
declaration scope Rounding10Cents:
  output result content money

scope Rounding10Cents:
  definition result equals
    round of ($4.13 * 10.) / 10.
```

### Rounding up or down

To round up or down, add or subtract half a unit before performing the computation and rounding.

#### Example

To compute a tax amount that is defined as 0.5% of a gross amount (here $149.26) rounded down to the nearest cent

```catala
declaration scope Rounding:
  output tax_amount content money

scope Rounding:
  definition tax_amount equals
    money of
      (
        round of
          (
            ((decimal of $149.26) * 0.5% * 100.0) - 0.5
          )
        / 100.
      )

```

This is a bit of a mouthful, but can be made more readable by introducing a function.

```catala
declaration scope Rounding:
  output tax_amount content money
  internal round_down_cents content money depends on amount_decimal content decimal

scope Rounding:
  definition tax_amount equals
    round_down_cents of (decimal of $149.26 * 0.5%)

  definition round_down_cents of amount_decimal equals
    money of ((amount_decimal * 100.0 - 0.5) / 100.)
```

Besides being more readable, this has the benefit of making it more obvious that any computation that requires keeping a fractional number of cents should be performed on decimals, and converted to a monetary amount at the end.

## Can we use Large Language Models (LLMs) to translate the law into code?

## Can every law be formalized?

