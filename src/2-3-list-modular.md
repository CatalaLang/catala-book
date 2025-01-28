# Going modular with lists

In this section, the tutorial tackles a common pattern that significantly
increases the complexity of a codebase: the need to deal with lists and rules
applying to each element of the list. Here, Catala reuses all the common tricks
and patterns from functional programming to elegantly structure the code while
performing expressive operations on lists.

~~~~~~admonish info collapsible=true title="Recap of the previous section"
This section of the tutorial builds up on the [previous one](./2-2-conditionals-exceptions.md),
and will reuse the same running example, but all the Catala code necessary
to execute the example is included below for reference.

~~~
{{#include ../examples/tutorial_end_2_2.catala_en}}
~~~
~~~~~~

