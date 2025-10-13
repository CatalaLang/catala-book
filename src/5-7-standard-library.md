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
declaration min content integer depends on
  x content integer,
  y content integer

declaration max content integer depends on
  x content integer,
  y content integer

declaration ceiling content integer depends on
  variable content integer,
  ceiling content integer

declaration floor content integer depends on
  variable content integer,
  floor content integer

## Floors the value at 0
declaration positive content integer
  depends on variable content integer
```

## Module `Money`

```catala
declaration min content money depends on
  m1 content money,
  m2 content money

declaration max content money depends on
  m1 content money,
  m2 content money

declaration ceiling content money depends on
  variable content money,
  ceiling content money

declaration floor content money depends on
  variable content money,
  floor content money

## Floors the value at $0
declaration positive content money depends on
  variable content money

declaration truncate content money depends on
  variable content money

declaration round_by_excess content money depends on
  variable content money

declaration round_by_default content money depends on
  variable content money

## Returns the positive amount that `variable` overflows from `reference`
## ($0 otherwise)
declaration in_excess content money depends on
  variable content money,
  reference content money

## Returns the positive amount that `variable` underflows from `reference`
## ($0 otherwise)
declaration in_default content money depends on
  variable content money,
  reference content money
```

## Module `Decimal`

```catala
declaration min content decimal depends on
  m1 content decimal,
  m2 content decimal

declaration max content decimal depends on
  m1 content decimal,
  m2 content decimal

declaration ceiling content decimal depends on
  variable content decimal,
  ceiling content decimal

declaration floor content decimal
  variable content decimal,
  floor content decimal

## Floors the value at $0
declaration positive content decimal depends on
  variable content decimal

declaration truncate content decimal depends on
  variable content decimal

declaration round_by_excess content decimal depends on
  variable content decimal

declaration round_by_default content decimal depends on
  variable content decimal

## Returns the positive amount that `variable` overflows from `reference`
## ($0 otherwise)
declaration in_excess content decimal depends on
  variable content decimal,
  reference content decimal

## Returns the positive amount that `variable` underflows from `reference`
## ($0 otherwise)
declaration in_default content decimal depends on
  variable content decimal,
  reference content decimal
```

## Module `Date`

```catala
## Returns the earlier of two dates
declaration min
  content date
  depends on x content date,
    y content date
  equals
    if x <= y then x else y

## Returns the latter of two dates
declaration max
  content date
  depends on x content date,
    y content date
  equals
    if x >= y then x else y
```

## Dates and years, months and days

```catala
declaration of_year_month_day content date depends on
    pos content code_location,
    dyear content integer,
    dmonth content integer,
    dday content integer

declaration to_year_month_day content ( integer, integer, integer ) depends on
  d content date

declaration get_year content integer depends on
  d content date

declaration get_month content integer depends on
  d content date

declaration get_day content integer depends on
  d content date

declaration first_day_of_month content date depends on
  d content date

declaration last_day_of_month content date depends on
  d content date

declaration first_day_of_year content date depends on
  d content date

declaration last_day_of_year content date depends on
  d content date

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

declaration month_to_int content integer depends on
  m content Month

declaration structure MonthOfYear:
  data year_number content integer
  data month_name content Month

declaration month_of_int content Month depends on
  i content integer

declaration month_of_year_to_first_day_of_month content date depends on
  m content MonthOfYear

declaration to_month_of_year content MonthOfYear depends on
  d content date

declaration is_after_date_plus_delay content boolean depends on
  compared_date content date,
  reference_date content date,
  delay content duration

declaration is_old_enough content boolean depends on
  currrent_date content date,
  birth_date content date,
  target_age content duration

declaration is_before_date_plus_delay content boolean depends on
  compared_date content date,
  reference_date content date,
  delay content duration

declaration is_young_enough content boolean depends on
  currrent_date content date,
  birth_date content date,
  target_age content duration
```

## Module `Period`

```catala
declaration structure Period:
  data begin content date
  # The end date is excluded from the period
  data end content date

## Ensures that the period is coherent (it begins before its end)
declaration valid content boolean depends on
  p content Period

## Duration of a given period, in days
declaration duration content duration depends on
  p content Period

## Two periods are adjacent if the second one starts when the first stops
declaration are_adjacent content boolean depends on
  p1 content Period,
  p2 content Period

## Returns the period that encompasses both p1 and p2
declaration join content Period depends on
  p1 content Period,
  p2 content Period

## Returns the period corresponding to the days that are both in `p1` and `p2`
declaration intersection content optional of Period depends on
  p1 content Period,
  p2 content Period

## Returns `true` if the given date `d` belongs to the given period `p`
declaration contained content boolean depends on
  p content Period,
  d content date

## Finds the first period in the given list `l` that contains the date `d`
declaration find_period content optional of Period depends on
  l content list of Period,
  d content date

## Sorts the given periods by starting day
declaration sort_by_date content list of (Period, anything of type t) depends on
  l content list of (Period, anything of type t)

## Splits the given period, returning one period per calendar month. The first
## and last elements may be non-whole months.
declaration split_by_month content list of Period depends on
  p content Period

## Splits the given period, returning one period per year, split on the first
## of the given month. The first and last elements returned may be non-whole
## years.
declaration split_by_year content list of Period depends on
  starting_month content Date.Month,
  p content Period

declaration to_tuple content (date, date) depends on
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
```
