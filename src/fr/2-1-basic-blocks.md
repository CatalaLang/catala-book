# Éléments de base d'un programme Catala

<div id="tocw"></div>

Cette partie présente les éléments de base d'un programme Catala : la séparation
entre la loi et le code, les structures de données, les champs d'application,
les variables et les formules. En la terminant, vous serez en mesure d'écrire un
programme Catala simple, qui calcule l'équivalent d'une seule fonction
comportant plusieurs variables locales interdépendantes.

~~~admonish info title="Cheat code"
Un résumé de cette partie, ainsi que le code attendu, sont fournis en bas de
cette page.

Si vous vous sentez perdu, ou si vous voulez simplement vérifier que vous êtes
sur la bonne voie, jetez-y un œil. On ne dira rien!
~~~

## "Tisser" la loi et le code

Le concept de *programmation littéraire* est central en Catala. On entend par là
que le code informatique et sa spécification sont entrelacés au sein d'un unique
document. De la sorte, on peut obtenir une correspondance à la fois précise et
extrêmement directe entre les deux. En outre, il devient excessivement simple de
propager au code les mises à jour de la spécification, puisque la section du
code à modifier est déjà connue. Dans le cas de programmes complexes et
critiques tels que le calcul des impôts ou des aides sociales, la maintenance
peut vite devenir inextricable sans cet outil.

En pratique, un fichier source Catala suit le format Markdown. La spécification
y figure sous forme de texte, et peut utiliser le formattage Markdown, par
exemple pour `# Les titres`. Les fragments de code catala y sont insérés dans
des blocs délimités par une ligne `` ```catala `` et une ligne `` ``` ``.

Dans ce tutoriel, nous allons donc devoir commencer par introduire une
spécification de ce que nous allons calculer. Nous imaginerons ici un Code des
Impôts définissant un impôt sur le revenu (très) simplifié. En pratique, toutes
sortes de textes peuvent tenir lieu de spécification: lois, décrets, motivations
de décisions de justice, doctrine juridique, instructions internes,
spécifications techniques, etc. Il est en outre possible d'utiliser
conjointement plusieurs types de sources pour former un unique programme Catala:
concrètement, il s'agit simplement de recopier le texte d'origine de la source
juridique et de l'ajuster à la syntaxe Markdown.

Assez de préambules, attaquons la spécification de notre impôt sur le revenu
fictif, par l'article 1 du CITC (Code des Impôts du Tutoriel Catala):


```admonish quote title="Article 1"
L'impôt sur le revenu d'une personne est un pourcentage fixe du revenu de la
personne sur une année.
```

~~~admonish note title="Formater le texte juridique en Catala"
Catala utilise un formatage de type Markdown pour le texte juridique dans les
fichiers `.catala_fr`. Ainsi, pour copier le texte de l'article dans votre
fichier `tutoriel.catala_fr`, balisez l'en-tête de l'article avec `##` et
mettez le texte en dessous, comme ceci :

```catala-fr
## Article 1

L'impôt sur le revenu d'une personne est un pourcentage fixe du revenu de la
personne sur une année.
```
~~~

Collez toujours au plus près à la spécification: les fragments de code doivent
être le plus près possible des phrases auxquelles ils correspondent. Ici, les
fragments correspondant à l'article 1 seront logiquement immédiatement
en-dessous.

Dans ces fragments, nous allons décrire le programme qui calcule l'impôt sur le
revenu, et écrire les règles qui en définissent la valeur en tant que
multiplication entre le revenu et un taux donné. Voyons ce que cela donne en
pratique:

```catala-code-fr
# Nous verrons bientôt comment traduire ici le sens de l'article 1 en code
# Catala.

# Pour créer un bloc de code Catala, délimitez-le avec les balises
# Markdown "```catala" et "```".
# Tout ce qui suit un caractère "#" dans une ligne de code est ignoré, ce qui
# permet d'écrire des commentaires informatifs (comme celui-ici)
```

