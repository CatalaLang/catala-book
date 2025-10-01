# Creating your first Catala program

<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>

Now that you have installed the Catala tooling, you can test its correct
execution with the equivalent of a `Hello, world!` program.

Catala programs are just text files that can be handled by any text editor/IDE.
Hence, to kickstart your Catala development, the Catala teams recommends you
open your favorite text editor.

~~~admonish info title="Text editor/IDE support"
The Catala maintenance team currently only provides full support for the
[VSCode](https://code.visualstudio.com/) text editor (syntax highlighting, language server, formatter).

However
the Catala community has written a [number of plugins for other text editors
and IDEs](https://github.com/CatalaLang/catala/tree/master/syntax_highlighting), whose maintenance is performed on a best-effort basis. Please contribute if you add support to your favorite text editor!
~~~

In your text editor/IDE, create a new folder for your Catala developments (for
instance named `catala`) and inside it an empty text file (for instance named
`hello_world.catala_en`).

## Writing some specifications into a Catala file

Copy paste the following text into your file:

```text
# Catala tutorial

## Hello, world!

Your first Catala program should output the integer `42` as the
Answer to the Ultimate Question of Life, the Universe, and Everything.
```

At this point, your file looks like a regular Markdown file, and does not
contain any Catala source code *per se*. Indeed, as Catala uses [literate
programming](https://en.wikipedia.org/wiki/Literate_programming), any text
inside your file is assumed to be Markdown specification by default. Let's now
see how to actually write some code!

## Writing your first Catala code block

Below the `## Hello, world!` paragraph, open a Markdown code block indicating
the `catala` language:

~~~text
```catala
<you will insert your Catala code here !>
```
~~~

These Catala code blocks can be placed anywhere through the regular Markdown of
your source file. Actually, if you're following the Catala methodology to
translate law into code, your source
file will mostly look like a big Markdown document with lots of little Catala
code blocks interspersed.

~~~admonish danger title="How to make sure your code is not ignored"
Your Catala source code should **always** be placed inside a Catala code block
introduced by a line with `` ```catala `` and ended by a line with `` ``` ``.
Otherwise, the Catala compiler will just ignore your code.
~~~

Now, inside the Catala code block, copy-paste the following:

```catala
declaration scope HelloWorld:
  output answer_everything content integer

scope HelloWorld:
  definition answer_everything equals 42
```

It is not important to understand what this code does now. You will learn about
it later in the the [tutorial](./2-0-tutorial.md).

## Typechecking and running the Catala program

Since Catala is a strongly typed language, you can *typecheck* your program
without running it to see whether there are some syntax or typing errors. This
is done through the `clerk typecheck` command:

```test
$ clerk typecheck hello_world.catala_en
```

The result of this command should be:

```text
┌─[RESULT]─
│ Typechecking successful!
└─
```

If the program typechecks, we can run it through the interpreter contained
inside the `catala` compiler. This is done with the following command, indicating
that we want to run the `--scope` named `HelloWorld` inside the file `hello_world.catala_en`:

```text
$ catala interpret hello_world.catala_en --scope=HelloWorld
```

The result of this command should be, [as it is
customary](https://simple.wikipedia.org/wiki/42_(answer)):

```text
┌─[RESULT]─
│ answer_everything = 42
└─
```

You should now be all set to continue your Catala journey through the
[tutorial](./2-0-tutorial.md)!
