# Installations *nightly* et de développement

<div id="tocw"></div>

Les précédents guides à propos des installations
[Linux/Mac/WSL](./1-1-1-linux-mac-wsl.md) et [Windows](./1-1-2-windows.md)
supposent que vous voulez installer la dernière *release* communautaire de
Catala hébergée sur le principal [dépôt public de
opam](https://github.com/ocaml/opam-repository/). Grâce à un usage avancé
du client [opam](https://opam.ocaml.org/), cette page présente la manière
de récupérer les version *nightly* et de développement de Catala (distribuées par
l'équipe de Catala).

~~~admonish info title="Utilisez les *releases* communautaires d'abord!"
L'équipe de Catala recommande que vous installiez d'abord la dernière
*release* communautaire en utilisant les guides d'installation normaux avant
d'essayer les installations alternatives présentées sur cette page. Ces méthodes
d'installation alternatives reçoivent moins d'attention de la part de l'équipe
Catala que les installations classiques.
~~~

## Versions *nightly* de Catala

L'équipe de Catala maintient un canal de distrubution spécial pour fournir
des*releases nightly* de Catala, crées à partir des branches principales de
développement. Ces versions *nightly* contiennent des corrections et améliorations
par rapport à la dernière *release* communautaire, mais utilisez-les à vos
propres risques puisqu'elles ne sont pas autant testées que les *releases*
communautaires.

Pour accéder à ces versions *nightly*, vous devez créer un nouveau *switch* dans
votre `opam` local qui pointe vers un [dépôt opam
spécial](https://gitlab.inria.fr/catala/opam-repository/-/tree/nightly)
maintenu par l'équipe de Catala. Ce `switch` sera utilisé pour installer le
paquet spécial `catala-full` maintenu dans ce dépôt spécial d'opam par l'équipe
de Catala. Le paquet `catala-full` permet avec une unique commande d'installer
toute la suite Catala avec les paquets `catala`, `catala-lsp` et `catala-format`,
en prenant les versions `nightly` telles que définies par l'équipe de Catala.

Tout ceci peut être fait en utilisant cette commande `opam` magique:

```console
$ opam switch create --repos catala-nightly="git+https://gitlab.inria.fr/catala/opam-repository#nightly" catala-full
```
Vous avez maintenant un nouveau `switch` appelé `catala-full` qui contient
la version `nightly` de Catala. Vous pouvez faire `opam switch` pour voir la liste
des `switch` installés et utiliser `opam switch <nom du switch>` pour changer de
`switch` et ainsi basculer de la *release* communautaire de Catala à la version
*nightly* (et vice-versa).

Si vous voulez être sûr que vous vous utilisez toujours la version *nightly*
de Catala quand vous invoquez `opam` depuis un certain dossier sur votre
machine, vous pouvez invoquer `opam switch link catala-full` depuis ce dossier.

Après avoir changé votre version de Catala, n'oubliez pas d'appeler `clerk clean`
dans votre dossier et relancer votre IDE.

~~~admonish tip title="Mettre à jour votre version *nightly*"
Avec cette configuration, récupérer la dernière version *nightly* de Catala
est aussi simple que d'invoquer la commande suivante :

```console
$ opam update catala-nightly -u -y
```
~~~

## Versions de développement de Catala

Si vous vous sentez l'âme aventurière, vous pouvez récupérer la dernière version
de développement de l'outillage Catala au lieu des versions stables éprouvées.
Pour ce faire, vous devez [épingler](https://opam.ocaml.org/doc/Usage.html#opam-pin)
les paquets opam `catala`, `catala-lsp` et `catala-format` dans votre switch
vers une version `dev` pointant vers les dépôts git de l'outillage Catala. Voici
la commande à invoquer :

```console
$ opam pin catala.dev --dev-repo
$ opam pin catala-lsp.dev --dev-repo
$ opam pin catala-format.dev --dev-repo
```

Si vous êtes fatigué d'être à la pointe et souhaitez revenir aux versions
normales, désépinglez simplement les versions de développement :

```console
$ opam unpin catala.dev
$ opam unpin catala-lsp.dev
$ opam unpin catala-format.dev
```

Et réinstallez Catala :

```console
$ opam reinstall catala
$ opam reinstall catala-lsp
$ opam reinstall catala-format
```
