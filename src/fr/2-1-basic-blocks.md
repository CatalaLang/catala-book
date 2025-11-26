# Éléments de base d'un programme Catala

<div id="tocw"></div>

Dans cette section, le tutoriel présente les éléments de base d'un programme Catala :
la différence entre la loi et le code, les structures de données, les champs
d'application, les variables et les formules. À la fin de la section, vous
devriez être capable d'écrire un programme Catala simple équivalent à une seule
fonction avec des variables locales dont les définitions peuvent se référer les
unes aux autres.

~~~admonish info title="Corrigé du tutoriel"
Un récapitulatif de la section du tutoriel avec le code complet attendu dans
votre fichier compagnon `tutoriel.catala_fr` est joint à la fin de cette page.

Veuillez vous y référer si vous vous sentez perdu pendant la lecture et
souhaitez vérifier si vous êtes sur la bonne voie pour compléter votre fichier
`tutoriel.catala_fr`.
~~~

## "Tisser" la loi et le code

Catala est un langage conçu autour du concept de *programmation littéraire*,
c'est-à-dire le mélange (ou tissage -- de l'anglais *weaving*) entre
le code informatique et sa spécification dans un
seul document. Pourquoi la programmation littéraire ? Parce qu'elle permet une
correspondance fine entre la spécification et le code. Chaque fois que la
spécification est mise à jour, savoir où mettre à jour le code est trivial avec
la programmation littéraire. C'est absolument crucial pour permettre la
maintenance à long terme de programmes complexes et de haute assurance comme le
calcul des impôts ou des prestations sociales.

Ainsi, un fichier de code source Catala ressemble à un document Markdown
classique, avec la spécification écrite et formatée comme du texte Markdown,
et le code Catala présent uniquement dans des blocs de code Catala bien délimités
introduits par une ligne avec `` ```catala `` et terminés par une ligne avec `` ``` ``.

Avant d'écrire du code Catala, nous devons introduire la spécification du code
pour ce tutoriel. Cette spécification sera basée sur un Code des Impôts fictif
définissant un impôt sur le revenu simple. Mais en général, n'importe quoi peut
être utilisé comme spécification pour un programme Catala : lois, décrets,
motivations de décisions de justice, doctrine juridique, instructions internes,
spécifications techniques, etc. Ces sources peuvent être mélangées pour former
un programme Catala complet qui s'appuie sur ces multiples sources. Concrètement,
incorporer une source juridique de spécification dans le programme Catala revient
à copier-coller le texte et à le formater en syntaxe Markdown à l'intérieur du
fichier de code source.

Voici le premier paragraphe de spécification pour notre
impôt sur le revenu fictif, l'article 1 du CITC (Code des Impôts du Tutoriel Catala) :

```admonish quote title="Article 1"
L'impôt sur le revenu pour un individu est défini comme un pourcentage fixe du
revenu de l'individu sur une année.
```

~~~admonish note title="Formater le texte juridique en Catala"
Catala utilise un formatage de type Markdown pour le texte juridique dans les
fichiers `.catala_fr`. Ainsi, pour copier le texte de l'article dans votre
fichier `tutoriel.catala_fr`, balisez l'en-tête de l'article avec `##` et
mettez le texte en dessous, comme ceci :

```catala-fr
## Article 1

L'impôt sur le revenu pour un individu est défini comme un pourcentage fixe du
revenu de l'individu sur une année.
```
~~~

L'esprit de l'écriture de code en Catala est de coller à la spécification à tout
moment afin de placer les extraits de code là où ils doivent être. Par conséquent,
nous introduirons ci-dessous les extraits de code Catala qui traduisent l'article 1,
qui doivent être placés juste en dessous de l'article 1 dans le fichier de code
source Catala.

Ces extraits de code doivent décrire le programme qui calcule l'impôt sur le
revenu, et contenir la règle le définissant comme une multiplication du revenu
par un taux. Il est temps de plonger dans Catala en tant que langage de
programmation.

```catala-code-fr
# Nous apprendrons bientôt quoi écrire ici pour traduire le sens de l'article 1
# en code Catala.

# Pour créer un bloc de code Catala dans votre fichier, délimitez-le avec les
# balises de style Markdown "```catala" et "```". Vous pouvez écrire des
# commentaires dans les blocs de code Catala en préfixant les lignes par "#"
```

~~~admonish warning title="Délimitation des blocs de code"
Dans la suite du tutoriel, lors de la présentation d'extraits de code Catala,
il est implicitement supposé que vous devez les copier-coller dans votre
fichier `tutoriel.catala_fr` à l'intérieur d'un bloc de code Catala délimité
par `` ```catala`` et `` ``` ``, et placé près de l'article de loi qu'il implémente.
~~~

