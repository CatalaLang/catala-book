# Attributs

<div id="tocw"></div>


Le langage peut être étendu avec des attributs, permettant une variété d'extensions.
Un attribut est de la forme `#[clé.de.extension]` ou `#[clé.de.extension = VALEUR]`,
où `VALEUR` peut être de la forme `"CHAÎNE"`, ou une expression en syntaxe Catala.
Un attribut est toujours lié à l'élément qui le suit directement : une extension
pourrait par exemple les utiliser pour récupérer des étiquettes pour les champs d'entrée d'un
champ d'application afin de générer un formulaire web :

```catala-code-fr
déclaration champ d'application UnCalcul:
  #[form.label = "Entrez le nombre d'enfants satisfaisant la condition XXX"]
  entrée enfants_age contenu entier
```

## Attributs prédéfinis

Le compilateur Catala reconnaît un certain nombre d'attributs prédéfinis.

### `#[test]`

S'applique aux déclarations de champs d'application, pour indiquer leur rôle de
test. Voir [la section sur les tests](./3-3-test-ci.md#test-par-assertion).

### `#[doc]` or `##`

Associé à une déclaration, un champ de structure, un cas d'énumération ou un
argument de fonction, l'attribut `#[doc = "texte d'explication"]` permet de le
documenter. Cette information sera rendue disponible aux utilisateurs du module,
et devrait indiquer le rôle et les modalités d'utilisation de l'élément associé.

Un commentaire commençant par `##` est automatiquement interprété comme un
attribut de documentation de l'élément qui suit: cette syntaxe allégée `## texte
d'explication` est à privilégier.

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
