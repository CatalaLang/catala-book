# Hands-on exercise: "Nothing is certain except death and taxes"

In this section, we present a practical exercise aiming to familiarize
the writing of Catala programs and understanding its basic concepts.
We strongly invite you to setup a [working Catala
environment](./1-1-0-installing.md), open an editor (such as `vscode`)
and copy-paste the following exercise template in a catala file; you
may name it `exercise-2-1-1.catala_en`.

~~~admonish example title="'exercise-2-1-1.catala_en' template file" collapsible=true
<pre>
# Catala Book: Exercise 2-1-1

```catala
declaration structure Individual:
  data date_of_birth content date
  data date_of_death content DateOfDeath

declaration enumeration DateOfDeath:
  -- Deceased content date
  -- StillAlive
```

# Question 1

Based on the `test_person1` declaration, declare a `test_person2` born
on the 21st of December 1977 that is still alive.

```catala
# Declaration and definition of a constant value named test_person1
declaration test_person1 content Individual equals
  Individual {
    -- date_of_birth: |1981-10-05|
      # Date format is |YYYY-MM-DD|
    -- date_of_death: Deceased content |2012-05-12|
  }

declaration test_person2 content Individual equals
  test_person1 # <= Remove this line and replace it with your answer
```

```catala
declaration scope KillPerson:
  input fateful_date content date
  input victim content Individual
  output killed_individual content Individual
```

# Question 2

Given the `KillPerson` scope declaration, define a `KillPerson` scope
output variable `killed_individual` that uses the `fateful_date` and
`victim` input variables to create a new Individual that is a copy of
the `victim` input but with its `date_of_death` updated. For the sake
of simplicity, we will not check whether or not we kill an already
deceased individual.

You can test your solution by invoking the TestKillPerson Catala
scope: `catala interpret exercise-2-1-1.catala_en --scope TestKillPerson`.

```catala
declaration scope TestKillPerson:
  output computation content KillPerson

scope TestKillPerson:
  definition computation equals
    output of KillPerson with {
      -- fateful_date: |2025-01-20|
      -- victim: test_person2
    }

# Define your KillPerson scope here

# scope KillPerson:
#   ...
```

```catala
declaration structure Couple:
  data household_yearly_income content money
  data person_1 content Individual
  data person_2 content Individual

# Define your test_couple definition here

# declaration test_couple content Couple equals
#   ...
```

```catala
declaration scope TaxComputation:
  input processing_date content date
  input couple content Couple

  internal person1_dead_before_processing_date content boolean
  internal person2_dead_before_processing_date content boolean

  output tax_amount content money

scope TaxComputation:
  definition tax_amount equals
    if person1_dead_before_processing_date
      or person2_dead_before_processing_date then
     $0
   else
     couple.household_yearly_income * 15%
```

## Question 4

Define another `TaxComputation` scope definition that defines both
internal boolean variables `person1_dead_before_processing_date` and
`person2_dead_before_processing_date`.

```catala
# Define your new TaxComputation scope here

# scope TaxComputation:
#   ...
```

## Question 5

Lastly, we need to define a test for our computation. Based on the
previously defined tests, write a definition of the
`TestTaxComputation` test scope. Then, tweak the given test values to
make sure your implementation is correct.

```catala
declaration scope TestTaxComputation:
  output test_tax_computation content TaxComputation

# Define your TestTaxComputation scope here

# scope TestTaxComputation:
#   ...
```
</pre>
~~~

***


