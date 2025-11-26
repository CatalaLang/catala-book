# Expressions

<div id="tocw"></div>

Les expressions en Catala représentent le cœur des règles de calcul, qui apparaissent dans les [définitions
de variables de champ d'application](./5-4-definitions-exceptions.md#definitions-and-exceptions) ou dans les [définitions
de constantes globales](./5-3-scopes-toplevel.md#constants).

~~~admonish tip title="Référence rapide de la grammaire BNF des expressions" collapsible=true
La forme de Backus-Naur ([BNF](https://fr.wikipedia.org/wiki/Forme_de_Backus-Naur)) est
un format pratique pour résumer ce qui compte comme une expression en Catala.
Si vous êtes familier avec ce format, vous pouvez le lire ci-dessous :
```text
<expr> ::=
  | (<expr 1>, <expr 2>, ...)                         # N-uplet
  | <expr>.<nom champ>                                # Accès champ structure
  | <expr>.<entier>                                   # Accès composant n-uplet
  | [<expr 1>; <expr 2>; ...]                         # Liste
  | <structure> { -- <nom champ 1>: <expr 1> -- ...}  # Valeur structure
  | <variante énum> contenu <expr>                    # Valeur énum
  | <expr 1> de <expr 2>, <expr 3>, ...               # Appel fonction
  | résultat de <nom champ d'application> avec        # Appel direct champ d'application
      {  -- <variable 1>: <expr 1> -- ... }
  | selon <expr> sous forme                           # Filtrage par motif
    -- <variante énum 1>: <expr 1>
    -- <variante énum 2> contenu <variable>: <expr 2>
  | <expr> sous forme <variante énum>                 # Test variante motif
  | <expr> sous forme <variante énum> contenu <variable> # Idem avec liaison contenu
      et <expr>                                       #   et test sur la variable
  | <expr> mais en remplaçant                         # Mises à jour partielles structure
      {  -- <variable 1>: <expr 1> -- ... }
  | - <expr>                                          # Négation
  | <expr>
    < + - * / et ou non ou bien > < >= <= == != > <expr> # Opérations binaires
  | si <expr 1> alors <expr 2> sinon <expr 3>         # Conditionnelles
  | soit <variable> égal à <expr 1> dans <expr 2>     # Liaison locale
  | ...                                               # Variable, littéraux,
                                                      # opérateurs de liste, ...
```
~~~

## Références à d'autres variables

À l'intérieur d'une expression, vous pouvez faire référence au nom d'autres variables du même
champ d'application, ou à des [constantes et fonctions de haut niveau](./5-3-scopes-toplevel.md#global-constant-and-functions-declarations-and-definitions).

~~~admonish info title="Accéder à un état particulier d'une variable de champ d'application"
Certaines variables de champ d'application peuvent avoir [plusieurs états](./5-4-definitions-exceptions.md#scope-variables-with-multiple-states).
Supposons que vous ayez une variable de champ d'application `foo` qui a les états `bar` et `baz` dans cet ordre.
Vous pouvez soit faire référence à `foo`, `foo état bar` ou `foo état baz`, mais la capacité
ou la signification de ces références dépend du contexte selon les règles suivantes.

* À l'intérieur de l'expression de `définition foo état bar`, vous ne pouvez pas faire référence à `foo`, ni `foo état bar`
  ni `foo état baz`, puisque `bar` est le premier état et `foo` est en cours de définition pour le premier état.
* À l'intérieur de l'expression de `définition foo état baz`, vous pouvez faire référence à `foo` et cela
  fera en fait référence à l'état précédemment défini pour `foo`, ici `bar`. Donc `foo`
  et `foo état bar` sont équivalents dans ce contexte, et vous ne pouvez pas faire référence à
  `foo état baz` puisqu'il est en cours de définition.
* En dehors des définitions de `foo`, vous pouvez faire référence à `foo état bar` et
  `foo état baz`. Si vous faites référence simplement à `foo`, cela prendra par défaut le dernier
  état, ici `baz`.
* Si `foo` est une variable `entrée` du champ d'application, alors son premier état ne peut pas
  être défini et sera valorisé par l'argument du champ d'application lorsqu'il est appelé.
~~~

Pour référencer une variable d'un autre [module](./5-6-modules.md), utilisez la syntaxe
`<nom du module>.<nom de la variable>`.

## Valeurs et opérations

Toutes les [valeurs et opérations](./5-2-types.md) présentées précédemment sont
des expressions à part entière.

## Parenthèses

Vous pouvez utiliser des parenthèses `(...)` autour de n'importe quelle partie ou sous-partie d'une expression
pour vous assurer que le compilateur comprendra correctement ce que vous tapez.

## Variables locales et liaisons let

À l'intérieur d'une `définition` complexe d'une variable de champ d'application, il est souvent utile de donner un nom à une
quantité intermédiaire pour promouvoir sa réutilisation, ou simplement pour rendre le [code plus
lisible](https://www.amazon.fr/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). Bien qu'il
soit toujours possible d'introduire une nouvelle [variable de
champ d'application](./5-3-scopes-toplevel.md#scope-variable-declarations) à cet effet, vous pouvez également utiliser une
variable locale plus légère qui n'affecte que l'expression courante. La syntaxe pour celles-ci est `soit foo
égal à ... dans ...`. Par exemple :

```catala-code-fr
champ d'application Bar:
  définition baz égal à
    soit foo égal à [4; 6; 5; 1] dans
    somme entier de foo - maximum de foo
```

~~~admonish info title="N-uplets et liaisons locales"
Si vous avez une valeur `x` de type `(entier, booléen)`, vous pouvez utiliser
`x.0` et `x.1` pour accéder aux deux composants du n-uplet. Mais vous pouvez aussi
lier les deux composants à deux nouvelles variables `y` et `z` avec :

```catala-expr-fr
soit (y, z) = x dans
si z alors y sinon 0
```

Cette syntaxe reflète l'utilisation plus générale des motifs dans les liaisons let dans les langages de programmation fonctionnelle
comme OCaml et Haskell. Cependant, pour le moment, seuls les n-uplets peuvent être
déstructurés de la sorte.
~~~

## Conditionnelles

Vous êtes encouragé à utiliser des [exceptions aux définitions de variables de
champ d'application](./5-4-definitions-exceptions.md#exceptions-and-priorities) pour encoder la logique cas de base/exception
des textes juridiques. Seules les exceptions et les définitions conditionnelles de variables de champ d'application
vous permettent de diviser votre code Catala en [petits
morceaux](./5-1-literate-programming.md#literate-programming), chacun attaché au morceau de texte juridique qu'il encode.

Cependant, parfois, il est tout simplement logique d'utiliser une conditionnelle classique à l'intérieur d'une expression pour
distinguer entre deux cas. Dans ce cas, utilisez le traditionnel `si ... alors ... sinon ...`. Notez
que vous devez inclure le `sinon` à chaque fois car cette conditionnelle est une expression produisant toujours
une valeur et non une instruction qui met à jour conditionnellement une cellule mémoire.

## Structures

Comme expliqué [précédemment](./5-2-types.md#structures), les valeurs de structure sont construites avec la
syntaxe suivante :

```catala-expr-fr
Individu {
  -- date_naissance: |1930-09-11|
  -- revenu: 100 000 €
  -- nombre_enfants: 2
}
```
Pour accéder au champ d'une structure, utilisez simplement la syntaxe <valeur struct>.<nom champ>, comme
`individu.revenu`.

~~~admonish tip title="Mettre à jour des structures de manière concise"
Supposons que vous ayez une valeur `foo` contenant une grande structure `Bar` avec une douzaine de champs,
y compris `baz`. Vous voulez obtenir une nouvelle valeur de structure similaire à `foo`
mais avec une valeur différente pour bar. Vous pourriez écrire :

```catala-expr-fr
Bar {
  -- baz: 42
  -- fizz: foo.fizz
  -- ...
}
```

Mais c'est très fastidieux car vous devez copier tous les champs. Au lieu de cela, vous pouvez
écrire :

```catala-expr-fr
foo mais en remplaçant { -- baz: 42 }
```
~~~

## Énumérations

Comme expliqué [précédemment](./5-2-types.md#enumerations), le type de chaque cas de l'énumération est
obligatoire et introduit par `contenu`. Il est possible d'imbriquer des énumérations (déclarer le type d'un
champ d'une énumération comme une autre énumération ou structure), mais pas récursivement.

Les valeurs d'énumération sont construites avec la syntaxe suivante :

```catala-expr-fr
# Premier cas
PasDeCreditImpot,
# Deuxième cas
CreditImpotPourIndividu contenu Individu {
    -- date_naissance: |1930-09-11|
    -- revenu: 100 000 €
    -- nombre_enfants: 2
},
# Troisième cas
CreditImpotApresDate contenu |2000-01-01|
```

## Filtrage par motif

Le filtrage par motif est une fonctionnalité populaire des langages de programmation qui vient de la programmation fonctionnelle,
introduite dans le grand public par [Rust](https://doc.rust-lang.org/book/ch19-00-patterns.html), mais
suivie par d'autres langages comme
[Java](https://docs.oracle.com/en/java/javase/17/language/pattern-matching.html) ou
[Python](https://peps.python.org/pep-0636/). En Catala, le filtrage par motif fonctionne
sur les valeurs d'énumération dont le type a été [déclaré par l'utilisateur](./5-2-types.md#enumerations).
Supposons que vous ayez déclaré le type

```catala-code-fr
déclaration énumération PasDeCreditImpot:
  -- PasDeCreditImpot
  -- CreditImpotPourIndividu contenu Individu
  -- CreditImpotApresDate contenu date
```

et vous avez une valeur `foo` de type `PasDeCreditImpot`. `foo` est soit une instance
de `PasDeCreditImpot`, soit `CreditImpotPourIndividu`, soit `CreditImpotApresDate`. Si
vous voulez utiliser `foo`, vous devez fournir des instructions pour ce qu'il faut faire dans chacun des
trois cas, puisque vous ne savez pas à l'avance lequel ce sera. C'est
le but du filtrage par motif ; dans chacun des cas, fournir une
expression produisant ce qui devrait être le résultat dans ce cas. Ces expressions de cas
peuvent également utiliser le contenu stocké à l'intérieur du cas des énumérations, rendant
le filtrage par motif un moyen puissant et intuitif d'"inspecter" le contenu imbriqué.
Par exemple, voici la syntaxe de filtrage par motif pour calculer le crédit d'impôt
dans notre exemple :

```catala-expr-fr
selon foo sous forme
-- PasDeCreditImpot: 0 €
-- CreditImpotPourIndividu contenu individu: individu.revenu * 10%
-- CreditImpotApresDate contenu date: si date_courante >= date alors 1000 € sinon 0 €
```

Dans `CreditImpotPourIndividu contenu individu`, alors que `CreditImpotPourIndividu` est
le nom du cas d'énumération inspecté, `individu` est un nom de variable
choisi par l'utilisateur représentant le contenu de ce cas d'énumération. En d'autres termes :
vous pouvez choisir votre propre nom pour la variable dans la syntaxe à cet endroit !

Il est important de noter que le filtrage par motif vous aide également à éviter d'oublier de gérer des cas.
En effet, si vous déclarez un cas dans le type mais l'oubliez dans le filtrage par motif,
vous obtiendrez une erreur du compilateur.

~~~admonish tip title="Cas attrape-tout dans le filtrage par motif"
Souvent, le résultat du filtrage par motif devrait être le même dans beaucoup de cas,
vous conduisant à répéter la même expression de résultat pour chaque cas d'énumération.
Pour la concision et la précision, vous pouvez utiliser le cas attrape-tout `n'importe quel` comme
le dernier cas de votre filtrage par motif. Par exemple, ici cela calcule si
vous devez appliquer un crédit d'impôt ou non :

```catala-expr-fr
selon foo sous forme
-- PasDeCreditImpot: vrai
-- n'importe quel: faux
```
~~~

~~~admonish info title="Tester un cas spécifique"
Vous pouvez créer un test booléen pour un cas spécifique d'une valeur énum avec
le filtrage par motif :

```catala-expr-fr
selon foo sous forme
-- CreditImpotPourIndividu contenu individu: vrai
-- n'importe quel: faux
```

Cependant, écrire ce filtrage par motif complet pour un simple test booléen
d'un cas spécifique est lourd. Catala offre un [sucre syntaxique](https://fr.wikipedia.org/wiki/Sucre_syntaxique)
pour rendre les choses plus concises ; le code ci-dessous est exactement équivalent au code
ci-dessus.

```catala-expr-fr
foo sous forme CreditImpotPourIndividu
```

Maintenant supposons que vous vouliez tester si `foo` est `CreditImpotPourIndividu`
et que le revenu de l'`individu` est supérieur à 10 000 €. Vous pourriez écrire :

```catala-expr-fr
selon foo sous forme
-- CreditImpotPourIndividu contenu individu: individu.revenu >= 10 000 €
-- n'importe quel: faux
```

Mais à la place vous pouvez aussi écrire le plus concis :

```catala-expr-fr
foo sous forme CreditImpotPourIndividu contenu individu et individu.revenu >= 10 000 €
```
~~~

~~~admonish question title="Le filtrage par motif de Catala est-il aussi puissant que celui d'OCaml ou Haskell ?" collapsible=true
Non, actuellement le filtrage par motif de Catala est basique et permet seulement de
faire correspondre le type d'énumération le plus externe de la valeur. L'équipe Catala a des
[plans](https://github.com/CatalaLang/catala/issues/199)
pour implémenter progressivement des fonctionnalités de filtrage par motif plus avancées, mais elles
n'ont pas encore été implémentées.
~~~

## N-uplets

Comme expliqué [précédemment](./5-2-types.md#tuples), vous pouvez construire des valeurs de n-uplet avec la
syntaxe suivante :

```catala-expr-fr
(|2024-04-01|, 30 €, 1%) # Cette valeur a le type (date, argent, décimal)
```

Vous pouvez également accéder au `n`-ième élément d'un n-uplet, commençant à `1`, avec la syntaxe `<n-uplet>.n`.

## Listes


Vous pouvez construire des valeurs de liste en utilisant la syntaxe suivante :

```catala-expr-fr
[1; 6; -4; 846645; 0]
```

Toutes les opérations disponibles pour les listes sont [disponibles sur la page de référence
pertinente](./5-2-types.md#list-operations).

## Appels de fonction

Pour appeler la fonction `foo` avec les arguments `1`, `baz` et `vrai`, la syntaxe est :

```catala-expr-fr
foo de 1, baz, vrai
```

Les fonctions que vous pouvez appeler sont soit des [fonctions de haut niveau](./5-3-scopes-toplevel.md#functions) définies par l'utilisateur,
soit des opérateurs intégrés comme [`accès_jour`](./5-2-types.md#date-operations). Pour appeler
un champ d'application comme une fonction, voir juste en dessous.

## Appels directs de champ d'application

L'équipe Catala préconise l'utilisation de [déclarations de
sous-champ d'application](./5-3-scopes-toplevel.md#sub-scopes-declarations) et d'[appel de
sous-champ d'application](./5-4-definitions-exceptions.md#sub-scope-calling) lorsque c'est possible (avec
un appel de sous-champ d'application unique et statique), car cela permet d'utiliser des définitions
conditionnelles et des exceptions sur les arguments du sous-champ d'application. Cependant, parfois
un champ d'application doit être appelé dynamiquement sous certaines conditions ou à l'intérieur d'une boucle,
ce qui rend impossible l'utilisation du mécanisme précédent. Dans ces situations, vous pouvez
utiliser des appels directs de champ d'application qui sont l'équivalent des appels directs de fonction, mais
pour les champs d'application, comme une expression. Par exemple, supposons que vous soyez à l'intérieur d'une expression
et que vous vouliez appeler le champ d'application `Foo` avec les arguments `bar` et `baz` ; la syntaxe est :

```catala-expr-fr
résultat de Foo avec {
  -- bar: 0
  -- baz: vrai
}
```

Notez que la valeur renvoyée par ce qui précède est la [structure de résultat du
champ d'application](./5-3-scopes-toplevel.md#scope-output-structure) de `Foo`, contenant
un champ par variable de résultat. Vous pouvez stocker cette valeur de résultat dans une [variable
locale](./5-5-expressions.md#local-variables-and-let-bindings) et ensuite
[accéder à ses champs](./5-5-expressions.md#structures) pour récupérer les valeurs
pour chaque variable de résultat.


## Cas "impossibles"

Lorsque certains cas ne sont pas censés se produire dans le flux d'exécution normal d'un
programme, ils peuvent être marqués comme `impossible`. Cela rend l'intention du
programmeur claire, et supprime le besoin d'écrire une valeur fictive. Si, pendant
l'exécution, `impossible` est atteint, le programme s'arrêtera avec une erreur fatale.

Il est conseillé de toujours accompagner `impossible` d'un commentaire justifiant pourquoi le
cas est jugé impossible.

`impossible` a le type `n'importe quel`, de sorte qu'il peut être utilisé à la place de n'importe quelle valeur.
Par exemple :

```catala-expr-fr
selon foo sous forme
-- CreditImpotPourIndividu contenu individu : individu.date_naissance
-- n'importe quel :
   impossible # Nous savons que foo n'est sous aucune autre forme à ce stade car...
```

Attention, toute valeur qui n'est pas gardée par des conditions peut être calculée,
même si elle n'est pas directement nécessaire pour calculer le résultat (en d'autres termes, Catala n'est pas
un langage _paresseux_). Par conséquent, `impossible` n'est pas adapté pour initialiser des champs de
structures, par exemple, même si ces champs ne sont jamais utilisés.