~~~admonish warning title="Délimitation des blocs de code"
Dans la suite du tutoriel, vous pourrez supposer que les extraits de code donnés
sont à recopier dans votre fichier `tutoriel.catala_fr` à l'intérieur d'un bloc
de code `` ```catala `` suivant directemet l'article de loi qu'il transcrit.
~~~

## Mise en place des structures de données

Tout un contexte implicite est supposé connu dans l'article 1: il existe une
personne, cette personne a un revenu, et il existe un impôt sur le revenu que
cette personne doit payer chaque année. Programmer cet article nous demande
d'expliciter ce contexte, ce que nous allons faire à l'aide de structure de
données et de signatures de fonctions.

Catala est un langage [fortement
typé](https://blog.merigoux.ovh/en/2017/07/19/static-or-dynamic.html) et compilé
statiquement, ce qui demande que toutes les structures de données et toutes les
signatures de fonctions soient déclarées explicitement. Commençons par la
personne — le contribuable sujet à ce calcul d'imposition. Les informations dont
nous aurons besoin sur elle sont ses revenus, et le nombre de ses enfants:

~~~admonish note title="Déclaration d'une structure"
```catala-code-fr
# Aucun article de loi spécifique ne correspond, généralement, aux déclarations.
# Pour cette raison, vous pouvez les mettre en "préambule", en haut du
# fichier "tutoriel.catala_fr", avant l'article 1.

# Le nom de la structure, "Personne", doit commencer par une majuscule :
# c'est la convention "CamelCase".
déclaration structure Personne:
  # Dans la ligne qui suit, "revenu" est le nom du champ de la structure et
  # "argent" est le type de ce qui est stocké dans ce champ.
  # Les types disponibles incluent : "entier", "décimal", "argent", "date",
  # "durée", et toute autre structure ou énumération que vous déclarez.
  donnée revenu contenu argent
  # Les noms de champs "revenu" et "nombre_enfants" commencent par une
  # minuscule, ils suivent la convention "snake_case".
  donnée nombre_enfants contenu entier
```
~~~

Cette structure contient deux champs de données, `revenu` et `nombre_enfants`.
Les structures servent à regrouper des données qui forment un tout. Vous aurez
généralement une structure par objet concret sur lequel appliquer la loi (comme
ici la `Personne`). Le critère le plus important à retenir lorsque l'on choisit
comment les données seront regroupées est la lisibilité du code qui va en
résulter.

~~~admonish tip title="Déclarer une énumération"
Certaines lois énumérent un certain nombre de situations possibles. Ces
possibilités sont modélisées en Catala à l'aide d'un type énumération:

```catala-code-fr
# Le nom "CréditImpôt" est également écrit en "CamelCase".
déclaration énumération CréditImpôt:
  # La ligne ci-dessous indique qu'une des situations de "CréditImpôt"
  # est "PasDeCréditImpôt"
  -- PasDeCréditImpôt
  # Alternativement, "CréditImpôt" peut être en situation "CréditImpôtEnfants".
  # Cette situation porte un contenu de type "entier"
  # qui renseigne le nombre d'enfants concernés par le crédit d'impôt.
  # Cela signifie que lorsqu'on rencotre la situation "CréditImpôtEnfants",
  # le nombre d'enfants sera une information supplémentaire accessible.
  -- CréditImpôtEnfants contenu entier
