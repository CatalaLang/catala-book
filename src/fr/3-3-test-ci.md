# Processus de test et d'intégration continue

<div id="tocw"></div>


Dans la section précédente, nous avons défini un répertoire contenant un projet Catala avec
un fichier de configuration `clerk.toml` qui contenait deux cibles principales (`code-impots-us`
et `aides-logement`), que nous avons appris à compiler et déployer en C et Java. Maintenant,
assurons-nous que le code déployé est correct et pratiquons un peu de développement piloté par les tests !

~~~admonish info collapsible=true title="Récapitulatif de la section précédente : fichier de configuration `clerk.toml` et hiérarchie du projet"
Voici le fichier de configuration `clerk.toml` de notre projet fictif :
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
Hiérarchie des fichiers du projet :
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
~~~


## Mise en place des tests

Nous encourageons les développeurs Catala à écrire beaucoup de tests dans leurs projets !
Bien que vous puissiez écrire des tests n'importe où dans vos fichiers de code source Catala, nous
vous conseillons de les regrouper dans un dossier `tests` à la racine de
votre projet, avec des fichiers spécifiques remplis de tests pour un module spécifique dans `src`,
par exemple.

### Qu'est-ce qu'un test ?

En Catala, un test est un [champ d'application](./5-3-scopes-toplevel.md) sans variables d'entrée,
qui appelle le champ d'application ou la fonction que vous voulez tester avec des entrées codées en dur.
Par exemple, imaginez que l'un de vos fichiers `src`,
`src/impot_revenu.catala_fr`, contient la déclaration de champ d'application suivante (adaptée
et étendue de [plus tôt](./3-2-compilation-deployment.md))

~~~catala-fr
> Module Impot_revenu

```catala
déclaration énumération Declaration:
  -- Individuelle
  -- Conjointe contenu date

déclaration champ d'application CalculImpotRevenu:
  entrée revenu contenu argent
  entrée nombre_enfants contenu entier
  entrée declaration contenu Declaration

  résultat impot_revenu contenu argent
```
~~~

Ensuite, dans le fichier `tests/tests_impot_revenu.catala_fr`, vous pouvez écrire un test
pour le champ d'application `CalculImpotRevenu`. Bien qu'il n'y ait pas de format contraint
pour les tests en Catala, nous recommandons que vous suiviez ce modèle :

~~~catala-fr
> Usage de Impot_revenu

```catala
# D'abord, déclarez votre test
déclaration champ d'application TestImpotRevenu1: # Vous pouvez choisir n'importe quel nom pour votre test
  résultat calcul contenu Impot_revenu.CalculImpotRevenu # Mettez ici le champ d'application que vous voulez tester

# Ensuite, remplissez les entrées de votre test
champ d'application TestImpotRevenu1:
  définition calcul égal à
    résultat de Impot_revenu.CalculImpotRevenu avec {
      # Les entrées de ce test pour CalculImpotRevenu sont ci-dessous :
      -- revenu: 20 000 €
      -- nombre_enfants: 2
      -- declaration: Conjointe contenu |1998-04-03|
    }
```
~~~

Ce test est maintenant un programme valide. Vous pouvez l'exécuter avec :

```console
$ clerk run tests/tests_impot_revenu.catala_fr --scope=TestImpotRevenu1
┌─[RESULT]─ TestImpotRevenu1 ─
│ calcul =
│   Impot_revenu.CalculImpotRevenu {
│     -- impot_revenu: 5 000,00 €
│   }
└─
```

Maintenant, ce test devrait indiquer quelles sont les sorties *attendues*, à comparer
avec les sorties *calculées*. Il y a des façons de le faire avec Catala, selon
ce qui convient le mieux à votre cas d'utilisation. Le point de départ pour les deux méthodes est
exactement ce que nous avons décrit juste au-dessus. Les deux méthodes sont supportées par le
système de test de Catala, accessible via la commande `clerk test`.

### Test par assertion

