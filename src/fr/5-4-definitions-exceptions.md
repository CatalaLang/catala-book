# Définitions et exceptions

<div id="tocw"></div>

Alors que la [section de référence précédente](./5-3-scopes-toplevel.md) couvrait la
déclaration des champs d'application (introduite par `déclaration champ d'application Foo`) qui doit être faite une fois
pour chaque champ d'application dans la base de code, cette section couvre la définition des variables de champ d'application
dispersées à travers la base de code de programmation littéraire (introduite par
`champ d'application Foo`).


~~~admonish info title="Tout se passe à l'intérieur d'un champ d'application"
Les définitions de variables de champ d'application et les assertions n'ont de sens qu'à l'intérieur d'un champ d'application donné,
c'est pourquoi tous les exemples ci-dessous montreront la fonctionnalité à l'intérieur d'un bloc `champ d'application Foo`
qui est supposé avoir déjà été déclaré ailleurs.
~~~

La syntaxe complète de ce qui sera couvert dans cette section est :

```catala-code-fr
champ d'application <nom_champ_application>:
  [étiquette <nom_étiquette>]
  [exception <nom_étiquette>]
  définition <nom_variable_champ_application>
    [de <paramètres>] [état <nom_état>]
    [sous condition <expression> conséquence]
    égal à <expression>

  assertion <expression>
```

## Définitions de variables de champ d'application

Les définitions de variables de champ d'application sont l'endroit où vivra la majeure partie du code Catala.
Définir une variable `bar` à l'intérieur du champ d'application `Foo` comme la valeur 42 est aussi simple que :

```catala-code-fr
champ d'application Foo:
  définition bar égal à 42
```

Bien sûr, vous pouvez remplacer 42 par n'importe quelle [expression](./5-5-expressions.md) tant qu'elle
a le type correct par rapport à la déclaration de la variable de champ d'application.

### Variables de champ d'application qui sont des fonctions

Si la variable de champ d'application que vous définissez est une variable de fonction, par exemple si `foo`
est une fonction du champ d'application `Foo` avec les arguments `x` et `y`, alors la syntaxe
pour définir la variable est :

```catala-code-fr
champ d'application Foo:
  définition foo de x, y égal à x + y
```

### Variables de champ d'application avec plusieurs états

Si la variable de champ d'application a plusieurs [états](./5-3-scopes-toplevel.md#variable-state-declarations),
par exemple si `bar` a les états `debut`, `milieu` et `fin`, alors la syntaxe pour définir
l'état `milieu` de la variable est :

```catala-code-fr
champ d'application Foo:
  définition bar état milieu égal à bar * 2
  # "bar" ci-dessus fait référence à la valeur de bar dans l'état précédent,
  # ici "debut"
```

Les états de variables et les fonctions se mélangent de cette façon :

```catala-code-fr
champ d'application Foo:
  définition foo de x, y état milieu égal à (foo de x, y) * 2 + x + y
```

### Variables de champ d'application qui sont `condition`

Les variables de champ d'application `condition` (variables de champ d'application booléennes avec une valeur par défaut
de `faux`) ont une syntaxe différente, adaptée aux juristes, pour les définitions :
`définition` est remplacé par `règle` et `égal à <expression>` est remplacé
par `rempli` ou `non rempli` :

```catala-code-fr
champ d'application Foo:
  # Les règles viennent généralement toujours sous la forme de définitions conditionnelles, voir ci-dessous
  règle bar sous condition [...] conséquence non rempli
```


## Définitions conditionnelles

La principale fonctionnalité de Catala est de pouvoir décomposer les définitions de variables
de champ d'application en plusieurs morceaux. En effet, les textes juridiques définissent souvent les choses
par morceaux dans plusieurs articles, chaque article traitant d'une situation spécifique
donnant une définition spécifique pour une quantité. Ce modèle est reflété dans
Catala sous la forme de définitions conditionnelles.

~~~admonish success title="Vous pouvez définir une variable plusieurs fois !"
Comme couvert dans le [tutoriel](./2-2-conditionals-exceptions.md), il est totalement
attendu en Catala qu'une variable de champ d'application donnée ait *plusieurs* définitions
dans la base de code. Le code "fonctionnera" car ces multiples définitions
sont conditionnelles, et chacune ne se déclenchera que si sa condition est remplie.
~~~

Les conditions sont introduites dans les définitions de variables de champ d'application juste avant
le mot-clé `égal à` avec la syntaxe suivante :

```catala-code-fr
champ d'application Foo:
  définition bar sous condition fizz >= 0 conséquence égal à 42
```

Suivez la [section pertinente du tutoriel](./2-2-conditionals-exceptions.md) pour
plus d'informations sur la façon d'utiliser les définitions conditionnelles pour encoder des dispositions juridiques.

~~~admonish tip title="Répéter la même condition sur plusieurs définitions"
Parfois, la même condition s'appliquera à plusieurs définitions regroupées dans le
même bloc `champ d'application`. Cela vient souvent d'une condition temporelle sur laquelle
les définitions s'appliquent, comme :

