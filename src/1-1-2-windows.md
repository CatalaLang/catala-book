# Windows

<div id="tock" data-block_title="Summary"></div>
<div id="tocw"></div>


~~~admonish danger
The Windows installation is currently experimental, as the [Windows support
for the OCaml software toolchain](https://ocaml.org/docs/ocaml-on-windows) dates
from the early 2020s. If possible, use WSL (Windows Subsystem for Linux) instead.
~~~

## Binary installer

You can download and install Catala using this binary installer - you
might need administrator privileges:

- [Catala x86_64 Windows binary installer](https://gitlab.inria.fr/verifisc/docker-catala/-/raw/catala-windows-installer/Catala.msi)

~~~admonish warning title="This is an incomplete version of Catala"
Currently, this installer provides the basic Catala compiler with the LSP
server used by the VS Code extension along with the Catala code
formatter. This is handy for experimenting with the language but this
does not include the full compilation toolchain and the Catala build
system required to use modules. To get those, you will need to
[install from the sources directly](#installing-from-sources).
~~~

Once this Catala setup file is installed, you might need to restart
VS Code if it was previously launched. To make sure everything was
properly installed, you can open a VS Code terminal and type `$ catala
--version`. If this does not display an error, everything should be
properly setup.

To install the Catala VS Code extension, please refer to this
[section](#getting-the-vs-code-extension).

## Installing from sources

### Getting Opam

Open a PowerShell and install
[opam](https://opam.ocaml.org/doc/Install.html) by invoking
```powershell
$ Invoke-Expression "& { $(Invoke-RestMethod https://opam.ocaml.org/install.ps1) }"
```
~~~admonish bug title="Alternative `opam` installation methods"
If an unexpected error occurs, try another `opam` installation method as
listed on the [OCaml on Windows](https://ocaml.org/docs/ocaml-on-windows) official webpage.
~~~

Then, initialize `opam`:

```bash
$ opam init -c 4.14.2
```

### Getting Catala

Currently, the `opam` Catala package is not directly buildable on
Windows. However, the Catala's lsp server bundles a subset of Catala
which is fine. This may be installed with the following command

```bash
$ opam pin catala-lsp git+https://github.com/CatalaLang/catala-language-server -y
```
~~~admonish warning title="Ninja error"
If the installation step fails to find the "ninja" tool, you may install it using winget.
In a powershell, type `winget install Ninja-build.Ninja` as described
[here](https://winstall.app/apps/Ninja-build.Ninja).
~~~

### Setting up the Catala LSP server

After the previous step, the Catala LSP server should be built in
`opam`'s binaries directory. In order for VS Code to be able to get it,
this directory must be added to Windows' `PATH` environment variable.

To change the `PATH` environment variable, follow [these
instructions](https://www.java.com/en/download/help/path.html).

~~~admonish tip title="`opam` binary directory on Windows"
The directory in question should be located in
`%LOCALAPPDATA%\opam\default\bin` (n.b., `default` might be named
something else such as "4.14.2", double-check the directory location).
~~~

### Getting the VS Code extension

Install VS Code and open it. Browse the extension marketplace and
install the [`Catala` extension](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).

### Getting the Catala code formatter

Currently, the code formatter is not yet available on Windows.