## Mettre en place les structures de données

Le contenu de l'article 1 suppose beaucoup de contexte implicite : il existe un
individu avec un revenu, ainsi qu'un impôt sur le revenu que l'individu doit
payer chaque année. Même si ce contexte implicite n'est pas verbatim dans la loi,
nous devons l'expliciter dans le code informatique, sous la forme de structures
de données et de signatures de fonctions.

Catala est un langage [fortement typé](https://blog.merigoux.ovh/en/2017/07/19/static-or-dynamic.html)
et compilé statiquement, donc toutes les structures de données et signatures de
fonctions doivent être explicitement déclarées. Nous commençons donc par déclarer
les informations de type pour l'individu, le contribuable qui sera le sujet du
calcul de l'impôt. Cet individu a un revenu et un nombre d'enfants, deux
informations qui seront nécessaires à des fins fiscales :

~~~admonish note title="Déclarer une structure"
```catala-code-fr
# Les déclarations de structures de données et généralement toute déclaration
# en Catala ne correspondent souvent à aucun article de loi spécifique. Ainsi,
# vous pouvez mettre toutes les déclarations en haut de votre fichier
# tutoriel.catala_fr, avant l'article 1.

# Le nom de la structure, "Individu", doit commencer par une majuscule :
# c'est la convention CamelCase.
déclaration structure Individu:
  # Dans cette ligne, "revenu" est le nom du champ de la structure et
  # "argent" est le type de ce qui est stocké dans ce champ.
  # Les types disponibles incluent : "entier", "décimal", "argent", "date",
  # "durée", et toute autre structure ou énumération que vous déclarez.
  donnée revenu contenu argent
  # Les noms de champs "revenu" et "nombre_enfants" commencent par une
  # minuscule, ils suivent la convention snake_case.
  donnée nombre_enfants contenu entier
```
~~~

Cette structure contient deux champs de données, `revenu` et `nombre_enfants`.
Les structures sont utiles pour regrouper des données qui vont ensemble.
Généralement, vous obtenez une structure par objet concret sur lequel la loi
s'applique (comme l'individu). C'est à vous de décider comment regrouper les
données, mais nous vous conseillons de viser l'optimisation de la lisibilité du
code.

~~~admonish tip title="Déclarer une énumération"
Parfois, la loi donne une énumération de différentes situations. Ces
énumérations sont modélisées en Catala à l'aide d'un type énumération, comme :

```catala-code-fr
# Le nom "CréditImpôt" est également écrit en CamelCase.
déclaration énumération CréditImpôt:
  # La ligne ci-dessous dit que "CréditImpôt" peut être une situation
  # "PasDeCréditImpôt".
  -- PasDeCréditImpôt
  # La ligne ci-dessous dit qu'alternativement, "CréditImpôt" peut être une
  # situation "CréditImpôtEnfants". Cette situation porte un contenu de type
  # entier correspondant au nombre d'enfants concernés par le crédit d'impôt.
  # Cela signifie que si vous êtes dans la situation "CréditImpôtEnfants",
  # vous aurez également accès à ce nombre d'enfants.
  -- CréditImpôtEnfants contenu entier
```

