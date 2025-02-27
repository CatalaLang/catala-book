# Installing Catala on your machine

~~~admonish warning title="Disclaimer"
Currently, Catala is only available through source
building. We plan to package Catala in binary format in the future, which will greatly
ease the installation process.
~~~

Catala is a programming language primarily designed to be installed on your
machine and run locally in your favorite development environment. Materially,
Catala is comprised of several executables that together complete the
tooling for the programming language:
* the Catala compiler `catala`, together with the build system `clerk`;
* the Catala Language Server Protocol (LSP) server `catala-lsp`;
* the Catala auto formatting tool `catala-format`;
* the Catala plugin for your text editor or [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment).

Under the hood, most of these executables are produced using the
[OCaml](https://www.ocaml.org) software toolchain, so the installation process
begins with `opam`, the package and build system for OCaml.

The installation instructions all assume proficiency with the command line
and basic knowledge about the filesystem and the general process of building
executables from sources using a package manager.

~~~admonish bug title="The installation failed, what can I do?"
If your installation failed even though you were following the installation
guide, please [file an issue](https://github.com/CatalaLang/catala/issues)
or start a thread on the [Catala community online chat](https://zulip.catala-lang.org/).

In your issue or post, please provide:
* your platform and operating system;
* a log of the commands you executed with their command line output.
~~~

The installation instructions are different whether you are on an
[Unix-compatible system](./1-1-1-linux-mac-wsl.md) (Linux, MacOS, Windows
Subsystem for Linux), or on plain [Windows](./1-1-2-windows.md). Please pick the
appropriate guide for your situation.

~~~admonish info title="Important information"
During the installation steps several prompts might occur, choosing
the default option (by pressing enter each time) or answering yes (by
typing `y` then enter) is enough.
~~~

