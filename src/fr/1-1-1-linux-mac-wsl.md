# Linux/Mac/WSL

<div id="tocw"></div>

Sauf indication contraire, l'installation de l'outillage Catala s'effectue
sur un terminal en ligne de commande classique.

~~~admonish info title="Pour les utilisateurs de WSL2" collapsible=true
Nous supposons que toutes les commandes données sont invoquées dans un
environnement WSL2. WSL2 peut être installé en exécutant `> wsl --install`
dans un PowerShell Windows (`Touche Windows + R` puis tapez `powershell` dans
l'invite). WSL2 installera par défaut une machine virtuelle de type Ubuntu.
Ensuite, vous pouvez entrer dans l'environnement WSL2 et la machine virtuelle
en tapant `wsl` dans le PowerShell.
~~~

## Obtenir `opam`

Installez la dernière version d'`opam` (version >= 2.2), via les
[instructions d'installation officielles](https://opam.ocaml.org/doc/Install.html)
que nous répétons ici pour plus de commodité.

Avec aptitude (distributions linux de type debian) :
```console
$ sudo apt update
$ sudo apt install opam
```
Sans aptitude :
```console
$ bash -c "sh <(curl -fsSL https://opam.ocaml.org/install.sh)"
```

À ce stade, `opam` devrait être initialisé sur votre machine. Mais ce n'est pas
fini, car `opam` doit créer un *switch* avec une version spécifique d'OCaml, où
tous les paquets que nous installerons plus tard seront compilés et stockés.
Pour initialiser `opam` et créer ce premier switch, entrez ce qui suit :

```console
$ opam init -c 4.14.2
$ eval $(opam env)
```

~~~admonish question title="Et si j'ai déjà `opam` ?"
Alors vous pouvez conserver votre switch actuel pour installer Catala, ou en
créer un nouveau spécifique avec

```console
$ opam switch create 4.14.2
```

Catala supporte les versions d'OCaml de `4.14.0` jusqu'à `5.4.X`.
~~~

## Obtenir Catala

Exécutez les commandes suivantes pour installer la dernière version de Catala via `opam` :

```console
$ opam update && opam install catala.1.0.0
```

Une fois terminé, le système de construction Catala devrait être installé. Vous
devriez pouvoir appeler avec succès `$ clerk --version` dans votre terminal. Si
ce n'est pas le cas, essayez d'invoquer `$ eval $(opam env)` avant.

### Mettre à jour Catala
À tout moment, vous pouvez récupérer la dernière version de Catala en utilisant
ces commandes simples :
```console
$ opam update
$ opam upgrade catala
```

Cette méthode fonctionne également pour les autres paquets `opam` présentés
ci-dessous : remplacez simplement `upgrade catala` par `upgrade catala-lsp`, etc.

~~~admonish danger collapsible=true title="À la pointe : obtenir les versions de développement"

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
~~~

## Obtenir le serveur LSP (nécessaire pour l'extension VSCode)

L'extension VSCode nécessite que le protocole de serveur de langage (LSP) de
Catala soit installé. Cela peut être fait en exécutant :

```console
$ opam install catala-lsp.1.0.0
```

## Obtenir l'extension VSCode

Installez VSCode et ouvrez-le. Parcourez le marché des extensions et installez
l'[extension `Catala`](https://marketplace.visualstudio.com/items?itemName=catalalang.catala).

~~~admonish info title="Pour les installations WSL2" collapsible=true
VSCode doit atteindre l'environnement WSL installé pour récupérer les outils
Catala. Cela peut être fait en installant l'[extension officielle WSL VSCode](https://code.visualstudio.com/docs/remote/wsl).
Une fois installée, vous devrez charger une fenêtre VSCode WSL en appuyant sur
F1 (qui ouvre l'invite VSCode) et exécuter la commande suivante
`WSL: Connect to WSL`.
~~~

## Obtenir l'outil de mise en forme de code Catala

Exécutez la commande suivante :
```shell
$ opam install catala-format.1.0.0
```

~~~admonish note
Cette installation prendra un certain temps car elle nécessite l'installation
d'une chaîne d'outils Rust. Si vous avez déjà une chaîne d'outils Rust installée
(vérifiez en tapant `cargo` dans le terminal), sélectionnez `ignore pin depends`
lorsqu'on vous le demande.
~~~

Une fois installé, vous pouvez rafraîchir votre environnement VSCode (`F1`, puis
`Developer: Reload Window`) ce qui notifiera l'extension Catala que l'outil de mise en forme
est maintenant disponible. Vous pouvez invoquer l'outil de mise en forme en utilisant `F1`,
puis `Format Document` ou par un raccourci clavier défini par l'utilisateur.