```catala-code-fr
champ d'application Foo:
  définition bar sous condition date_courante >= |2025-01-01|
  conséquence égal à [...]

  définition baz sous condition date_courante >= |2025-01-01|
  conséquence égal à [...]
```

Pour éviter de dupliquer `date_courante >= |2025-01-01|`, vous pouvez mettre la
condition directement sur le bloc de champ d'application avec :

```catala-code-fr
champ d'application Foo sous condition date_courante >= |2025-01-01|:
  définition bar égal à [...]

  définition baz égal à [...]
```
~~~

## Exceptions et priorités

Lorsqu'il y a plusieurs définitions conditionnelles ou non conditionnelles pour une variable
de champ d'application donnée, il est parfois nécessaire de désambiguïser laquelle va
prévaloir lorsque les conditions pour 2 définitions ou plus se déclenchent en même temps.
Cela se fait en définissant une structure d'exceptions entre les multiples
définitions de la même variable de champ d'application. Cette structure d'exceptions est en fait
un arbre, car vous pouvez avoir des exceptions d'exceptions.

Suivez la [section pertinente du tutoriel](./2-2-conditionals-exceptions.md) pour
plus d'informations sur la façon d'utiliser les exceptions pour encoder des dispositions juridiques.

### Déclarer une définition exceptionnelle à une seule définition de cas de base

Commençons par le cas le plus basique. Chaque nœud de l'arbre des exceptions pour une
variable de champ d'application donnée commence par une définition conditionnelle ou non conditionnelle.
Vous pouvez donner une étiquette à ce nœud de l'arbre avec la syntaxe `étiquette` :

```catala-code-fr
champ d'application Foo:
  étiquette cas_base définition bar égal à 42
```

Ensuite, plus tard dans la base de code, si vous voulez ajouter une exception à ce `cas_base`
de la définition de `bar`, vous le ferez avec la syntaxe :

```catala-code-fr
champ d'application Foo:
  # La ligne ci-dessous signifie que la définition actuelle est une exception *à*
  # l'autre définition avec l'étiquette "cas_base".
  exception cas_base
  définition bar
  sous condition fizz = 0
  conséquence égal à
    0
```

~~~admonish tip title="Dois-je donner une étiquette à chaque définition tout le temps ?"
Dans cette configuration avec une seule définition de cas de base et une définition exceptionnelle,
il n'y a qu'un seul choix quant à ce à quoi l'`exception` fait référence (l'autre
définition). Dans ces cas où il est non ambigu à quoi vous définissez
une exception, vous pouvez omettre l'`étiquette` et simplement écrire :

```catala-code-fr
champ d'application Foo:
  définition bar égal à 42

...

champ d'application Foo:
  exception définition bar
  sous condition fizz = 0
  conséquence égal à
    0
```

S'il y a une ambiguïté avec votre configuration utilisant ce format raccourci, le
compilateur Catala vous avertira. Quoi qu'il en soit, il est toujours plus clair et de meilleure pratique
de donner des étiquettes aux définitions, surtout avec des structures d'exception complexes.
~~~

### Déclarer plusieurs définitions comme une exception à une seule définition

Dans l'exemple précédent, `bar` était défini exceptionnellement à `0` si `fizz = 0`. Et
si vous voulez étendre ce comportement avec deux autres définitions exceptionnelles qui
définissent `bar` à `1` et `-1` respectivement lorsque `fizz > 0` et `fizz < 0` ? Ces
trois définitions exceptionnelles ne peuvent pas entrer en conflit les unes avec les autres car `fizz` est
soit positif, négatif ou 0. Donc, ces trois définitions exceptionnelles se comportent
comme une grande exception au cas de base (où `bar` est défini à `42`).

