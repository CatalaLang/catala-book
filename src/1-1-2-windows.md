# Windows


~~~admonish danger
The Windows installation is currently experimental, as the [Windows support
for the OCaml software toolchain](https://ocaml.org/docs/ocaml-on-windows) dates
from the early 2020s.
~~~

## Getting Opam

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

## Getting Catala

Currently, the `opam` Catala package is not directly buildable on
Windows. However, the Catala's lsp server bundles a subset of Catala
which is fine. This may be installed with the following command

```bash
$ opam pin git+https://github.com/CatalaLang/catala-lsp -y
```

## Setting up the Catala LSP server

After the previous step, the Catala LSP server should be built in
`opam`'s binaries directory. In order for VSCode to be able to get it,
this directory must be added to Windows' `PATH` environment variable.

To change the `PATH` environment variable, follow [these
instructions](https://www.java.com/en/download/help/path.html).

~~~admonish tip title="`opam` binary directory on Windows"
The directory in question should be located in
`%LOCALAPPDATA%\opam\default\bin` (n.b., `default` might be named
something else such as "4.14.2", double-check the directory location).
~~~

## Getting the VSCode extension

Install VSCode and open it. Browse the extension marketplace and
install the `Catala` extension.

## Getting the Catala code formatter

Currently, the code formatter is not yet available on Windows.
