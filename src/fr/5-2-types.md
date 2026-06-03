# Types, valeurs et opérations

<div id="tocw"></div>

~~~admonish info title="Catala est un langage fortement typé"
Chaque valeur manipulée par les programmes Catala a un type bien défini qui est
soit intégré, soit déclaré par l'utilisateur. Cette section de la référence du
langage résume tous les différents types de types, comment les déclarer et
comment construire des valeurs de ce type.
~~~

## Types de base

Les types et valeurs suivants sont intégrés à Catala, s'appuyant sur des
mots-clés du langage.

### Booléens

Le type `booléen` n'a que deux valeurs, `vrai` et `faux`.

#### Opérations booléennes

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `et` | booléen | booléen | booléen | Et logique (strict) |
| `ou` | booléen | booléen | booléen | Ou logique (strict) |
| `ou bien` | booléen | booléen | booléen | Ou exclusif logique (strict) |
| `non` | booléen | | booléen | Négation logique |

#### Comparaisons

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `=`, `!=` | tout sauf fonctions | même que le premier argument | booléen | Égalité structurelle |
| `>`, `>=`, `<`, `<=` | tout sauf fonctions | même que le premier argument | booléen | Comparaison usuelle |

* La comparaison de durées d'unités différentes déclenche une erreur à
  l'exécution (en raison de cas tels que `1 mois > 30 jour` pour lesquels on ne
  peut pas définir de réponse)
* La comparaison de structures est lexicographique, dans l'ordre où les champs
  ont été déclarés. C'est-à-dire que le premier champ des deux valeurs est
  d'abord comparé ; s'il est égal, on compare le champ suivant ; et ainsi de
  suite.
* La comparaison des énumérations suit les règles suivantes:
  - si les deux valeurs ont le même constructeur, les valeurs encapsulées sont
    comparées
  - sinon, le constructeur apparaissant le plus haut lors de la déclaration de
    l'énumération est considéré comme le plus petit
* Comparer des fonctions déclenche une erreur à l'exécution

### Opérations sur les entiers

Le type `entier` représente les entiers mathématiques, comme `564 614` ou `-2`.
Notez que vous pouvez optionnellement utiliser le séparateur de nombres ` ` (espace) pour
rendre les grands entiers plus lisibles.

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `+` | entier | entier | entier | Addition entière |
| `-` | entier | entier | entier | Soustraction entière |
| `-` | entier | | entier | Négation entière |
| `*` | entier | entier | entier | Multiplication entière |
| `/` | entier | entier | décimal | Division rationnelle |
| `entier de` | décimal, argent | | entier | Conversion (arrondi au plus proche) |

