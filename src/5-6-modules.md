# Modules

<div id="tocw"></div>

After [scopes and toplevel declarations](./5-3-scopes-toplevel.md), modules are
the second abstraction level in Catala. Precisely, modules are simply a group of
scopes and toplevel declarations that form a separate compilation unit for the
Catala compiler. As such, they present a public interface or API, whose elements
can be referred to or called at runtime by another module.

## Module declarations

A Catala source file can be turned into a module by inserting at the top a
module declaration. For instance, if the file is named `foo.catala_en`,
the module declaration is simply:

```catala-en
> Module Foo
```

The name of the file and the name of the module in the module declaration
should match, but differences in casing are allowed as module names have to be
in CamlCase and file names are usually snake_case.

~~~admonish danger title="Don't forget the module declaration !"
If you forget to put `> Module Foo` at the top of your file, the file will
not be considered as a module by the `clerk` build system. In particular,
you will not be able to call functions of this file from other modules.
~~~

## Imports

Modules can "use" other modules to import their public types, scopes and
constants. If you want to use module `Bar` inside module `Foo`, the top of
`foo.catala_en` should look like:

```catala-en
> Module Foo

> Using Bar
```

You can then refer to types, scopes and constants like of `Bar` like `Fizz` with
`Bar.Fizz` inside `Foo`. If you don't want to type in `Bar.` each time, you can
give `Bar` an alias inside `Foo` with:

```catala-en
> Module Foo

> Using Bar as B
```

Then, `B.Fizz` will refer to `Bar.Fizz`.

## Inclusions

Sometimes, the legal text and Catala code that have to fit inside a single
module are too big for one file. That is generally the case when the legal
specification for a given scope spans multiple legal sources that have
mutual references between them. In these cases, you want each legal source
to have its own `.catala_en` file, while the scope implementation and encompassing
module to span all these files.

To accommodate this practice, Catala has a mechanism of textual inclusion that
lets you include the contents of one file in another. For instance, imagine
the module in the file `benefit.catala_en` draws its implementation from the
files `benefit_law.catala_en`, `benefit_regulation.catala_en`, and `benefit_instructions.catala_en`.

Then, the contents of `benefit.catala_en` should look like this to include
all the other files:

```catala-en
> Module Benefit

> Include: benefit_law.catala_en
> Include: benefit_regulation.catala_en
> Include: benefit_instructions.catala_en
```

The order of the `> Include` statements in `benefit.catala_en` will determine
the order in which the contents of the file are copies over. While this order
has no influence over the semantic of the computation, it will change how things
are printed in the [literate programming](./5-1-literate-programming.md)
backends.

What comes after the `Include:` is actually a Unix-style file path, that can
refer to sub-directories or the parent directory (`../`).

## Public interface and visibility

The Catala team believes that programmers should control precisely which interface they
make publicly available for their modules. Indeed, not exposing internal
functions is the key the preserve the ability to refactor the code later
without breaking the endpoints used by the clients of the module.

This is the reason why in Catala, all the type, scope and constant declarations
inside `` ```catala `` blocks are private: they will not be accessible by other
modules. To make a type, scope or constant declaration public and therefore
accessible by other modules, you need to turn the containing `` ```catala ``
block into a `` ```catala-metadata `` block. That's all!
