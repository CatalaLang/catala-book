# Test tool (graphical user interface)

<div id="tocw"></div>

In the previous section, you saw how to create and add Catala tests to your
continuous integration system.

Besides this pipeline, we provide a GUI tool for creating and running tests
to help create domain/business tests. 

~~~admonish tip
The test GUI editor is packaged in the official Catala
[VS Code extension](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).
~~~

To access this tool, install the VS code extension for Catala, and enable
the test GUI.

## Enabling the test GUI

The GUI tool needs to be enabled before first use. After that, it will stay available.

To do so, bring the VS code command panel (ctrl-shift-P) and search for "settings",
then filter by typing "catala" in the search box.

In the catala settings, check "Enable Custom Test Editor".

![Enabling the custom test editor in the settings panel](img/enable_test_case_editor.png)

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