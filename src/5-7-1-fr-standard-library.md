# Bibliothèque standard

<div id="tocw"></div>

Pour éviter d'avoir à réinventer la roue, Catala dispose d'une
bibliothèque standard contenant diverses fonctions utiles permettant
de manipuler les types de bases. Ci-dessous, vous trouverez la liste
des prototypes de fonction de la bibliothèque standard, classifiée par
modules. Pour utilister une fonction de la bibliothèque standard, vous
pouvez taper:

```catala-code-fr
<nom module>.<nom fonction> de <arguments>
```

Exemple:

```catala-expr-fr
Date.dernier_jour_du_mois de |21-01-2024| # retourne |31-01-2024|
```

~~~admonish info title="Utilisation des modules de la bibliothèque standard"
Il n'est pas nécessaire d'écrire `> Usage de <Module>` pour les
modules de la bibliothèque standard. Ces modules sont automatiquement accessibles.
En outre, seuls les modules français, décrits ci-dessous, sont
accessibles. Les modules anglais ne sont pas inclus.
~~~

Voici un résumé de tous les modules disponibles de la bibliothèque standard:
- [`Entier`](#module-entier) -- Fonctions arithmétiques sur les valeurs de type `entier`
- [`Décimal`](#module-décimal) -- Fonctions arithmétiques sur les valeurs de type `décimal`
- [`Argent`](#module-argent) -- Fonctions arithmétiques et financières sur le type `argent`
- [`Date`](#module-date) -- Fonctions de représentation et de manipulation du type `date`
- [`MoisAnnée`](#module-moisannée) -- Structure et fonctions sur les mois d'année spécifiques
- [`Période`](#module-période) -- Période de temps et utilitaires pour les manipuler
- [`Liste`](#module-liste) -- Fonctions pour créer, accéder et manipuler les valeurs de type `liste`

~~~admonish info title="Où se trouvent les fichiers de la bibliothèque standard ?"
Les sources de la bibliothèque standard sont installées en même temps que
Catala. Au sein de chaque projet, elles sont copiées dans le dossier
`_build/libcatala` dès que nécessaire, en particulier lors de l'utilisation de
`clerk build` ou `clerk run`.
~~~

~~~admonish tip title="Quelque chose manque, puis-je l'ajouter ?"
Avec plaisir! Catala est un projet open-source ; vous pouvez
contribuer à l'extension de la bibliothèque standard en créant une
"Pull Request" mettant à jour les [fichiers dans le dossier
`stdlib`](https://github.com/CatalaLang/catala/tree/master/stdlib).
~~~

## Module `Entier`

```catala-code-fr
## Renvoie le plus petit des deux arguments.
déclaration min
  contenu entier
  dépend de
    n1 contenu entier,
    n2 contenu entier

## Renvoie le plus grand des deux arguments.
déclaration max
  contenu entier
  dépend de
    n1 contenu entier,
    n2 contenu entier

## Applique une limite supérieure à `n`, et renvoie une valeur qui n'est
## jamais plus grande que `valeur_max`.
déclaration plafond
  contenu entier
  dépend de
    variable contenu entier,
    valeur_max contenu entier

## Applique une limite inférieure à `n`, et renvoie une valeur qui n'est
## jamais plus petite que `valeur_min`.
déclaration plancher
  contenu entier
  dépend de
    variable contenu entier,
    valeur_min contenu entier

## Renvoie l'argument s'il est positif, 0 sinon.
déclaration positif
  contenu entier
  dépend de variable contenu entier
```

## Module `Décimal`

```catala-code-fr
## Renvoie le plus petit des deux arguments.
déclaration min
  contenu décimal
  dépend de
    d1 contenu décimal,
    d2 contenu décimal

## Renvoie le plus grand des deux arguments.
déclaration max
  contenu décimal
  dépend de
    d1 contenu décimal,
    d2 contenu décimal

## Applique une limite supérieure à `d`, et renvoie une valeur qui n'est
## jamais plus grande que `valeur_max`.
déclaration plafond
  contenu décimal
  dépend de
    d contenu décimal,
    valeur_max contenu décimal

## Applique une limite inférieure à `n`, et renvoie une valeur qui n'est
## jamais plus petite que `valeur_min`.
déclaration plancher
  contenu décimal
  dépend de
    d contenu décimal,
    valeur_min contenu décimal

## Renvoie l'argument s'il est positif, 0,0 sinon.
déclaration positif
  contenu décimal
  dépend de d contenu décimal

## Enlève les chiffres après la virgule.
## **Exemples:**
## - `troncature de 7,61 = 7,0`
## - `troncature de -7,61 = -7,0`
déclaration troncature
  contenu décimal
  dépend de d contenu décimal

## Arrondit à l'entier supérieur.
## **Exemples:**
## - `arrondi_par_excès de 4,34 = 5,0`
## - `arrondi_par_excès de -4,34 = -4,0`
déclaration arrondi_par_excès
  contenu décimal
  dépend de d contenu décimal

## Arrondit à l'entier inférieur.
## **Exemples:**
## - `arrondi_par_défaut de 3,78 = 3,0`
## - `arrondi_par_défaut de -3,78 = -4,0`
déclaration arrondi_par_défaut
  contenu décimal
  dépend de d contenu décimal

## Arrondit à la `nième_décimale` spécifiée. `nième_décimale` peut être une
## valeur négative.
## **Exemples:**
## - `arrondi_à_la_décimale de 123,4567,  3 = 123,457`
## - `arrondi_à_la_décimale de 123,4567, -2 = 100,0`
déclaration arrondi_à_la_décimale
  contenu décimal
  dépend de
    d contenu décimal,
    nième_décimale contenu entier
```

## Module `Argent`

```catala-code-fr
## Renvoie le plus petit des deux arguments.
déclaration min
  contenu argent
  dépend de
    m1 contenu argent,
    m2 contenu argent

## Renvoie le plus grand des deux arguments.
déclaration max
  contenu argent
  dépend de
    m1 contenu argent,
    m2 contenu argent

## Applique une limite supérieure à `a`, et renvoie une valeur qui n'est
## jamais plus grande que `valeur_max`.
déclaration plafond
  contenu argent
  dépend de
    a contenu argent,
    valeur_max contenu argent

## Applique une limite inférieure à `a`, et renvoie une valeur qui n'est
## jamais plus petite que `valeur_min`.
déclaration plancher
  contenu argent
  dépend de
    a contenu argent,
    valeur_min contenu argent

## Renvoie l'argument s'il est positif, 0€ sinon.
déclaration positif
  contenu argent
  dépend de a contenu argent

## Enlève d'un montant d'argent ses chiffres après la virgule.
## **Exemples:**
## - `troncature de 7,61€ = 7€`
## - `troncature de -7,61€ = -7€`
déclaration troncature
  contenu argent
  dépend de a contenu argent

## Arrondi un montant d'argent à l'euro supérieur.
## **Exemples:**
## - `arrondi_par_excès de 4,34€ = 5€`
## - `arrondi_par_excès de -4,34€ = -4€`
déclaration arrondi_par_excès
  contenu argent
  dépend de a contenu argent

## Arrondit un montant d'argent à l'euro inférieur.
## **Exemples:**
## - `arrondi_par_défaut de 3,78€ = 3€`
## - `arrondi_par_défaut de -3,78€ = -4€`
déclaration arrondi_par_défaut
  contenu argent
  dépend de a contenu argent

## Arrondit un montant d'argent à la `nième_décimale` spécifiée.
## `nième_décimale` peut être une valeur négative.
## **Exemples:**
## - `arrondi_à_la_décimale de 123,45€, 1 = 123,5€`
## - `arrondi_à_la_décimale de 123,45€, -2 = 100€`
déclaration arrondi_à_la_décimale
  contenu argent
  dépend de
    a contenu argent,
    nième_décimale contenu entier
```

### Opérations financières

```catala-code-fr
## Retourne le montant positif duquel `a` dépasse de `référence`
## (sinon 0€).
déclaration en_excès
  contenu argent
  dépend de
    a contenu argent,
    référence contenu argent

## Retourne le montant positif duquel `a` est en dessous de `référence`
## (sinon 0€).
déclaration en_défaut
  contenu argent
  dépend de
    a contenu argent,
    référence contenu argent
```

## Module `Date`

### Fonctions utilitaires

```catala-code-fr
## Renvoie la plus ancienne des deux dates.
déclaration min
  contenu date
  dépend de
    d1 contenu date,
    d2 contenu date

## Renvoie la plus récente des deux dates.
déclaration max
  contenu date
  dépend de
    d1 contenu date,
    d2 contenu date
```

### Dates et années, mois et jours

```catala-code-fr
## Construit une date à partir du numéro de l'année, du mois (à partir de 1)
## et du jour (à partir de 1).
déclaration depuis_année_mois_jour
  contenu date
  dépend de
    #[implicit_position_argument]
    pos contenu position_source,
    dannée contenu entier,
    dmois contenu entier,
    djour contenu entier

## Renvoie le numéro de l'année, du mois (1-12) et du jour (1-31) de la date
## passée en argument.
déclaration vers_année_mois_jour
  contenu (entier, entier, entier)
  dépend de d contenu date

## Renvoie le numéro de l'année d'une date.
déclaration accès_année
  contenu entier
  dépend de d contenu date

## Renvoie le numéro du mois (1-12) d'une date.
déclaration accès_mois
  contenu entier
  dépend de d contenu date

## Renvoie le numéro du jour (1-31) d'une date.
déclaration accès_jour
  contenu entier
  dépend de d contenu date
```

### Aller vers le passé ou le futur

```catala-code-fr
## Renvoie le premier jour du mois de la date passée en argument.
## **Exemple:** `premier_jour_du_mois de |2024-01-21| = |2024-01-01|`.
déclaration premier_jour_du_mois
  contenu date
  dépend de d contenu date

## Renvoie le dernier jour du mois de la date passée en argument.
## **Exemple:** `dernier_jour_du_mois de |2024-01-21| = |2024-01-31|`
déclaration dernier_jour_du_mois
  contenu date
  dépend de d contenu date

## Renvoie le premier jour de l'année de la date passée en argument.
## **Exemple:** `premier_jour_de_l_année de |2024-03-21| = |2024-01-01|`
déclaration premier_jour_de_l_année
  contenu date
  dépend de d contenu date

## Renvoie le dernier jour de l'année de la date passée en argument.
## **Exemple:** `dernier_jour_de_l_année de |2024-03-21| = |2024-12-31|`
déclaration dernier_jour_de_l_année
  contenu date
  dépend de d contenu date
```

### Mois nommés

```catala-code-fr
déclaration énumération Mois:
  -- Janvier
  -- Février
  -- Mars
  -- Avril
  -- Mai
  -- Juin
  -- Juillet
  -- Août
  -- Septembre
  -- Octobre
  -- Novembre
  -- Décembre

## Renvoie le numéro de mois (1-12) associé à un mois nommé.
déclaration mois_vers_entier
  contenu entier
  dépend de m contenu Mois

## Renvoie le mois nommé correspondant au numéro de mois (1-12).
## **Échoue:** si l'argument n'est pas entre 1 et 12
déclaration entier_vers_mois
  contenu Mois
  dépend de i contenu entier
```

### Comparaisons de dates

```catala-code-fr
## Teste si une personne née à `date_de_naissance` est au moins âgée de `âge` à
## la date `à_date`. Cette fonction calcule l'anniversaire en arrondissant à
## l'**inférieur**.
## **Exemples:**
## - `est_assez_âgé_arrondi_inférieur de |2000-06-01|, 24 an, |2024-06-15| = vrai`
## - `est_assez_âgé_arrondi_inférieur de |2000-06-01|, 24 an, |2024-05-15| = faux`
## - `est_assez_âgé_arrondi_inférieur de |2000-01-31|, 1 mois, |2000-02-29| = vrai`
déclaration est_assez_âgé_arrondi_inférieur
  contenu booléen
  dépend de
    date_de_naissance contenu date,
    âge contenu durée,
    à_date contenu date

## Teste si une personne née à `date_de_naissance` est au moins âgée de `âge` à
## la date `à_date`. Cette fonction calcule l'anniversaire en arrondissant au
## **supérieur**.
## **Exemples:**
## - `est_assez_âgé_arrondi_supérieur de |2000-06-01|, 24 an, |2024-06-15| = vrai`
## - `est_assez_âgé_arrondi_supérieur de |2000-06-01|, 24 an, |2024-05-15| = faux`
## - `est_assez_âgé_arrondi_supérieur de |2000-01-31|, 1 mois, |2000-02-29| = faux`
déclaration est_assez_âgé_arrondi_supérieur
  contenu booléen
  dépend de
    date_de_naissance contenu date,
    âge contenu durée,
    à_date contenu date

## Teste si une personne née à `date_de_naissance` a un âge strictement
## inférieur à `âge` à la date `à_date`. Cette fonction calcule l'anniversaire
## en arrondissant à l'**inférieur**.
## **Exemples:**
## - `est_assez_jeune_arrondi_inférieur de |2000-06-01|, 24 an, |2024-06-15| = faux`
## - `est_assez_jeune_arrondi_inférieur de |2000-06-01|, 24 an, |2024-05-15| = vrai`
## - `est_assez_jeune_arrondi_inférieur de |2000-01-31|, 1 mois, |2000-02-29| = faux`
déclaration est_assez_jeune_arrondi_inférieur
  contenu booléen
  dépend de
    date_de_naissance contenu date,
    âge contenu durée,
    à_date contenu date

## Teste si une personne née à `date_de_naissance` a un âge strictement
## inférieur à `âge` à la date `à_date`. Cette fonction calcule l'anniversaire
## en arrondissant au **supérieur**.
## **Exemples:**
## - `est_assez_jeune_arrondi_supérieur de |2000-06-01|, 24 an, |2024-06-15| = faux`
## - `est_assez_jeune_arrondi_supérieur de |2000-06-01|, 24 an, |2024-05-15| = vrai`
## - `est_assez_jeune_arrondi_supérieur de |2000-01-31|, 1 mois, |2000-02-29| = vrai`
déclaration est_assez_jeune_arrondi_supérieur
  contenu booléen
  dépend de
    date_de_naissance contenu date,
    âge contenu durée,
    à_date contenu date
```

## Module `MoisAnnée`

```catala-code-fr
déclaration structure MoisAnnée:
  donnée nom_mois contenu D.Mois
  donnée numéro_année contenu entier

## Extrait le mois d'année depuis une date en ignorant le jour.
déclaration depuis_date
  contenu MoisAnnée
  dépend de d contenu date

## Transforme un `MoisAnnée` vers une `date` en choisissant
## le premier jour du mois.
déclaration premier_jour_du_mois
  contenu date
  dépend de m contenu MoisAnnée

## Transforme un `MoisAnnée` vers une `date` en choisissant
## le dernier jour du mois.
déclaration dernier_jour_du_mois
  contenu date
  dépend de m contenu MoisAnnée

## Teste si la date survient strictement avant le mois concerné.
déclaration est_avant_le_mois
  contenu booléen
  dépend de m contenu MoisAnnée, d contenu date

## Teste si la date survient strictement après le mois concerné.
déclaration est_après_le_mois
  contenu booléen
  dépend de m contenu MoisAnnée, d contenu date

## Teste si la date survient durant le mois concerné.
déclaration est_dans_le_mois
  contenu booléen
  dépend de m contenu MoisAnnée, d contenu date
    (est_après_le_mois_précédent de m, d)
    et (est_avant_le_mois_suivant de m, d)

## Teste si la date survient avant le premier jour du mois suivant.
## **Exemples:**
## - `est_avant_le_mois_suivant de mai_2025, |2025-04-13| = vrai`
## - `est_avant_le_mois_suivant de mai_2025, |2025-05-31| = vrai`
## - `est_avant_le_mois_suivant de mai_2025, |2025-06-01| = faux`
déclaration est_avant_le_mois_suivant
  contenu booléen
  dépend de m contenu MoisAnnée, d contenu date

## Teste si la date survient après le dernier jour du mois suivant.
## **Exemples:**
## - `est_après_le_mois_précédent de mai_2025, |2025-06-15| = vrai`
## - `est_après_le_mois_précédent de mai_2025, |2025-05-01| = vrai`
## - `est_après_le_mois_précédent de mai_2025, |2025-04-30| = faux`
déclaration est_après_le_mois_précédent
  contenu booléen
  dépend de m contenu MoisAnnée, d contenu date
```

## Module `Période`

### Définitions et opérations

Une période est composée d'une date de début et d'une date de fin.

```catala-code-fr
déclaration structure Période:
  donnée début contenu date
  # La date de fin est incluse dans la période par convention
  donnée fin contenu date

## Retourne la période englobant le mois donné de l'année donnée.
déclaration depuis_mois_et_année
  contenu Période
  dépend de
    pmois contenu Date.Mois,
    pannée contenu entier

## Retourne la période englobant l'année donnée.
déclaration depuis_année
  contenu Période
  dépend de pannée contenu entier

## Vérifie si la période est bien cohérente (elle débute avant sa fin, et dure
## au moins un jour).
déclaration valide
  contenu booléen
  dépend de p contenu Période

## Durée d'une période, en nombre de jours.
déclaration durée
  contenu durée
  dépend de p contenu Période

## Deux périodes sont adjacentes si la seconde commence aussitôt après la fin
## de la première.
déclaration sont_adjacentes
  contenu booléen
  dépend de
    p1 contenu Période,
    p2 contenu Période

## Retourne la période qui englobe `p1` et `p2`.
déclaration union
  contenu Période
  dépend de
    p1 contenu Période,
    p2 contenu Période

## Retourne la période contenue à la fois dans p1 et p2, si elle existe.
déclaration intersection
  contenu optionnel de Période
  dépend de
    p1 contenu Période,
    p2 contenu Période

## Teste si les périodes se chevauchent d'au moins un jour.
déclaration chevauche
  contenu booléen
  dépend de
    p1 contenu Période,
    p2 contenu Période

## Teste si la période `longue` englobe la période `courte`.
déclaration englobe
  contenu booléen
  dépend de
    longue contenu Période,
    courte contenu Période

## Teste si la date `d` est contenue dans la période `p`.
déclaration est_contenue
  contenu booléen
  dépend de
    p contenu Période,
    d contenu date

## Teste si la date survient *strictement* avant la période.
déclaration est_avant
  contenu booléen
  dépend de
    p contenu Période,
    d contenu date

## Teste si la date survient *strictement* après la période.
déclaration est_après
  contenu booléen
  dépend de
    p contenu Période,
    d contenu date

## Trouve la première période dans la liste `l` qui contient la date `d`.
déclaration trouve_période
  contenu optionnel de Période
  dépend de
    l contenu liste de Période,
    d contenu date
```

### Opérations sur des listes associées indexées par des périodes

```catala-code-fr
## Trie la liste de périodes en fonction de la date de début.
## Si deux périodes commencent le même jour, leur ordre dans la liste est
## préservé
déclaration tri_par_date
  contenu liste de (Période, n'importe quel de type t)
  dépend de l contenu liste de (Période, n'importe quel de type t)
```

### Diviser des périodes

```catala-code-fr
## Divise la période en autant de sous-périodes qu'elle contient de mois
## calendaires. Les premiers et derniers éléments retournés peuvent donc être
## des mois incomplets.
## Si la période donnée est invalide, retourne une liste vide.
déclaration divise_par_mois
  contenu liste de Période
  dépend de p contenu Période

## Divise la période en autant de sous-périodes qu'elle contient d'années du
## calendrier. Les premiers et derniers éléments retournés peuvent donc être
## des années incomplètes.
## Si la période donnée est invalide, retourne une liste vide.
déclaration divise_par_année
  contenu liste de Période
  dépend de
    mois_de_départ contenu Date.Mois,
    p contenu Période
```

## Module `Liste`

```catala-code-fr
## Donne la liste constituée des entiers consécutifs de `début` à `fin`.
## Si `fin <= début`, le résultat est une liste vide.
## **Exemple**: `séquence de 3, 6` donne la liste `[ 3; 4; 5; 6 ]`
déclaration séquence
  contenu liste de entier
  dépend de
    début contenu entier,
    fin contenu entier

## Donne l'élément à l'`index` donné dans la liste, encapsulé dans
## le constructeur `Présent`.
## Si l'index est plus petit que 1, ou en-dehors de la liste, la valeur
## `Absent` est retournée
## **Exemple**: `nième_élément de [101€; 102€; 103€], 2 = Présent contenu 102€`
déclaration nième_élément
  contenu optionnel de n'importe quel de type t
  dépend de
    l contenu liste de n'importe quel de type t,
    index contenu entier

## Donne le premier élément de la liste encapsulé dans le constructeur
## `Présent`.
## Si la liste est vide, retourne `Absent`.
déclaration premier_élément
  contenu optionnel de n'importe quel de type t
  dépend de l contenu liste de n'importe quel de type t

## Donne le dernier élément de la liste encapsulé dans le constructeur
## `Présent`.
## Si la liste est vide, retourne `Absent`.
déclaration dernier_élément
  contenu optionnel de n'importe quel de type t
  dépend de l contenu liste de n'importe quel de type t

## Supprime l'élément à l'`index` donné de la liste. Les index des éléments
## suivants sont décalés.
## Si l'index donné est invalide, retourne la liste sans modification.
déclaration retire_nième_élément
  contenu liste de n'importe quel de type t
  dépend de
    l contenu liste de n'importe quel de type t,
    index contenu entier

## Retourne la liste sans son premier élément.
## La liste vide est retournée inchangée.
déclaration retire_premier_élément
  contenu liste de n'importe quel de type t
  dépend de l contenu liste de n'importe quel de type t

## Retourne la liste sans son dernier élément.
## La liste vide est retournée inchangée.
déclaration retire_dernier_élément
  contenu liste de n'importe quel de type t
  dépend de l contenu liste de n'importe quel de type t

## Inverse l'ordre des éléments la liste donnée.
déclaration inverse
  contenu liste de n'importe quel de type t
  dépend de l contenu liste de n'importe quel de type t
```
