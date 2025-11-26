# Champs d'application, fonctions et constantes

<div id="tocw"></div>

~~~admonish info title="Le code Catala va à l'intérieur des champs d'application"
Puisque Catala est un langage fonctionnel, les déclarations de haut niveau en Catala
se comportent comme des fonctions. Bien que Catala possède de véritables fonctions de haut niveau, l'équipe Catala
conseille de limiter leur utilisation en pratique et d'utiliser des champs d'application à la place, car seuls les champs d'application bénéficient
du mécanisme d'[exceptions](./5-4-definitions-exceptions.md) qui est
la fonctionnalité phare de Catala.
~~~

## Déclarations de champ d'application

Un champ d'application est une fonction dont le prototype (*c'est-à-dire* la signature) est explicitement déclaré,
et dont le corps peut être dispersé en petits morceaux à travers la base de code de programmation littéraire.

Vous devez déclarer (`déclaration champ d'application Foo ...`) une fois à un endroit dans le
code ; ensuite vous pouvez utiliser ce champ d'application (`champ d'application Foo`) pour ajouter des [définitions
de variables](./5-4-definitions-exceptions.md) plusieurs fois et n'importe où ailleurs
dans votre base de code.

Les sections de référence suivantes vous indiquent comment écrire la déclaration de champ d'application. Comme
divulgâchage, voici un exemple complet pour un champ d'application minimal nommé `Min` avec deux
variables, `a` et `b` :

```catala-code-fr
déclaration champ d'application Min:
  entrée a contenu entier
  résultat b contenu décimal
```

~~~admonish warning title="Cette section ne couvre que les déclarations de champ d'application"
Pour des informations sur le corps du champ d'application, y compris les définitions de variables
de champ d'application, consultez les sections de référence sur les [définitions et exceptions](./5-4-definitions-exceptions.md)
ou les [expressions](./5-5-expressions.md).
~~~

### Nom du champ d'application

Les déclarations de champ d'application commencent par la déclaration du nom du champ d'application. Les noms de champ d'application commencent
par une majuscule et suivent la convention CamelCase. Une déclaration de champ d'application est un
élément de haut niveau à l'intérieur d'un bloc de code Catala. Par exemple, si vous voulez nommer votre
champ d'application `Foo`, alors sa déclaration commence par :

```catala-code-fr
déclaration champ d'application Foo:
   ...
