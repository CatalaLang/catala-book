# Installing Catala on your machine

# Catala installation instructions

**Disclaimer**: Currently, Catala is only available through source
building. We plan to package Catala as binaries which will greatly
ease the installation process.

**Important**: during these steps several prompts might occur, choosing
the default option (by pressing enter each time) or answering yes (by
typing `y` then enter) is enough.

## On Linux/WSL2

**For WSL2 users**: we assume all the given commands are invoked in a
WSL2 environment. WSL2 can be installed by running `> wsl --install`
in a Window's PowerShell (`Windows key + R` then type "powershell" in
the prompt) which will installed by default a Ubuntu-like virtual
machine. Then, you may enter the WSL2 environment by typing "wsl" in
the PowerShell.

### Getting opam

Install the latest version of [opam](https://opam.ocaml.org/doc/Install.html) (version >= 2.2)

With aptitude (debian-like linux distributions):
```bash
$ sudo apt update
$ sudo apt install opam
```
Without aptitude:
```bash
$ bash -c "sh <(curl -fsSL https://opam.ocaml.org/install.sh)"
```

Then, initialize `opam`:
```bash
$ opam init -c 5.0.0
$ eval $(opam env)
```

### Getting Catala

Run the following command to install the latest Catala version via `opam`:

```bash
$ opam pin catala.dev git+https://github.com/CatalaLang/catala -y
```

Once this finishes, the Catala compiler (and its build system) should
be installed. You should be able to succesfully call `$ catala
--version` in your terminal. If that's not the case, try invoking `$
eval $(opam env)` priorly.

### Getting the LSP server (needed by the VSCode extension)

The VSCode extension requires the Catala's Language Server Protocol to be installed.
This can be done by running:

```bash
$ opam pin catala-lsp.dev git+https://github.com/CatalaLang/catala-language-server -y
```

### Getting the VSCode extension

Install VSCode and open it. Browse the extension marketplace and
install the `Catala` extension.

**For WSL2 installations**: VSCode needs to reach the installed WSL
environment to retrieve the Catala tools which can be done by
installing the official WSL VSCode extension
(c.f. https://code.visualstudio.com/docs/remote/wsl). Once this is
installed, you will need to load a WSL VSCode window by pressing F1
(which opens the VSCode prompt) and execute the following command
`WSL: Connect to WSL`.

### Getting the Catala code formatter

Run the following command:
```bash
$ opam pin catala-format.dev git+https://github.com/CatalaLang/catala-format -y
```

_Note_: this installation will take some time as it requires a Rust
toolchain.

Once this is installed, you may refresh your VSCode environment (`F1`
=> "Developer: Reload Window") which will notify the Catala extension
that the formatter is now available. You can invoke the formatter
using `F1` => "Format Document" or by a user-defined's key-binding.

## On Windows (_without_ WSL)

**Caution**: The Windows installation is currently experimental.

### Getting Opam

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

### Getting Catala

Currently, the `opam`'s Catala package is not directly buildable on
Windows. However, the Catala's lsp server bundles a subset of Catala
which is fine. This may be installed the same way as Linux/WSL2:

```bash
$ opam pin git+https://github.com/CatalaLang/catala-lsp -y
```

### Setting up the Catala LSP server

After the previous step, the Catala LSP server should be built in
opam's binaries directory. In order for VSCode to be able to get it,
this directory must be added to Windows' `PATH` environment variable.
The directory in question should be located in
`%LOCALAPPDATA%\opam\default\bin` (n.b., `default` might be named
something else such as "4.14.2", double-check the directory location).

### Getting the VSCode extension

Install VSCode and open it. Browse the extension marketplace and
install the `Catala` extension.

Currently, the code formatter is not yet available on Windows.
