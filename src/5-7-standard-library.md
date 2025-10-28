# Standard library

<div id="tocw"></div>

~~~admonish tip title="French version"
A french translated version is also available here: [French version](./5-7-fr-standard-library.md)
Other languages currently need to use the following english version
~~~

To avoid reinventing the wheel, Catala comes with a standard library containing
helpful functions on basic types.
We include below a listing of the function prototypes in the standard library, classified by
modules. To use a function of the standard library, simply type:

```catala
<module name>.<function name> of <arguments>
```

Example:

```catala
Date.last_day_of_month of |21-01-2024| # returns |31-01-2024|
```

~~~admonish info title="Using standard library modules"
It is not necessary to write `> Using <Module>` to use the standard
library. Those modules are automatically accessible.
~~~


Here is a summary of all the available modules in the standard library:
- [`Integer`](#module-integer) -- Advanced arithmetic functions on `integers` type
- [`Decimal`](#module-decimal) -- Advanced arithmetic functions on `decimal` type
- [`Money`](#module-money) -- Arithmetic and financial operations on `money` type
- [`Date`](#module-date) -- Date utility functions and representations for `date` type
- [`MonthYear`](#module-monthyear) -- Structure and functions for months of specific years
- [`Period`](#module-period) -- Periods of time and utility functions to manipulate them
- [`List`](#module-list) -- Functions to create, access, sort and manipulate list values


~~~admonish info title="Where are the standard library files ?"
The standard library source files are contained in your installation
of Catala and copied over in the `_build/libcatala` directory each
time you run `clerk build` or `clerk run`.
~~~

~~~admonish tip title="Something is missing, can I add it?"
Yes, please! Catala is an open-source project; you can contribute to the
standard library by filing a pull request updating the
[files in the `stdlib` directory](https://github.com/CatalaLang/catala/tree/master/stdlib).
~~~


## Module `Integer`

```catala
## Returns the smaller of the two arguments.
declaration min
  content integer
  depends on
    n1 content integer,
    n2 content integer

## Returns the bigger of the two arguments.
declaration max
  content integer
  depends on
    n1 content integer,
    n2 content integer

## Caps `n`, returning a value that never exceeds `max_value`.
declaration ceiling
  content integer
  depends on
    n content integer,
    max_value content integer

## Applies a lower cap on `n`, and returns a value that is never smaller
## than `min_value`.
declaration floor
  content integer
  depends on
    n content integer,
    min_value content integer

## Returns the argument if it is positive, 0 otherwise.
declaration positive
  content integer
  depends on n content integer
```

## Module `Decimal`

```catala
## Returns the smaller of the two arguments.
declaration min
  content decimal
  depends on
    d1 content decimal,
    d2 content decimal

## Returns the bigger of the two arguments.
declaration max
  content decimal
  depends on
    d1 content decimal,
    d2 content decimal

## Caps `d`, returning a value that never exceeds `max_value`.
declaration ceiling
  content decimal
  depends on
    d content decimal,
    max_value content decimal

## Applies a lower cap on `d`, and returns a value that is never smaller
## than `min_value`.
declaration floor
  content decimal
  depends on
    d content decimal,
    min_value content decimal

## Returns the argument if it is positive, 0.0 otherwise.
declaration positive
  content decimal
  depends on d content decimal

## Removes decimal digits from a number.
## **Examples:**
## - `truncate of 7.61 = 7.0`
## - `truncate of -7.61 = -7.0`
declaration truncate
  content decimal
  depends on d content decimal

## Rounds a number to the next greater integer.
## **Examples:**
## - `round_by_excess of 4.34 = 5`
## - `round_by_excess of -4.34 = -4.0`
declaration round_by_excess
  content decimal
  depends on d content decimal

## Rounds a number to the previous lesser integer.
## **Examples:**
## - `round_by_excess of 3.78 = 3`
## - `round_by_excess of -3.78 = -4.0`
declaration round_by_default
  content decimal
  depends on d content decimal

## Rounds a number to the specified `nth_decimal`. `nth_decimal` may be a
## negative value.
## **Examples:**
## - `round_to_decimal of 123.4567,  3 = 123.457`
## - `round_to_decimal of 123.4567, -2 = 100.0`
declaration round_to_decimal
  content decimal
  depends on
    d content decimal,
    nth_decimal content integer
```

## Module `Money`

```catala
## Returns the smaller of the two arguments.
declaration min
  content money
  depends on
    m1 content money,
    m2 content money

## Returns the bigger of the two arguments.
declaration max
  content money
  depends on
    m1 content money,
    m2 content money

## Caps `m`, returning a value that never exceeds `max_value`.
declaration ceiling
  content money
  depends on
    m content money,
    max_value content money

## Puts a lower cap on `m`, and returns a value that is never smaller
## than `min_value`.
declaration floor
  content money
  depends on
    m content money,
    min_value content money

## Returns the argument if it is positive, $0 otherwise.
declaration positive
  content money
  depends on m content money

## Removes decimal digits from a money amount.
## **Examples:**
## - `truncate of $7.61 = $7.0`
## - `truncate of -$7.61 = -$7.0`
declaration truncate
  content money
  depends on m content money

## Rounds a money amount to the next greater dollar.
## **Examples:**
## - `round_by_excess of $4.34 = $5`
## - `round_by_excess of -$4.34 = -$4.0`
declaration round_by_excess
  content money
  depends on m content money

## Rounds a money amount to the previous lesser dollar.
## **Examples:**
## - `round_by_excess of $3.78 = $3`
## - `round_by_excess of -$3.78 = -$4.0`
declaration round_by_default
  content money
  depends on m content money

## Rounds a money amount to the specified `nth_decimal`.
## `nth_decimal` may be a negative value.
## **Examples:**
## - `round_to_decimal of $123.45, 1 = $123.5`
## - `round_to_decimal of $123.45, -2 = $100`
declaration round_to_decimal
  content money
  depends on
    m content money,
    nth_decimal content integer
```

### Financial operations

```catala
## Returns the positive amount that `m` overflows from `reference`
## ($0 otherwise).
declaration in_excess
  content money
  depends on
    m content money,
    reference content money

## Returns the positive amount that `m` underflows from `reference`
## ($0 otherwise).
declaration in_default
  content money
  depends on
    m content money,
    reference content money
```

## Module `Date`

### Helper functions

```catala
## Returns the earlier of two dates.
declaration min
  content date
  depends on
    d1 content date,
    d2 content date

## Returns the latter of two dates.
declaration max
  content date
  depends on
    d1 content date,
    d2 content date
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

## Returns the number of the year, month (1-12) and day (1-31) from the date.
declaration to_year_month_day
  content (integer, integer, integer)
  depends on d content date

## Returns the year number from a date.
declaration get_year
  content integer
  depends on d content date

## Returns the month number (1-12) from a date.
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
## Returns the first day of the current month from the given date.
## **Example:** `first_day_of_month of |2024-01-21| = |2024-01-01|`
declaration first_day_of_month
  content date
  depends on d content date

## Returns the last day of the current month from the given date.
## **Example:** `last_day_of_month of |2024-01-21| = |2024-01-31|`
declaration last_day_of_month
  content date
  depends on d content date

## Returns the first day of the current year from the given date.
## **Example:** `first_day_of_year of |2024-03-21| = |2024-01-01|`.
declaration first_day_of_year
  content date
  depends on d content date

## Returns the last day of the year from the given date.
## **Example:** `last_day_of_year of |2024-03-21| = |2024-12-31|`.
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

## Returns the month number (1-12) associated to a named month.
declaration month_to_integer
  content integer
  depends on m content Month

## Returns the named month corresponding to the month number (1-12).
## **Aborts:** if the input is not between 1 and 12
declaration integer_to_month
  content Month
  depends on i content integer
```

### Date comparisons

```catala
## Checks whether a person born at `birth_date` is at least `age` old at
## `at_date`. This function rounds **down** when computing the birthday.
## **Examples:**
## - `is_old_enough_rounding_down of |2000-06-01|, 24 year, |2024-06-15| = true`
## - `is_old_enough_rounding_down of |2000-06-01|, 24 year, |2024-05-15| =
##   false`
## - `is_old_enough_rounding_down of |2000-01-31|, 1 month, |2000-02-29| = true`
declaration is_old_enough_rounding_down
  content boolean
  depends on
    birth_date content date,
    age content duration,
    at_date content date

## Checks whether a person born at `birth_date` is at least `age` old at
## `at_date`. This function rounds **up** when computing the birthday.
## **Examples:**
## - `is_old_enough_rounding_up of |2000-06-01|, 24 year, |2024-06-15| = true`
## - `is_old_enough_rounding_up of |2000-06-01|, 24 year, |2024-05-15| = false`
## - `is_old_enough_rounding_up of |2000-01-31|, 1 month, |2000-02-29| = false`
declaration is_old_enough_rounding_up
  content boolean
  depends on
    birth_date content date,
    age content duration,
    at_date content date

## Checks whether a person born at `birth_date` is strictly less than
## `age` old at `at_date`. This function rounds **down** when computing
## the birthday.
## **Examples:**
## - `is_young_enough_rounding_down of |2000-06-01|, 24 year, |2024-06-15| =
##   false`
## - `is_young_enough_rounding_down of |2000-06-01|, 24 year, |2024-05-15| =
##   true`
## - `is_young_enough_rounding_down of |2000-01-31|, 1 month, |2000-02-29| =
##   false`
# Note: it would be tempting to write a function that tests if the person
# is "at most" a given age instead. But that would be misleading, because by
# "at most n years old", we actually mean "less than (n+1) years old",
# implicitly rounding the age down. The function can't do that since it allows
# durations in months or days as well.
declaration is_young_enough_rounding_down
  content boolean
  depends on
    birth_date content date,
    age content duration,
    at_date content date

## Checks whether a person born at `birth_date` is strictly less than
## `age` old at `at_date`. This function rounds **down** when computing
## the birthday.
## **Examples:**
## - `is_young_enough_rounding_up of |2000-06-01|, 24 year, |2024-06-15| =
##   false`
## - `is_young_enough_rounding_up of |2000-06-01|, 24 year, |2024-05-15| = true`
## - `is_young_enough_rounding_up of |2000-01-31|, 1 month, |2000-02-29| = true`
declaration is_young_enough_rounding_up
  content boolean
  depends on
    birth_date content date,
    age content duration,
    at_date content date
```

## Module `MonthYear`

```catala
declaration structure MonthYear:
  data year_number content integer
  data month_name content D.Month

## Extracts the named month and year from a date ignoring the day.
declaration to_month_year
  content MonthYear
  depends on d content date

## Transforms a `MonthYear` into a `date` by choosing the first day of the
## month.
declaration first_day_of_month
  content date
  depends on m content MonthYear

## Transforms a `MonthYear` into a `date` by choosing the last day of the
## month.
declaration last_day_of_month
  content date
  depends on m content MonthYear

## Checks if the date occurs strictly before given month.
declaration is_before_the_month
  content boolean
  depends on m content MonthYear, d content date

## Checks if the date occurs strictly after the given month.
declaration is_after_the_month
  content boolean
  depends on m content MonthYear, d content date

## Checks if the date is in the given month.
declaration is_in_the_month
  content boolean
  depends on m content MonthYear, d content date

## Checks if the date occurs before the first day of the next month.
## **Example:** `is_before_the_next_month of may_2025, |2025-04-13| = true`
## **Example:** `is_before_the_next_month of may_2025, |2025-05-31| = true`
## **Example:** `is_before_the_next_month of may_2025, |2025-06-01| = false`
declaration is_before_the_next_month
  content boolean
  depends on m content MonthYear, d content date

## Checks if the date occurs after the last day of the previous month.
## **Example:** `is_after_the_previous_month of may_2025, |2025-06-15| = true`
## **Example:** `is_after_the_previous_month of may_2025, |2025-05-01| = true`
## **Example:** `is_after_the_previous_month of may_2025, |2025-04-30| = false`
declaration is_after_the_previous_month
  content boolean
  depends on m content MonthYear, d content date
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
  depends on
    pmonth content Date.Month,
    pyear content integer

## Returns a period ranging over the given year.
declaration of_year
  content Period
  depends on pyear content integer

## Ensures that the period is coherent (it begins before it ends, and is at
## least one day long).
declaration valid
  content boolean
  depends on p content Period

## Duration of a given period, in days.
declaration duration
  content duration
  depends on p content Period

## Two periods are adjacent if the second one starts right after the first
## stops.
declaration are_adjacent
  content boolean
  depends on
    p1 content Period,
    p2 content Period

## Returns the period that encompasses both `p1` and `p2`.
declaration join
  content Period
  depends on
    p1 content Period,
    p2 content Period

## Returns the period corresponding to the days that are both in `p1` and `p2`.
declaration intersection
  content optional of Period
  depends on
    p1 content Period,
    p2 content Period

## Checks if the periods have an overlap of at least one day.
declaration overlaps
  content boolean
  depends on
    p1 content Period,
    p2 content Period

## Checks if the period `long` fully covers the period `short`.
declaration covers
  content boolean
  depends on
    long content Period,
    short content Period

## Checks if the date `d` is contained in the period `p`.
declaration is_contained
  content boolean
  depends on
    p content Period,
    d content date

## Checks if the given date occurs *strictly* before the period.
declaration is_before
  content boolean
  depends on
    p content Period,
    d content date

## Checks if the given date occurs *strictly* after the period.
declaration is_after
  content boolean
  depends on
    p content Period,
    d content date

## Finds the first period in the given list `l` that contains the date `d`.
declaration find_period
  content optional of Period
  depends on
    l content list of Period,
    d content date
```

### Operations on associated lists indexed by periods

```catala
## Sorts the given periods by starting day.
## if two periods start on the same day, their order in the list is preserved
declaration sort_by_date
  content list of (Period, anything of type t)
  depends on l content list of (Period, anything of type t)
```

### Splitting periods

```catala
## Splits the given period, returning one period per calendar month. The first
## and last elements may be non-whole months.
## If the given period is empty (begin >= end), an empty list is returned.
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
  depends on
    starting_month content Date.Month,
    p content Period
```

## Module `List`

```catala
## Returns a list made of the consecutive integers from `begin` to `end`.
## If `end <= begin`, the returned list is empty.
## **Example:** `sequence of 3, 6 = [ 3; 4; 5; 6 ]`
declaration sequence
  content list of integer
  depends on
    begin content integer,
    end content integer

## Returns the element at the given `index` in the list, encapsulated within
## constructor `Present`.
## If the index is less than 1, or otherwise outside of the list, `Absent` is
## returned.
## **Example**: `nth_element of [$101; $102; $103], 2 = Present content $102`
declaration nth_element
  content optional of anything of type t
  depends on
    l content list of anything of type t,
    index content integer

## Returns the first element of the list encapsulated within constructor
## `Present`.
## If the list is empty, returns `Absent` instead.
declaration first_element
  content optional of anything of type t
  depends on l content list of anything of type t

## Returns the last element of the list encapsulated within constructor
## `Present`.
## If the list is empty, returns `Absent`
declaration last_element
  content optional of anything of type t
  depends on l content list of anything of type t

## Removes the element at `index` within the list. The indexes of the
## following elements are shifted.
## If the index is invalid, the list is returned unchanged.
declaration remove_nth_element
  content list of anything of type t
  depends on
    l content list of anything of type t,
    index content integer

## Returns the given list, without its first element.
## An empty list is returned unchanged.
declaration remove_first_element
  content list of anything of type t
  depends on l content list of anything of type t

## Returns the given list, without its last element.
## An empty list is returned unchanged.
declaration remove_last_element
  content list of anything of type t
  depends on l content list of anything of type t

## Reverse the elements of the given list.
declaration reverse
  content list of anything of type t
  depends on l content list of anything of type t
```