```

En termes de programmation, ce type d'énumération est appelée un "type somme" ou
simplement une "enum". La combinaison de structures et d'énumérations forme la
base de la notion de [types
algébriques](https://fr.wikipedia.org/wiki/Type_algébrique_de_données). Retenez
que cela permet de décrire toutes les configurations de données possibles.
~~~

Ces déclarations de structures de données ne s'attachent naturellement à aucun
article du le texte de spécification, puisqu'il s'agit d'un contexte implicite.
Où les placer ? Il sera nécessaire de s'y référer souvent, nous suggérons donc
de les regrouper, par commodité dans un "prélude" en tête du fichier.


## Le "champ d'application": unité de calcul élémentaire

Maintenant que nous avons défini les données que le programme devra manipuler
ainsi que leurs types, nous allons nous occuper du contexte logique dans lequel
elles vont évoluer. Catala étant un langage de programmation
[fonctionnel](https://fr.wikipedia.org/wiki/Programmation_fonctionnelle), tout
calcul s'effectue au sein d'une *fonction*. L'équivalent d'une fonction, en
Catala, est appelé `champ d'application` et se constitue de :
- un nom
- des variables d'`entrée` (~ les arguments de la fonction)
- des variables `interne`s (~ variables locales aux corps de la fonction)
- des variables de `résultat` (regroupées en une structure qui forme la valeur
  de retour de la fonction)

Revenons à notre article 1, et déclarons le champ d'application correspondant:

~~~admonish note title="Déclaration d'un champ d'application"
```catala-code-fr
# Les noms de champs d'application utilisent la convention de nommage CamelCase,
# comme les noms de structures ou d'énums. Les variables de champ d'application,
# en revanche, utilisent la convention de nommage snake_case, comme les champs
# de structure
déclaration champ d'application CalculImpôtRevenu:
  # La ligne qui suit déclare une variable d'entrée du champ d'application,
  # ce qui s'apparente à un paramètre de fonction en termes de programmation.
  # C'est la donnée sur laquelle le champ d'application va opérer.
  entrée personne contenu Personne
  interne taux_imposition contenu décimal
  résultat impôt_revenu contenu argent
```
~~~

Le champ d'application est la brique de base des programmes Catala. Les champs
d'application peuvent se composer: de la même façon qu'une fonction peut appeler
d'autres fonctions, un champ d'application peut en appeler d'autres au cours de
ses calculs. Mais nous y reviendrons plus tard.

Une déclaration de champ d'application s'apparente à une signature de fonction:
une liste d'arguments, avec leurs types attendus. En Catala, les variables
peuvent être qualifiées d'`entrée`, `interne` ou `résultat`. Une variable
`entrée` devra obligatoirement être fournie lors de l'appel du champ
d'application, et il est impossible de la redéfinir à l'intérieur du champ
d'applicaton. Une variable `interne` doit être définie, mais ne pourra jamais
être vue depuis l'extérieur. Enfin, une variable `résultat` devra également être
définie, mais sera rendue accessible à l'appelant. Il est également possible de
combiner en déclarant une variable comme `entrée résultat`, auquel cas elle
devra être spécifiée par l'appelant, et lui sera retournée sans modification.

Cette déclaration effectuée, nous allons enfin pouvoir définir le calcul à
effectuer !


## Définir des variables et des formules

L'article 1 nous fournit directement la formule à utiliser pour définir la
variable `impôt_revenu` du champ d'application `CalculImpôtRevenu`.
Traduisons-la en Catala:

~~~admonish quote title="Article 1"
L'impôt sur le revenu d'une personne est un pourcentage fixe du revenu de la
personne sur une année.
~~~

~~~admonish note title="Définir une variable"
```catala-code-fr
champ d'application CalculImpôtRevenu:
  définition impôt_revenu égal à
    personne.revenu * taux_imposition
```
~~~

Décortiquons le code ci-dessus. Toute `définition` d'une variable (ici,
`impôt_revenu`) est rattachée à un champ d'application qui la déclare (ici,
`CalculImpôtRevenu`). L'expression donnant sa valeur à la variable suit le
`égal à` : elle a la forme `personne.revenu * taux_imposition`.

