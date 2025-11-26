# Questions spécifiques à Catala

<div id="tocw"></div>

## Quand choisir `condition`, `règle` plutôt que des booléens ?

Vous avez peut‑être remarqué les mots‑clés `condition` et `règle` dans les champs d'application Catala, par exemple :

```catala-code-fr
déclaration champ d'application Foo:
  entrée i contenu entier
  résultat x condition

champ d'application Foo:
  règle x sous condition i = 42 conséquence rempli
```

Le programme ci‑dessus est strictement équivalent à celui‑ci :

```catala-code-fr
déclaration champ d'application Foo:
  entrée i contenu entier
  résultat x contenu booléen

champ d'application Foo:
  définition x égal à faux

  exception définition x sous condition i = 42 conséquence égal à vrai
```

Comme l'exemple le montre, `condition` est un [sucre syntaxique](https://fr.wikipedia.org/wiki/Sucre_syntaxique) pour déclarer une variable booléenne dont la valeur par défaut est `faux`. Dans le corps du champ d'application, on utilise `règle` au lieu de `définition` pour préciser sous quelles conditions la `condition` doit être `rempli` (`vrai`) ou `non rempli` (`faux`). Il est possible d'utiliser `exception` et `étiquette` sur des règles comme sur des définitions, mais toutes les `règle` sont implicitement des exceptions d'un cas de base où la condition vaut `faux`.

Ce comportement pour `condition` et `rule` correspond à l'intuition juridique et rend cette syntaxe plus lisible pour des morceaux de programme où l'on construit une valeur booléenne selon des cas.

## Pourquoi faut‑il faire des conversions de type ?

Certains langages, comme Javascript, ne distinguent pas entiers et décimaux (type unique `Number`). D'autres, comme Python, masquent la distinction car l'interpréteur insère des conversions implicites quand un entier est utilisé là où un décimal est attendu. Cette approche facilite le codage, car on se soucie moins de la représentation en mémoire : "ça marche".

Mais cela a un inconvénient : puisque le langage décide pour vous de la représentation en mémoire, vous perdez le contrôle sur la précision des calculs et sur la manière dont les valeurs sont converties. Par exemple, convertir un décimal en entier fait perdre de la précision (arrondi/troncature) ; il y a plusieurs façons de convertir un nombre de mois en nombre de jours selon la finalité du calcul.

La philosophie de Catala est de vous donner le contrôle, au prix d'exiger des conversions explicites. Ainsi, les types de base de Catala (`booléen`, `entier`, `décimal`, `argent`, `date`, `durée`) sont strictement distincts et nécessitent des conversions explicites entre eux. Utiliser un `décimal` là où un `entier` est attendu produira une erreur de typage comme :

```text
┌─[ERROR]─
│
│  I don't know how to apply operator + on types integer and decimal
│
├─➤ example.catala_en:
│    │
│ 13 │   1 + 2.0
│    │   ‾‾‾‾‾‾‾
│
│ Type integer coming from expression:
├─➤ example.catala_en:
│    │
│ 13 │  1 + 2.0
│    │  ‾
│
│ Type decimal coming from expression:
├─➤ example.catala_en:
│    │
│ 13 │   1 + 2.0
│    │       ‾‾‾
└─
```

