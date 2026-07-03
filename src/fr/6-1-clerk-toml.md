# Fichier de configuration du projet

<div id="tocw"></div>

Cette section décrit entièrement le format de manifeste pour les fichiers de
configuration de projet. Le fichier `clerk.toml` contient des métadonnées qui
décrivent comment construire et empaqueter des programmes Catala dans un projet. Il est
écrit au [format TOML](https://toml.io/en/).

Un exemple de configuration `clerk.toml` est disponible dans la [section
3.1](3-1-directory-config.md#le-fichier-de-configuration-clerktoml).


## Format du manifeste

- [`[project]`](#options-project) -- Table qui définit les options globales du projet.
  - [`name`](#name) -- Nom du projet.
  - [`include_dirs`](#include_dirs) -- Répertoires scannés pour les sources.
  - [`exclude_dirs`](#exclude_dirs) -- Répertoires exclus du scan de sources.
  - [`build_dir`](#build_dir) -- Le répertoire de sortie des artefacts de construction.
  - [`target_dir`](#target_dir) -- Le répertoire de sortie des cibles.
  - [`default_targets`](#default_targets) -- Les cibles par défaut à construire.
  - [`catala_opts`](#catala_opts) -- Surcharge des options Catala.
  - [`catala_exe`](#catala_exe) -- Surcharge du chemin du binaire Catala.
- `[[target]]` -- Multi-table qui définit une cible de projet.
  - [`name`](#name) -- Nom de la cible (*Requis*).
  - [`modules`](#modules) -- Modules liés à la cible (*Requis*).
  - [`tests`](#tests) -- Liste des répertoires contenant des tests liés à la cible.
  - [`backends`](#backends) -- Liste des backends vers lesquels cette cible sera construite.
  - [`dependencies`](#dependencies) -- Liste de noms des cibles en dépendance.
- [`[variables]`](#variables) -- Table pour surcharger les variables liées à la compilation.

### Options `[project]`

#### name

Ce champ sera utilisé pour les réferences dans des multi-projets.

#### include_dirs

Définit les répertoires dans lesquels `clerk` cherchera les fichiers
sources Catala. Cette recherche est récursive : les sous-répertoires
des répertoires déclarés sont implicitement inclus.

Exemple: `include_dirs = ["src", "libs/catala"]`

La valeur par défaut est `["."]`, signifiant la racine du projet :
ainsi, si cette valeur n'est pas spécifiée, l'entièreté de l'arbre du
projet est scanné ormis les répertoires listés via l'option
[exclude_dirs](#exclude_dirs).

#### exclude_dirs

Configure `clerk` pour qu'il exclus de sa découverte de fichiers
sources les répertoires spécifiés. Cela sert à éviter de scanner des
certains répertoires contenant des sources devant être omises.

Exemple: `exclude_dirs = ["doc", "libs/non-catala"]`

#### build_dir

Spécifie quel répertoire doit être utilisé pour sortir les fichiers d'artefacts de construction
générés.

Exemple : `build_dir = "catala_build/"`

Par défaut `"_build/"`.

#### target_dir

Spécifie quel répertoire doit être utilisé pour sortir les bibliothèques générées
des cibles résultantes. Le répertoire contiendra les
fichiers backend exportables.

Exemple : `target_dir = "generated_targets/"`

Par défaut `"_target/"`.

#### default_targets

Définit quelles cibles seront construites si aucune n'est spécifiée lors de l'invocation de
`clerk build` sans arguments.

Exemple : `default_targets = ["calcul_impot", "prestations_sociales"]`

#### catala_opts

Définit quelles options seront passées au compilateur Catala lors de
la construction des programmes Catala. *Attention* : utiliser avec précaution.

Exemple : `catala_opts = ["--trace", "--whole-program"]`

#### catala_exe

Surcharge quel compilateur Catala sera utilisé pour construire les fichiers
sources.

Exemple : `catala_exe = "chemin/vers/catala_personnalise.exe"`

### Options `[[target]]`

Les cibles (ou _targets_) regroupent un ensemble cohérent de modules
permettant de générer des bibliothèques ou paquets dans les languages
de backend cibles. Ainsi, à l'aide de la commande `clerk build`, les
cibles déclarées seront construites dans le dossier `_target` (ou vers
le dossier spécifié par le champ `target_dir`) et triés par backend.

#### name

Nom donné à la cible. Cela créera un alias qui peut être utilisé
par clerk pour construire la cible spécifique ou lancer des tests dédiés.

Exemple : `name = "calcul_impot"`

Invoquer `$ clerk build calcul_impot` ne construira que la
cible `calcul_impot`.

#### modules

Modules qui seront inclus dans la `[[target]]`. Ils seront alors
utilisable dans le(s) backend(s) spécifié(s).

Exemple : `modules = ["Section_121", "Section_132"]`

Tout autre module en dépendance des modules spécifiés sera également
exporté dans la cible générée (seulement s'ils ne sont pas spécifiés
via [dependencies](#dependencies)]).

#### tests

Spécifie la liste des répertoires qui contiennent des tests Catala qui sont
liés à la cible. Exécuter `clerk test <nom_cible>` exécutera les
tests trouvés dans les répertoires donnés (et sous-répertoires
récursivement).

Exemple : `tests = ["tests/tests_impot/unitaires/", "tests/tests_impot/"]`

#### backends

Spécifie la liste des backends qui seront générés pour cette
cible. La liste des backends actuellement supportés est : `"ocaml"`,
`"java"`, `"c"`, `"python"`

Exemple : `backends = ["ocaml", "c", "java"]`

Si non-spécifié, tous les backends sont activés.

#### dependencies

Attend une liste de noms d'autres cibles. Ceci donne l'indication que
la cible dispose de dépendances et que leur génération vers les
languages de backend cibles doivent les utiliser comme tel plutôt que
de tout regrouper en une seule cible "stand-alone".


~~~admonish info title="Comportement par défaut des inclusions de cibles"
Par défaut, lorsque le champ `dependencies` n'est pas spécifié,
`clerk` va inclure l'ensemble des modules requis pour son exécution
(_i.e._, les `modules` spécifiés **ainsi que** tous les modules
présents dans leurs chaînes de dépendance). Ceci permettra que le
dossier généré sera auto-contenu.

Cependant, lorsque l'on utilise plusieurs fois les mêmes modules dans
plusieurs cibles d'un même projet, on tombe sur le problème où les
modules seront inclus plusieurs fois.

Par exemple, si un module `Commun` est utilisé par deux cibles `a` et
`b`, ces deux cibles inclueront deux copies de ce module `Commun`. Si,
par la suite, on souhaite utiliser les deux cibles dans une même
application hôte, nous aurons un conflit lié à la présence de deux
copies du même module.
~~~

Si deux cibles `A` and `B` dépendent d'un même module `Commun` et vous
souhaitez les utiliser dans une même application, vous pouvez utiliser
le champ `dependencies`:
- Soit en créant une nouvelle cible `C` incluant le module `Commun` et
  en déclarant `dependencies= [ "C" ]` dans les configurations de
  cibles de `A` et de `B`. Se faisant, les versions backends des
  cibles n'utiliseront qu'une unique version du module `Commun`.
- Une autre possibilité est de faire dépendre la cible `A` de `B`. Le
  module `Commun` sera ainsi inclus dans `B` mais `A` sera capable de
  le référencer via sa dépendance à la cible `B` et, ainsi, n'en
  créera pas une copie superflue.


~~~admonish note
Toutes les cibles dépendent implicitement de la cible `libcatala` qui
inclus la runtime Catala et sa bibliothèque standard. Celle-ci devra
également être _linké_ dans l'application finale.
~~~

Exemple: `dependencies = [ "commun", "calcul-impot" ]`

### `[variables]`

Table globale utilisée pour surcharger les variables de construction clerk. La liste complète des
variables peut être consultée en utilisant `clerk list-vars`.

Exemple :
```toml
[variables]
CATALA_FLAGS_C = "-O"
CC = "clang"
JAVAC = "/usr/bin/javac"
```