La syntaxe des formules utilise les opérateurs arithmétiques classiques. Ici,
`*` indique la multiplication d'un montant d'`argent` par un `décimal`, ce qui
retourne un montant d'`argent`. Le comportement exact de chaque opérateur dépend
des types des valeurs sur lesquels il est appliqué. Par exemple, ici, parce
qu'une valeur de type `argent` est toujours un nombre entier de centimes, `*`
arrondit le résultat de la multiplication au centime le plus proche, donnant un
résultat de type `argent` (voir [la FAQ](./4-2-catala-specific.md) pour
plus d'informations sur l'arrondi en Catala).

Concernant `personne.revenu`, la notation `.` nous permet d'accéder au champ
`revenu` de la variable d'entrée `personne`, qui est une structure de type
`Personne`.

~~~admonish tip title="Utiliser les énumérations"
Pour inspecter le contenu d'une valeur d'un type énumération, la notation `.` ne
convient pas: il faut utiliser le «filtrage par motif», qui est commun dans les
langages fonctionnels. Supposons une variable `crédit_impôt` du type énumération
`CréditImpôt` que nous avons déclaré ci-dessus, et que nous voulions définir la
valeur du crédit en fonction du nombre d'enfants éligibles

```catala-expr-fr
selon crédit_impôt sous forme
-- PasDeCréditImpôt: 0 €
-- CréditImpôtEnfants contenu nombre_enfants_éligibles:
   10 000 € * nombre_enfants_éligibles
```

Le fitrage a ici deux branches, pour gérer les deux cas possibles de la variable
`crédit_impôt`. Dans la seconde branche (`-- CréditImpôtEnfants`), le nom
`nombre_enfants_éligibles` définit une nouvelle variable, locale à cette
branche, qui contiendra la valeur de type `entier` qui avait été encapsulée dans
l'énumération. Cette variable peut ensuite être utilisée normalement dans la
formule de calcul.
~~~

Revenons maintenant à notre champ d'application `CalculImpôtRevenu`. Nous avons
utilisé la variable `taux_imposition`, mais elle n'est encore définie nulle
part! Nous avons pourtant été fidèle au texte de loi, mais c'est courant: les
définitions des variables sont souvent dispersées dans différents articles. Ce
cas est donc prévu, et le compilateur Catala se chargera de rassembler toutes
les définitions de chaque champ d'application, et de les ordonner comme il
faudra. Peu importe donc ici, si `taux_imposition` est défini après
`impôt_revenu` dans notre code. En règle générale, l'ordre des déclarations et
définitions dans les sources Catala importe peu pour le calcul: c'est la
structure de la spécification qui doit primer.

Le CITC définit justement le pourcentage qui nous manquait dans son article 2
suivant. La définition en Catala de la variable `taux_imposition` ne devrait
plus vous surprendre.

~~~admonish quote title="Article 2"
Le pourcentage fixe mentionné à l'article 1 est égal à 20 %.

```catala-code-fr
champ d'application CalculImpôtRevenu:
  # "20 %" est une écriture alternative du décimal "0,20".
  définition taux_imposition égal à 20 %
```
~~~

## Types de base et calculs en Catala

Jusqu'à présent, nous avons vu des valeurs qui ont des types comme `décimal`,
`argent`, `entier`. On pourrait objecter qu'il n'y a pas lieu de distinguer ces
trois concepts, car ce ne sont que des nombres. Cependant, la philosophie de
Catala est de rendre explicite chaque choix qui affecte le résultat du calcul,
et la représentation des nombres affecte le résultat du calcul. En effet, les
calculs financiers varient selon que l'on considère un montant d'argent comme un
nombre exact de centimes, ou que l'on stocke des chiffres fractionnaires
supplémentaires après le centime. Puisque le type de programmes [pour lesquels Catala est conçu](./0-intro.md)
implique de lourdes conséquences pour de nombreux utilisateurs, le langage est
assez strict sur la façon dont les nombres sont représentés. La règle générale
est que, en Catala, les nombres se comportent exactement selon la sémantique
mathématique commune que l'on peut associer aux calculs arithmétiques de base
(`+`, `-`, `*`, `/`).

