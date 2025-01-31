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
Invoke-Expression "& { $(Invoke-RestMethod https://opam.ocaml.org/install.ps1) }"
```

If an unexpected error occurs, follow the `opam`'s installation
instructions: https://opam.ocaml.org/doc/Install.html

Then, initialize `opam`:
```bash
$ opam init -c 5.0.0
```

## Getting Catala

Currently, the `opam`'s Catala package is not directly buildable on
Windows. However, the Catala's lsp server bundles a subset of Catala
which is fine. This may be installed the same way as Linux/WSL2:

```bash
$ opam pin git+https://github.com/CatalaLang/catala-lsp -y
```

## Setting up the Catala LSP server

After the previous step, the Catala LSP server should be built in
opam's binaries directory. In order for VSCode to be able to get it,
this directory must be added to Windows' `PATH` environment variable.
The directory in question should be located in
`%LOCALAPPDATA%\opam\default\bin` (n.b., `default` might be named
something else such as "4.14.2", double-check the directory location).

## Getting the VSCode extension

Install VSCode and open it. Browse the extension marketplace and
install the `Catala` extension.

Currently, the code formatter is not yet available on Windows.
