# Commandes et processus

<div id="tocw"></div>

## `clerk build`

Construit les fichiers ou les cibles `clerk` listés dans votre [fichier `clerk.toml`](./6-1-clerk-toml.md).
Cette commande est assez polyvalente, et peut être utilisée pour construire des fichiers spécifiques
individuels dans n'importe lequel des backends autorisés par Catala (voir l'aide ci-dessous), mais
nous conseillons de n'utiliser `clerk build` qu'avec des cibles correctement définies
dans `clerk.toml`.

Les résultats de `clerk build` sont disponibles dans le répertoire `_targets` par
défaut, si vous n'avez pas spécifié un autre répertoire cible dans `clerk.toml`.
Chaque cible génère un ensemble de fichiers de code source dans les langages de programmation
cibles, générés par le compilateur Catala à partir des fichiers de code source
Catala. Veuillez vous référer au guide de [compilation et déploiement](./3-2-compilation-deployment.md)
pour plus d'exemples sur la façon d'utiliser `clerk build` et les artefacts
résultants.

```admonish info collapsible=true title="clerk build &dash;&dash;help"
<pre>
<!-- cmdrun clerk build --help=plain -->
</pre>
```

## `clerk test`

Découvre, construit et exécute les tests.

### Exécuter les tests

`clerk test` peut être utilisé sans aucun argument à la racine d'un
projet Catala, avec la sortie suivante :

```console
$ clerk test
┏━━━━━━━━━━━━━━━━━━━━━━━━  ALL TESTS PASSED  ━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                    ┃
┃             FAILED     PASSED      TOTAL                           ┃
┃   files          0         37         37                           ┃
┃   tests          0        261        261                           ┃
┃                                                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

La ligne `tests` de ce rapport compte le nombre de tests échoués et réussis.
La ligne `files` affiche le nombre de fichiers où soit tous les tests
passent, soit il y a au moins un test qui échoue.

Vous pouvez imprimer les détails sur les fichiers contenant des tests réussis et échoués
avec le drapeau `--verbose`. De plus, il est possible d'exécuter la
commande avec le drapeau `--xml` pour obtenir un rapport compatible JUnit.

Vous pouvez restreindre la portée des tests exécutés par `clerk test` en fournissant un autre argument :
* `clerk test <fichier>` exécutera uniquement les tests dans `<fichier>` ;
* `clerk test <dossier>` exécutera uniquement les tests à l'intérieur des fichiers dans `<dossier>` (ou ses sous-répertoires) ;
* `clerk test <cible>` exécutera uniquement les tests liés à la [construction `<cible>`](./6-1-clerk-toml.md).


~~~admonish info title="Qu'utilise `clerk test` pour exécuter les tests ?"
`clerk test` exécute les tests avec l'interpréteur Catala. Si votre déploiement
utilise un backend spécifique, disons python, il est fortement recommandé d'inclure également
une exécution de `clerk test --backend=python` dans votre CI. Avec cette option,
`clerk test` exécute Python sur le code Python généré par le compilateur Catala.
 De cette façon, vous serez protégé de l'éventualité qu'un bug dans le backend
que vous utilisez conduise à un résultat différent pour le même programme Catala. La confiance
n'exclut pas de vérifier minutieusement !
~~~

### Déclarer les tests

Catala supporte deux types distincts de tests, adaptés à des objectifs différents :

- **Les tests de champ d'application** devraient être le moyen principal d'écrire des tests qui valident
  des résultats attendus sur un calcul donné. C'est la façon naturelle d'automatiser les
  commandes `clerk run --scope=TestXxx` que vous utilisez pour exécuter vos tests manuellement.
- **Les tests Cram** fournissent un moyen d'exécuter des commandes catala personnalisées et de vérifier leur
  sortie sur `stdout` et `stderr`. Ils sont parfois utiles pour des besoins plus spécifiques,
  comme s'assurer que la bonne erreur est déclenchée dans une situation donnée.

La commande `clerk test` peut être exécutée sur n'importe quel fichier ou répertoire contenant des fichiers
catala, traitera les deux types de tests et imprimera un rapport.

#### Tests de champ d'application

Un **test de champ d'application** est un champ d'application qui est marqué avec l'[attribut](./5-8-1-attributes.md) "test" : écrivez simplement
`#[test]` juste avant son mot-clé `déclaration`.

```catala-code-fr
#[test]
déclaration champ d'application TestArrondiArgent:
  résultat resultat contenu argent
```

Il y a deux exigences pour un test de champ d'application :
- Le champ d'application doit être public (déclaré dans une section `` ```catala-metadata``) afin
  qu'il puisse être exécuté et vérifié dans des conditions réelles
- Il ne doit nécessiter aucune entrée : seules les variables `interne`, `résultat` et `contexte`
  sont autorisées

La sortie attendue du test doit être validée avec des instructions `assertion`.
Sans elles, la seule chose que le test validerait est que le calcul
ne déclenche pas d'erreur.

```catala-code-fr
champ d'application TestArrondiArgent:
  définition resultat égal à 100 € / 3
  assertion resultat = 33,33 €
```