En particulier, cela signifie que les valeurs `entier` sont illimitées et ne
peuvent jamais [déborder](https://fr.wikipedia.org/wiki/Dépassement_d'entier).
De même, les valeurs `décimal` peuvent être arbitrairement précises (bien
qu'elles soient toujours rationnelles, appartenant à ℚ) et ne souffrent pas des
imprécisions de la virgule flottante. Pour `argent`, le langage prend une
décision arrêtée : une valeur de type `argent` est toujours un nombre entier de
centimes.

Ces choix ont plusieurs conséquences :
* `entier` divisé par `entier` donne un `décimal` ;
* `argent` ne peut pas être multiplié par `argent` (multipliez plutôt `argent` par `décimal`) ;
* `argent` multiplié (ou divisé) par `décimal` arrondit le résultat au centime le plus proche ;
* `argent` divisé par `argent` donne un `décimal` (qui n'est pas arrondi).

~~~admonish example title="Types, valeurs et opérations"
Concrètement, cela donne :
```catala-expr-fr
10  / 3   = 3,333333333... et
10 € / 3,0 = 3,33 € et
20 € / 3,0 = 6,67 € et
10 € / 3 €  = 3,33333333...
```
~~~

Le compilateur Catala vous guidera pour utiliser explicitement les opérations
correctes, en signalant des erreurs de compilation lorsque ce n'est pas le cas.

~~~admonish bug title="Résoudre les erreurs de typage sur les opérations"
Par exemple, essayer d'ajouter un `entier` et un `décimal` donne le message
d'erreur suivant du compilateur Catala :

```text
┌─[ERROR]─
│
│  I don't know how to apply operator + on types integer and decimal
│
├─➤ tutoriel_fr.catala_fr
│    │
│    │   définition x égal à 1 + 2,0
│    │                       ‾‾‾‾‾‾‾
│
│ Type integer coming from expression:
├─➤ tutoriel_fr.catala_fr
│    │
│    │   définition x égal à 1 + 2,0
│    │                       ‾
│
│ Type decimal coming from expression:
├─➤ tutoriel_fr.catala_fr
│    │
│    │   définition x égal à 1 + 2,0
│    │                           ‾‾‾
└─
```

Pour corriger cette erreur, vous devez utiliser une conversion explicite, par
exemple en remplaçant `1` par `décimal de 1`. Référez-vous à la [référence du langage](./5-catala.md)
pour toutes les conversions possibles, les opérations et leurs sémantiques associées.
~~~

Catala possède également des types intégrés `date` et `durée` avec les opérations
associées courantes (ajouter une durée à une date, soustraire deux dates pour
obtenir une durée, etc.). Pour un aperçu plus approfondi des calculs de dates
(qui sont [très délicats](https://link.springer.com/chapter/10.1007/978-3-031-57267-8_16) !),
consultez la [référence du langage](./5-catala.md).

## Tester le code

Maintenant que nous avons implémenté quelques articles en Catala, il est temps
de tester notre code pour vérifier qu'il se comporte correctement. Nous vous
encourageons à tester votre code souvent, le plus tôt possible, et à vérifier le
résultat du test dans un système d'intégration continue pour éviter les régressions.

Le test du code Catala se fait avec l'interpréteur à l'intérieur du compilateur,
accessible avec la commande `interpret` et l'option `--scope` qui spécifie le
champ d'application à interpréter.

~~~admonish info title="Tester `CalculImpôtRevenu` directement ?" collapsible=true
Le réflexe à ce stade est d'exécuter la commande suivante :
```console
$ clerk run tutoriel.catala_fr --scope=CalculImpôtRevenu
┌─[ERROR]─
│
│  Invalid scope for execution or testing: it defines input variables. If
│  necessary, a wrapper scope with explicit inputs to this one can be defined.
│
├─➤ tutoriel.catala_fr:41.9-41.19:
│    │
│ 41 │   entrée personne contenu Personne
│    │          ‾‾‾‾‾‾‾‾
└─
```

Comme le dit le message d'erreur, essayer d'interpréter directement
`CalculImpôtRevenu` revient à essayer de calculer les impôts de
quelqu'un sans connaître le revenu de la personne ! Pour être exécuté,
le champ d'application doit être appelé avec des valeurs concrètes
pour le revenu et le nombre d'enfants de la personne. Sinon, Catala se
plaindra que les variables d'`entrée` du champ d'application manquent
pour l'interprétation. Toutefois, il est possible de fournir ces
entrées sous forme de données JSON à l'aide de l'option `--input`.  La
section [Support du JSON](./5-8-3-json-support.md) décrit la manière
d'y parvenir.  Notez que, pour des raisons de robustesse du code, nous
recommendons d'écrire vos tests directement en Catala lorsque cela est
possible.
~~~

Le modèle de test utilise des concepts qui seront vus [plus tard](./2-4-states-dynamic.md)
dans le tutoriel, il est donc acceptable de considérer une partie de ce qui suit
comme une syntaxe mystérieuse qui fait ce que nous voulons. Fondamentalement,
nous allons créer pour notre cas de test un nouveau test qui passera des
arguments spécifiques à `CalculImpôtRevenu` qui est testé :

~~~admonish note title="Définir un test"
```catala-code-fr
déclaration champ d'application Test:
  # La ligne suivante est mystérieuse pour l'instant
  résultat calcul contenu CalculImpôtRevenu

champ d'application Test:
  définition calcul égal à
    # La ligne suivante est mystérieuse pour l'instant
    résultat de CalculImpôtRevenu avec {
      # Ci-dessous, nous passons les variables d'entrée pour "CalculImpôtRevenu"
      -- personne:
        # "personne" a un type structure, nous devons donc construire la
        # structure "Personne" avec la syntaxe suivante
        Personne {
          # "revenu" et "nombre_enfants" sont les champs de la structure ;
          # nous leur donnons les valeurs que nous voulons pour notre test
          -- revenu: 20 000 €
          -- nombre_enfants: 0
        }
    }
```
~~~

Ce test peut maintenant être exécuté via l'interpréteur Catala :

```console
$ clerk run tutoriel.catala_fr --scope=Test
┌─[RESULT]─
│ calcul = CalculImpôtRevenu { -- impôt_revenu: 4 000,00 € }
└─
```

Nous pouvons maintenant vérifier que `4 000 € = 20 000 € * 20%` ; le résultat est correct.

~~~admonish tip title="Testez, testez, testez !"
Utilisez ce test pour jouer régulièrement avec le code pendant le tutoriel et
inspecter ses résultats sous divers scénarios d'entrée. Cela vous aidera à
comprendre le comportement des programmes Catala, et à repérer les erreurs dans
votre code 😀

Vous pouvez également vérifier qu'il n'y a pas d'erreur de syntaxe ou de typage
dans votre code, sans le tester, avec la commande suivante :

```console
$ clerk typecheck tutoriel.catala_fr
┌─[RESULT]─
│ Typechecking successful!
└─
```
~~~

## Récapitulons

Ceci conclut la première partie du tutoriel. En mettant en place des structures
de données comme `structure` et `énumération`, en représentant les types des
variables de `champ d'application`, et la `définition` de formules pour ces
variables, vous devriez maintenant être capable de coder en Catala l'équivalent
de programmes à fonction unique qui effectuent des opérations arithmétiques
courantes et définissent des variables locales.

~~~~~~admonish info collapsible=true title="Récapitulatif de la partie actuelle"
Pour référence, voici la version finale du code Catala consolidé à la fin de
cette partie du tutoriel.

~~~catala-fr
{{#include ../../examples/tutoriel_fin_2_1.catala_fr}}
~~~
~~~~~~