En termes informatiques, une telle énumération est appelée un "type somme" ou
simplement une enum. La combinaison de structures et d'énumérations permet au
programmeur Catala de déclarer toutes les formes possibles de données, car elles
sont équivalentes à la puissante notion de [types de données algébriques](https://fr.wikipedia.org/wiki/Type_alg%C3%A9brique_de_donn%C3%A9es).
~~~

Notez que ces structures de données que nous avons déclarées ne peuvent pas
toujours être rattachées naturellement à un morceau particulier du texte de
spécification. Alors, où mettre ces déclarations dans votre fichier de
programmation littéraire ? Puisque vous reviendrez souvent à ces déclarations de
structures de données pendant la programmation, nous vous conseillons de les
regrouper dans une sorte de prélude dans votre fichier de code source.
Concrètement, cette section de prélude contenant la déclaration des structures
de données sera votre point de référence unique pour essayer de comprendre les
données manipulées par les règles ailleurs dans le fichier de code source.

## Les champs d'application comme blocs de calcul de base

Nous avons défini et typé les données que le programme manipulera. Maintenant,
nous devons définir le contexte logique dans lequel ces données évolueront.
Parce que Catala est un langage de [programmation fonctionnelle](https://fr.wikipedia.org/wiki/Programmation_fonctionnelle),
tout code existe au sein d'une fonction. Et l'équivalent d'une fonction en
Catala est appelé un *champ d'application* (scope). Un champ d'application est
composé de :
* un nom,
* des variables d'entrée (similaires aux arguments de fonction),
* des variables internes (similaires aux variables locales),
* des variables de résultat (qui forment ensemble le type de retour de la fonction).

Par exemple, l'article 1 déclare un champ d'application pour calculer l'impôt
sur le revenu :

~~~admonish note title="Déclarer un champ d'application"
```catala-code-fr
# Les noms de champs d'application utilisent la convention de nommage CamelCase,
# comme les noms de structures ou d'énums. Les variables de champ d'application,
# en revanche, utilisent la convention de nommage snake_case, comme les champs
# de structure.
déclaration champ d'application CalculImpôtRevenu:
  # La ligne suivante déclare une variable d'entrée du champ d'application,
  # ce qui s'apparente à un paramètre de fonction en termes informatiques.
  # C'est la donnée sur laquelle le champ d'application va opérer.
  entrée individu contenu Individu
  interne taux_imposition contenu décimal
  résultat impôt_revenu contenu argent
```
~~~

Le champ d'application est l'unité d'abstraction de base dans les programmes
Catala, et les champs d'application peuvent être composés. Puisqu'une fonction
peut appeler d'autres fonctions, les champs d'application peuvent aussi appeler
d'autres champs d'application. Nous verrons plus tard comment faire cela, mais
concentrons-nous d'abord sur les entrées et les sorties des champs d'application.

La déclaration du champ d'application s'apparente à une signature de fonction :
elle contient une liste de tous les arguments avec leurs types. Mais en Catala,
les variables de champ d'application peuvent être `entrée`, `interne` ou
`résultat`. `entrée` signifie que la variable doit être fournie chaque fois que
le champ d'application est appelé, et ne peut pas être définie à l'intérieur du
champ d'application. `interne` signifie que la variable est définie à l'intérieur
du champ d'application et ne peut pas être vue de l'extérieur ; elle ne fait pas
partie de la valeur de retour du champ d'application. `résultat` signifie qu'un
appelant peut récupérer la valeur calculée de la variable. Notez qu'une variable
peut être simultanément une entrée et un résultat du champ d'application, dans
ce cas elle doit être annotée avec `entrée résultat`.

Une fois le champ d'application déclaré, nous pouvons l'utiliser pour définir
nos règles de calcul et enfin coder l'article 1 !

## Définir des variables et des formules

L'article 1 donne en fait la formule pour définir la variable `impôt_revenu` du
champ d'application `CalculImpôtRevenu`, ce qui se traduit par le code Catala
suivant :

~~~admonish quote title="Article 1"
L'impôt sur le revenu pour un individu est défini comme un pourcentage fixe du
revenu de l'individu sur une année.
~~~

~~~admonish note title="Définir une variable"
```catala-code-fr
champ d'application CalculImpôtRevenu:
  définition impôt_revenu égal à
    individu.revenu * taux_imposition
```
~~~

Décortiquons le code ci-dessus. Chaque `définition` d'une variable (ici,
`impôt_revenu`) est rattachée à un champ d'application qui la déclare (ici,
`CalculImpôtRevenu`). Après `égal à`, nous avons l'expression réelle pour la
variable : `individu.revenu * taux_imposition`. La syntaxe des formules utilise
les opérateurs arithmétiques classiques. Ici, `*` signifie multiplier un montant
d'`argent` par un `décimal`, renvoyant un nouveau montant d'`argent`. Le
comportement exact de chaque opérateur dépend des types de valeurs sur lesquels
il est appliqué. Par exemple, ici, parce qu'une valeur de type `argent` est
toujours un nombre entier de centimes, `*` arrondit le résultat de la
multiplication au centime le plus proche pour fournir la valeur finale de type
`argent` (voir [la FAQ](./4-2-catala-specific.md) pour plus d'informations sur
l'arrondi en Catala). Concernant `individu.revenu`, nous voyons que la notation
`.` nous permet d'accéder au champ `revenu` de `individu`, qui est en fait une
structure de type `Individu`.

~~~admonish tip title="Utiliser des énumérations"
De manière similaire à l'accès aux champs de structure, Catala vous permet
d'inspecter le contenu d'une valeur d'énumération avec le filtrage par motif
(pattern matching), comme il est d'usage dans les langages de programmation
fonctionnelle. Concrètement, si `crédit_impôt` est une variable dont le type est
`CréditImpôt` tel que déclaré ci-dessus, alors vous pouvez définir le montant
d'un crédit d'impôt qui dépend d'un nombre d'enfants éligibles avec le filtrage
par motif suivant :

```catala-expr-fr
selon crédit_impôt sous forme
-- PasDeCréditImpôt: 0 €
-- CréditImpôtEnfants contenu nombre_enfants_éligibles:
  10 000 € * nombre_enfants_éligibles
```

Dans la branche `-- CréditImpôtEnfants contenu nombre_enfants_éligibles:`, vous
savez que `crédit_impôt` est dans la variante `CréditImpôtEnfants`, et
`nombre_enfants_éligibles` vous permet de lier le contenu `entier` de la
variante. Comme dans un langage de programmation fonctionnelle classique, vous
pouvez donner le nom que vous voulez à `nombre_enfants_éligibles`, ce qui est
utile si vous imbriquez des filtrages par motif et souhaitez différencier le
contenus de deux variantes différentes.
~~~

Maintenant, revenons à notre champ d'application `CalculImpôtRevenu`. À ce stade,
il nous manque encore la définition de `taux_imposition`. C'est un schéma courant
lors du codage de la loi : les définitions des différentes variables sont
dispersées dans différents articles. Heureusement, le compilateur Catala
collecte automatiquement toutes les définitions pour chaque champ d'application
et les met dans le bon ordre. Ici, même si nous définissons `taux_imposition`
après `impôt_revenu` dans notre code source, le compilateur Catala inversera
l'ordre des définitions en interne car `taux_imposition` est utilisé dans la
définition de `impôt_revenu`. Plus généralement, l'ordre des définitions et
déclarations de haut niveau dans les fichiers de code source Catala n'a pas
d'importance, et vous pouvez remanier le code librement sans avoir à vous soucier
de l'ordre des dépendances.

Dans ce tutoriel, nous supposerons que notre spécification CITC fictive définit
le pourcentage dans l'article suivant. Le code Catala ci-dessous ne devrait pas
vous surprendre à ce stade.

~~~admonish quote title="Article 2"
Le pourcentage fixe mentionné à l'article 1 est égal à 20 %.

```catala-code-fr
champ d'application CalculImpôtRevenu:
  # Écrire 20% est juste une alternative pour le décimal "0,20".
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
peuvent jamais [déborder](https://fr.wikipedia.org/wiki/D%C3%A9passement_d%27entier).
De même, les valeurs `décimal` peuvent être arbitrairement précises (bien
qu'elles soient toujours rationnelles, appartenant à ℚ) et ne souffrent pas des
imprécisions de la virgule flottante. Pour `argent`, le langage prend une
décision arrêtée : une valeur de type `argent` est toujours un nombre entier de
centimes.

Ces choix ont plusieurs conséquences :
* `entier` divisé par `entier` donne un `décimal` ;
* `argent` ne peut pas être multiplié par `argent` (multipliez plutôt `argent` par `décimal`) ;
* `argent` multiplié (ou divisé) par `décimal` arrondit le résultat au centime le plus proche ;
* `argent` divisé par `argent` donne un `décimal` (qui n'est absolument pas arrondi).

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

~~~admonish failure title="Pourquoi ne puis-je pas tester `CalculImpôtRevenu` directement ?" collapsible=true
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
│ 41 │   entrée individu contenu Individu
│    │          ‾‾‾‾‾‾‾‾
└─
```

Comme le dit le message d'erreur, essayer d'interpréter directement
`CalculImpôtRevenu` revient à essayer de calculer les impôts de quelqu'un sans
connaître le revenu de la personne ! Pour être exécuté, le champ d'application
doit être appelé avec des valeurs concrètes pour le revenu et le nombre d'enfants
de l'individu. Sinon, Catala se plaindra que les variables d'`entrée` du champ
d'application manquent pour l'interprétation.
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
      -- individu:
        # "individu" a un type structure, nous devons donc construire la
        # structure "Individu" avec la syntaxe suivante
        Individu {
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

Ceci conclut la première section du tutoriel. En mettant en place des structures
de données comme `structure` et `énumération`, en représentant les types des
variables de `champ d'application`, et la `définition` de formules pour ces
variables, vous devriez maintenant être capable de coder en Catala l'équivalent
de programmes à fonction unique qui effectuent des opérations arithmétiques
courantes et définissent des variables locales.

~~~~~~admonish info collapsible=true title="Récapitulatif de la section actuelle"
Pour référence, voici la version finale du code Catala consolidé à la fin de
cette section du tutoriel.

~~~catala-fr
{{#include ../../examples/tutoriel_fin_2_1.catala_fr}}
~~~
~~~~~~
