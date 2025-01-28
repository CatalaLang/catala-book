# Conditional definitions and exceptions

In this section, the tutorial introduces the killer feature of Catala
when it comes to coding the law: exceptions in the definitions of variables.
By the end of the section, you should understand the behavior of computations
involving exceptions, and be able to structure groups of variable definitions
according to their exceptional status and relative priority.

~~~~~~admonish info collapsible=true title="Recap of the previous section"
This section of the tutorial builds up on the [previous one](./2-1-basic-blocks.md),
and will reuse the same running example, but all the Catala code necessary
to execute the example is included below for reference.

~~~
```catala
declaration structure Individual:
  data income content money
  data number_of_children content integer

declaration scope IncomeTaxComputation:
   input individual content Individual
   internal tax_rate content decimal
   output income_tax content money
```

## Article 1

The income tax for an individual is defined as a fixed percentage of the
individual's income over a year.

```catala
scope IncomeTaxComputation:
  definition income_tax equals
    individual.income * tax_rate
```

## Article 2

The fixed percentage mentioned at article 1 is equal to 20 %.

```catala
scope IncomeTaxComputation:
  definition tax_rate equals 20 %
```

## Test

```catala
declaration scope Test:
  output computation content IncomeTaxComputation

scope Test:
  definition computation equals
    output of IncomeTaxComputation with {
      -- individual:
        Individual {
          -- income: $20,000
          -- number_of_children: 0
        }
    }
```
~~~
~~~~~~

## Conditional definitions and exceptions

Specifications coming from legal text do not always
neatly divide up each variable definition into its own article. Sometimes, and this
is a very common pattern, a later article redefines a variable already
defined previously, but with a twist in a certain exceptional situation.
For instance, Article 3 of CTTC:

~~~admonish quote title="Article 3"
If the individual is in charge of 2 or more children, then the fixed
percentage mentioned at article 1 is equal to 15 %.
~~~

This article actually gives another definition for the fixed percentage, which
was already defined in article 2. However, article 3 defines the percentage
conditionally to the individual having more than 2 children. How to redefine
`tax_rate`? Catala allows you precisely to redefine a variable under a
condition with the `under condition ... consequence` syntax between the name
of the variable being defined and the `equals` keyword:

~~~admonish note title="Defining a variable conditionally"
```catala
scope IncomeTaxComputation:
  definition tax_rate under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```
~~~

What does this mean? If the individual has more than two children, then
`tax_rate` will be `15 %`. Conditional definitions let you define
your variables piecewise, one case at a time; the Catala compiler stitches
everything together for execution. More precisely, at runtime, we look at
the conditions of all piecewise definitions for a same variable, and pick
the one that is valid.

~~~admonish warning title="Conflict between definitions"
But what happens if no conditional definition is valid at runtime? Or multiple
valid definitions at the same time? In these cases, Catala will abort
execution and return an error message like the one below:

```text
┌─[ERROR]─
│
│  During evaluation: conflict between multiple valid consequences for assigning the same variable.
│
├─➤ tutorial_en.catala_en
│     │
│     │   definition tax_rate equals 20 %
│     │                                      ‾‾‾‾
├─ Article 2
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals 15 %
│     │                      ‾‾‾‾
└─ Article 3
```
~~~

If the specification is correctly drafted, then these error situations should
not happen, as one and only one conditional definition should be valid at all
times. Here, however, our definition of `tax_rate` conflicts with the
more general definition that we gave above. To correctly model situations like
this, Catala allows us to define precedence of one conditional definitions
over another. It is as simple as adding `exception` before the definition.
For instance, here is a more correct version of the code for Article 3:

~~~admonish quote title="Article 3"
If the individual is in charge of 2 or more children, then the fixed
percentage mentioned at article 1 is equal to 15 %.
~~~

~~~admonish note title="Defining an exception for a variable"
```catala
scope IncomeTaxComputation:
  exception definition tax_rate under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```
~~~

With `exception`, the conditional definition at Article 3 will be picked over
the base case at Article 1 when the individual has two children or more. This
`exception` mechanism is modeled on the logic of legal drafting: it is the key
mechanism that lets us split our variables definition to match the structure of
the specification. Without `exception`, it is not possible to use the literate
programming style. This is precisely why writing and maintaining computer
programs for taxes or social benefits is very difficult with mainstream
programming languages. So, go ahead and use `exception` as much as possible,
since it is a very idiomatic Catala concept.

