# Exercise

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

 As an exercise, you can try implementing a new article that
complexifies even more the computation:

~~~admonish quote title="Article 9"
The deduction granted at article 8 is capped at $8,500 for the whole household.
~~~

~~~admonish example title="Implementation solution for articles 7, 8 and 9" collapsible=true
```catala
declaration scope HouseholdTaxComputation:
  input individuals content list of Individual
  input overseas_territories content boolean
  input current_date content date

  internal shares_of_household_tax
    # It is possible to store the structure resulting from a scope call
    # (with all its output variable) into a single type. The name of this
    # structure type is the name of the scope, hence the line below.
    content list of HouseholdTaxIndividualComputation
  internal total_deduction content money
    state base
    state capped

  output household_tax content money
    state base
    state deduction

declaration scope HouseholdTaxIndividualComputation:
  input individual content Individual
  input overseas_territories content boolean
  input current_date content date

  income_tax_computation scope IncomeTaxComputation

  output household_tax content money
  output deduction content money
```

#### Article 7

When several individuals live together, they are collectively subject to
the household tax. The household tax owed is $10,000 per individual of the household,
and half the amount per children.


```catala
scope HouseholdTaxIndividualComputation:
  definition household_tax equals
    $10,000 * (1.0 + decimal of individual.number_of_children / 2.0)

scope HouseholdTaxComputation:
  definition shares_of_household_tax equals
    map each individual among individuals to
      output of HouseholdTaxIndividualComputation with {
        -- individual: individual
        -- overseas_territories: overseas_territories
        -- current_date: current_date
      }


  definition household_tax
    state base
  equals
    sum money of
      map each share_of_household_tax among shares_of_household_tax
      to share_of_household_tax.household_tax
```

#### Article 8

The amount of income tax paid by each individual can be deducted from the
share of household tax owed by this individual.

```catala
scope HouseholdTaxIndividualComputation:
  definition income_tax_computation.individual equals
    individual
  definition income_tax_computation.overseas_territories equals
    overseas_territories
  definition income_tax_computation.current_date equals
    current_date

  definition deduction equals
    if income_tax_computation.income_tax > household_tax then household_tax
    else income_tax_computation.income_tax

scope HouseholdTaxComputation:
  definition total_deduction
    state base
  equals
    sum money of
      map each share_of_household_tax among shares_of_household_tax to
        share_of_household_tax.deduction

  definition household_tax
    state deduction
  equals
    if total_deduction > household_tax then $0
    else household_tax - total_deduction
```

#### Article 9

The deduction granted at article 8 is capped at $8,500 for the whole household.

```catala
scope HouseholdTaxComputation:
  definition total_deduction
    state capped
  equals
    if total_deduction > $8,500 then $8,500 else total_deduction
```
~~~
