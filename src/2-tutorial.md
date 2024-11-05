# Tutorial : computing your taxes

Welcome to this tutorial, whose objective is to guide you through the features
of the Catala language and teach you how to annotate a simple legislative text
using the language, and get out an executable program that compute your taxes!

This tutorial does not cover the installation of Catala. For more information
about this to the [Getting started chapter](./1-0-getting_started.md). If you
want follow this tutorial locally, simply create an empty file with the
extension `.catala_en`, which you will be filling as you read the tutorial by
copy-pasting the relevant section. This tutorial itself is written as a Catala
program, whose source code is [available
online](https://github.com/CatalaLang/catala-book/blob/main/src/2-tutorial.md).

## Literate programming

To begin writing a Catala program, you must start from the text of the
legislative source that will justify the code that you will write. Concretely,
that means copy-pasting the text of the law into a Catala source file and
formatting it according so that Catala can understand it. Catala source files
have the ".catala_en" extension. If you were to write a Catala program for a
French law, you would use the ".catala_fr" extension; for Polish law,
"catala_pl", etc.

You can write any kind of plain text in Catala, and it will be printed as is
in PDF or HTML output. You can split your text into short lines of less than
80 characters, terminal-style, and those will appear as a single paragraph
in the output. If you want to create a new paragraph, you have to leave a blank
line in the source. The syntax for non-code text in a Catala program follows
a subset of Markdown that supports titles and Catala block codes.

Catala allows you to declare section or subsection headers as it is done
here, with the "#" symbol. You can define heading of lower
importance by adding increasing numbers of "#" after the title of the heading.
Generally, the literate programming syntax of Catala follows the syntax of
Markdown (though it does not have all of its features).

In the rest of this tutorial, we will analyze a fictional example that
defines an income tax. This income tax is defined through several articles
of law, each of them introduced by a header. Here is the first one:

### Article 1 of Your Own Tax Code (YOTC)

The income tax for an individual is defined as a fixed percentage of the
individual's income over a year.

```catala
# We will soon learn what to write here in order to translate the meaning
# of the article into Catala code.

# To create a block of Catala code in your file, bound it with Markdown-style
# "```catala" and "```" delimiters.

declaration structure Thing:
  data foo content integer
```

To translate that fictional income tax definition into a Catala program,
we will intertwine short snippets of code between the sentences of
the legislative text. Each snippet of code should be as short as possible and
as close as possible to the actual sentence that justifies the code. This style
is called literate programming, a programming paradigm invented by the famous
computer scientist Donald Knuth in the 70s.
