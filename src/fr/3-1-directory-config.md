# Structure des répertoires et configuration

<div id="tocw"></div>

La première étape lors de la création de votre projet Catala est de définir la structure des
répertoires et des fichiers qui contiendront votre code source. Dans cette section,
nous décrirons l'organisation et la configuration d'un projet Catala
contenant des fichiers de code source gérés par le système de construction `clerk`.

Pour commencer, nous vous encourageons vivement à mettre en place un système de gestion de versions
tel que [git](https://git-scm.com/) lors de la construction de votre projet ; cette pratique est
largement utilisée dans le développement logiciel et aide à suivre et maintenir les
contributions à votre code.

## Exemple de projet Clerk

Disons que vous avez un projet fictif qui a deux parties principales : une pour
calculer les codes fiscaux et une pour les aides au logement. La hiérarchie de fichiers suivante
montre un exemple de l'organisation habituelle pour un projet Catala :

```
mon-projet/
│   clerk.toml
├───src/
│   ├───code_impots/
│   │   │   article_121.catala_fr
│   │   │   article_132.catala_fr
│   │   │   ...
│   │
│   ├───aides_logement/
│   │   │   article_8.catala_fr
│   │   │   ...
│   │
│   └───commun/
│       │   prorata.catala_fr
│       │   foyer.catala_fr
│       │   ...
│
└───tests/
    │   test_impot_revenu.catala_fr
    │   test_aides_logement.catala_fr
```

Le projet est composé de plusieurs répertoires et d'un fichier de configuration de projet
`clerk.toml` :
- `src/` : contient les programmes Catala principaux. Ces programmes peuvent être
  davantage divisés en sous-répertoires pour séparer correctement votre
  processus de développement. Le sous-répertoire `src/commun/`, ici, contient certaines
  structures de données et utilitaires qui sont partagés par les deux autres
  composants.
- `tests/` : contient les tests dédiés de vos programmes Catala. Afin
  de ne pas encombrer votre logique avec des tests parasites, il est conseillé de
  créer des fichiers spécifiques et séparés contenant vos tests pour chaque module
  source.
- `clerk.toml` : le fichier de configuration d'un projet `clerk`.

~~~~~~admonish danger title="Déclarez vos modules !"
Chaque fichier source dans votre projet Catala est destiné à être son propre
module logique séparé (sauf en cas d'[inclusion textuelle](./5-1-programmation-litteraire.md#textual-inclusion)).
Les modules Catala sont des collections de champs d'application, de constantes de haut niveau et de fonctions
qui partagent le même espace de noms. De plus, les modules peuvent être importés dans d'autres
modules, vous permettant de modulariser votre base de code et de la garder propre et ordonnée.

Mais, seul et non préparé, un fichier source Catala n'est pas encore un module Catala ! Vous devez
déclarer le titre du module à l'intérieur du fichier source et créer l'interface
publique d'abord ; voir la [documentation dédiée](./5-6-modules.md) pour déclarer
et utiliser des modules.
~~~~~~

Avoir un tas de fichiers de code source Catala (correctement déclarés comme modules) stockés
dans les sous-répertoires du projet n'est pas encore suffisant pour que `clerk`
trouve ses marques et sache quoi faire. Vous devez le guider avec un fichier de configuration
déclaratif, `clerk.toml`.


## Le fichier de configuration `clerk.toml`

Ce fichier est utilisé pour configurer comment et ce que l'outil `clerk` est
censé construire et exécuter. Ce fichier de configuration doit être écrit
au format de configuration [TOML](https://toml.io/en/). Voici un
exemple de ce à quoi il devrait ressembler pour notre projet fictif (les commentaires sont
préfixés par le caractère #) :

~~~admonish note title="Fichier de configuration `clerk.toml` pour `mon-projet`"
```toml
[project]
include_dirs = [ "src/commun",              # Quels répertoires inclure
                 "src/code_impots",         # lors de la recherche de modules Catala
                 "src/aides_logement" ]     # et de dépendances.
build_dir    = "_build"    # Définit où sortir les fichiers compilés générés.
target_dir   = "_target"   # Définit où sortir les fichiers finaux des cibles.

# Chaque section [[target]] décrit une cible de construction pour le projet

[[target]]
name     = "code-impots-us"                       # Le nom de la cible
modules  = [ "Article_121", "Article_132", ... ]  # Composants modules
tests    = [ "tests/test_impot_revenu.catala_fr" ] # Test(s) associé(s)
backends = [ "c", "java" ]                        # Backends de langage de sortie

[[target]]
name     = "aides-logement"
modules  = [ "Article_8", ... ]
tests    = [ "tests/test_aides_logement.catala_fr" ]
backends = [ "ocaml", "c", "java" ]
```
~~~

Cet exemple de fichier `clerk.toml` décrit d'abord deux éléments de configuration à l'échelle du projet
(sous la section `[project]`) :
* dans quels répertoires `clerk` doit chercher les fichiers sources Catala lorsqu'il essaie de trouver des modules
  et des dépendances ;
* où sortir les fichiers compilés générés lors de la construction du projet et
  de ses cibles.

Les options `build_dir` et `target_dir` ont déjà pour valeur par défaut `"_build"` et
`"_target"` lorsqu'elles sont absentes, donc, ici elles peuvent être omises en toute sécurité.

Ensuite, le fichier de configuration définit deux composants `[[target]]`. Une cible dans un
projet Catala est un ensemble de modules Catala qui seront compilés vers un ou
plusieurs langages de programmation cibles, créant des bibliothèques sources prêtes à l'emploi
que vous pouvez ensuite importer et distribuer à d'autres applications dans votre système informatique.

Par exemple, la première cible est nommée `"code-impots-us"` (vous pouvez la choisir comme
vous le souhaitez) et empaquettera toutes les structures de données déclarées et les champs d'application définis
dans les `modules` donnés et leurs dépendances. Nous associons également des fichiers (ou répertoires) de
`tests` spécifiques liés à cette cible afin que nous puissions les exécuter
isolément si nécessaire. Enfin, nous définissons les `backends` de langage que cette
cible doit générer. Dans notre premier exemple, nous avons configuré la cible pour
traduire notre code en tant que bibliothèque `C` et en tant que paquet `Java`.


~~~admonish question title="Modules ou fichiers ?"
Le champ de configuration `modules` d'une section `[[target]]` nécessite une liste
de noms de modules, tandis que la section `tests` nécessite une liste de fichiers. Pourquoi cela ?

La raison derrière cette différence est que les `modules` contiennent la logique du
code Catala pour votre cible ; alors qu'un module Catala est généralement contenu
dans un seul fichier de code, l'[inclusion textuelle](./5-1-programmation-litteraire.md#textual-inclusion)
est souvent utilisée pour diviser le code d'un seul module sur plusieurs fichiers sources,
[correspondant à différentes sources juridiques](./3-5-juristes-agile.md#why-you-should-pick-the-legal-texts-for-the-literate-programming-in-catala).
Par conséquent, nous fournissons les noms de modules dans `clerk.toml` et laissons `clerk` comprendre
quels fichiers sources appartiennent à quel module pour plus de simplicité.

Les tests, cependant, sont une bête différente. Comme nous le verrons, un test est simplement un
champ d'application avec une marque spéciale `#[test]` dans un fichier, il n'a pas besoin d'être à l'intérieur d'un module correctement
déclaré. C'est pourquoi le champ `tests` de la section `[[target]]`
à l'intérieur de `clerk.toml` est une liste de fichiers, et non de modules.
~~~

Veuillez vous référer à la [référence complète de `clerk.toml`](./6-1-clerk-toml.md) pour
une liste exhaustive des options de configuration et de leurs valeurs possibles.

Maintenant que nous avons nos fichiers sources bien disposés dans leurs répertoires appropriés,
ainsi qu'un fichier de configuration de projet, nous détaillerons dans la section suivante comment
construire et déployer les livrables pour le projet.
