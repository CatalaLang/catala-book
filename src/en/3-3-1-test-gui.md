# Test tool (user interface)

<div id="tocw"></div>

In the previous section, you saw how to create and add Catala tests to your
continuous integration system.


~~~admonish tip
The test GUI editor is packaged in the official Catala
[VS Code extension](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).
~~~

## Enabling the test GUI

## Creating a test

### Defining input data

### Defining assertions

~~~admonish warning title="Be cautious when using the reset feature"
~~~

## Running a test / diff view



~~~admonish tip title="Should I check GUI tests in version control and add them in my continuous integration system?"
Yes! While we provide a GUI for non-programmers to create
business tests whithout writing Catala literals and assertions, good
software engineering practices still apply. We store tests as "vanilla"
Catala files (with a few technical assertions) to help check them in 
and review diffs in the same manner as other test and program files.
~~~