~~~admonish tip title="Catala syntax cheat-sheet"
Throughout this exercise, do not hesitate to refer to the [Catala
syntax cheat-sheet](https://catalalang.github.io/catala/syntax.pdf)!
In particular if you struggle with the language's syntactic
constructions.
~~~

In this exercise, we want to define (yet another!) tax
computation. This time, the tax amount an household is required to pay
depends on whether individuals are still alive or not. In order to
model such mechanism, we introduce the following Catala structures
representing individuals.

An individual is referenced using only two informations: its date of
birth and its **possible** date of death. If an individual is still
alive, it has no date of death. Expressing this possibility can be
done using an enumeration: if the individual is still alive, its
`date_of_death` entry will be `StillAlive` otherwise it will be
`Deceased` that must come along a date value as specified in the
following declaration.

```catala
declaration structure Individual:
  data date_of_birth content date
  data date_of_death content DateOfDeath

declaration enumeration DateOfDeath:
  -- Deceased content date
  -- StillAlive

# Declaration and definition of a constant value named test_person1
declaration test_person1 content Individual equals
  Individual {
    -- date_of_birth: |1981-10-05|
      # Date format is |YYYY-MM-DD|
    -- date_of_death: Deceased content |2012-05-12|
  }
```

## Question 1

Based on the `test_person1` declaration, try to define a
`test_person2` born on the 21st of December 1977 that is still alive.

~~~admonish example title="Solution to Question 1" collapsible=true

Answer:

```catala

declaration test_person2 content Individual equals
  Individual {
    -- date_of_birth: |1977-12-21|
    -- date_of_death: StillAlive
  }
```
~~~

***

We now want a way to update the status of a person from alive to dead. We do
it through a dedicated `KillPerson` scope whose declaration is:


```catala
declaration scope KillPerson:
  input fateful_date content date
  input victim content Individual
  output killed_individual content Individual
```

## Question 2

Given the `KillPerson` scope declaration, define a `KillPerson` scope
output variable `killed_individual` that uses the `fateful_date` and
`victim` input variables to create a new Individual that is a copy of
the `victim` input but with its `date_of_death` updated. For the sake
of simplicity, we will not check whether or not we kill an already
deceased individual.

You can test your solution using the following TestKillPerson
scope by invoking this command in a console:
```bash
catala interpret exercise-2-1-1.catala_en --scope TestKillPerson
```

```catala
declaration scope TestKillPerson:
  output computation content KillPerson

scope TestKillPerson:
  definition computation equals
    output of KillPerson with {
      -- fateful_date: |2025-01-20|
      -- victim: test_person2
    }
```

~~~admonish example title="Solution to Question 2" collapsible=true
```catala
scope KillPerson:
  definition killed_individual equals
    Individual {
      -- date_of_birth: victim.date_of_birth
      -- date_of_death: Dead content kill_date
    }
```

***

You can also use the `replace` syntax to modify specific fields of a
structure. It allows you to only modify specific fields which can be
useful especially when a structure defines a lot of fields!


```catala
scope KillPerson:
  definition killed_individual equals
    victim but replace { -- date_of_death: Dead content kill_date }
```
~~~

We now define a `Couple` structure that represent a simple
household. This structure has three different entries:
- Two individuals: `person_1` and `person_2`;
- And, their combined `household_yearly_income`.

```catala
declaration structure Couple:
  data person_1 content Individual
  data person_2 content Individual
  data household_yearly_income content money
```

## Question 3

Again, define a test value named `test_couple` that reuses the
previously defined individuals (namely `test_person_1` and
`test_person_2`) and sets their `house_yearly_income` to `$80,000`.


~~~admonish example title="Solution to Question 3" collapsible=true
```catala
declaration test_couple content Couple equals
  Couple {
    -- household_yearly_income: $80,000
    -- person_1: test_person1
    -- person_2: test_person2
  }
```
~~~

***

Let's now consider a tax computation law article with a very simple
definition:

```admonish quote title="Article: Tax Computation"
The income tax for a couple's household is defined as 15% of their
yearly income unless one (or both) of the individuals are deceased
prior to the file's processing date.
```

This translates to the following Catala code:

```catala
declaration scope TaxComputation:
  input processing_date content date
  input couple content Couple

  internal person1_dead_before_processing_date content boolean
  internal person2_dead_before_processing_date content boolean

  output tax_amount content money

scope TaxComputation:
  definition tax_amount equals
    if person1_dead_before_processing_date
      or person2_dead_before_processing_date then
     $0
   else
     couple.household_yearly_income * 15%
```

In order to trivialise the definition of `tax_amount`, we introduced
two `internal` scope variables that represent boolean values (`true`
or `false`). However, even if we provided the definition of the output
variable `tax_amount`, these internal variables are yet to be defined
otherwise we won't be able to effectively do the computation.

## Question 4

In Catala, scope definitions can be scattered over the whole file. In
doing so, it allows to locally implement the logic defined by a law
article without introducing boilerplate that would hinder a reviewing
process.

Define another `TaxComputation` scope definition that defines both
internal boolean variables `person1_dead_before_processing_date` and
`person2_dead_before_processing_date`.

~~~admonish tip title="Decomposing enumerations"
In order to decompose and reason on enumeration values, one can use
the _pattern-matching_ construction. For example, _pattern-matching_ a `DateOfDeath`
enumeration looks like this:
```catala
definition individual_age equals
  match individual.date_of_death with
  -- StillAlive: current_date - individual.date_of_birth
  -- Deceased of deceased_date: deceased_date - individual.date_of_birth
```
N.b., all the different branches of a _pattern-matching_ must contain same
data type expressions.
~~~

~~~admonish example title="Solution to Question 4" collapsible=true
```catala
scope TaxComputation:
  definition person1_dead_before_processing_date equals
    match couple.person_1.date_of_death with pattern
    -- StillAlive: false
    -- Deceased of d: d < processing_date

  definition person2_dead_before_processing_date equals
    # Another possible syntax for testing patterns
    couple.person_1.date_of_death with pattern
      Deceased of d and d < processing_date
```
~~~

## Question 5

Lastly, we need to define a test for our computation. Based on the
previously defined tests, write a definition of the
`TestTaxComputation` test scope. Then, tweak the given test values to
make sure your implementation is correct.

```catala
declaration scope TestTaxComputation:
  output test_tax_computation content TaxComputation
```

Same as before, you can use a similar command to execute your test:
```bash
catala interpret exercise-2-1-1.catala_en --scope TestTaxComputation
```

~~~admonish example title="Solution to Question 5" collapsible=true
```catala
scope TestTaxComputation:
  definition test_tax_computation equals
    output of TaxComputation with {
      # Processing date is a week before test_person1's death:
      -- processing_date: |2012-05-01|
      # Processing date is a week before test_person2's death:
      # -- processing_date: |2012-05-20|
      -- couple: test_couple
    }
```
~~~
