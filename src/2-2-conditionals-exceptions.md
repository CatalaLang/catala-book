# Conditional definitions and exceptions

In this section, the tutorial introduces the killer feature of Catala
when it comes to coding the law: exceptions in the definitions of variables.
By the end of the section, you should understand the behavior of computations
involving exceptions, and be able to structure groups of variable definitions
according to their exceptional status and relative priority.

~~~admonish info collapsible=true title="Recap of the previous section"
This section of the tutorial builds up on the [previous one](2-1-basic-blocks.md),
and will reuse the same running example, but all the Catala code necessary
to execute the example is included below for reference.

 ```catala
declaration structure Individual:
  data income content money
  data number_of_children content integer

 declaration scope IncomeTaxComputation:
   input individual content Individual
   internal fixed_percentage content decimal
   output income_tax content money
 ```

 #### Article 1

 The income tax for an individual is defined as a fixed percentage of the
 individual's income over a year.

 ```catala
 scope IncomeTaxComputation:
   definition income_tax equals
     individual.income * fixed_percentage
 ```

 #### Article 2

 The fixed percentage mentioned at article 1 is equal to 20 %.

 ```catala
 scope IncomeTaxComputation:
   definition fixed_percentage equals 20 %
 ```
~~~

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
`fixed_percentage`? Catala allows you precisely to redefine a variable under a
condition with the `under condition ... consequence` syntax:

~~~admonish note title="Defining a variable conditionally"
```catala
scope IncomeTaxComputation:
  definition fixed_percentage under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```
~~~

What does this mean? If the individual has more than two children, then
`fixed_percentage` will be `15 %`. Conditional definitions let you define
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
│     │   definition fixed_percentage equals 20 %
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
times. Here, however, our definition of `fixed_percentage` conflicts with the
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
  exception definition fixed_percentage under condition
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
  exception definition fixed_percentage under condition
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
  label article_2 definition fixed_percentage equals 20 %
```

#### Article 3

If the individual is in charge of 2 or more children, then the fixed
percentage mentioned at article 1 is equal to 15 %.

```catala
scope IncomeTaxComputation:
  label article_3 exception article_2 definition fixed_percentage under condition
    individual.number_of_children >= 2
  consequence equals 15 %
```

#### Article 4

Individuals earning less than $10,000 are exempted of the income tax mentioned
at article 1.

```catala
scope IncomeTaxComputation:
  label article_4 exception article_3 definition tax_rate under condition
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

## Trees of exceptions

It may be difficult to see why some legal situations may lead to different
branches of exceptions. Let us provide an example with a new article of the CTTC:

~~~admonish quote title="Article 5"
Individuals earning more than $100,000 are subjects to a tax rate of
30%, regardless of their number of children.

```catala
scope IncomeTaxComputation:
  label article_5 exception article_3 definition fixed_percentage under condition
    individual.income > $100,000
  consequence equals 30 %
```
~~~

Now, article 3 has two exceptions : article 4, and article 5. These two exceptions have the following conditions:
* **Article 4**: income less than $10,000 ;
* **Article 5**: income more than $100,000.


## Grouping definitions together

<!--
So far, the exceptional definition has been simply declared with the `exception`
keyword. That keyword alone suffices because there is only one base case that
the `exception` is refering to. However, sometimes the specification implicitly
sets up more complex exception patterns:

> #### Article 6
>
> Individuals earning less than $10,000 are exempted of the income tax mentioned
> at article 1.

At a first glance, this Article 6 merely defines another exceptional conditional
definition for variable `income_tax` of scope `IncomeTaxComputation`. But this
third exception is likely to conflict with the first one when the individual
earns less than $10,000, and has zero children! If such a conflict between
exceptions were to happen, the Catala program would crash with an error message
similar to the one we already saw when programming Article 3:

```text
┌─[ERROR]─
│
│  During evaluation: conflict between multiple valid consequences for assigning the same variable.
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals two_brackets.tax_formula of individual.income
│     │                      ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
├─ Article 5
│
├─➤ tutorial_en.catala_en
│     │
│     │   consequence equals $0
│     │                      ‾‾
└─ Article 6
```

In this situation, we need to prioritize the exceptions. This prioritization
requires legal expertise and research, as it is not always obvious which
exception should prevail in any given situation. Hence, Catala error messages
indicating a conflict during evaluation are an invitation to call the lawyer in
your team and have them interpret the specification, rather than fixing the
conflict yourself.

Here, because Article 6 follows Article 5, and because it is more favorable to
the taxpayer to pay $0 in tax rather than the result of the two-brackets
computation, we can make the legal decision to prioritize the exception of
Article 6 over the exception of Article 5. Now, let us see how to write that
with Catala. Because Article 1 is the base case for the exception of Article 5,
and Article 5 is the base case for the exception of Article 6, we need to give
the definitions of `income_tax` at Articles 1 and 5 labels so that the
`exception` keywords in Article 5 and 6 can refer to those labels:

> #### Article 1
>
> The income tax for an individual is defined as a fixed percentage of the
> individual's income over a year.
>
> ```catala
> scope IncomeTaxComputation:
>   label article_1 definition income_tax equals
>     individual.income * fixed_percentage
> ```
> #### Article 5
>
> For individuals in charge of zero children, the income
> tax of Article 1 is defined as a two-brackets computation with rates 20% and
> 40%, with an income breakpoint of $100,000.
>
> ```catala
> scope IncomeTaxComputation:
>   label article_5 exception article_1
>   definition income_tax under condition
>     individual.number_of_children = 0
>   consequence equals two_brackets.tax_formula of individual.income
> ```
>
> #### Article 6
>
> Individuals earning less than $10,000 are exempted of the income tax mentioned
> at article 1.
>
> ```catala
> scope IncomeTaxComputation:
>   exception article_5 definition income_tax under condition
>     individual.income <= $10,000
>   consequence equals $0
> ```

At runtime, here is how Catala will determine which of the three definitions
to pick for `income_tax`: first, it will try the most exceptional
exception (Article 6), and test whether the income is below $10,000;
if not, then it will default to the exception level below (Article 5),
and test whether there are no children; if not, it will default to the
base case (Article 1).

This scenario defines an "exception chain", but it can get more complex than
that. Actually, Catala lets you define "exception trees" as big as you want,
simply by providing `label` and `exception` tags that refer to each other
for your conditional definitions. This expressive power will help you tame
the complexity of legal specifications and keep your Catala code readable
and maintainable. -->
