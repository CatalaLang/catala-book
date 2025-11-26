# Fichier de configuration du projet

<div id="tocw"></div>

Cette section décrit entièrement le format de manifeste pour les fichiers de
configuration de projet. Le fichier `clerk.toml` contient des métadonnées qui
décrivent comment construire et empaqueter des programmes Catala dans un projet. Il est
écrit au [format TOML](https://toml.io/en/).

Un exemple de configuration `clerk.toml` est disponible dans la [section
3.1](3-1-directory-config.md#le-fichier-de-configuration-clerktoml).


## Format du manifeste

- `[project]` -- Table qui définit les options globales du projet.
  - [`include_dirs`](#include_dirs) -- Les répertoires d'emplacement des sources.
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
  - [`include_sources`](#include_sources) -- Drapeau pour inclure les fichiers sources dans la cible compilée.
  - [`include_objects`](#include_objects) -- Drapeau pour inclure les fichiers objets dans la cible compilée.
- [`[variables]`](#variables) -- Table pour surcharger les variables liées à la compilation.

### Options `[project]`

#### include_dirs

Définit dans quels répertoires `clerk` cherche les fichiers sources Catala.

Exemple : `include_dirs = ["src", "src/utils"]`

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

#### name

Nom donné à la cible. Cela créera un alias qui peut être utilisé
par clerk pour construire la cible spécifique ou lancer des tests dédiés.

Exemple : `name = "calcul_impot"`

Invoquer `$ clerk build calcul_impot` ne construira que la
cible `calcul_impot`.

#### modules

Modules qui seront utilisés pour compiler la `[[target]]` vers les backends
spécifiés.

Exemple : `modules = ["Section_121", "Section_132"]`

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

Par défaut `["ocaml"]` si omis.

#### include_sources

Spécifie s'il faut copier les fichiers sources générés par le backend (par exemple,
le `.c` ou `.java`) dans le répertoire `target`.

Exemple : `include_sources = true`

Par défaut `false`.

#### include_objects

Spécifie s'il faut copier les fichiers compilés générés par le backend (par exemple,
le `.o` ou `.class`) dans le répertoire `target`.

Exemple : `include_objects = true`

Par défaut `false`.

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
