# Nightly and development installations

<div id="tocw"></div>

The previous guides about [Linux/Mac/WSL](./1-1-1-linux-mac-wsl.md) and
[Windows](./1-1-2-windows.md) installations assumed that you wanted to
install the latest community release of Catala hosted on the main public
[opam repository](https://github.com/ocaml/opam-repository/).
Through a different usage of the [opam](https://opam.ocaml.org/) client,
this page presents how to get nightly versions and development versions of
Catala (provided by the Catala team).

~~~admonish info title="Use the community releases first!"
The Catala team recommends that your first install the latest community releases
using the regular installation guides before trying the
alternative installation methods presented on this page. These
alternative installation methods receive less care and attention than the
mainstream instal path from the Catala team.
~~~

## Nightly versions of Catala

The Catala team maintains a special release distribution channel to provide
regularly nightly versions of Catala cureated from the main development branches.
These nightly versions contain fixes and improvements from the last community
release, but should be used at your own risk since they are not as well
tested as the community releases.

To access these nightly versions, you need to create a new switch in your local
`opam` pointing to a [special opam
repository](https://gitlab.inria.fr/catala/opam-repository/-/tree/nightly)
maintained by the Catala team. This switch will be used to install the special
`catala-full` package maintained in this special opam repository by the Catala
team. The `catala-full` package installs in a single command the whole Catala suite with
`catala`, `catala-lsp` and `catala-format`, taking the nightly version of the
packages as defined by the Catala team.

All of this can be done thanks to this magical `opam` command:

```console
$ opam switch create --repos catala-nightly="git+https://gitlab.inria.fr/catala/opam-repository#nightly" catala-full
```

You now have a new switch named `catala-full` that contains the nightly version
of Catala. You can do `opam switch` to see which switches are installed
and use `opam switch <name of the switch>` to change which switch you are
using and go back and forth from the community release of Catala to the
nightly version of Catala.

If you want to make sure that you're always using
the nightly version of Catala when you invoke `opam` from a certain repository,
you can invoke `opam switch link catala-full` from that repository.

After switching your version of Catala, don't forget to call `clerk clean`
in your repository and restart your IDE.

~~~admonish tip title="Updating your nightly version"
With this setup, getting the latest nightly version from the Catala team
is as simple as :

```console
$ opam update catala-nightly -u -y
```
~~~

## Development versions of Catala

If you feel adventurous, you can retrieve the latest development version of
the Catala tooling, pulling directly from the `master` branches of the
repositories of the Catala development team. To do so,
you need to [pin](https://opam.ocaml.org/doc/Usage.html#opam-pin) the `catala`,
`catala-lsp` and `catala-format` opam packages in your switch to a `dev`
version pointing to the git repositories of the Catala tooling. Here is the
command to invoke:

```console
$ opam pin catala.dev --dev-repo
$ opam pin catala-lsp.dev --dev-repo
$ opam pin catala-format.dev --dev-repo
```

If you're tired of the bleeding edge and want to go back to the normal releases,
simply unpin the development versions:

```console
$ opam unpin catala.dev
$ opam unpin catala-lsp.dev
$ opam unpin catala-format.dev
```

And reinstall Catala:

```console
$ opam reinstall catala
$ opam reinstall catala-lsp
$ opam reinstall catala-format
```
