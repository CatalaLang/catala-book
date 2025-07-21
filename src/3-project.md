# Setting up a Catala project

While the [Catala tutorial](./2-0-tutorial.md) introduces you to programming in
Catala and the specificities of mirroring legal requirements in your code, it
lacks all the aspects of an IT project beyond just writing the code.

Specifically, the Catala team encourages Catala developers to use modern
software engineering standards with respect to project organization and
management. This section, "Setting up a Catala project", acts as a walkthrough
guide that shows primarily how the Catala build system, `clerk`, facilitates
the workflow of structuring, testing and deploying an IT project using Catala.

~~~admonish info title="Prerequisite for this walktrough"
This walkthrough will assume the reader works on an Unix-like system and
has a minimum level of practice of the command line and basic system operations.
The second, third and fourth section also assume basic knowledge of modern
software engineering works, and familiarity with platforms like Gitlab or Github.
~~~

This walkthrough guide is structured sequentially to mimick the different
steps of creating a new Catala project and organizing its codebase as well
as the work around it:
* the [first section](./3-1-directory-config.md) explains how to structure
  the codebase and where to put the Catala source files;
* the [second section](./3-2-test-ci.md) is about setting up a modern software
  engineering stack around the codebase, complete with versionning, automated
  testing and continuous integration (CI);
* the [third section](./3-3-compilation-deployment.md) expands on the previous
  one to add automated deployment of Catala-generated artifacts using the
  different backends of the compiler;
* the [fourth section](./3-4-external-plugins.md) is a step-by-step guide for
  setting up an [externally implemented module](./5-6-modules.md#declaring-external-modules)
  and its external implementations in all the target backends, all of that
  integrated in the automated software engineering toolchain described in the
  previous sections;
* the [fifth and final section](./3-5-lawyers-agile.md) is mostly non-technical
  and orthogonal to the previous sections, it is about the human organization
  of Catala projects involving lawyers and programmers, as well as the important
  foundational choices to be made at the start of the project.

~~~admonish tip title="The last section will surprise you!"
While the first four sections are primarily geared towards programmers, the
Catala teams recommends that everyone on the project, including lawyers, read
the [fifth section](./3-5-lawyers-agile.md) before diving into the production
of the Catala code.
~~~

Have a good read!
