# General questions

~~~admonish info
Portions of these answers are adapted, with permission, from Lawsky, [Coding
the Code: Catala and Computationally Accessible Tax
Law](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4291177), 75 SMU L.
Rev. 535 (2022).
~~~

<div id="tocw"></div>

## What is pair programming for coding the law?

As [the introduction of this book](./0-intro.md) explains, Catala is designed to
be used by teams that have both legal and computational expertise. Pair
programming generally refers to two programmers working together side by side at
the same computer to write computer code. Pair programming for coding the law
does not involve two programmers with similar skills but rather a programmer and
a lawyer, people with different areas of expertise, working side by side to
write computer code that captures as accurately as possible the meaning of the
law. Pair programming with a lawyer and a programmer allows the law to be
encoded without the need for one person to be an expert in both tax law and
coding. Pair programming also improves the quality of code because pair
programming requires the lawyer to explain the law very clearly, so clearly that
a programmer can understand it, and it requires the programmer to be able to
articulate exactly how the computer code matches the law, thus improving
precision and attention to detail for both the law and the code.

## What is literate programming for coding the law?

Literate programming is the idea, first put forward by Donald Knuth, that a
computer program doesn't just communicate to a computer what to do, but also
communicates to the humans reading the program what the program wants the
computer to do. Practically speaking, programs that follow the literate
programming approach include a lot of comments. Literate programming is
especially important in coding the law, beacuse it increases transparency and
shows clearly how the code does (or does not) match up with the law. As
explained in [the first section of the tutorial](./2-1-basic-blocks.md),
literate programming for the law in Catala means that Catala code includes not
only the code that tells the computer what to do, but also the actual statutory
or regulatory language that relates to the code for the computer. This makes it
easier to update the computer code when the law changes. The comments also
include the reasoning behind the decisions of the coding team, including
extra-legal statutory support for the decisions. And the comments also can make
explicit ambiguities the coding team found, and how and why the team chose to
resolve the ambiguities.

## Why shouldn't I use any programming language that I like to code the law?

The question of which programming language to use to code the law is, of course,
a pragmatic question. That Catala can be compiled to other languages, such as
Python, demonstrates that one could code the law and accurately capture its
meaning, in some sense, in many different languages. But Catala has several
advantages for coding law, especially law that is organized as general rules
followed by exceptions, as many laws are.

First, a program in Catala mimics the structure of legal thinking by listing the
relevant parties, structures, and variables first. Items are named before they
are used, which allows humans looking at the computer code to identify relevant
concepts before applying them. Second, Catala allows the programmer to easily
define a scope over which various rules and definitions apply, consistent with
the law's approach of having provisions that apply only to "this chapter," "this
section," and so forth.

Additionally, and most importantly, as described in [the second section of the
tutorial](./2-2-conditionals-exceptions.md), the semantics of Catala are based
on a logic of general rules and exceptions ("prioritized default logic"). The
structure of Catala programs can therefore closely track the structure of the
law itself, if the law is organized as general rules followed by exceptions.
This makes it easier to code the law; because the underlying logic tracks the
statute, the default logic translation can simply follow the statute itself. And
if the statute changes, it will be easier to change the Catala code than it
would be to change code that did not follow the structure of the statute.
Because Catala allows for exceptions that override more general rules,
formalizing in Catala allows separate sections and subsections of the law to
remain separate. Drafting is more modular and allows coders to swap new law in
and old law out more easily.

Finally, Catala programs can be formally verified because Catala has a well-defined
[formal semantics](https://dl.acm.org/doi/10.1145/3473582).

## Can we use large language models (LLMs) to translate the law into code?

Whether large language models (LLMs) can be used to translate the law into code
is an open research question that various people have been pursuing, without
great success at this point. Legal language is complex and not like "regular"
language. Even beyond that, though, coding law is more than just
straightforwardly "translating" statutory language into computer code. The law
encompasses more than just the language of a statute. Coding law may, for
example, require resolving ambiguities present in statutory text, or
incorporating regulations or practices outside the statute. Translating law into
code also requires precision, accuracy, and accountability, all of which are, at
the time of this writing, in tension with using LLMs.

## Can every law be formalized?

In some sense not particularly interesting sense, every law can be formalized.
But at least when it comes to formalizing law with Catala, not every law is
*usefully* formalized. Laws where the effort of formalization pays off
conconcretely tend to be rule-heavy, complex laws, perhaps involving many
numerical computations, and, to really take advantage of all that Catala has to
offer, structured as general rules followed by exceptions.

Formalizing law also has impact on how it is enforced, and on the Rule of Law at
large. See the output of the [COHUBICOL](https://www.cohubicol.com/) research
group for more detail.
