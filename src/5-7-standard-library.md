# Standard library

<div id="tocw"></div>

To avoid reinventing the wheel, Catala comes with a standard library containing
helpful functions on basic types.

~~~admonish info title="Where are the standard library files ?"
The standard library source files are contained in your installation
of Catala and copied over in the `_build/libcatala` directory each
time you run `clerk build` or `clerk run`.
~~~

~~~admonish tip title="Something is missing, can I add it?"
Yes please! Catala is an open-source project; you can contribute to the
standard library by filing a pull request updating the
[files in the `stdlib` directory](https://github.com/CatalaLang/catala/tree/master/stdlib).
~~~

We include below a listing of the function prototypes in the standard library, classified by
modules. To use a function of the standard library, simply type:

```catala
<module name>.<function name> of <arguments>
```

## Module `Integer`

```catala
## Returns the smallest of the two arguments.
declaration min content integer depends on
  x content integer,
  y content integer

## Returns the biggest of the two arguments.
declaration max content integer depends on
  x content integer,
  y content integer

## `ceiling of variable, max_value` puts an upper cap to `variable` and returns
## a value that never exceeds `max_value`.
declaration ceiling content integer depends on
  variable content integer,
  max_value content integer

## `floor of variable, min_value` puts a lower cap to `variable` and returns
## a value that is never inferior to `min_value`.
declaration floor content integer depends on
  variable content integer,
  min_value content integer

## Returns the argument if it is positive, 0 otherwise.
declaration positive content integer depends on
  variable content integer
```

## Module `Money`

```catala
## Returns the smallest of the two arguments.
declaration min content money depends on
  m1 content money,
  m2 content money

## Returns the biggest of the two arguments.
declaration max content money depends on
  m1 content money,
  m2 content money

## `ceiling of variable, max_value` puts an upper cap to `variable` and returns
## a value that never exceeds `max_value`.
declaration ceiling content money depends on
  variable content money,
  max_value content money

## `floor of variable, min_value` puts a lower cap to `variable` and returns
## a value that is never inferior to `min_value`.
declaration floor content money depends on
  variable content money,
  min_value content money

## Returns the argument if it is positive, $0 otherwise.
declaration positive content money depends on
  variable content money

## Removes decimal digits from a money amount. For instance,
## `truncate of $7.61 = $7.0` and `truncate of -$7.61 = -$7.0`.
declaration truncate content money depends on
  variable content money

## Rounds a money amount to the next greater dollar. For instance,
## `round_by_excess of $4.34 = $5` and `round_by_excess of -$4.34 = -$4.0`.
declaration round_by_excess content money depends on
  variable content money

## Rounds a money amount to the previous lesser dollar. For instance,
## `round_by_excess of $3.78 = $3` and `round_by_excess of -$3.78 = -$4.0`.
declaration round_by_default content money depends on
  variable content money

## Rounds a money amount to the specified [nth_decimal].
## [nth_decimal] may be a negative value. For instance,
## `round_to_decimal of $123.45, 1  = $123.5` and
## `round_to_decimal of $123.45, -2 = $100`.
declaration round_to_decimal
  content money
  depends on variable content money,
    nth_decimal content integer

## Returns the positive amount that `variable` overflows from `reference`
## ($0 otherwise).
declaration in_excess content money depends on
  variable content money,
  reference content money

## Returns the positive amount that `variable` underflows from `reference`
## ($0 otherwise).
declaration in_default content money depends on
  variable content money,
  reference content money
```

## Module `Decimal`

```catala
## Returns the smallest of the two arguments.
declaration min content decimal depends on
  m1 content decimal,
  m2 content decimal

## Returns the biggest of the two arguments.
declaration max content decimal depends on
  m1 content decimal,
  m2 content decimal

## `ceiling of variable, max_value` puts an upper cap to `variable` and returns
## a value that never exceeds `max_value`.
declaration ceiling content decimal depends on
  variable content decimal,
  max_value content decimal

## `floor of variable, min_value` puts a lower cap to `variable` and returns
## a value that is never inferior to `min_value`.
declaration floor content decimal depends on
  variable content decimal,
  min_value content decimal

## Returns the argument if it is positive, 0 otherwise.
declaration positive content decimal depends on
  variable content decimal

## Removes decimal digits from a number. For instance, `truncate of 7.61 = 7.0`
## and `truncate of -7.61 = -7.0`.
declaration truncate content decimal depends on
  variable content decimal

## Rounds a number to the next greater integer. For instance,
## `round_by_excess of 4.34 = 5` and `round_by_excess of -4.34 = -4.0`.
declaration round_by_excess content decimal depends on
  ariable content decimal

## Rounds a number to the previous lesser integer. For instance,
## `round_by_excess of 3.78 = 3` and `round_by_excess of -3.78 = -4.0`.
declaration round_by_default content decimal depends on
  variable content decimal

## Rounds a number to the specified [nth_decimal].
## [nth_decimal] may be a negative value. For instance,
## `round_to_decimal of 123.4567,  3 = 123.457` and
## `round_to_decimal of 123.4567, -2 = 100.0`.
declaration round_to_decimal
  content decimal
  depends on variable content decimal,
    nth_decimal content integer
```

## Module `Date`

### Helper functions

```catala
## Returns the earlier of two dates.
declaration min
  content date
  depends on x content date,
    y content date

## Returns the latter of two dates.
declaration max
  content date
  depends on x content date,
    y content date
```

### Dates and years, months and days

```catala
## Builds a date from the number of the year, month (starting from 1)
## and day (starting from 1).
declaration of_year_month_day
  content date
  depends on
    dyear content integer,
    dmonth content integer,
    dday content integer

## Returns the number of the year, month (starting from 1) and day (starting
## from 1) from the date.
declaration to_year_month_day
  content (integer, integer, integer)
  depends on d content date

## Returns the year number from a date.
declaration get_year
  content integer
  depends on d content date

## Returns the month number from a date (starting from 1).
declaration get_month
  content integer
  depends on d content date

## Returns the day number from a date (starting from 1).
declaration get_day
  content integer
  depends on d content date
```

### Getting to the past or future

```catala
## Returns the first day of the current month from the given date. For
## instance, `first_day_of_month of |21-01-2024| = |01-01-2024|`.
declaration first_day_of_month
  content date
  depends on d content date

## Returns the last day of the current month from the given date. For
## instance, `last_day_of_month of |21-01-2024| = |31-01-2024|`.
declaration last_day_of_month
  content date
  depends on d content date

## Returns the first day of the current year from the given date. For
## instance, `first_day_of_year of |21-03-2024| = |01-01-2024|`.
declaration first_day_of_year
  content date
  depends on d content date

## Returns the last day of the current year from the given date. For
## instance, `last_day_of_month of |21-03-2024| = |31-12-2024|`.
declaration last_day_of_year
  content date
  depends on d content date
```

### Named months

```catala
declaration enumeration Month:
  -- January
  -- February
  -- March
  -- April
  -- May
  -- June
  -- July
  -- August
  -- September
  -- October
  -- November
  -- December

## Returns the month number (starting from 1) associated to a named month.
declaration month_to_integer
  content integer
  depends on m content Month

## Returns the named month corresponding to the month number (starting from 1).
## If the input is not between 1 and 12, fails with an `impossible` error.
declaration month_of_integer
  content Month
  depends on i content integer
```

### Months of specific years

```catala
declaration structure MonthYear:
  data year_number content integer
  data month_name content Month

## Extracts the named month and year from a date ignoring the day.
declaration to_month_year
  content MonthYear
  depends on d content date

## Transforms a `MonthYear` into a `date` by choosing the first day of the
## month.
declaration to_first_day_of_month
  content date
  depends on m content MonthYear

## Transforms a `MonthYear` into a `date` by choosing the last day of the
## month.
declaration to_last_day_of_month
  content date
  depends on m content MonthYear

## Returns `true` if the date occurs strictly before given month.
declaration is_before_the_month
  content boolean
  depends on m content MonthYear, d content date

## Returns `true` if the date occurs strictly after the given month.
declaration is_after_the_month
  content boolean
  depends on m content MonthYear, d content date

## Returns `true` if the date is in the given month.
declaration is_in_the_month
  content boolean
  depends on m content MonthYear, d content date

## Returns `true` if the date occurs before the end of the given month (included).
## **Example:** `is_before_the_end_of_the_month of may_2025, |2025-04-13| = true`
## **Example:** `is_before_the_end_of_the_month of may_2025, |2025-05-31| = true`
## **Example:** `is_before_the_end_of_the_month of may_2025, |2025-06-01| = false`
declaration is_before_the_end_of_the_month
  content boolean
  depends on m content MonthYear, d content date

## Returns `true` if the date occurs after the first day of the given month (included).
## **Example:** `is_after_the_first_day_of_month of may_2025, |2025-06-15| = true`
## **Example:** `is_after_the_first_day_of_month of may_2025, |2025-05-01| = true`
## **Example:** `is_after_the_first_day_of_month of may_2025, |2025-04-30| = false`
declaration is_after_the_first_day_of_month
  content boolean
  depends on m content MonthYear, d content date
```

### Date comparisons

```catala
## `is_after_date_plus_delay of compared_date, reference_date, delay`
## checks whether `compared_date` is after `reference_date + delay`.
## For instance,
## `is_after_date_plus_delay of |15-06-2024|, |01-01-2024|, 6 month` returns
## `true` but
## `is_after_date_plus_delay of |15-05-2024|, |01-01-2024|, 6 month` returns
## `false.
declaration is_after_date_plus_delay
  content boolean
  depends on compared_date content date,
    reference_date content date,
    delay content duration

## `is_old_enough of compared_date, birth_date, target_age`
## checks whether `compared_date` is after `birth_date + target_age`.
## For instance,
## `is_old_enough of |15-06-2024|, |01-06-2000|, 24 year` returns
## `true` but
## `is_old_enough of |15-05-2024|, |01-06-2024|, 24 year` returns
## `false.
declaration is_old_enough
  content boolean
  depends on currrent_date content date,
    birth_date content date,
    target_age content duration

## `is_before_date_plus_delay of compared_date, reference_date, delay`
## checks whether `compared_date` is before `reference_date + delay`.
## For instance,
## `is_before_date_plus_delay of |15-06-2024|, |01-01-2024|, 6 month` returns
## `false` but
## `is_before_date_plus_delay of |15-05-2024|, |01-01-2024|, 6 month` returns
## `true.
declaration is_before_date_plus_delay
  content boolean
  depends on compared_date content date,
    reference_date content date,
    delay content duration

## `is_young_enough of compared_date, birth_date, target_age`
## checks whether `compared_date` is before `birth_date + target_age`.
## For instance,
## `is_young_enough of |15-06-2024|, |01-06-2000|, 24 year` returns
## `false` but
## `is_young_enough of |15-05-2024|, |01-06-2024|, 24 year` returns
## `true.
declaration is_young_enough
  content boolean
  depends on currrent_date content date,
    birth_date content date,
    target_age content duration
```

## Module `Period`

### Definitions and operations

A period is a starting date and an end date.

```catala
declaration structure Period:
  data begin content date
  # The end date is included in the period
  data end content date

## Returns a period ranging over the given month of the given year.
declaration of_month_and_year
  content Period
  depends on pmonth content Date.Month,
    pyear content integer

## Returns a period ranging over the given year.
declaration of_year
  content Period
  depends on pyear content integer

## Ensures that the period is coherent (it begins before its end).
declaration valid
  content boolean
  depends on p content Period

## Duration of a given period, in days.
declaration duration
  content duration
  depends on p content Period

## Two periods are adjacent if the second one starts when the first stops.
declaration are_adjacent
  content boolean
  depends on p1 content Period,
    p2 content Period

## Returns the period that encompasses both `p1` and `p2`.
declaration join
  content Period
  depends on p1 content Period,
    p2 content Period

## Returns the period corresponding to the days that are both in `p1` and `p2`.
declaration intersection
  content optional of Period
  depends on p1 content Period,
    p2 content Period

## Returns `true` if the periods have an overlap of at least one day.
declaration overlap
  content boolean
  depends on p1 content Period,
    p2 content Period

## Returns `true` if the period `p1` fully covers the period `p2`.
declaration cover
  content boolean
  depends on p1 content Period,
    p2 content Period

## Returns `true` if the given date `d` is contained in the given period `p`.
declaration is_contained
  content boolean
  depends on p content Period,
    d content date

## Returns `true` if the given date occurs *strictly* before the period.
declaration is_before
  content boolean
  depends on p content Period,
    d content date

## Returns `true` if the given date occurs *strictly* after the period.
declaration is_after
  content boolean
  depends on p content Period,
    d content date

## Finds the first period in the given list `l` that contains the date `d`.
declaration find_period
  content optional of Period
  depends on l content list of Period,
    d content date
```

### Operations on associated lists indexed by periods

```catala
## Sorts the given periods by starting day.
## **Edge-case**: if two periods start on the same day, their order in the list
## is preserved
declaration sort_by_date
  content list of (Period, anything of type t)
  depends on l content list of (Period, anything of type t)
```

### Splitting periods

```catala
## Splits the given period, returning one period per calendar month. The first
## and last elements may be non-whole months.
## **Edge-case**: if the given period is empty (begin >= end), an empty list
## is returned
declaration split_by_month
  content list of Period
  depends on p content Period

## Splits the given period, returning one period per year, split on the first
## of the given month. The first and last elements returned may be non-whole
## years.
## **Edge-case**: if the given period is empty (begin >= end), an empty list
## is returned
declaration split_by_year
  content list of Period
  depends on starting_month content Date.Month,
    p content Period
```

## Module `List`

```catala
## Returns a list made of the consecutive integers from `begin` (inclusive)
## to `end` (exclusive).
## **Example**: `sequence of 3, 6` is the list `[3; 4; 5]`
## **Edge-case**: if `end <= begin`, the returned list is empty
declaration sequence
  content list of integer
  depends on begin content integer,
             end content integer

## if `index` is between `1` and `count of lst`, returns `Present` with the
## element of the list at that index. Otherwise, returns `Absent`.
## **Example**: `nth_element of [$101; $102; $103], 2` is `Present content $102`
declaration nth_element
  content optional of anything of type t
  depends on lst content list of anything of type t,
             index content integer

## On a non-empty list, returns `Present` with content its first element
## **Edge-case**: if the list is empty, returns `Absent`
declaration first_element
  content optional of anything of type t
  depends on lst content list of anything of type t

## On a non-empty list, returns `Present` with content its last element
## **Edge-case**: if the list is empty, returns `Absent`
declaration last_element
  content optional of anything of type t
  depends on lst content list of anything of type t

## Removes the element at `index` (starting at 1) within list `lst`
## **Edge-case**: if the index is invalid, the list is returned unchanged
declaration remove_nth_element
  content list of anything of type t
  depends on lst content list of anything of type t,
             index content integer

## Returns the given list, without its first element
## **Edge-case**: an empty list is returned unchanged
declaration remove_first_element
  content list of anything of type t
  depends on lst content list of anything of type t

## Returns the given list, without its last element
## **Edge-case**: an empty list is returned unchanged
declaration remove_last_element
  content list of anything of type t
  depends on lst content list of anything of type t

## Reverse the elements of the given list.
## **Edge-case**: an empty list is returned unchanged
declaration reverse
  content list of anything of type t
  depends on lst content list of anything of type t
```