On corrige en remplaçant `2.0` par `entier de 2.0`. Voir la section correspondante de la [référence du langage](./5-2-types.md#base-types) pour les détails.

## Pourquoi un type `argent` distinct ?

Effectuer correctement des calculs financiers est difficile. Les règles de précision/arrondi varient selon les applications et doivent être conciliées avec la performance.

C'est pourquoi Catala sépare strictement `argent` des `entier`/`décimal`. Utiliser `argent` avec des conversions explicites (cf. ci‑dessus) permet au compilateur d'avertir lorsqu'on mélange argent et non‑argent. L'argent et son unité deviennent comme une unité dimensionnelle dans une formule physique.

Une fois ce type distinct, il faut lui donner un comportement cohérent avec la philosophie du langage. Les valeurs `argent` en Catala sont un nombre entier de centimes. Multiplier un `argent` par un `décimal` peut donner un résultat non entier en centimes ; Catala arrondit alors au centime le plus proche.

Si vous avez besoin de plus de précision pour des montants d'argent, représentez‑les en `décimal` et convertissez vers/depuis `argent` quand nécessaire.

## Comment arrondir un montant à une précision donnée ?

En Catala, `argent` est un entier de centimes (voir ci‑dessus). Un calcul avec `argent` est arrondi au centime à chaque étape. Il faut donc penser l'arrondi à chaque valeur intermédiaire ; cela facilite la relecture par des experts métier.

- Pour arrondir à l'unité monétaire la plus proche, utilisez `arrondi de`.
- Pour arrondir à un multiple arbitraire du centime, utilisez les [fonctions utilitaires](./5-7-standard-library.md#module-money) de la bibliothèque standard (section 5‑7).

Exemples:
- `Money.round_by_excess of $4.13` donne `$5`
- `Money.round_by_default of $4.13` donne `$4`
- `Money.round_to_decimal of $123.45, 1 = $123.5` (arrondi au 10e de l'unité)
- `Money.round_to_decimal of $123.45, -2 = $100.0` (arrondi à la centaine)

Des fonctions analogues existent pour `décimal` dans le [module dédié](./5-7-standard-library.md#module-decimal).

## Pourquoi des entiers/décimaux mathématiques plutôt que des entiers/flottants machine ?

Pour la précision. Les entiers machine débordent. Les flottants ne représentent pas tous les intervalles et accumulent des erreurs. En général, c'est acceptable ; pas pour des calculs financiers qui pilotent des décisions administratives.

Catala utilise la bibliothèque [GMP](https://gmplib.org/) pour des entiers et décimaux mathématiquement sains dont la représentation grandit avec la précision requise. Cela a un coût de performance, mais GMP propose des optimisations bas niveau pour limiter cet impact.

En pratique, les `décimal` de Catala sont des rationnels GMP (fractions irréductibles de deux entiers GMP).

## Comment créer des dates et des durées à partir d'entiers ?

Pour obtenir une durée, multipliez l'unité voulue par l'entier/décimal :

```catala-code-fr
# 1 mois * 24 = 24 mois

déclaration durée_de_jours contenu durée
  dépend de nombre_de_jours contenu entier
  égal à
    1 jour * nombre_de_jours
```

En revanche, on ne construit pas une date `YYYY-MM-DD` en concaténant des entiers. Utilisez la fonction `Date.of_year_month_day`.

## Pourquoi pas de chaînes de caractères ?

L'absence de chaînes est volontaire. Catala cible des calculs décrits par des textes juridiques. Si vous trouvez un texte légal nécessitant des opérations de chaînes, dites‑le nous !

- Les opérations "texte" des lois sont souvent mieux modélisées par des énumérations (avec contenu) et un filtrage par motif exhaustif.
- Les opérations bas niveau non décrites par la loi mais utilisées dans un programme Catala devraient être faites hors de Catala, en fournissant le résultat comme entrée d'un champ d'application, ou via un module externe ([référence](./5-6-modules.md#declaring-external-modules)).
- Ajouter un runtime de chaînes alourdirait fortement la taille/complexité, avec des regex identiques sur tous les backends supportés. Coût important à la mise en œuvre et en maintenance.

## Comment ajouter une exception depuis l'extérieur d'un champ d'application ?

La loi peut être tordue. Par exemple, l'[article 1731 bis](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044981364) du CGI spécifie des amendes où l'on doit neutraliser certaines déductions à l'intérieur d'un calcul fiscal existant. En Catala, vous auriez deux champs d'application `FinesComputation` et `IncomeTaxComputation` ; le premier doit appeler le second tout en modifiant certaines règles à l'intérieur du second.

Ce motif revient à déclarer une exception à une variable de `IncomeTaxComputation`, depuis l'extérieur de `IncomeTaxComputation`. Catala offre une fonctionnalité dédiée : les variables de contexte, qui étendent proprement les `exception`s entre champs d'application. Voir la [référence](./5-3-scopes-toplevel.md#context-variables).

## Dois‑je répéter tous les champs d'une struct si je n'en change qu'un seul ?

Non ! Voir "Mise à jour des structures" dans la [référence](./5-5-expressions.md#structures).

## Comment sont gérées les dates et durées ?

Quel est le résultat de `31 janv + 1 mois` ? 28 fév, 29 fév, 1er mars ? Ces ambiguïtés ont un impact sur les décisions automatisées. Nous avons conçu une [bibliothèque dédiée de calcul de dates](https://github.com/CatalaLang/dates-calc) permettant de choisir la stratégie d'arrondi des dates ambiguës, motivée dans un [article scientifique](https://hal.science/hal-04536403).

Sinon, les dates sont des dates grégoriennes au jour près. Les durées combinent jours/mois/années. Voir la [référence](./5-2-types.md#dates).

## Quels langages cibles pour Catala ?

Le compilateur Catala cible nativement :
- C (C89) ;
- Python ;
- Java ;
- OCaml.

Depuis le backend OCaml, Javascript peut être ciblé via [`js_of_ocaml`](https://ocsigen.org/js_of_ocaml/latest/manual/overview).

Les [runtimes](https://github.com/CatalaLang/catala/tree/master/runtimes) ont deux dépendances hors bibliothèques standard :
[GMP](https://gmplib.org/) pour l'arithmétique multi‑précision et la [bibliothèque de dates](https://github.com/CatalaLang/dates-calc).

## Pourquoi ne peut‑on pas découper les déclarations de champ d'application comme les définitions ?

En Catala, on peut avoir [plusieurs `définition` pour la même variable](./5-4-definitions-exceptions.md), ce qui permet d'aligner le code sur des fragments de texte légal dispersés. On pourrait vouloir faire pareil avec les déclarations de structures et de champs d'application.

Nous avons choisi de ne pas le permettre. Empiriquement, contrairement aux `definition`s à justifier par le texte légal, l'agencement des structures et prototypes relève surtout de choix de programmation. Nous recommandons de mettre toutes les déclarations de structures et de champs d'application dans un "prologue" distinct des sources légales, plutôt que de les disperser.

De plus, centraliser ces déclarations facilite la navigation. Des outils avancés ("Aller à la déclaration") peuvent pallier ce besoin, mais ils ne sont pas toujours disponibles pour des lecteurs externes à l'équipe de développement.
