# Literate programming and basic syntax


<div id="tock" data-block_title="Features"></div>
<div id="tocw"></div>

~~~admonish info title="Catala uses Pandoc's Markdown"
Catala source code files should be interpretable as Markdown files.
Specifically, Catala's Markdown syntax is aligned on the [Pandoc](https://pandoc.org/MANUAL.html#pandocs-markdown)
markdown syntax.
~~~

## Literate programming

### Weaving and tangling

[Literate programming](https://en.wikipedia.org/wiki/Literate_programming)
mixes the source code and its documentation in the same document. A Catala
source file thus contains both Catala code and the text of the legal
specification for this code.

To execute the code or compile to a target programming language, the Catala
compiler simply ignores all legal specification text from the source file
and picks only the source code. This is called _tangling_.

But you might also want to produce a human-readable (or even lawyer-readable)
comprehensive document about the program and its specification. The Catala
compiler and build system also lets you do that, see the [build system reference](./6-clerk.md)
for more information. This is called _weaving_.

### Free text and paragraphs

If you simply put some text in your Catala source code file, it will be
interpreted as free text and ignored as source Catala code. This free text mode
is meant for you to copy-paste the legal specifications of your Catala program.
These specifications will be the basis of your program, as you will annotate
them with [Catala code
blocks](./5-1-literate-programming.md#catala-code-blocks).

Free text follows the classic Markdown syntax: you need to leave a blank line to
introduce a new paragraph.

~~~markdown
This is a first paragraph of free text.
This sentence will be rendered on the same line as the one before.

This sentence begins a new paragraph after a line jump.
~~~

### Headers

A Markdown document is organized thanks to a hierarchy of headers, each
introduced by `#`. The more `#` a header has, the more deep it is into
the plan of the document. Use these headers to replicate the hierarchical
structure of legal documents (sections, articles, etc.); each paragraph
of the legal specification should have a header specifying its title.

```markdown
# Title of the document

## First section

### Article 1

...

## Second section

### Article 2

...

### Article 3

...
```

Indeed, the Catala compiler will keep track of these headers to enrich the
source code positions used in error messages, debugging and explanations
interfaces.

### Other Markdown features

For styling (bold, italics), tables, links, etc., you can use all the Markdown
features supported by [Pandoc](https://pandoc.org/MANUAL.html#pandocs-markdown).

## Basic syntax principles

### Catala code blocks

All the Catala source code must be contained inside a Catala code block.
A Catala code block looks like this inside your source file:

~~~markdown
```catala
<your code goes here>
```
~~~

In general, Catala source code does not care about line jumps, tabs and spaces;
you can organize your code however you like. However, this syntax for opening and
closing Catala code blocks is very strict and should be strictly enforce.

~~~admonish danger title="Watch out for these syntax mistakes that will generate hard-to-debug errors"
* The opening `` ```catala `` should be at the beginning of a new line (no space before `` ```catala ``).
* Do not put a space between `` ``` `` and `catala`.
* Always put a new line after `` ```catala ``.
* Always put the closing `` ``` `` alone on a new line.
* Always put a new line after the closing `` ``` ``.
* You cannot nest code blocks, *i.e.* an opening `` ```catala `` should
  always be closed by a closing `` ``` `` without opening new code blocks
  in between.
~~~

### Comments inside Catala code blocks

Inside Catala code block, you can comment your code by prefixing lines with
`#`. Comments will be ignored by the compiler at runtime but weaved into
the documentation like legal specifications in free text mode.

### Reserved keywords

Certain words are reserved in Catala for keywords and thus cannot be
used a variable names. If you try, you will get a confusing syntax error
because Catala will believe that you tried to use the keyword instead of the
variable name.

The reserved keywords in Catala are :


* `scope`
* `consequence`
* `data`
* `depends on`
* `declaration`
* `context`
* `decreasing`
* `increasing`
* `of`
* `list of`
* `contains`
* `enumeration`
* `integer`
* `money`
* `text`
* `decimal`
* `date`
* `duration`
* `boolean`
* `sum`
* `fulfilled`
* `definition`
* `state`
* `label`
* `exception`
* `equals`
* `match`
* `anything`
* `with pattern`
* `under condition`
* `if`
* `then`
* `else`
* `condition`
* `content`
* `structure`
* `assertion`
* `with`
* `for`
* `all`
* `we have`
* `rule`
* `let`
* `exists`
* `in`
* `among`
* `combine`
* `map each`
* `to`
* `such`
* `that`
* `and`
* `or`
* `xor`
* `not`
* `maximum`
* `minimum`
* `is`
* `or if list empty`
* `but replace`
* `initially`
* `number`
* `year`
* `month`
* `day`
* `true`
* `false`
* `input`
* `output`
* `internal`
* `round`
* `get_day`
* `get_month`
* `get_year`
* `first_day_of_month`
* `last_day_of_month`


### Textual inclusion

While a Catala [module](./5-6-modules.md) should be contained in one file,
sometimes legal specifications are very large and it is impossible to
break them down into logically-independent modules: the law is a big ball
of spaghetti code. In those case, it would be unfair to force you to
have gigantic Catala source files to represent one module.

Hence, Catala has a textual inclusion feature. It works like this. If, inside
`foo.catala_en`, you put (in free text mode, not inside a Catala code block):

```markdown
> Include: bar.catala_en
```

Then, the weaving and tangling will work as if you had copy-pasted the contents
of `bar.catala_en` inside `foo.catala_en` at the location where the `> Include`
is.

~~~admonish tip title="How to split big module into multiple included files"
Typically, you want to implement all the provisions for the computation
of a tax. These provisions are split across a statute, a regulation and
a court case. Each of these specify a part of the computation, so they
need to be inside the same Catala module. However, you can use the textual
inclusion mechanism to split your implementation into four different files
mirroring the different sources of the specification: `tax.catala_en`,
`statute.catala_en`, `regulation.catala_en` and `court_case.catala_en`.

`tax.catala_en` will be the master file listing the other ones:

```
# Tax computation

> Include: statute.catala_en
> Include: regulation.catala_en
> Include: court_case.catala_en
```

Then, you can copy-paste the legal specification into `statute.catala_en`,
`regulation.catala_en` and `court_case.catala_en`, starting with `##` headers
in each of those files because `tax.catala_en` already features the toplevel `#`
header.
~~~
