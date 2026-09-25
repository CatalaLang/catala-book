# Windows

<div id="tocw"></div>


## Installation depuis l'installeur binaire

L'équipe de Catala maintient un installateur binaire Windows `.msi` pour
les *releases* publiques qui installe toute la chaîne de compilation de Catala
et modifie votre variable d'environnement `$PATH` pour faire en sorte que
tous les outils soient accessibles depuis un terminal ou votre éditeur de code.
L'installeur détecte également VSCode et y installe l'extension Catala idoine.

<p style="text-align: center;">
<a href="https://github.com/CatalaLang/installers/releases/download/test-sign-2026-07-09/catala-1.2.0-windows-x86_64-777afe1-dirty-unsigned.msi">Télécharger l'installeur Windows pour Catala 1.2.1</a>
</p>

## Méthode alternative : installation depuis les sources

### Obtenir Opam

Ouvrez un PowerShell et installez [opam](https://opam.ocaml.org/doc/Install.html)
en invoquant
```powershell
$ Invoke-Expression "& { $(Invoke-RestMethod https://opam.ocaml.org/install.ps1) }"
```
~~~admonish bug title="Méthodes d'installation alternatives d'`opam`"
Si une erreur inattendue se produit, essayez une autre méthode d'installation
d'`opam` telle que listée sur la page web officielle [OCaml sur Windows](https://ocaml.org/docs/ocaml-on-windows).
~~~

Ensuite, initialisez `opam` :

```console
$ opam init -c 4.14.2
```

### Obtenir Catala

Actuellement, le paquet `opam` Catala n'est pas directement compilable sur
Windows. Cependant, le serveur lsp de Catala intègre un sous-ensemble de Catala
qui est suffisant. Cela peut être installé avec la commande suivante

```console
    $ opam install catala.1.2.1 catala-lsp.1.2.0
```
~~~admonish warning title="Erreur Ninja"
Si l'étape d'installation ne parvient pas à trouver l'outil "ninja", vous pouvez
l'installer en utilisant winget. Dans un powershell, tapez `winget install
Ninja-build.Ninja` comme décrit [ici](https://winstall.app/apps/Ninja-build.Ninja).
~~~

### Configurer le serveur LSP Catala

Après l'étape précédente, le serveur LSP Catala devrait être construit dans le
répertoire des binaires d'`opam`. Pour que VS Code puisse l'obtenir, ce
répertoire doit être ajouté à la variable d'environnement `PATH` de Windows.

Pour modifier la variable d'environnement `PATH`, suivez [ces instructions](https://www.java.com/fr/download/help/path.html).

~~~admonish tip title="Répertoire binaire d'`opam` sur Windows"
Le répertoire en question devrait être situé dans
`%LOCALAPPDATA%\opam\default\bin` (n.b., `default` pourrait être nommé
autrement comme "4.14.2", vérifiez l'emplacement du répertoire).
~~~

### Obtenir l'extension VS Code

Installez VS Code et ouvrez-le. Parcourez le marché des extensions et installez
l'[extension `Catala`](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).