Voir aussi le [module `Entier` de la bibliothèque standard](./5-7-standard-library.md#module-entier) pour
plus d'opérations.

### Décimaux

Le type `décimal` représente les nombres décimaux mathématiques (ou *rationnels*),
comme `0,21` ou `-988 453,6842541`. Notez que vous pouvez optionnellement utiliser le
séparateur de nombres ` ` (espace) pour rendre les grands décimaux plus lisibles. Les nombres
décimaux sont stockés avec une précision infinie en Catala, mais vous pouvez les
[arrondir](./5-5-expressions.md#rounding) à volonté.

~~~admonish tip title="Pourcentages"
Un pourcentage est juste une valeur décimale, donc en Catala vous aurez `30% = 0,30`
et vous pouvez utiliser la notation `%` si cela rend votre code plus facile à lire.
~~~

#### Opérations sur les décimaux

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `+` | décimal | décimal | décimal | Addition rationnelle |
| `-` | décimal | décimal | décimal | Soustraction rationnelle |
| `-` | décimal | | décimal | Négation rationnelle |
| `*` | décimal | décimal | décimal | Multiplication rationnelle |
| `/` | décimal | décimal | décimal | Division rationnelle |
| `arrondi de` | décimal | | décimal | Arrondi à l'unité la plus proche |
| `décimal de` | entier, argent | | décimal | Conversion |

Voir aussi le [module `Décimal` de la bibliothèque standard](./5-7-standard-library.md#module-decimal) pour
plus d'opérations.

### Argent

Le type `argent` représente un montant d'argent, positif ou négatif, dans une
unité monétaire (dans la version française de Catala, le symbole monétaire `€`
est utilisé), avec une précision au centime et pas en dessous. Les valeurs monétaires sont
notées comme des valeurs décimales avec au maximum deux chiffres fractionnaires et le
symbole monétaire, comme `12,36 €` ou `-871 84,1 €`.


#### Opérations sur l'argent

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `+` | argent | argent | argent | Addition monétaire |
| `-` | argent | argent | argent | Soustraction monétaire |
| `-` | argent | | argent | Négation monétaire |
| `/` | argent | argent | décimal | Division rationnelle |
| `arrondi de` | argent | | argent | Arrondi à l'unité la plus proche |
| `argent de` | entier, décimal | | argent | Conversion (arrondi au centime le plus proche) |

Voir aussi le [module `Argent` de la bibliothèque standard](./5-7-standard-library.md#module-argent) pour
plus d'opérations.


### Dates

Le type `date` représente des dates dans le [calendrier
grégorien](https://fr.wikipedia.org/wiki/Calendrier_gr%C3%A9gorien). Ce type
ne peut pas représenter de dates invalides comme `2025-02-31`. Les valeurs de ce type sont
notées suivant la notation [ISO8601](https://fr.wikipedia.org/wiki/ISO_8601) (`AAAA-MM-JJ`)
entourée de barres verticales, comme `|1930-09-11|` ou `|2012-02-03|`.

#### Sémantique de l'addition de dates

~~~admonish info title="L'addition de dates est ambiguë et mal définie dans d'autres langages"
Lors de la conception de Catala, l'équipe Catala a remarqué que la question
"*Qu'est-ce que le 31 janvier + 1 mois ?*" n'avait pas de réponse consensuelle en informatique.

* En Java, ce sera le 28/29 février selon l'année bissextile.
* En Python, il est impossible d'ajouter des mois avec la bibliothèque standard.
* Dans `coreutils`, cela donne le 3 mars (!).

Étant donné l'importance des calculs de dates dans les implémentations juridiques, l'équipe
Catala a décidé de régler ce désordre et a décrit ses résultats dans un article de recherche :

[Monat, R., Fromherz, A., Merigoux, D. (2024). Formalizing Date Arithmetic and Statically Detecting Ambiguities for the Law. In: Weirich, S. (eds) Programming Languages and Systems. ESOP 2024. Lecture Notes in Computer Science, vol 14577. Springer, Cham. https://doi.org/10.1007/978-3-031-57267-8_16](https://rmonat.fr/data/pubs/2024/2024-04-08_esop_dates.pdf)
~~~

L'addition de dates en Catala consiste à ajouter une durée à une date, donnant une nouvelle date dans le passé ou dans le futur
selon que la durée est négative ou positive. La valeur de cette nouvelle date dépend du
contenu de la durée :
* si la durée est un nombre de jours, alors Catala ajoutera ou soustraira simplement ce nombre de jours au jour de la date originale,
  en passant aux mois précédents ou suivants si nécessaire ;
* si la durée est un nombre d'années (disons, `x`), alors Catala se comportera comme si la durée était de `12 * x mois` ;
* si la durée est un nombre de mois, Catala ajoutera ou soustraira simplement ce nombre de mois au mois de la date originale,
  en passant à l'année précédente ou suivante si nécessaire ; mais cette opération pourrait donner une date invalide (comme 31 janv. + 1 mois -> 31 fév.),
  qui doit être arrondie.

Il existe trois modes d'arrondi en Catala, dont la description est ci-dessous :


| Mode d'arrondi | Sémantique | Exemple |
|---|---|---|
| Pas d'arrondi | Erreur d'exécution si date invalide | `31 janv. + 1 mois` échoue avec `AmbiguousDateComputation` |
| Arrondi supérieur | Premier jour du mois suivant | `31 janv. + 1 mois = 1er mars` |
| Arrondi inférieur | Dernier jour du mois précédent | `31 janv. + 1 mois = 28/29 fév.` (selon année bissextile) |

Par défaut, Catala est en mode "Pas d'arrondi". Pour définir le mode d'arrondi vers le haut ou vers le bas, pour toutes les opérations de date
à l'intérieur d'un champ d'application entier, voir la [section de référence pertinente](./5-4-definitions-exceptions.md#date-rounding-mode).

Enfin, si la durée à ajouter est composée de plusieurs unités (comme `2 mois + 21 jour`), alors Catala commencera par ajouter
la composante avec la plus grande unité (ici, `mois`), puis la composante avec la plus petite unité (ici, `jour`).

#### Opérations sur les dates

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `+` | date | durée | date | Addition de date (voir ci-dessus) |
| `-` | date | durée | date | Soustraction de date |
| `-` | date | date | durée | Nombre de jours entre les dates |
| `Date.accès_jour de` | date | | entier | Jour dans le mois (1..31) |
| `Date.accès_mois de` | date | | entier | Mois dans l'année (1..12) |
| `Date.accès_année de` | date | | entier | Numéro de l'année |
| `Date.premier_jour_du_mois de` | date | | date | Premier jour du mois |
| `Date.dernier_jour_du_mois de` | date | | date | Dernier jour du mois |

Voir aussi le [module `Date` de la bibliothèque standard](./5-7-standard-library.md#module-date) pour
plus d'opérations.

### Durées

Le type `durée` représente des durées en termes de jours, mois et/ou années,
comme `254 jour`, `4 mois` ou `1 an`. Les durées peuvent être négatives et combiner
un nombre de jours et de mois ensemble, comme `1 mois + 15 jour`.

~~~admonish danger title="Les durées en jours et en mois sont incomparables"
Il est toujours vrai qu'en termes de durées, `1 an = 12 mois`. Cependant,
parce que les mois ont un nombre variable de jours, comparer des durées en jours
à des durées en mois est ambigu et nécessite des interprétations juridiques.

Pour cette raison, Catala lèvera une erreur d'exécution lors de la tentative d'effectuer une telle comparaison.
De plus, la différence entre deux dates donnera toujours une durée exprimée
en jours.
~~~

#### Opérations sur les durées

| Symbole | Type du premier argument | Type du second argument | Type du résultat | Sémantique |
|---|---|---|---|---|
| `+` | durée | durée | durée | Ajouter le nombre de jours, mois, années |
| `-` | durée | durée | durée | Ajouter la durée opposée |
| `-` | durée | | durée | Nier les composantes de la durée |
| `*` | durée | entier | durée | Multiplier le nombre de jours, mois, années |


## Conversion des types numériques de base

La conversion entre les types de base est explicite ; la syntaxe est `<nom du type désiré> de <argument>`.

| Type de l'argument | Type du résultat | Sémantique |
|---|---|---|
| décimal | entier | Troncature |
| entier | décimal | Valeur conservée |
| décimal | argent | Arrondi au centime le plus proche |
| argent | décimal | Valeur conservée |
| argent | entier | Troncature à l'unité la plus proche |
| entier | argent | Valeur conservée |

## Types déclarés par l'utilisateur

Les types déclarés par l'utilisateur doivent être déclarés avant d'être utilisés dans le reste du
programme. Cependant, la déclaration n'a pas besoin d'être placée avant l'utilisation dans l'ordre
textuel.

### Structures

Les structures combinent plusieurs éléments de données ensemble dans un seul type. Chaque
élément de données est un "champ" de la structure. Si vous avez une structure, vous pouvez
accéder à chacun de ses champs, mais vous avez besoin de tous les champs pour construire la valeur de la structure.

Les types de structure sont déclarés par l'utilisateur, et chaque type de structure a un nom
choisi par l'utilisateur. Les noms de structure commencent par une majuscule et doivent suivre
la convention de nommage `CamelCase`. Un exemple de déclaration de structure est :

```catala-code-fr
déclaration structure Individu:
  donnée date_naissance contenu date
  donnée revenu contenu argent
  donnée nombre_enfants contenu entier
```

Le type de chaque champ de la structure est obligatoire et introduit par `contenu`.
Il est possible d'imbriquer des structures (déclarer le type d'un champ d'une structure
comme une autre structure ou énumération), mais pas récursivement.

Les valeurs de structure sont construites avec la syntaxe suivante :

```catala-expr-fr
Individu {
  -- date_naissance: |1930-09-11|
  -- revenu: 100 000 €
  -- nombre_enfants: 2
}
```

Pour accéder au champ d'une structure, utilisez simplement la syntaxe `<valeur struct>.<nom champ>`,
comme `individu.revenu`.

### Énumérations

Les énumérations représentent une alternative entre différents choix, chacun
encapsulant un modèle spécifique de données. En ce sens, les énumérations sont
des ["types somme"](https://fr.wikipedia.org/wiki/Type_somme) à part entière comme
dans les langages de programmation fonctionnelle, et plus puissantes que les énumérations de type C
qui listent juste des codes alternatifs qu'une valeur peut avoir. Chaque choix ou alternative
de l'énumération est appelé un "cas" ou une "variante".

Les types d'énumération sont déclarés par l'utilisateur, et chaque type d'énumération a un nom
choisi par l'utilisateur. Les noms d'énumération commencent par une majuscule et doivent suivre
la convention de nommage `CamelCase`. Un exemple de déclaration d'énumération est :

```catala-code-fr
déclaration énumération PasDeCreditImpot:
  -- PasDeCreditImpot
  -- CreditImpotPourIndividu contenu Individu
  -- CreditImpotApresDate contenu date
```


Le type de chaque cas de l'énumération est obligatoire et introduit par
`contenu`. Il est possible d'imbriquer des énumérations (déclarer le type d'un champ d'une
énumération comme une autre énumération ou structure), mais pas récursivement.

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

Pour inspecter les valeurs d'énumération, voir dans quel cas vous êtes et utiliser les données
associées, utilisez le [filtrage par motif](./5-5-expressions.md#pattern-matching).

## Listes

Le type `liste de <autre type>` représente un tableau de taille fixe d'un autre type.
Par exemple, `liste de entier` représente un tableau de taille fixe d'entiers.

Vous pouvez construire des valeurs de liste en utilisant la syntaxe suivante :

```catala-expr-fr
[1; 6; -4; 846645; 0]
```

### Opérations sur les listes

| Syntaxe | Type du résultat | Sémantique |
|---|---|---|
| `<liste> contient <élément>` | booléen | `vrai` si `<liste>` contient `<élément>`, faux sinon |
| `nombre de <liste>` | entier | Longueur de la liste |
| `existe <var> parmi <liste> tel que <expr>` | booléen | `vrai` si au moins un élément de `liste` satisfait `<expr>` |
| `pour tout <var> parmi <liste> on a <expr>` | booléen | `vrai` si tous les éléments de `liste` satisfont `<expr>` |
| `transforme chaque <var> parmi <liste> en <expr>` | liste | Transformation élément par élément, créant une nouvelle liste avec `<expr>` |
| `liste de <var> parmi <liste> tel que <expr>` | liste | Crée une nouvelle liste avec seulement les éléments satisfaisant `<expr>` |
| `transforme chaque <var> parmi <liste> tel que <expr1>` en <expr2>` | liste | Combine le filtrage et la transformation (voir deux dernières opérations) |
| `<liste1> ++ <liste2>` | liste | Concaténer deux listes |
| `maximum de <liste> (ou si liste vide alors <expr>)` | type des éléments | Renvoie l'élément maximum de la liste (ou un défaut optionnel) |
| `minimum de <liste> (ou si liste vide alors <expr>)` | type des éléments | Renvoie l'élément minimum de la liste (ou un défaut optionnel) |
| `contenu de <var> parmi <liste> tel que <expr>`  | optionnel(type des élements) | Retourne le premier élément de la liste qui satisfait `<expr>` |
| `contenu de <var> parmi <liste> tel que <expr1> est maximum (ou si liste vide alors <expr2>)` | type des éléments | Renvoie l'élément arg-maximum de la liste (ou un défaut optionnel) |
| `contenu de <var> parmi <liste> tel que <expr1> est minimum (ou si liste vide alors <expr2>)` | type des éléments | Renvoie l'élément arg-minimum de la liste (ou un défaut optionnel) |
| `combine tout <var> parmi <liste> dans <acc> initialement <expr1> avec <expr2>` | type des éléments | [Plie](https://fr.wikipedia.org/wiki/Fold_(fonction_d%27ordre_sup%C3%A9rieur)) `<liste>`, commençant avec `<expr1>` et accumulant avec `<expr2>` |
| `trie <liste> par ordre croissant` | liste | Utilise l'ordre par défaut sur les éléments de la liste |
| `trie <liste> par ordre décroissant` | liste | Utilise l'ordre par défaut sur les éléments de la liste |
| `trie tout <var> parmi <liste> par ordre croissant de <expr1> (puis <expr2>...)` | liste | Utilise l'ordre par défaut sur le résultat de `<expr1>` etc.  |
| `trie tout <var> parmi <liste> par ordre décroissant de <expr1> (puis <expr2>...)` | liste |  Utilise l'ordre par défaut sur le résultat de `<expr1>` etc.  |

~~~admonish tip title="Itérer sur plusieurs listes en même temps"
Ces opérations sur les listes reflètent le contenu d'une [bibliothèque de listes de base pour un langage de
programmation fonctionnelle](https://ocaml.org/manual/latest/api/List.html). Mais dans
une telle bibliothèque de listes, une fonctionnalité clé est la capacité d'itérer sur deux ou plusieurs
listes en même temps pour les combiner élément par élément. En Catala, cela peut être
fait simplement en écrivant un [n-uplet](./5-5-expressions.md#tuples) de listes au lieu
d'une `<liste>` à l'intérieur des opérations ; alors vous avez un n-uplet de `<var>` au lieu
d'un seul pour correspondre aux éléments de chaque liste dans le n-uplet de listes. Par exemple,

```catala-expr-fr
transforme chaque (x, y) parmi (lst1, lst2) en x + y
```

Cela fonctionne aussi avec `existe`, `pour tout`, `liste de`, `combine`, etc.
Notez que si `lst1` et `lst2` n'ont pas la même longueur, le programme Catala
s'arrêtera avec une erreur d'exécution.
~~~

## N-uplets

Le type `(<type 1>, <type 2>)` représente une paire d'éléments, le premier étant
de `type 1`, le second étant `type 2`. Il est possible d'étendre le type paire
en un type triplet, ou même un `n`-uplet pour un nombre arbitraire `n` en
répétant les éléments après `,`.

Vous pouvez construire des valeurs de n-uplet avec la syntaxe suivante :

```catala-expr-fr
(|2024-04-01|, 30 €, 1%) # Cette valeur a le type (date, argent, décimal)
```
Vous pouvez accéder au `n`-ième élément d'un n-uplet, commençant à `1`, avec la syntaxe `<n-uplet>.n`.

## Valeurs optionnelles

Le type `optionnel de <type>` peut être utilisé pour contenir une valeur de `<type>` qui pourrait
être absente. Par exemple, `optionnel de entier` est équivalent à l'énumération :

```catala-code-fr
déclaration énumération EntierOptionnel:
  -- Absent
  -- Présent contenu entier
```

Mais l'avantage de `optionnel de entier` par rapport à un tel `EntierOptionnel` est
qu'il n'a pas besoin d'être déclaré pour chaque type avec lequel il est utilisé. Comme une
énumération, les valeurs de type `optionnel` peuvent être créées en utilisant `Présent contenu
<expr>`, et utilisées dans les formes `selon <expr> sous forme` et `<expr> sous
forme <constr>`, par ex.

```catala-expr-fr
si foo sous forme Présent de bar et bar > 3 alors ...
```

## Fonctions

Les types de fonction représentent des valeurs de fonction, *c'est-à-dire* des valeurs qui nécessitent d'être appelées
avec des arguments pour produire un résultat. Les fonctions sont des valeurs de première classe car
Catala est un [langage de programmation
fonctionnelle](https://fr.wikipedia.org/wiki/Programmation_fonctionnelle).

La syntaxe générale pour décrire un type de fonction est :

```text
<type du résultat> dépend de
  <nom de l'argument 1> contenu <type de l'argument 1>,
  <nom de l'argument 2> contenu <type de l'argument 2>,
  ...
```

Par exemple, `argent dépend de revenu contenu argent, nombre_enfants contenu
entier` peut être le type d'une fonction de calcul d'impôt.

Cependant, contrairement à la plupart des langages de programmation, il n'est pas possible de construire directement
une fonction comme une valeur ; les fonctions sont créées et passées avec d'autres
mécanismes du langage.

### Fonctions polymorphes

Une fonctionnalité clé d'un langage de programmation est sa capacité à éviter la duplication de code ;
le programmeur devrait réutiliser autant de code que possible à travers des
abstractions, telles que des fonctions et des modules. De plus, une fonctionnalité standard du
génie logiciel moderne est le
[polymorphisme](https://fr.wikipedia.org/wiki/Polymorphisme_(informatique)),
*c'est-à-dire* écrire des morceaux de code qui peuvent opérer sur plusieurs types de valeurs à
la fois, évitant au programmeur la nécessité de dupliquer le même code plusieurs
fois selon le type des arguments.


~~~admonish question title="Que signifie le polymorphisme dans différents langages de programmation ?"
Le polymorphisme peut être implémenté de plusieurs manières selon le langage de
programmation. Java a des classes abstraites et des interfaces, C++ a des templates, Python
et Javascript ont une résolution dynamique des méthodes. Catala, étant un langage de programmation
fonctionnelle typé statiquement, a une façon de faire du polymorphisme qui
est inspirée par les mécanismes de base présents en OCaml.
~~~

Concrètement, lors de la définition d'une fonction en Catala, vous pouvez donner le type `n'importe quel`
à un argument ou au type de retour. Cela signifie que lorsque vous appelez la fonction,
vous pouvez l'appeler avec un argument qui a n'importe lequel des types possibles. Nous pouvons appeler
un tel argument "générique", ou dire qu'il a un type "joker". Par exemple, il est
pratique de pouvoir écrire la fonction `est_vide` une fois pour des listes d'
éléments de n'importe quel type :

```catala-code-fr
déclaration est_vide contenu booléen
  dépend de argument contenu liste de n'importe quel
  égal à (nombre de argument = 0)
```

Bien que les arguments génériques soient puissants, ils ont aussi l'inconvénient que
vous ne pouvez pas vraiment "faire" grand-chose avec une valeur qui a le type `n'importe quel` puisque
vous ne savez pas quel type elle a. En particulier, il est impossible d'utiliser
les opérateurs comme `+`, `*`, `-`, `/`, `<=`, etc. puisque ces opérateurs ne
fonctionnent que pour les types de base (`entier`, `décimal`, etc.) et pas tous les autres
types qui peuvent être définis par l'utilisateur (structures, énumérations, etc.).

Parfois, il y a plusieurs arguments génériques ou types de retour dans la même
fonction mais vous voulez qu'ils *partagent le même type générique*. Par exemple, si une
fonction inverse les éléments d'une liste, le type des éléments de la liste sera
le même à l'entrée et à la sortie de la fonction. Les types `n'importe quel` peuvent être _nommés_ à
cette fin, en utilisant `n'importe quel de type <nom>`. Par exemple :

```catala-code-fr
déclaration inverser contenu liste de n'importe quel de type type_element
  dépend de argument contenu liste de n'importe quel de type type_element
```

Si vous ne nommez pas le type `n'importe quel` explicitement, il sera supposé que
chaque `n'importe quel` est un `n'importe quel` frais et indépendant des autres `n'importe quel`.
Cela peut conduire à des messages d'erreur complexes du compilateur, alors rappelez-vous de donner
le même nom aux types `n'importe quel` que vous savez devoir être liés ensemble.

Les signatures de fonctions polymorphes peuvent être vraiment utiles lors de la définition d'interfaces pour
des [modules implémentés en externe](./5-6-modules.md#declaring-external-modules).