Comme vu dans [le tutoriel](./2-1-basic-blocks.md#tester-le-code), un test de champ d'application
prend presque toujours la forme d'un appel au vrai champ d'application que vous voulez tester,
en lui fournissant des entrées spécifiques et un résultat attendu :

```catala-code-fr
#[test]
déclaration champ d'application Test_CalculImpotRevenu_1:
  résultat calcul contenu CalculImpotRevenu

champ d'application Test_CalculImpotRevenu_1:
  # Définir le calcul comme CalculImpotRevenu appliqué à des entrées spécifiques
  définition calcul égal à
    résultat de CalculImpotRevenu avec {
      -- individu:
        Individu {
          -- revenu: 20 000 €
          -- nombre_enfants: 0
        }
    }
  # Vérifier que le résultat est comme attendu
  assertion calcul.impot_revenu = 4 000 €
```

### Test Cram

Le test Cram (ou test CLI) fournit un moyen de valider la sortie d'une commande
Catala donnée, ce qui peut être utile dans des scénarios d'intégration plus spécifiques. Il
est inspiré par le système de test [Cram](https://bitheap.org/cram/), en ce sens qu'un
seul fichier source inclut à la fois la commande de test et sa sortie attendue.

Par exemple, vérifier qu'une erreur se produit quand attendu ne peut pas être fait avec
des tests de champ d'application, qui doivent réussir. Vous voudrez peut-être inclure des tests qui utilisent
`catala proof`. Ou vous pourriez vouloir, pour un test simple, valider que la trace est
exactement comme prévu. Pour cela, une section `` ```catala-test-cli`` doit être
introduite dans le fichier source Catala. La première ligne commence toujours par
`$ catala `, suivi de la commande Catala à exécuter sur le fichier actuel ; le
reste est la sortie attendue de la commande ; de plus, si la commande
s'est terminée avec une erreur, la dernière ligne affichera le code d'erreur.

~~~catala-fr
```catala-test-cli
$ catala interpret --scope=Test --trace
[LOG] ☛ Definition applied:
      ─➤ tutoriel.catala_fr:214.14-214.25:
          │
      214 │   définition calcul égal à
          │              ‾‾‾‾‾‾
      Test
[LOG] →  CalculImpotRevenu.direct
   ...
[LOG]   ≔  CalculImpotRevenu.direct.résultat: CalculImpotRevenu { -- impot_revenu: 4 000,00 € }
[LOG] ←  CalculImpotRevenu.direct
[LOG] ≔  Test.calcul: CalculImpotRevenu { -- impot_revenu: 4 000,00 € }
┌─[RESULT]─ Test ─
│ calcul = CalculImpotRevenu { -- impot_revenu: 4 000,00 € }
└─
```
~~~

Lors de l'exécution de `clerk test`, la commande spécifiée est exécutée sur le fichier ou répertoire (tronqué
à ce point). Si la sortie correspond exactement à ce qui est dans le fichier, les tests
passent. Sinon, il échoue, et les différences précises sont affichées côte à côte.

Attention, les tests cram ne peuvent pas être utilisés pour tester le code généré par le backend ; donc `clerk
  test --backend=...` n'exécutera pas les tests cram.

~~~admonish example title="`test-scope`"
Notez que pour ces `` ```catala-test-cli``, `$ catala test-scope Test` est un raccourci pour
```console
$ catala interpret --scope=Test
```
De plus, ils permettent d'exécuter le test avec des drapeaux variables en utilisant le drapeau `--test-flags` de `clerk
run`. Voir [`clerk test --help`](#admonition-clerk-test---help) pour les détails.
~~~

~~~admonish tip title="Réinitialiser la sortie attendue d'un test cram"
Si un test cram échoue, mais en raison d'une différence légitime (par exemple, un changement de numéro de ligne
dans l'exemple ci-dessus), il est possible d'exécuter
`clerk test --reset` pour mettre à jour automatiquement le résultat attendu. Cela fera
immédiatement passer le test cram, mais les systèmes de gestion de versions
et une revue de code standard mettront en évidence les changements.

`clerk test --reset` peut également être utilisé pour initialiser un nouveau test, à partir d'une
section `` ```catala-test-cli`` qui ne fournit que la commande sans sortie attendue.
~~~

```admonish info collapsible=true title="clerk test &dash;&dash;help"
<pre>
<!-- cmdrun clerk test --help=plain -->
</pre>
```

## `clerk ci`

Scanne le projet et exécute toutes les actions possibles. Cela inclut
l'interprétation de tous les tests catala et tests CLI (équivalent à
l'exécution de la commande [`clerk test`](#clerk-test)), et aussi, la construction de toutes les cibles clerk
(équivalent à l'exécution de la commande [`clerk build`](#clerk-build)) aux côtés de
l'exécution de leurs tests contre tous leurs backends définis. Cette
commande est utile pour l'exécution d'intégrations continues (CIs)
où toutes les actions de construction et de test sont souvent destinées à être exécutées.

```admonish info collapsible=true title="clerk ci &dash;&dash;help"
<pre>
<!-- cmdrun clerk ci --help=plain -->
</pre>
```

## `clerk run`

Exécute l'interpréteur Catala sur les fichiers donnés, après
avoir construit leurs dépendances. Le champ d'application à exécuter peut être spécifié
en utilisant l'option `-s`.

Au moment de la rédaction, `clerk run` est restreint aux champs d'application qui ne
nécessitent pas d'entrées, il est donc utilisé pour exécuter des tests de champ d'application.

### Exemple

`$ clerk run tests/tests_allocations_familiales.catala_fr -s Test1`

```admonish info collapsible=true title="clerk run &dash;&dash;help"
<pre>
<!-- cmdrun clerk run --help=plain -->
</pre>
```

## `clerk clean`

Supprime les fichiers et répertoires précédemment générés par `clerk`, notamment
le répertoire `_build` et `_targets`. Utile pour nettoyer la machine après
un travail CI ou pour s'assurer que vous n'incluez pas de fichiers périmés et anciens dans votre pipeline de construction.

```admonish info collapsible=true title="clerk clean &dash;&dash;help"
<pre>
<!-- cmdrun clerk clean --help=plain -->
</pre>
```
