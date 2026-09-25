# Windows

<div id="tocw"></div>


## Installing from the binary installer

The Catala team maintains a binary, `.msi` Windows installer for public releases
of Catala that installs the whole toolchain and modifies your `$PATH`
environment variable to make the tools accessible in your terminal or from your
code editor. The installer also detects if you have VSCode and automatically
installs the Catala VSCode extension for it.

<p style="text-align: center;">
<a href="https://github.com/CatalaLang/installers/releases/download/test-sign-2026-07-09/catala-1.2.0-windows-x86_64-777afe1-dirty-unsigned.msi">Download the Windows installer for Catala 1.2.1</a>
</p>


## Alternative method: installing from sources

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

```console
$ opam init -c 4.14.2
```

### Getting Catala

Currently, the `opam` Catala package is not directly buildable on
Windows. However, the Catala's lsp server bundles a subset of Catala
which is fine. This may be installed with the following command

```console
$ opam install catala.1.2.1 catala-lsp.1.2.0
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

### Geting the VS Code extension

Install VS Code and open it. Browse the extension marketplace and
install the [`Catala` extension](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).
