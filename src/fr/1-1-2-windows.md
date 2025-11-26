# Windows

<div id="tocw"></div>


~~~admonish danger
L'installation sous Windows est actuellement expérimentale, car le [support
Windows pour la chaîne d'outils logicielle OCaml](https://ocaml.org/docs/ocaml-on-windows)
date du début des années 2020. Si possible, utilisez plutôt WSL (Sous-système
Windows pour Linux).
~~~

## Installateur binaire

Vous pouvez télécharger et installer Catala en utilisant cet installateur
binaire - vous pourriez avoir besoin des privilèges d'administrateur :

- [Installateur binaire Windows Catala x86_64](https://gitlab.inria.fr/verifisc/docker-catala/-/raw/catala-windows-installer/Catala.msi)

~~~admonish warning title="Ceci est une version incomplète de Catala"
Actuellement, cet installateur fournit le compilateur Catala de base avec le
serveur LSP utilisé par l'extension VS Code ainsi que l'outil de mise en forme de code
Catala. C'est pratique pour expérimenter avec le langage mais cela n'inclut pas
la chaîne de compilation complète et le système de construction Catala requis
pour utiliser les modules. Pour obtenir ceux-ci, vous devrez [installer
directement depuis les sources](#installation-depuis-les-sources).
~~~

Une fois ce fichier d'installation Catala installé, vous devrez peut-être
redémarrer VS Code s'il était déjà lancé. Pour vous assurer que tout a été
correctement installé, vous pouvez ouvrir un terminal VS Code et taper `$ catala
--version`. Si cela n'affiche pas d'erreur, tout devrait être correctement
configuré.

Pour installer l'extension VS Code Catala, veuillez vous référer à cette
[section](#obtenir-lextension-vs-code).

## Installation depuis les sources

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
$ opam install catala.1.0.0 catala-lsp.1.0.0
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

### Obtenir l'outil de mise en forme de code Catala

Actuellement, l'outil de mise en forme de code n'est pas encore disponible sur Windows.
