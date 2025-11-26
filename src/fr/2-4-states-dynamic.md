# États de variables et appels dynamiques de champs d'application

<div id="tocw"></div>

## Introduction

Dans cette section, le tutoriel reprend là où la section précédente s'est arrêtée,
c'est-à-dire l'implémentation du calcul de l'impôt sur le foyer pour
un individu. Maintenant, nous devons encore agréger les calculs
pour les individus au niveau du foyer pour générer l'impôt total sur le foyer.

Faire cette agrégation nécessitera d'appeler le champ d'application `CalculImpôtFoyerIndividuel`
plusieurs fois pour une agrégation de liste à l'intérieur de `CalculImpôtFoyer`. Nous
couvrirons ce sujet, mais d'abord nous devons régler les affaires inachevées
de la dernière section du tutoriel !

~~~~~~admonish info collapsible=true title="Récapitulatif de la section précédente"
Cette section du tutoriel s'appuie sur la [précédente](./2-3-list-scopes.md),
et réutilisera le même exemple fil rouge, mais tout le code Catala nécessaire
pour exécuter l'exemple est inclus ci-dessous pour référence.

~~~catala-fr
{{#include ../../examples/tutoriel_fin_2_3.catala_fr}}
~~~
~~~~~~

## États de variables

Rappelez-vous que nous avons défini `impôt_foyer` en un seul passage
à l'intérieur de `CalculImpôtFoyerIndividuel` :

```catala-code-fr
champ d'application CalculImpôtFoyerIndividuel:
  définition impôt_foyer égal à
    soit impôt égal à
      10 000 € * (1,0 + individu.nombre_enfants / 2)
    dans
    soit déduction égal à calcul_impôt_revenu.impôt_revenu dans
    # N'oubliez pas de plafonner la déduction !
    si déduction > impôt alors 0 € sinon impôt - déduction
```

Cependant, faire cela fusionne les spécifications de l'article 7 et de l'article 8,
ce qui va à l'encontre de l'esprit de Catala de diviser le code dans la même structure
que le texte juridique. Donc, au lieu d'utiliser deux variables locales à l'intérieur de la définition
de `impôt_foyer`, nous voulons diviser la formule en deux `définition` distinctes.
Intuitivement, cela implique de créer deux variables de champ d'application dans
`CalculImpôtFoyerIndividuel`, `impôt_foyer_base` (pour l'article 7) et
`impôt_foyer_avec_déduction` (article 8). Mais en réalité, cela revient à donner
deux états consécutifs pour la variable `impôt_foyer`, et les juristes comprennent
mieux le code de cette façon ! Donc Catala a une fonctionnalité pour vous permettre de faire exactement cela :

~~~admonish note title="Définir plusieurs états pour la même variable"
```catala-code-fr
déclaration champ d'application CalculImpôtFoyerIndividuel:
  entrée individu contenu Individu
  entrée territoires_outre_mer contenu booléen
  entrée date_courante contenu date

  calcul_impôt_revenu champ d'application CalculImpôtRevenu

  résultat impôt_foyer contenu argent
    # Les différents états pour la variable "impôt_foyer" sont déclarés ici,
    # dans l'ordre exact où vous vous attendez à ce qu'ils soient calculés !
    état base
    état avec_déduction
```

Avec nos deux états `base` et `avec_déduction`, nous pouvons coder les articles 7 et
8 :

#### Article 7

Lorsque plusieurs individus vivent ensemble, ils sont collectivement soumis à
l'impôt sur le foyer. L'impôt sur le foyer dû est de 10 000 € par individu du foyer,
et la moitié de ce montant par enfant.

```catala-code-fr
champ d'application CalculImpôtFoyerIndividuel:
  définition impôt_foyer état base égal à
    10 000 € * (1,0 + individu.nombre_enfants / 2)
```

#### Article 8

Le montant de l'impôt sur le revenu payé par chaque individu peut être déduit de la
part de l'impôt sur le foyer due par cet individu.

```catala-code-fr
champ d'application CalculImpôtFoyerIndividuel:
  définition impôt_foyer état avec_déduction égal à
    # Ci-dessous, "impôt_foyer" fait référence à la valeur de "impôt_foyer" calculée
    # dans l'état précédent, donc ici l'état "base" qui précède immédiatement
    # l'état "avec_déduction" dans la déclaration.
    si calcul_impôt_revenu.impôt_revenu > impôt_foyer alors 0 €
    sinon
      impôt_foyer - calcul_impôt_revenu.impôt_revenu
    # Il est également possible de faire référence aux états de variables explicitement avec la
    # syntaxe "impôt_foyer état base".
```

Ailleurs dans `CalculImpôtFoyerIndividuel`, utiliser `impôt_foyer` fera
implicitement référence au dernier état de la variable (donc ici `avec_déduction`),
correspondant à la convention implicite habituelle dans les textes juridiques.
~~~

Ceci complète notre implémentation de `CalculImpôtFoyerIndividuel` ! Sa
variable de résultat `impôt_foyer` contient maintenant la part de l'impôt sur le foyer due par
chaque individu du foyer, avec la déduction correcte de l'impôt sur le revenu.
Nous pouvons maintenant l'utiliser dans le calcul de l'impôt global sur le foyer dans
`CalculImpôtFoyer`.

## Relier les champs d'application ensemble via la transformation de liste

Nous pouvons maintenant finir de coder l'article 7 en additionnant chaque part de l'
impôt sur le foyer détenue par tous les individus du foyer. Nous ferons
cela via l'agrégation de liste, comme précédemment, mais les éléments de la liste à
agréger sont maintenant le résultat de l'appel de `CalculImpôtFoyerIndividuel`
sur chaque individu. Précédemment, nous avons montré comment appeler un sous-champ d'application
statiquement et exactement une fois. Mais ici, ce n'est pas ce que nous voulons : nous voulons
appeler le sous-champ d'application autant de fois qu'il y a d'individus dans le foyer.
Nous devons alors utiliser une méthode différente pour appeler le sous-champ d'application :

~~~admonish note title="Appeler un sous-champ d'application dynamiquement"
Avec toutes nos refactorisations, la déclaration du champ d'application `CalculImpôtFoyer`
peut être simplifiée (nous n'avons plus besoin de la variable de fonction `part_impôt_foyer`) :

```catala-code-fr
déclaration champ d'application CalculImpôtFoyer:
  entrée individus contenu liste de Individu
  entrée territoires_outre_mer contenu booléen
  entrée date_courante contenu date
  résultat impôt_foyer contenu argent
```

Ensuite, la définition de `impôt_foyer` pourrait être réécrite comme suit à côté
de l'article 7 :

```catala-code-fr
champ d'application CalculImpôtFoyer:
  définition impôt_foyer égal à
    somme argent de
      transforme chaque individu parmi individus en (
        # Ci-dessous se trouve la syntaxe pour appeler le sous-champ d'application
        # "CalculImpôtFoyerIndividuel" dynamiquement, sur place.
        # après "avec" se trouve la liste des entrées du champ d'application.
        résultat de CalculImpôtFoyerIndividuel avec {
          # Les trois lignes suivantes sont tautologiques dans cet exemple, car
          # les noms des paramètres et les noms des variables de champ d'application
          # sont identiques, mais les valeurs des paramètres d'appel de champ d'application peuvent être
          # arbitrairement complexes !
          -- individu: individu # <- ce dernier "individu" est la variable de transformation
          -- territoires_outre_mer: territoires_outre_mer
          -- date_courante: date_courante
        }
        # La construction "résultat de <X> avec { ... }" renvoie une structure
        # contenant toutes les variables de résultat du champ d'application <X>. Par conséquent, nous accédons
        # à la variable de résultat "impôt_foyer" du champ d'application
        # "CalculImpôtFoyerIndividuel" avec la syntaxe d'accès au champ
        # ".impôt_foyer".
        ).impôt_foyer
```
~~~

C'est tout ! Nous avons fini d'implémenter l'article 7 et l'article 8 de manière propre,
extensible et pérenne en utilisant une série de champs d'application qui s'appellent
les uns les autres.

## Tester et déboguer le calcul

Nous avons écrit un code assez complexe dans cette section du tutoriel, il est grand
temps de le tester et de le déboguer. De la même manière que le test présenté dans la
[première section du tutoriel](./2-1-basic-blocks.md), nous pouvons déclarer un nouveau
champ d'application de test pour le calcul de l'impôt sur le foyer, et l'exécuter :

~~~admonish success title="Nouveau test pour `CalculImpôtFoyer`"
```catala-code-fr
déclaration champ d'application TestFoyer:
  résultat calcul contenu CalculImpôtFoyer

champ d'application TestFoyer:
  définition calcul égal à
    résultat de CalculImpôtFoyer avec {
      -- individus:
        [ Individu {
            -- revenu: 15 000 €
            -- nombre_enfants: 0
          } ;
          Individu {
            -- revenu: 80 000 €
            -- nombre_enfants: 2
          } ]
      -- territoires_outre_mer: faux
      -- date_courante: |1999-01-01|
    }
```

```console
$ clerk run tutoriel.catala_fr --scope=TestFoyer
┌─[RESULT]─
│ calcul = CalculImpôtFoyer { -- impôt_foyer: 21 500,00 € }
└─
```
~~~

Le résultat du test est-il correct ? Voyons cela en déroulant le calcul
manuellement :
* L'impôt sur le foyer pour deux individus et deux enfants est `2 * 10 000 € + 2 *
  5 000 €`, soit 30 000 € ;
* Le premier individu gagne plus de 10 000 €, moins de 100 000 €, n'a pas
  d'enfants et nous sommes avant l'an 2000, donc le taux d'impôt sur le revenu est de 20 %
  selon l'article 2 et son impôt sur le revenu est de 3 000 € ;
* La part de l'impôt sur le foyer pour le premier individu est de 10 000 €, donc la déduction
  pour le premier individu est la totalité des 3 000 € ;
* Le deuxième individu gagne plus de 10 000 €, moins de 100 000 €, mais a
  deux enfants donc le taux d'impôt sur le revenu est de 15 % selon l'article 3 et son
  impôt sur le revenu est de 12 000 € ;
* La part de l'impôt sur le foyer pour le deuxième individu est de 20 000 €, donc la
  déduction pour le deuxième individu est la totalité des 12 000 € ;
* La déduction totale est donc de 15 000 €, qui est plafonnée à 8 500 € selon l'article 9 ;
* Appliquer la déduction à l'impôt sur le foyer de base donne 21 500 €.

Jusqu'ici tout va bien, le résultat du test est correct. Mais il aurait pu arriver au
bon résultat en prenant les mauvaises étapes intermédiaires, donc nous voudrons
les inspecter. Heureusement, l'interpréteur Catala peut imprimer la trace complète
du calcul à cette fin. Voici la sortie sur l'interprétation
de `TestFoyer` :

~~~admonish abstract title="Trace de `TestFoyer`" collapsible=true
```console
$ clerk run tutoriel.catala_fr --scope=TestFoyer -c--trace
[LOG] ☛ Definition applied:
      ─➤ tutoriel.catala_fr
          │
          │   définition calcul égal à
          │              ‾‾‾‾‾‾
      Test
[LOG] →  CalculImpôtFoyer.direct
[LOG]   ≔  CalculImpôtFoyer.direct.
      entrée: CalculImpôtFoyer_in { -- individus_in: [Individu { -- revenu: 15 000,00 € -- nombre_enfants: 0 }; Individu { -- revenu: 80 000,00 € -- nombre_enfants: 2 }] -- territoires_outre_mer_in: faux -- date_courante_in: 1999-01-01 }
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │   définition parts_impôt_foyer égal à
            │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        Article 7
[LOG]   →  CalculImpôtFoyerIndividuel.direct
[LOG]     ≔  CalculImpôtFoyerIndividuel.direct.
      entrée: CalculImpôtFoyerIndividuel_in { -- individu_in: Individu { -- revenu: 15 000,00 € -- nombre_enfants: 0 } -- territoires_outre_mer_in: faux -- date_courante_in: 1999-01-01 }
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │   définition impôt_foyer égal à
              │              ‾‾‾‾‾‾‾‾‾‾‾‾
          Article 7
[LOG]     ≔  CalculImpôtFoyerIndividuel.impôt_foyer: 10 000,00 €
[LOG]     →  CalculImpôtRevenu.direct
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.date_courante égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.individu égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.territoires_outre_mer égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ≔  CalculImpôtRevenu.direct.
      entrée: CalculImpôtRevenu_in { -- date_courante_in: 1999-01-01 -- individu_in: Individu { -- revenu: 15 000,00 € -- nombre_enfants: 0 } -- territoires_outre_mer_in: faux }
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
               │
               │     date_courante < |2000-01-01|
               │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 2 (ancienne version avant 2000)
[LOG]       ≔  CalculImpôtRevenu.taux_imposition: 0,2
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
               │
               │   définition impôt_revenu égal à
               │              ‾‾‾‾‾‾‾‾‾‾‾‾
            Article 1
[LOG]       ≔  CalculImpôtRevenu.impôt_revenu: 3 000,00 €
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   calcul_impôt_revenu champ d'application CalculImpôtRevenu
                │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 7
[LOG]       ≔  CalculImpôtRevenu.direct.
      résultat: CalculImpôtRevenu { -- impôt_revenu: 3 000,00 € }
[LOG]     ←  CalculImpôtRevenu.direct
[LOG]     ≔  CalculImpôtFoyerIndividuel.
      calcul_impôt_revenu: CalculImpôtRevenu { -- impôt_revenu: 3 000,00 € }
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │   définition déduction égal à
              │              ‾‾‾‾‾‾‾‾‾
          Article 8
[LOG]     ≔  CalculImpôtFoyerIndividuel.déduction: 3 000,00 €
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │       résultat de CalculImpôtFoyerIndividuel avec {
              │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- individu: individu
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- territoires_outre_mer: territoires_outre_mer
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- date_courante: date_courante
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │       }
              │       ‾
          Article 7
[LOG]     ≔  CalculImpôtFoyerIndividuel.direct.
      résultat: CalculImpôtFoyerIndividuel { -- impôt_foyer: 10 000,00 € -- déduction: 3 000,00 € }
[LOG]   ←  CalculImpôtFoyerIndividuel.direct
[LOG]   →  CalculImpôtFoyerIndividuel.direct
[LOG]     ≔  CalculImpôtFoyerIndividuel.direct.
      entrée: CalculImpôtFoyerIndividuel_in { -- individu_in: Individu { -- revenu: 80 000,00 € -- nombre_enfants: 2 } -- territoires_outre_mer_in: faux -- date_courante_in: 1999-01-01 }
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │   définition impôt_foyer égal à
              │              ‾‾‾‾‾‾‾‾‾‾‾‾
          Article 7
[LOG]     ≔  CalculImpôtFoyerIndividuel.impôt_foyer: 20 000,00 €
[LOG]     →  CalculImpôtRevenu.direct
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.date_courante égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.individu égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   définition calcul_impôt_revenu.territoires_outre_mer égal à
                │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 8
[LOG]       ≔  CalculImpôtRevenu.direct.
      entrée: CalculImpôtRevenu_in { -- date_courante_in: 1999-01-01 -- individu_in: Individu { -- revenu: 80 000,00 € -- nombre_enfants: 2 } -- territoires_outre_mer_in: faux }
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
               │
               │     individu.nombre_enfants >= 2
               │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 3
[LOG]       ≔  CalculImpôtRevenu.taux_imposition: 0,15
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
               │
               │   définition impôt_revenu égal à
               │              ‾‾‾‾‾‾‾‾‾‾‾‾
            Article 1
[LOG]       ≔  CalculImpôtRevenu.impôt_revenu: 12 000,00 €
[LOG]       ☛ Definition applied:
            ─➤ tutoriel.catala_fr
                │
                │   calcul_impôt_revenu champ d'application CalculImpôtRevenu
                │   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            Article 7
[LOG]       ≔  CalculImpôtRevenu.direct.
      résultat: CalculImpôtRevenu { -- impôt_revenu: 12 000,00 € }
[LOG]     ←  CalculImpôtRevenu.direct
[LOG]     ≔  CalculImpôtFoyerIndividuel.
      calcul_impôt_revenu: CalculImpôtRevenu { -- impôt_revenu: 12 000,00 € }
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │   définition déduction égal à
              │              ‾‾‾‾‾‾‾‾‾
          Article 8
[LOG]     ≔  CalculImpôtFoyerIndividuel.déduction: 12 000,00 €
[LOG]     ☛ Definition applied:
          ─➤ tutoriel.catala_fr
              │
              │       résultat de CalculImpôtFoyerIndividuel avec {
              │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- individu: individu
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- territoires_outre_mer: territoires_outre_mer
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │         -- date_courante: date_courante
              │         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
              │       }
              │       ‾
          Article 7
[LOG]     ≔  CalculImpôtFoyerIndividuel.direct.
      résultat: CalculImpôtFoyerIndividuel { -- impôt_foyer: 20 000,00 € -- déduction: 12 000,00 € }
[LOG]   ←  CalculImpôtFoyerIndividuel.direct
[LOG]   ≔  CalculImpôtFoyer.
      parts_impôt_foyer: [CalculImpôtFoyerIndividuel { -- impôt_foyer: 10 000,00 € -- déduction: 3 000,00 € }; CalculImpôtFoyerIndividuel { -- impôt_foyer: 20 000,00 € -- déduction: 12 000,00 € }]
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │   définition impôt_foyer
            │              ‾‾‾‾‾‾‾‾‾‾‾‾
        Article 7
[LOG]   ≔  CalculImpôtFoyer.impôt_foyer#base: 30 000,00 €
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │   définition déduction_totale
            │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        Article 8
[LOG]   ≔  CalculImpôtFoyer.déduction_totale#base: 15 000,00 €
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │   définition déduction_totale
            │              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        Article 9
[LOG]   ≔  CalculImpôtFoyer.déduction_totale#plafonnée: 8 500,00 €
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │   définition impôt_foyer
            │              ‾‾‾‾‾‾‾‾‾‾‾‾
        Article 8
[LOG]   ≔  CalculImpôtFoyer.impôt_foyer#déduction: 21 500,00 €
[LOG]   ☛ Definition applied:
        ─➤ tutoriel.catala_fr
            │
            │     résultat de CalculImpôtFoyer avec {
            │     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │       -- individus:
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾
            │         [ Individu {
            │         ‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- revenu: 15 000 €
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- nombre_enfants: 0
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │           } ;
            │           ‾‾‾
            │           Individu {
            │           ‾‾‾‾‾‾‾‾‾‾
            │             -- revenu: 80 000 €
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │             -- nombre_enfants: 2
            │             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │           } ]
            │           ‾‾‾
            │       -- territoires_outre_mer: faux
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │       -- date_courante: |1999-01-01|
            │       ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
            │     }
            │     ‾
        Test
[LOG]   ≔  CalculImpôtFoyer.direct.
      résultat: CalculImpôtFoyer { -- impôt_foyer: 21 500,00 € }
[LOG] ←  CalculImpôtFoyer.direct
[LOG] ≔  TestFoyer.calcul: CalculImpôtFoyer { -- impôt_foyer: 21 500,00 € }
```
~~~

L'inspection de la trace révèle la structure du calcul qui correspond
étroitement au raisonnement juridique que nous avons fait juste au-dessus pour calculer la sortie du test
manuellement. Avec cet outil puissant, il est possible de déboguer et de maintenir
des programmes Catala à grande échelle.

## Conclusion

Félicitations pour avoir terminé le tutoriel Catala ! Les deux dernières sections n'ont pas
présenté de fonctionnalités uniques à Catala, contrairement aux exceptions de [la
deuxième section](./2-2-conditionals-exceptions.md). Au contraire, en Catala, nous utilisons
les techniques classiques de génie logiciel de la programmation fonctionnelle pour diviser
le code en plusieurs fonctions qui s'appellent les unes les autres au bon niveau d'
abstraction, dans le but de garder le code proche de là où il est spécifié dans la
loi. Il existe différentes façons d'exprimer quelque chose en Catala, mais la proximité
entre le code et la spécification juridique devrait être le critère pour ce qui est
la manière idiomatique de faire les choses.

Refactoriser le code Catala en continu à mesure que de nouvelles exigences légales sont ajoutées ou
mises à jour est la clé pour maintenir la base de code efficacement sur le long terme,
et éviter le code spaghetti qui est courant lors de la traduction de la loi en code. Nous
espérons que ce tutoriel vous a mis sur la bonne voie pour votre voyage dans Catala
et le monde merveilleux de l'automatisation sûre et fidèle des dispositions légales.

Nous vous encourageons à lire les prochains chapitres de ce livre pour continuer à apprendre comment
utiliser Catala, car le tutoriel n'est pas situé dans [une configuration de projet de développement logiciel
réel](./3-project.md), et manque de [beaucoup de conseils](./4-0-howto.md) sur
le codage en Catala mais aussi l'interaction avec les juristes.

~~~~~~admonish info collapsible=true title="Récapitulatif de la section actuelle"
Pour référence, voici la version finale du code Catala consolidé à la fin de
cette section du tutoriel.

~~~catala-fr
{{#include ../../examples/tutoriel_fin_2_4.catala_fr}}
~~~
~~~~~~
