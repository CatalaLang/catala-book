# Attributs

<div id="tocw"></div>


Le langage peut être étendu avec des attributs, permettant une variété d'extensions.
Un attribut est de la forme `#[clé.de.extension]` ou `#[clé.de.extension = VALEUR]`,
où `VALEUR` peut être de la forme `"CHAÎNE"`, ou une expression en syntaxe Catala.
Un attribut est toujours lié à l'élément qui le suit directement. Par exemple,
le code suivant permet de relier l'attribut `doc` à la variable d'`entrée`
`enfants_âge` du champ d'application `UnCalcul` :

```catala-code-fr
déclaration champ d'application UnCalcul:
  #[doc = "Entrez le nombre d'enfants satisfaisant la condition XXX"]
  entrée enfants_âge contenu entier
```

## Attributs prédéfinis

Le compilateur Catala reconnaît un certain nombre d'attributs prédéfinis, ils
sont tous listés ci-dessous. Le tableau récapitule les effets de chaque
attribut prédéfini sur les différentes parties de l'outillage de Catala :

| Attribut                                | Attacéà   o               | Interprète  | Code généré    | Éditeur de cas de test | JSON Schema |
|-----------------------------------------|---------------------------|:-----------:|:--------------:|:----------------------:|:-----------:|
| `#[test]`                               | Scope declarations        | ✅          | ✅             | ✅                     |             |
| `#[doc = "..."]` or `##`                | Anything                  |             | ✅             |                        | ✅          |
| `#[description = "..."]`                | Anything                  |             |                | ✅                     |             |
| `#[error.message = "..."]`              | `impossible`, `assertion` | ✅          | ✅             |                        |             |
| `#[debug.print = "..."]`                | Any expression            | ✅          |                |                        |             |
| `#[implicit_position_argument]`         | Function declarations     | ✅          | ✅             |                        |             |
| `#[json = "..."]`                       | External expression       | ✅          | ✅             |                        |             |
| `#[testcase.testui]`                    | Test scope declaration    |             |                | ✅                     |             |
| `#[testcase.test_title = "..."]`        | Test scope declaration    |             |                | ✅                     |             |
| `#[testcase.uid = "..."]`               | Any expression            |             |                | ✅                     |             |
| `#[testcase.array_item_label = "..."]`  | Array items               |             |                | ✅                     |             |


### `#[test]`

S'applique aux déclarations de champs d'application, pour indiquer leur rôle de
test. Voir [la section sur les tests](./3-3-0-test-ci.md#test-par-assertion).

### `#[doc]` or `##`

Associé à une déclaration, un champ de structure, un cas d'énumération ou un
argument de fonction, l'attribut `#[doc = "texte d'explication"]` permet de le
documenter. Cette information sera rendue disponible aux utilisateurs du module,
et devrait indiquer le rôle et les modalités d'utilisation de l'élément associé.

Un commentaire commençant par `##` est automatiquement interprété comme un
attribut de documentation de l'élément qui suit: cette syntaxe allégée `## texte
d'explication` est à privilégier.

Les attributs de documentations attachés à un type ou des déclarations de  variables
de champ d'application sont propagées dans le [JSON Schema](./5-8-3-json-support.md)
généré en tant que propriété `description` des objets.

### `#[description]`

Attache une courte chaîne lisible à un élément, que les outils affichent à
côté de son identifiant. Contrairement à `#[doc]`, qui explique le rôle et
l'usage d'un élément, une description est une légende. Le compilateur
l'accepte sur les déclarations, champs de structure, cas d'énumération,
arguments de fonction et assertions ; la valeur doit être une chaîne. Pour
l'instant, l'outillage n'affiche que les descriptions des cas d'énumération
-- voir [l'éditeur de cas de
test](./7-1-test-gui.md#des-noms-lisibles-pour-les-cas-dénumération).

### `#[error.message]`

L'attribut `#[error.message = "message informatif"]` s'attache à une assertion
ou au mot-clef `impossible`. Si l'erreur est déclenchée, le message sera affiché
à l'utilisateur en plus des informations habituelles sur le type de l'erreur et
sa position d'origine dans le code. Le message est affiché lors de
l'interprétation, mais également dans les programmes générés en utilisant les
différents backends.

### `#[debug.print]`

Cet attribut s'applique à une expression et n'a d'effet que lors de
l'interprétation, si l'option `--debug` de `catala` est active (`-c--debug` si
exécuté depuis `clerk`). Une fois calculée, la valeur de l'expression attachée
sera affichée sur la console.

Un label peut être ajouté pour différencier plusieurs affichages de débug, de la
sorte: `#[debug.print = "variable 001"]`.

Attention: à cause de la façon dont fonctionne la compilation, il n'y a pas de
garantie sur l'affichage des messages de débug: en particulier, il peut arriver
qu'ils soient dupliqués ou disparaissent, suivant l'élément où ils apparaissent
et la présence du flag d'optimisation (`-O`). En cas de souci de ce type, il est
conseiller de déplacer l'attribut à la racine de la définition d'une variable
plutôt que sur un élément intermédiaire.

### `#[implicit_position_argument]`

Cet attribut s'applique à un paramètre de fonction de type `position_source`
uniquement. Il peut être utile en particulier lors de l'utilisation de [modules
externes](./5-8-2-external-modules.md)). Lorsqu'il est utilisé, le paramètre
concerné disparaît des appels à cette fonction, et sera renseigné implicitement
avec la position de l'appelant.

Le but est, dans le cas où une fonction définie dans un module a des
préconditions, de pouvoir signaler l'erreur comme venant du lieu d'appel plutôt
que de la fonction elle-même. Par exemple, lors d'un appel à
`Utils.division_custom de 2, 0`, donner la position où `division_custom` est
définie dans le module `Utils` ne serait pas très utile.

### `#[json]`

Utilisé pour fournir des valeurs de [types
externes](./5-8-2-external-modules.md#types-externes).

### `#[testcase.*]`

Ces attributs sont utilisés par l'[éditeur de cas de test](./7-1-test-gui.md).
Ils doivent être attachés à la déclaration du champ d'application utilisé
comme test, et souvent également marqué avec l'attribut `#[test]`.

Une déclaration de champ d'application de test produite par l'éditeur de cas
de test ressemblera ainsi à cela :


```catala-code-fr
#[test]
#[testcase.testui]
#[testcase.test_title = "Some computation"]
déclaration champ d'application UnCalcul :
  entrée enfants_âge contenu entier
  ...
```

#### `#[testcase.testui]`

Cet attribue signale à l'éditeur de cas de test que cette déclaration de
champ d'application est un test qui devrait être affiché dans l'éditeur. Cet
attribut doit toujours être accompagné de l'attribut `#[test]` puisque
des tests de l'éditeur de cas de test sont aussi des tests classiques.

#### `#[testcase.test_title]`

Affiche un titre pour le test, distinct du nom du champ d'application,
dans l'éditeur de cas de test.

#### `#[testcase.uid]`

Cet attribut stocke l'identifiant unique utilisé dans des applications
React pour identifier les différents composants React dans une liste. C'est
un item technique utilisé en interne par l'éditeur de cas de test.

#### `#[testcase.array_item_label]`

Affiche un nom pour l'élément de liste dans l'éditeur de cas de test.

## Plugin-supplied attributes

Le système d'attributs de Catala est extensible, et chaque plugin du compilateur
peut définir une liste d'attributs qui peuvent être parsés et transmis au plugin,
en plus de donner de nouvelles fonctionnalités et actions aux attributs prédéfinis.
