# Attributes

<div id="tocw"></div>


The language can be extended with attributes, enabling a variety of extensions.
An attribute is of the form `#[key.of.extension]` or `#[key.of.extension = VALUE]`,
where `VALUE` can be of the form `"STRING"`, or an expression in Catala syntax.
An attribute is always bound to the element directly following it, for instance,
the following binds the `doc` attribute to the `input` variable `children_of_age`
in scope `SomeComputation`:

```catala-code-en
declaration scope SomeComputation:
  #[doc = "Enter the number of children satisfying the condition XXX"]
  input children_of_age content integer
```

## Built-in attributes

Some attributes affect the Catala tooling and have built-in support;
they are all listed below. The table lists which attribute has an effect
on which part of the Catala tooling.

| Attribute                               | Attached to               | Interpreter | Generated code | Test editor UI | JSON Schema |
|-----------------------------------------|---------------------------|:-----------:|:--------------:|:--------------:|:-----------:|
| `#[test]`                               | Scope declarations        | ✅          | ✅             | ✅             |             |
| `#[doc = "..."]` or `##`                | Anything                  |             | ✅             |                | ✅          |
| `#[description = "..."]`                | Anything                  |             |                | ✅             |             |
| `#[error.message = "..."]`              | `impossible`, `assertion` | ✅          | ✅             |                |             |
| `#[debug.print = "..."]`                | Any expression            | ✅          |                |                |             |
| `#[implicit_position_argument]`         | Function declarations     | ✅          | ✅             |                |             |
| `#[json = "..."]`                       | External expression       | ✅          | ✅             |                |             |
| `#[testcase.testui]`                    | Test scope declaration    |             |                | ✅             |             |
| `#[testcase.test_title = "..."]`        | Test scope declaration    |             |                | ✅             |             |
| `#[testcase.uid = "..."]`               | Any expression            |             |                | ✅             |             |
| `#[testcase.array_item_label = "..."]`  | Array items               |             |                | ✅             |             |


### `#[test]`

Used on scope declarations to mark them for testing. See [the "Test"
section](./3-3-0-test-ci.md#assertion-testing).

### `#[doc]` or `##`

Attached to declarations, structure fields, enumeration cases, or function
arguments, the `#[doc = "documentation text"]` attribute can be used to document
them. This information will be available to the users of the module and should
explain the purpose and usage of its linked element.

The alternative syntax `## documentation text` (a code comment starting with a
double `#` character) is available and preferred for readability. Like the
attribute, it must be present just above its target. It is syntactic sugar
for the attribute syntax above, and can be used interchangeably. A single `##`
line cannot contain a line break, but several lines can be used, as below. Both
forms can be mixed above the same element, and the compiler checks them in the
same way. The following three declarations have the same documentation:

```catala-code-en
## Number of children of the household
## that are under 18 years old.
input children_of_age content integer
```

```catala-code-en
#[doc = "Number of children of the household"]
#[doc = "that are under 18 years old."]
input children_of_age content integer
```

```catala-code-en
#[doc = "Number of children of the household\nthat are under 18 years old."]
input children_of_age content integer
```

#### How the documentation text is interpreted

The documentation of an element is made of _fragments_:

* each `##` line is one fragment, whose text is the rest of the line after
  `## ` (with one space) or `##` (if there is no space), with trailing
  whitespace removed. If there is more than one space immediately after `##`,
  only the first one is removed.
* each `#[doc = "..."]` attribute is one fragment, whose text is the value of
  the string, unchanged.

The fragments are joined in source order, separated by exactly one newline.
Indentation inside the text is not changed: if you write `##␣␣␣text`, the
fragment is `␣␣text`.

As in Markdown, a single line break inside the documentation is a soft break
and has no semantic meaning. Blank lines (that is, doc comments or attributes
with empty text) separate paragraphs.

Regular comments (`#`) and empty lines between fragments are ignored.

The documentation items attached to type or scope items declarations are
passed down in the generated [JSON Schema](./5-8-3-json-support.md) in
the `description` property of the objects. The Java backend turns
documentation into Javadoc comments.

### `#[description]`

Attaches a short readable string to an element, which tools display beside
its identifier. Unlike `#[doc]`, which explains an element's purpose and
usage, a description is a caption. The compiler accepts it on declarations,
structure fields, enumeration cases, function arguments and assertions; the
value must be a string. For now, tooling only displays the descriptions of
enumeration cases -- see [the test case
editor](./7-1-test-gui.md#readable-names-for-enumeration-cases).

### `#[error.message]`

The `#[error.message = "informative message"]` attribute can be attached to
assertions or to the `impossible` keyword. The given message will be printed
alongside the normal error message and the code location when the error is
triggered, both in the interpreter and other backends.

### `#[debug.print]`

By adding `#[debug.print]` in front of an expression in a Catala program, the
value of that expression will be printed upon computation by the interpreter,
when run with the `--debug` option. It is otherwise ignored by the other
backends.

It is also possible to print the value along with a specific tag using
`#[debug.print = "some debug tag"]`.

Note that, in some cases, due to how the compiler works, debug prints could
appear duplicated or not at all, especially if optimisations are enabled (with
the `-O` flag). If that happens, try to move the attribute to the root of the
definition.

### `#[implicit_position_argument]`

The `#[implicit_position_argument]` is used when declaring a function (often
useful in conjunction with [external modules](./5-8-2-external-modules.md)), to
mark one of its arguments of type `code_location` as _implicit_. The argument
will not appear when calling the function, and will automatically be filled with
the code position where the function was called from.

This enables functions from libraries that can fail in some definite conditions
to report the error where it happens in the user code, rather than point to the
library. For example, it wouldn't be very helpful when calling
`Utils.custom_division of 2, 0` to report the position of the `Utils` module
where the `custom_division` function is defined.

### `#[json]`

Used to supply constants of [external
types](./5-8-2-external-modules.md#external-types).

### `#[testcase.*]`

These attributes are used by the [test case editor UI](./7-1-test-gui.md). They should be attached
to scope declarations used for tests, and usually also marked with `#[test]`.

A test scope declaration produced by the test case editor UI will thus look like
this:

```catala-code-en
#[test]
#[testcase.testui]
#[testcase.test_title = "Some computation"]
declaration scope SomeComputation:
  input children_of_age content integer
  ...
```

#### `#[testcase.testui]`

Signals to the test case editor UI that this scope declaration is a test
that should be displayed in the UI. Must always be accompanied by a
`#[test]` since UI test cases shoudl always also be regular tests.

#### `#[testcase.test_title]`

Displays a title for the test, distinct from the scope name, in the test
case editor UI.

#### `#[testcase.uid]`

This attribute stores the unique identifier used in React applications
to identify React components in a list. It's a technical stub used
by the test case editor UI.

#### `#[testcase.array_item_label]`

Displays a name for the the array item in the test case editor UI.

## Plugin-supplied attributes

The attribute system of Catala is extensible, and each compiler plugin <!--[compiler plugin](./6-3-compiler-plugins.md)-->
can define an array of attributes which can be parsed and passed to the plugin,
on top of giving new meaning and actions to built-in attributes.
