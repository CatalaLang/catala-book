# Linux/Mac/WSL

Unless noted otherwise, the installation of the Catala tooling happens
on a regular command-line terminal.

~~~admonish info title="For WSL2 users" collapsible=true
We assume all the given commands are invoked in a
WSL2 environment. WSL2 can be installed by running `> wsl --install`
in a Window's PowerShell (`Windows key + R` then type `powershell` in
the prompt). WSL2 will install by default a Ubuntu-like virtual
machine. Then, you may enter the WSL2 environment and the virtual
machine by typing `wsl` in the PowerShell.
~~~

## Getting `opam`

Install the latest version of `opam` (version >= 2.2), through
the [official installation instructions](https://opam.ocaml.org/doc/Install.html)
that we repeat here for convenience.

With aptitude (debian-like linux distributions):
```bash
$ sudo apt update
$ sudo apt install opam
```
Without aptitude:
```bash
$ bash -c "sh <(curl -fsSL https://opam.ocaml.org/install.sh)"
```

At this point, `opam` should be initialized on your machine. But it is not over,
as `opam` needs to create a *switch* with a specific version of OCaml, where
all the packages that we'll install later will be compiled and stored. To
initialize `opam` and create this first switch, enter the following:

```bash
$ opam init -c 4.14.2
$ eval $(opam env)
```

~~~admonish question title="What if I already have `opam`?"
Then you can keep your current switch for installing Catala, or create a
new, specific one with

```
$ opam switch create 4.14.2
```

Catala normally supports OCaml versions `4.14.X` and `5.0.X`.
~~~

## Getting Catala

Run the following command to install the latest Catala version via `opam`:

```bash
$ opam pin catala.dev git+https://github.com/CatalaLang/catala
```

Once this finishes, the Catala compiler (and its build system) should
be installed. You should be able to succesfully call `$ catala
--version` in your terminal. If that's not the case, try invoking `$
eval $(opam env)` priorly.

~~~admonish tip title="Upgrading Catala"
At any time, you can retrieve the latest Catala development version using
these simple commands:
```bash
$ opam update
$ opam upgrade catala
```

This method also works for the other `opam` packages presented below:
just replace `upgrade catala` by `upgrade catala-lsp`, etc.
~~~

## Getting the LSP server (needed by the VSCode extension)

The VSCode extension requires the Catala's Language Server Protocol to be
installed. This can be done by running:

```bash
$ opam pin catala-lsp.dev git+https://github.com/CatalaLang/catala-language-server -y
```

## Getting the VSCode extension

Install VSCode and open it. Browse the extension marketplace and
install the [`Catala` extension](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).

~~~admonish info title="For WSL2 installations" collapsible=true
VSCode needs to reach the installed WSL
environment to retrieve the Catala tools. This can be done by
installing the [official WSL VSCode extension](https://code.visualstudio.com/docs/remote/wsl). Once this is
installed, you will need to load a WSL VSCode window by pressing F1
(which opens the VSCode prompt) and execute the following command
`WSL: Connect to WSL`.
~~~

## Getting the Catala code formatter

Run the following command:
```shell
$ opam pin catala-format.dev git+https://github.com/CatalaLang/catala-format
```

~~~admonish note
This installation will take some time as it requires installing a Rust
toolchain. If you already have a Rust tool chain installed (check by typing `cargo` in the terminal), select
`ignore pin depends` when asked for.
~~~

Once this is installed, you may refresh your VSCode environment (`F1`, then
`Developer: Reload Window`) which will notify the Catala extension that the
formatter is now available. You can invoke the formatter using `F1`, then
`Format Document` or by a user-defined's key-binding.