Pour regrouper les trois définitions exceptionnelles ensemble en Catala et les définir comme une
exception au cas de base, il suffit de donner aux trois définitions
exceptionnelles la même étiquette `fizz_exn` (vous pouvez choisir le nom de l'étiquette) et
l'indication d'exception :

```catala-code-fr
champ d'application Foo:
  étiquette cas_base définition bar égal à 42

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz = 0
  conséquence égal à
    0

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz > 0
  conséquence égal à
    1

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz < 0
  conséquence égal à
    -1
```

~~~admonish tip title="Pourrais-je omettre certaines étiquettes ici ?"
Les deux étiquettes `cas_base` et `fizz_exn` ci-dessus rendent très clair ce qui se
passe, au prix d'être un peu verbeux. Dans cet exemple, puisqu'il
n'y a qu'une seule définition dans le cas de base, il est non ambigu à quoi
les définitions exceptionnelles sont `exception`, et si elles sont toutes des exceptions
à la même chose sans aucune étiquette, elles seront regroupées implicitement ensemble.
Donc, vous auriez pu omettre toutes les étiquettes et écrire :

```catala-code-fr
champ d'application Foo:
  définition bar égal à 42

...

champ d'application Foo:
  exception définition bar
  sous condition fizz = 0
  conséquence égal à
    0

...

champ d'application Foo:
  exception définition bar
  sous condition fizz > 0
  conséquence égal à
    1

...

champ d'application Foo:
  exception définition bar
  sous condition fizz < 0
  conséquence égal à
    -1
```
~~~

### Déclarer plusieurs définitions comme une exception à un groupe de définitions

Pour construire sur notre exemple fil rouge, imaginez maintenant que la valeur de `bar` dans le
cas de base dérive avec le temps : `42` avant 2025 mais `43` après. Alors, vous avez besoin
de deux définitions conditionnelles dans le cas de base (ces deux définitions regroupées
sont toujours mutuellement exclusives). Cela est réalisé en Catala simplement en donnant
la même étiquette `cas_base` aux deux définitions de cas de base :

```catala-code-fr
champ d'application Foo:
  étiquette cas_base définition bar
  sous condition date_courante < |2025-01-01|
  conséquence égal à
    42

...

champ d'application Foo:
  étiquette cas_base définition bar
  sous condition date_courante >= |2025-01-01|
  conséquence égal à
    43

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz = 0
  conséquence égal à
    0

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz > 0
  conséquence égal à
    1

...

champ d'application Foo:
  étiquette fizz_exn
  exception cas_base
  définition bar
  sous condition fizz < 0
  conséquence égal à
    -1
```

~~~admonish tip title="Pourrais-je omettre certaines étiquettes ici ?"
Non ; ici la situation est déjà assez complexe pour créer une ambiguïté quant
à ce dont les règles exceptionnelles sont une exception.
~~~

### Empiler les exceptions, et plus encore

Les exemples précédents montrent comment utiliser la syntaxe `étiquette` et `exception`
pour regrouper des définitions ensemble et déclarer des priorités exceptionnelles. Cette syntaxe
est tout ce dont vous avez besoin ! En particulier, vous pouvez empiler les exceptions en définissant des chaînes
et des branches de relation `exception`, etc. Cela est couvert de manière extensive
dans la [section pertinente du tutoriel](./2-2-conditionals-exceptions.md).

## Appel de sous-champ d'application

Une fois que vous avez [déclaré un sous-champ d'application](./5-3-scopes-toplevel.md#sub-scopes-declarations),
vous devrez définir ses arguments en définissant les variables d'entrée du
sous-champ d'application dans le champ d'application. Par exemple, si le champ d'application `Foo` a un sous-champ d'application `bar` appelant
le champ d'application `Bar` qui a des variables d'entrée `fizz` et `buzz`, vous devrez définir
`bar.fizz` et `bar.fuzz` avec cette syntaxe :

```catala-code-fr
champ d'application Foo:
  définition bar.fizz égal à [...]

  définition bar.fuzz égal à [...]
```

Bien sûr, vous pouvez utiliser des exceptions et des définitions conditionnelles pour ces
définitions de variables d'entrée de sous-champ d'application.

Une fois que vous avez défini toutes les [variables d'entrée](./5-3-scopes-toplevel.md#input-variables) du champ d'application
(ainsi que certaines [variables de contexte](./5-3-scopes-toplevel.md#context-variables) si nécessaire),
vous pouvez simplement faire référence aux [variables de résultat](./5-3-scopes-toplevel.md#output-variables) du sous-champ d'application
dans des expressions ultérieures. Par exemple, si `Bar` a une variable de résultat `fizzbuzz`, alors
vous pouvez faire référence à `bar.fizzbuzz` comme le résultat de `fizzbuzz` lors de l'appel de `Bar`
avec les arguments `bar.fizz` et `bar.fuzz`.

## Assertions

Les assertions en Catala sont des [expressions](./5-5-expressions.md) attachées aux champs d'application
(elles peuvent dépendre des variables de champ d'application) qui doivent *toujours être vraies*. Elles peuvent être
utilisées pour :
* la validation des entrées et les préconditions de champ d'application ;
* vérifier des invariants logiques ;
* tester une sortie attendue.

Leur syntaxe est aussi simple que :

```catala-code-fr
champ d'application Foo:
  assertion bar + 2 = fizz * 4
```

## Mode d'arrondi des dates

Pour définir le mode d'arrondi du calcul de date vers le haut ou vers le bas (voir la
[section de référence pertinente](./5-2-types.md#semantic-of-date-addition)), pour
toutes les opérations de date à l'intérieur d'un champ d'application entier, utilisez cette syntaxe :

```catala-code-fr
# Supposons que vous vouliez définir le mode d'arrondi pour les opérations de date
# à l'intérieur du champ d'application Foo déclaré ailleurs
champ d'application Foo:
  date arrondi supérieur # arrondi à la date suivante
  # ou
  date arrondi inf # arrondi à la date précédente
```