~~~admonish question title="How are exceptions computed?"
When defining exceptions in your Catala code, it is importand to understand
precisely their underlying *semantics*, *i.e.* what will be the end result
of the computation. The semantics of Catala are [formally defined](https://dl.acm.org/doi/10.1145/3473582)
and based on [prioritized default logic](https://link.springer.com/content/pdf/10.1007/978-94-015-9383-0_3?pdf=chapter%20toc),
which translates intuitively to the following algorithm describing how to compute exceptions:

1. Gather all definitions (conditional or not) for a given variable;
2. Among these definitions, check all that apply (whose conditions evaluate to `true`):
    - If no definition apply, the program crashes with an error ("no definitions apply");
    - If only one definition applies, then pick it and continue the execution of the program;
    - If multiple definitions apply, then check their priorities:
        * If there exists one definition that is an exception to all the
          others that apply, pick it and continue the execution of the program;
        * Otherwise, the program crashes with an error ("conflicting definitions").
~~~

As described above, putting `exception` in a Catala program alters the behavior
of the program, by providing a priority between conditional definitions of a
variable that Catala can use at execution time when hesitating between multiple
definitions that apply at the same time. So far, we have seen a very simple
situation with one base definition (in Article 2) and a single exception (in
Article 3). But the `exception` mechanism can be much broader and help set
different priority lines among dozens of different conditional definitions for a
same variable. Let us explore this mechanism on a more complex example.

## Dealing with multiple exceptions

It is frequent in legal text that an article setting up a general rule is
followed by multiple articles defining exceptions to the base rule. Additionally
to article 3 and the reduced tax rate for large families, the CTTC (Catala
Tutorial Tax Code) indeed defines a tax exemption for low-income individuals,
that we can encode as another exception to the definition of the tax rate in
article 2:


~~~admonish quote title="Article 4"
Individuals earning less than $10,000 are exempted of the income tax mentioned
at article 1.

```catala
scope IncomeTaxComputation:
  exception definition tax_rate under condition
    individual.income <= $10,000
  consequence equals 0 %
```
~~~

But then, what happens when testing the code with an individual that earns
less than $10,000 and has more than 2 children?

~~~admonish bug title="Conflicting definitions"
The program execution yields the following error at runtime:

```text
┌─[ERROR]─
│
│  During evaluation: conflict between multiple valid consequences for assigning the same variable.
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals 15 %
│     │                      ‾‾‾‾
├─ Article 3
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals 0 %
│     │                      ‾‾‾
└─ Article 4
```

In this situation, both conditional definitions from article 3 and article 4
apply, but also the base definition from article 2. We know article 3 and article
4 are exceptions to article 2, hence they both have priority over it. But
we don't know which definition has priority between article 3 and article 4,
hence the error message above!
~~~

In this situation, we need to prioritize the exceptions between each other.


~~~admonish warning title="Prioritizing exceptions is a legal act of interpretation"
The prioritization of exceptions requires legal expertise and research, as it
is not always obvious which exception should prevail in any given situation.
Hence, Catala error messages indicating a conflict during evaluation are an
invitation to call the lawyer in your team and have them interpret the
specification, rather than fixing the conflict yourself.
~~~

Here, because article 4 follows article 3, and because it is more favorable to
the taxpayer to pay $0 in tax rather than 15 % of their income, we can make the
legal decision to prioritize the exception of article 4 over the exception of
article 3. Now, let us see how to write that with Catala. Because article 2 is
the base case for the exception of article 3, and article 3 is the base case for
the exception of Article 4, we need to give the definitions of `tax_rate` at
articles 2 and 3 an explicit `label` so that the `exception` keywords in article
3 and 4 can refer to those labels:

~~~admonish note title="Pointing exceptions to specific labels"
#### Article 2

The fixed percentage mentioned at article 1 is equal to 20 %.

```catala
scope IncomeTaxComputation:
  # The keyword "label" introduces the name of the label itself, here
  # "article_2".
  label article_2 definition tax_rate equals 20 %
```

#### Article 3

If the individual is in charge of 2 or more children, then the fixed
percentage mentioned at article 1 is equal to 15 %.

```catala
scope IncomeTaxComputation:
  # This definition is preceded by two indications:
  # * it has its own label, "article_3";
  # * this definition is an exception to the definition labeled "article_2".
  label article_3 exception article_2
  definition tax_rate under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```

#### Article 4

Individuals earning less than $10,000 are exempted of the income tax mentioned
at article 1.

```catala
scope IncomeTaxComputation:
  label article_4 exception article_3
  definition tax_rate under condition
    individual.income <= $10,000
  consequence equals 0 %
```
~~~

Thanks to labels, we can define *chains* of exceptions, where each definition is
the exception to the previous one, and the base case for the next one. This
pattern is the most usual in legal texts, and its behavior is straightfoward:
when multiple definitions apply, pick the one with the highest priority in the
chain. But sometimes, it's not possible to arrange exceptions in a chain,
since legal interpretation leads to different *branches* of exceptions.

## Branches of exceptions

It may be difficult to see why some legal situations may lead to different
branches of exceptions. Let us provide an example with a new article of the CTTC:

~~~admonish quote title="Article 5"
Individuals earning more than $100,000 are subjects to a tax rate of
30%, regardless of their number of children.

```catala
scope IncomeTaxComputation:
  label article_5 exception article_3
  definition tax_rate under condition
    individual.income > $100,000
  consequence equals 30 %
```
~~~

Now, article 3 has two exceptions : article 4, and article 5. These two exceptions have the following conditions:
* **Article 4**: income less than $10,000 ;
* **Article 5**: income more than $100,000.

~~~admonish tip title="Displaying the exception branches" collapsible=true
As the codebase grows, it becomes more and more difficult to visualized all
the conditional definitions of a variable as well as the prioritization between
them. To help, the Catala compiler can display the exception branches with
the following command:

```text
$ catala exceptions tutorial.catala_en --scope=IncomeTaxComputation --variable=tax_rate
┌[RESULT]─
│ Printing the tree of exceptions for the definitions of variable "tax_rate" of scope "IncomeTaxComputation".
└─
┌─[RESULT]─
│ Definitions with label "article_2":
│
├─➤ tutorial.catala_en
│    │
│    │   label article_2 definition tax_rate equals 20 %
│    │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
└─ Title
   └─ Article 2
┌─[RESULT]─
│ Definitions with label "article_3":
│
├─➤ tutorial.catala_en
│    │
│    │   label article_3 exception article_2 definition tax_rate under condition
│    │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
└─ Title
   └─ Article 3
┌─[RESULT]─
│ Definitions with label "article_4":
│
├─➤ tutorial.catala_en
│    │
│    │   label article_4 exception article_3 definition tax_rate under condition
│    │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
└─ Title
   └─ Article 4
┌─[RESULT]─
│ Definitions with label "article_5":
│
├─➤ tutorial.catala_en
│    │
│    │   label article_5 exception article_3 definition tax_rate under condition
│    │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
└─ Title
   └─ Article 5
┌─[RESULT]─
│ The exception tree structure is as follows:
│
│ "article_2"───"article_3"──┬──"article_5"
│                            │
│                            └──"article_4"
└─
```
~~~

Theoretically, since the exceptions of article 4 and article 5 are not
prioritized with each other, they could both apply at the same time and
conflict. However, since the income cannot be both less than $10,000 and greater
than $100,000, the conflict cannot happen in practice. Hence, it is not
necessary to prioritize the two exceptions, since they live in mutually
exclusive conditional branches. It is then possible to extend these branches
separately, for instance with a new article of the CTTC:

~~~admonish quote title="Article 6"
In the overseas territories, the tax rate for individuals earning
more than $100,000 specified at article 5 is reduced to 25 %.
~~~

This article introduces a new bit of information about the tax computation:
are we in an overseas territory or not? We can model it with a new input to the
scope `IncomeTaxComputation`, leading to a revised scope declaration:

~~~admonish quote title="Revised scope declaration"
```catala
declaration scope IncomeTaxComputation:
   input individual content Individual
   input overseas_territories content boolean
   internal tax_rate content decimal
   output income_tax content money
```
~~~

With this new input variable, the code for article 6 is as follows:

```catala
scope IncomeTaxComputation:
  label article_6 exception article_5
  definition tax_rate under condition
    individual.income > $100,000 and overseas_territories
  consequence equals 25 %
```

~~~admonish danger title="Exceptions do not inherit conditionals from their base case"
Note that in the condition for defining `tax_rate` in article 6, we
have repeated the condition `individual.income > $100,000` in conjunction
with the new clause `overseas_territories`. In our fictional CTTC, the text
of article 6 is gently worded and explicitly reminds us that this exception
to article 5 only applies in the situations that also trigger article 5 (where
the income is greater than $100,000).

However, the legal text can sometimes omit this key information, or make it
implicit, creating a danger of putting the wrong conditional in the Catala
code in presence of exception branches. Suppose we had ommitted the income
condition in the code for article 6:

```catala
scope IncomeTaxComputation:
  label article_6 exception article_5
  definition tax_rate under condition
    overseas_territories
  consequence equals 25 %
```

With this code, the article 6 definition would have applied in overseas
territories for all individuals, including those earning less than $100,000!
Indeed, exceptional definitions in Catala do not inherit the conditions of
their base case: the condition of article 6 does not inherit the condition
of article 5, we need to repeat it in article 6 if we want to have the correct
activation pattern.
~~~

Finally, we can recap the collection of exception branches as a tree of
exceptions for our example:

```text
"article_2"───"article_3"──┬──"article_5"───"article_6"
                           │
                           └──"article_4"
```


## Grouping conditional definitions together for exceptions

So far, we have seen how to define exception chains and mutually exclusive
exception branches. But there is a very common pattern that introduces
yet another exceptional shenanigan. Suppose than in the year 2000, a big tax
reform changes the base taxation rate of article 2 with a slight increase:

~~~admonish quote title="Article 2 (new version after 2000)"
The fixed percentage mentioned at article 1 is equal to 21 % %.
~~~

Now, there are several strategies to deal with legal updates in Catala, that
are summed up in the [how to section of this book](./4-1-design.md). But here,
we'll suppose that we want both versions of the law (before and after 2000)
to coexist in the same Catala program. This choice leads us to introduce the
current date as a new input of the scope `IncomeTaxComputation`:

~~~admonish quote title="Revised scope declaration"
```catala
declaration scope IncomeTaxComputation:
   input current_date content date
   input individual content Individual
   input overseas_territories content boolean
   internal tax_rate content decimal
   output income_tax content money
```
~~~

This `current_date` variable will allow us to introduce mutually exclusive
conditional definitions for the two different verions of article 2, each one
activating only before of after the year 2000. Note that is the two definitions
of article 2 were not mutually exclusive, they could conflict with each other,
forcing you to prioritize between them and change the shape of the overall
exception tree by introducing another layer of exception. However, we want in
this cas those two base definitions of article 2 to collectively be the base
case for all subsequent exceptions in the exception tree of `tax_rate`! In a
nutshell, we want the following exception tree:

```text
"article_2" (before 2000)┬───"article_3"──┬──"article_5"───"article_6"
"article_2" (after 2000) ┘                │
                                          └──"article_4"
```

Catala is able to represent this exception tree, by grouping together
the two conditional definitions to article 2. Indeed, since article 3
is an exception to the label `article_2`, it suffices to give the same label
`article_2` to the two conditional definitions of the two versions of `article_2`:

~~~admonish note title="Grouping mutually exclusive conditional definitions"
#### Article 2 (new version before 2000)

The fixed percentage mentioned at article 1 is equal to 20 %.

```catala
scope IncomeTaxComputation:
  label article_2 definition tax_rate under condition
    current_date < |2000-01-01|
  consequence equals 20 %
```

#### Article 2 (new version after 2000)

The fixed percentage mentioned at article 1 is equal to 21 % %.

```catala
scope IncomeTaxComputation:
  # Simply use the same label "article_2" as the previous definition to group
  # them together
  label article_2 definition tax_rate under condition
    current_date >= |2000-01-01|
  consequence equals 21 %
```
~~~

By using the definition grouping mechanism along with exception branches,
Catala is able to express a wide range of legal text logic, and helps keeping
the code alongside its specification.

## Checkpoint

This concludes the second section of the tutorial. In Catala, variables can be
defined piece-wise, each piece of definition being activate by a condition. When
multiple conditions apply, one can prioritize the conditional definitions using
the `exception` and `label` keywords to form exception trees able to capture the
complex logic behind the legal texts while conserving the same structure as
them.