Une façon de vérifier le résultat calculé est d'affirmer qu'il doit être égal à
une valeur attendue, en utilisant les [`assertion`s](./5-4-definitions-exceptions.md#assertions) de Catala.
Pour enregistrer un test par assertion dans `clerk test`, mettez simplement l'[attribut](./5-8-1-attributes.md) `#[test]` à la déclaration du champ d'application de test. Par exemple, voici
notre exemple de test configuré comme un test par assertion :

```catala-code-fr
#[test]
déclaration champ d'application TestImpotRevenu1:
  résultat calcul contenu CalculImpotRevenu

champ d'application TestImpotRevenu1:
  définition calcul égal à
    résultat de CalculImpotRevenu avec {
      # Les entrées de ce test pour CalculImpotRevenu sont ci-dessous :
      -- revenu: 20 000 €
      -- nombre_enfants: 2
      -- declaration: Conjointe contenu |1998-04-03|
    }
  assertion (calcul.impot_revenu = 5 000 €)
```

Bien sûr, l'`assertion` peut être aussi complexe que vous le souhaitez. Vous pouvez vérifier
le résultat de manière exhaustive ou partielle, vérifier si une propriété dépendant
de l'entrée est satisfaite, etc. Au moment du test, `clerk test` vérifiera seulement
si toutes les assertions que vous avez définies sont valides.

~~~admonish danger title="N'oubliez pas les assertions !"
Les tests basés sur des assertions nécessitent des assertions. Si vous mettez juste `#[test]` sans aucune
assertion dans votre test, il réussira quel que soit le résultat (puisque aucune
assertion n'échoue), ce qui n'est probablement pas ce que vous voulez pour un test.
~~~

~~~admonish success title="L'équipe Catala recommande les tests par assertion"
L'équipe Catala recommande l'utilisation des tests basés sur des assertions comme
méthode principale pour tester les projets, pour les tests unitaires ou de bout en bout.
Cela aide à prévenir toute régression indésirable future sur
votre base de code.
~~~

### Test Cram

La deuxième façon de vérifier le résultat attendu d'un calcul est simplement de
vérifier la sortie textuelle de l'exécution de la commande dans le terminal. C'est
appelé [test cram](https://bitheap.org/cram/). Pour activer les tests cram
dans Catala, vous devez spécifier :
1. quelle est la commande que vous voulez tester ;
2. quelle devrait être la sortie attendue du terminal.

Les tests Cram sont directement intégrés dans les fichiers de code source Catala, sous la forme d'un
bloc de code Markdown `` ```catala-test-cli ``. À l'intérieur, vous spécifiez quelle
commande tester après l'invite `$ catala ...`. Par exemple, la commande `interpret
--scope=TestImpotRevenu1` est équivalente à l'exécution de `clerk run
--scope=TestImpotRevenu1`. Ensuite suit un verbatim du résultat attendu tel qu'il est craché
par l'exécution de la commande sur le terminal.

Par exemple, voici comment créer un test cram à partir de notre exemple `CalculImpotRevenu`
ci-dessus :

~~~catala-fr
```catala
déclaration champ d'application TestImpotRevenu1:
  résultat calcul contenu CalculImpotRevenu

champ d'application TestImpotRevenu1:
  définition calcul égal à
    résultat de CalculImpotRevenu avec {
      # Les entrées de ce test pour CalculImpotRevenu sont ci-dessous :
      -- revenu: 20 000 €
      -- nombre_enfants: 2
      -- declaration: Conjointe contenu |1998-04-03|
    }
```

```catala-test-cli
$ catala interpret --scope=TestImpotRevenu1
┌─[RESULT]─ TestImpotRevenu1 ─
│ calcul =
│   Impot_revenu.CalculImpotRevenu {
│     -- impot_revenu: 5 000,00 €
│   }
└─
```
~~~

`clerk test` récupérera les blocs `` ```catala-test-cli `` , exécutera la commande
à l'intérieur, et comparera la sortie avec la sortie attendue.

Rappelez-vous qu'au-delà de `interpret`, vous pouvez mettre n'importe quelle commande Catala
acceptable sur un test cram. Voir la [référence](./6-2-commands-workflow.md#clerk-test)
pour plus de détails.


~~~admonish info title="Utilisez les tests cram uniquement lorsque les tests basés sur des assertions ne suffisent pas"
Vérifier la sortie du terminal d'une commande au lieu d'affirmer des valeurs est fragile
et peut introduire beaucoup de bruit lors de la vérification des sorties de test. Par exemple,
changer le nom d'un type peut casser la sortie du terminal tout en n'ayant aucun
effet sur une assertion dans votre test.

Par conséquent, l'équipe Catala recommande d'utiliser des tests basés sur des assertions lorsque c'est possible,
et d'utiliser uniquement les tests cram pour vérifier ce que le compilateur sort avec des
options spécifiques et des commandes différentes de `clerk run`.
~~~

## Exécuter les tests et obtenir des rapports

Simple : exécutez simplement `clerk test` ! Par défaut, il scannera tout votre projet à la recherche
de `#[test]` ou `` ```catala-test-cli `` dans vos fichiers, exécutera le test,
vérifiera la sortie attendue. Si tout est bon, vous obtiendrez dans votre terminal
un rapport comme :

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                       ┃
┃             FAILED     PASSED      TOTAL                              ┃
┃   files          0         34         34                              ┃
┃   tests          0        245        245                              ┃
┃                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Bien sûr, les nombres dépendent du nombre de tests et de fichiers de test qu'il y a dans votre
projet (ne vous inquiétez pas s'ils sont plus bas pour vous).

Si un `#[test]` basé sur une assertion échoue, vous obtiendrez un rapport supplémentaire imprimant pourquoi
l'assertion a échoué, avec la commande exacte que vous pouvez exécuter pour reproduire l'
échec :

```text
■ scope Test TestImpotRevenu1
  $ catala interpret -I code_impots --scope=TestImpotRevenu1
    tests/tests_impot_revenu.catala_fr:34 Assertion failed: 5 000,00 € = 4 500,00 €
```

Les tests cram échoués produiront également un rapport détaillé avec un diff entre la
sortie attendue et calculée du terminal.

## Pipelines CI

Maintenant que vous avez appris à déclarer vos tests, à les exécuter et à lire les rapports,
vous êtes prêt pour le développement piloté par les tests en local. Mais le génie logiciel
moderne nécessite une vérification par un tiers des tests avant que le code ne soit fusionné
dans la base de code principale. C'est l'un des objectifs des configurations d'intégration continue,
et nous discuterons ici de la façon de les mettre en place avec Catala.

### Images Docker

Une configuration d'intégration continue commence généralement par le déploiement d'une
machine virtuelle ou d'un conteneur basé sur le cloud équipé de toutes les dépendances nécessaires
pour construire votre code et exécuter vos tests.

~~~admonish info title="Images CI Catala"
Pour vous éviter les tracas de l'installation manuelle de Catala et de la configuration de votre
machine virtuelle, l'équipe Catala fournit des images [Docker](https://www.docker.com/) prêtes à l'emploi pour
la CI basées sur [Alpine Linux](https://www.alpinelinux.org/).

Vous pouvez les parcourir [ici](https://gitlab.inria.fr/catala/ci-images/container_registry/4100)
ou les récupérer avec :

```console
$ docker pull registry.gitlab.inria.fr/catala/ci-images:latest
```

Notez que `latest-c` est une version de l'image CI complétée par les
dépendances nécessaires pour compiler et exécuter du code C ; de même pour `latest-java`,
`latest-python`. Choisissez l'image qui convient à vos besoins, ou construisez par-dessus dans
votre propre Dockerfile.
~~~

### Workflow d'intégration continue

Maintenant, cette étape dépend de ce que vous utilisez comme forge de développement logiciel. De nos jours,
toutes ont un moyen de déclarer des pipelines déclenchés lors de certains événements
(commits sur une branche, sur une PR, sur une fusion, etc). Ces pipelines lancent des exécuteurs
qui exécutent certaines commandes, généralement pour exécuter le test ou construire un artefact.

Ce guide ne vous apprendra pas comment écrire ces fichiers de pipeline, veuillez
vous référer à la documentation de votre forge logicielle. Cependant, pour vous donner une idée
rapide, voici un exemple de fichier de workflow GitHub Actions pour les projets hébergés sur Github pour notre
exemple de projet Catala :

```yaml
name: CI

on:
  push:

jobs:
  tests:
    name: Test suite and build
    container:
      image: registry.gitlab.inria.fr/catala/ci-images:latest-c
      options: --user root
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run test suite with the Catala interpreter and backends
        run: opam exec -- clerk ci
```

Le `opam exec` est important car `clerk` est installé
via opam et la chaîne d'outils logicielle OCaml dans les images CI.

~~~admonish question title="Que fait `clerk ci` ?"
Conçu pour être mis dans une exécution CI, `clerk ci` est simplement un raccourci pour :
* `clerk test` sur tout votre projet ;
* `clerk build` pour toutes les cibles déclarées dans votre `clerk.toml`
* `clerk test --backend=...` pour tous les backends déclarés dans chacune de
  vos cibles dans `clerk.toml`.

Cela garantit que tout se construit, et que tous les tests passent avec l'interpréteur
**et** à l'intérieur du code généré dans chaque backend. Difficile d'obtenir plus d'assurance
que cela !
~~~

### Récupérer les artefacts et les déployer

À l'intérieur de votre pipeline CI, après une exécution de `clerk ci` ou `clerk build`, vous devriez
trouver le code source généré pour chaque backend de chaque cible à l'intérieur du
dossier `_targets` (rappelez-vous la [section précédente du guide](./3-2-compilation-deployment.md)).
À partir de là, vous pouvez personnaliser votre fichier de pipeline pour récupérer l'artefact,
l'empaqueter comme vous le souhaitez, le transférer vers un autre dépôt, construire une application plus grande
qui l'intègre, etc.

## Conclusion

Merci d'avoir suivi ce guide ! Nous espérons qu'il vous met sur la voie
d'un projet Catala réussi. Veuillez lire la [référence `clerk`](./6-clerk.md)
pour plus d'informations sur ce que notre système de construction peut faire pour vous aider.