```

Le contenu de la déclaration de champ d'application (à l'intérieur des `...`) est composé de :
* déclarations de variables de champ d'application ;
* sous-champs d'application appelés dans le champ d'application.

Ces deux éléments sont décrits ci-dessous.

### Déclarations de variables de champ d'application

Après le nom du champ d'application viennent les variables de champ d'application dans la déclaration de champ d'application. Les variables de champ d'application
sont similaires aux variables locales dans une fonction. Leur déclaration comporte :
* leur statut entrée/résultat ;
* leur nom ;
* leur type ;
* optionnellement, une liste d'états pour la variable.

Les noms de variables commencent par une minuscule et suivent la convention snake_case.
La syntaxe pour la déclaration de la variable `bar` est :

```text
<statut entrée/résultat> bar contenu <type> [<liste d'états de variable>]
```

```admonish info title="Un exemple de déclaration de champ d'application"
Voici la syntaxe pour déclarer le champ d'application `Foo` avec les variables locales
`baz`, `fizz` et `buzz` ; `baz` est une entrée booléenne, `fizz` est une variable
interne de type date avec deux états `avant` et `après`, et `buzz` est un
décimal qui est à la fois entrée et résultat du champ d'application :

~~~catala-code-fr
déclaration champ d'application Foo:
  entrée baz contenu booléen
  interne fizz contenu date
    état avant
    état après
  entrée résultat buzz contenu décimal
    dépend de arg contenu date
~~~
```

Les explications pour le statut entrée/résultat, les types de variables et les états de variables suivent ci-dessous.

#### Qualificateurs d'entrée/résultat

Il existe six types de qualificateurs d'entrée/résultat :
* `entrée`
* `résultat`
* `interne`
* `contexte`
* `entrée résultat`
* `contexte résultat`

##### Variables d'entrée

Les variables d'entrée nécessitent qu'une valeur soit fournie lorsque le champ d'application est appelé,
comme un argument de fonction. Elles ne peuvent pas être redéfinies à l'intérieur du champ d'application.


##### Variables de résultat

Les variables de résultat sont définies à l'intérieur du champ d'application, et leur valeur est renvoyée
comme partie du résultat de l'appel du champ d'application.

##### Variables internes

Lorsqu'une variable n'est ni une entrée ni un résultat du champ d'application, elle doit être
qualifiée d'`interne`.

##### Variables de contexte

Les variables de contexte sont essentiellement des entrées optionnelles au champ d'application avec une valeur
par défaut définie à l'intérieur du champ d'application. Supposons que le champ d'application `Foo` a une variable de contexte
`bar`. Si vous fournissez une valeur `x` pour `bar` lors de l'appel de `Foo`, le calcul de `Foo`
considérera que `bar = x`. Mais si vous ne fournissez pas de valeur
pour `bar` lors de l'appel de `Foo`, `Foo` prendra comme valeur `bar` la définition
existante de `bar` à l'intérieur de `Foo`.

~~~admonish question title="Pourquoi des variables de contexte ?"
Ce comportement curieux pour la variable `contexte` est motivé par des cas d'utilisation où
l'on veut créer une exception pour une variable de champ d'application depuis l'*extérieur* du champ d'application.
Voir la [FAQ](./4-2-catala-specific.md#how-do-i-add-an-exception-from-outside-a-scope) Catala
pour plus d'explications.
~~~

##### Variables d'entrée et de résultat

Parfois, on veut que l'entrée d'un champ d'application soit copiée et transmise comme partie du
résultat de l'appel du champ d'application. C'est-à-dire qu'une telle variable serait à la fois `entrée` et
`résultat`, c'est pourquoi la syntaxe pour cela est `entrée résultat`. Dans ce cas, la
variable ne peut pas être définie à l'intérieur du champ d'application (car c'est une entrée). Cela fonctionne aussi
en remplaçant `entrée` par `contexte`.

#### Types de variables et fonctions

Le type de la variable suivant le mot-clé `contenu` peut être n'importe quel identifiant de type
décrit dans la [référence des types](./5-2-types.md), y compris les
[types de fonction](./5-2-types.md#functions).

#### Variables de champ d'application `condition`

Une syntaxe spéciale existe pour le cas spécifique d'une variable de champ d'application
booléenne dont la valeur par défaut est `faux`. Ce cas correspond directement à une condition
juridique, il est donc nommé `condition` en Catala. La syntaxe pour déclarer une
variable de champ d'application `condition` (ici nommée `bar`, avec un qualificateur `interne`) est :

```catala-code-fr
déclaration champ d'application Foo:
  interne bar condition
```

Les variables `condition` ont également une syntaxe spéciale pour les définitions
(voir la [section de référence pertinente](./5-4-definitions-exceptions.md#scope-variables-that-are-condition)).

#### Déclarations d'états de variable

Comme mentionné dans le [tutoriel](./2-4-states-dynamic.md#variable-states),
il est possible de distinguer plusieurs états pendant le calcul de la
valeur finale de la variable. Les états se comportent comme une chaîne de variables,
la suivante utilisant la valeur de la précédente pour son calcul.

La liste ordonnée des états que la variable prend pendant le calcul est déclarée
aux côtés de la variable. Par exemple, si la variable entière interne `foo` a les états
`a`, `b` et `c` dans cet ordre, alors `foo` doit être déclarée avec :

```catala-code-fr
déclaration champ d'application Foo:
  interne foo contenu entier
    état a
    état b
    état c
```

L'ordre des clauses `état` dans la déclaration détermine l'ordre de calcul
entre les états pour la variable. Vous pouvez écrire `foo état a` pour la valeur de
la variable `foo` pendant l'état `a`. Avec cet ordre entre `a`, `b` et `c`, `foo
état b` peut dépendre de `foo état a` et `foo état c` peut dépendre de `foo état
b`, mais pas l'inverse.

### Structure de résultat du champ d'application

Toutes les variables qualifiées de `résultat` dans un champ d'application feront partie du résultat de
l'appel du champ d'application. Ce résultat est matérialisé comme une structure, avec chaque
variable de résultat correspondant à un champ de la structure. Cette structure de résultat
du champ d'application est utilisable comme n'importe quel autre type de structure déclaré par l'utilisateur.

Par exemple, si j'ai la déclaration de champ d'application :

```catala-code-fr
déclaration champ d'application Foo:
  résultat bar contenu entier
  résultat baz contenu décimal

  interne fizz contenu booléen
  entrée buzz contenu date
```

Alors implicitement, une structure de résultat également nommée `Foo` sera utilisable comme si elle avait la
déclaration suivante :

```catala-code-fr
déclaration structure Foo:
  donnée bar contenu entier
  donnée baz contenu décimal
```

Cette déclaration implicite de structure de résultat est utile pour transporter le
résultat d'un appel de champ d'application dans une autre variable et les réutiliser plus tard dans le code.

### Déclarations de sous-champs d'application

Les champs d'application sont des fonctions, et en tant que tels, ils peuvent être appelés comme des fonctions. Appeler
un champ d'application peut être fait à l'intérieur de n'importe quelle [expression](./5-5-expressions.md#direct-scope-call)
en fournissant simplement les variables d'entrée comme arguments.

Mais parfois, on sait que l'on effectuera toujours un seul appel statique de
*sous-champ d'application* depuis un champ d'application appelant. Pour cette situation, Catala a une syntaxe
déclarative spéciale rendant plus facile pour les juristes de comprendre ce qui se passe.

Les sous-champs d'application sont déclarés dans la déclaration de champ d'application comme des variables de champ d'application.
Par exemple, si à l'intérieur du champ d'application `Foo` vous appelez le champ d'application `Bar` exactement une fois,
alors vous écrirez :

```catala-code-fr
déclaration champ d'application Foo:
  appel_bar champ d'application Bar
```

`appel_bar` est le nom (de votre choix) qui désignera cette instance spécifique
d'appel de `Bar` à l'intérieur de `Foo`. Vous pouvez avoir plusieurs appels statiques au
même champ d'application comme :

```catala-code-fr
déclaration champ d'application Foo:
  premier_appel_bar champ d'application Bar
  second_appel_bar champ d'application Bar
```

Vous pouvez également préfixer par `résultat` la ligne `appel_bar champ d'application Bar`, assurant
que la structure de résultat de l'appel à `Bar` sera présente comme champ
`appel_bar` de la structure de résultat de l'appel à `Foo`.

Comme avec les structures et les énumérations, il n'est pas possible pour ces appels de champ d'application
d'être récursifs.

Voir [appel de sous-champ d'application](./5-4-definitions-exceptions.md#sub-scope-calling) pour
savoir comment fournir des arguments à l'appel de sous-champ d'application et récupérer les résultats.

## Déclarations et définitions de constantes et fonctions globales

Bien que les champs d'application soient le cheval de bataille des implémentations Catala, il y a parfois
de petites choses qui n'ont pas besoin d'être à l'intérieur d'un champ d'application à part entière. Par exemple,
déclarer de petites fonctions utilitaires comme `exces_de` qui calcule l'excès du
premier argument par rapport au second, ou déclarer une constante pour le nombre de
secondes dans une journée.

Pour cela, Catala permet la déclaration de constantes et fonctions globales,
qui ne sont pas liées à un champ d'application particulier.

~~~admonish danger title="Ne pas utiliser les champs d'application signifie passer à côté du cœur de Catala"
Puisque les champs d'application sont similaires aux fonctions, il est possible d'utiliser des déclarations
de fonctions régulières pour émuler toutes les fonctionnalités des champs d'application. Pourquoi les champs d'application existent-ils
en premier lieu alors ?

Parce que les champs d'application permettent la définition d'exceptions pour leurs variables, ce qui
est impossible avec les déclarations de fonctions et de constantes régulières. Les exceptions sont
la fonctionnalité phare de Catala, et utiliser Catala sans utiliser les exceptions n'a
aucun sens ; utilisez un langage de programmation régulier à la place.

Par conséquent, la déclaration de constantes et de fonctions ne doit être utilisée que pour leur
usage prévu. La règle générale est : si une définition de constante ou de variable
prend plus de quelques lignes de code, elle devrait être transformée en champ d'application !
~~~

### Constantes

Pour déclarer et définir globalement une constante `foo` de type `<type>` (n'importe quel élément
dans la [référence des types](./5-2-types.md)) avec la valeur `<expr>` (n'importe quelle
[expression](./5-5-expressions.md) de type `<type>`), utilisez la syntaxe suivante :

```catala-code-fr
déclaration foo contenu <type> égal à <expr>
```

Par exemple :

```catala-code-fr
déclaration foo contenu booléen égal à vrai
déclaration bar contenu entier égal à 4643 * 876 - 524
```

### Fonctions

Si le type de la constante que vous déclarez et définissez est un [type de fonction](./5-2-types.md),
alors la constante devient une fonction globale gratuitement. Par exemple :

```catala-code-fr
déclaration foo contenu est_rond contenu booléen
  dépend de x contenu décimal
  égal à
    arrondi de x = x

déclaration exces_de contenu argent
  dépend de
    arg contenu argent,
    seuil contenu argent
  égal à
    si arg >= seuil
    alors arg - seuil
    sinon 0 €
```
