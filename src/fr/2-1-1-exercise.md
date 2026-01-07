# Exercice pratique : "Rien n'est certain sauf la mort et les impôts"

Dans cette section, nous présentons un exercice pratique visant à familiariser
avec l'écriture de programmes Catala et la compréhension de ses concepts de base.
Nous vous invitons fortement à configurer un [environnement Catala fonctionnel](./1-1-0-installing.md),
à ouvrir un éditeur (tel que `vscode`) et à copier-coller le modèle d'exercice
suivant dans un fichier catala ; vous pouvez le nommer `exercice-2-1-1.catala_fr`.

~~~~~~admonish example title="Fichier modèle 'exercice-2-1-1.catala_fr'" collapsible=true
~~~catala-fr
# Livre Catala : Exercice 2-1-1

```catala
déclaration structure Individu:
  donnée date_naissance contenu date
  donnée date_décès contenu DateDécès

déclaration énumération DateDécès:
  -- Décédé contenu date
  -- ToujoursVivant
```

# Question 1

En vous basant sur la déclaration `test_personne1`, déclarez une `test_personne2`
née le 21 décembre 1977 qui est toujours vivante.

```catala
# Déclaration et définition d'une valeur constante nommée test_personne1
déclaration test_personne1 contenu Individu égal à
  Individu {
    -- date_naissance: |1981-10-05|
      # Le format de date est |AAAA-MM-JJ|
    -- date_décès: Décédé contenu |2012-05-12|
  }

déclaration test_personne2 contenu Individu égal à
  test_personne1 # <= Supprimez cette ligne et remplacez-la par votre réponse
```

```catala
déclaration champ d'application TuerPersonne:
  entrée date_fatidique contenu date
  entrée victime contenu Individu
  résultat individu_tué contenu Individu
```

# Question 2

Étant donné la déclaration du champ d'application `TuerPersonne`, définissez une
variable de résultat `individu_tué` du champ d'application `TuerPersonne` qui
utilise les variables d'entrée `date_fatidique` et `victime` pour créer un nouvel
Individu qui est une copie de l'entrée `victime` mais avec sa `date_décès` mise
à jour. Par souci de simplicité, nous ne vérifierons pas si nous tuons un
individu déjà décédé.

Vous pouvez tester votre solution en invoquant le champ d'application Catala
TestTuerPersonne : `clerk run exercice-2-1-1.catala_fr --scope TestTuerPersonne`.

```catala
déclaration champ d'application TestTuerPersonne:
  résultat calcul contenu TuerPersonne

champ d'application TestTuerPersonne:
  définition calcul égal à
    résultat de TuerPersonne avec {
      -- date_fatidique: |2025-01-20|
      -- victime: test_personne2
    }

# Définissez votre champ d'application TuerPersonne ici

# champ d'application TuerPersonne:
#   ...
```

```catala
déclaration structure Couple:
  donnée revenu_annuel_foyer contenu argent
  donnée personne_1 contenu Individu
  donnée personne_2 contenu Individu

# Définissez votre définition test_couple ici

# déclaration test_couple contenu Couple égal à
#   ...
```

```catala
déclaration champ d'application CalculImpôt:
  entrée date_traitement contenu date
  entrée couple contenu Couple

  interne personne1_décédée_avant_date_traitement contenu booléen
  interne personne2_décédée_avant_date_traitement contenu booléen

  résultat montant_impôt contenu argent

champ d'application CalculImpôt:
  définition montant_impôt égal à
    si personne1_décédée_avant_date_traitement
      ou personne2_décédée_avant_date_traitement alors
     0 €
   sinon
     couple.revenu_annuel_foyer * 15%
```

## Question 4

Définissez une autre définition de champ d'application `CalculImpôt` qui définit
les deux variables booléennes internes `personne1_décédée_avant_date_traitement`
et `personne2_décédée_avant_date_traitement`.

```catala
# Définissez votre nouveau champ d'application CalculImpôt ici

# champ d'application CalculImpôt:
#   ...
```

## Question 5

Enfin, nous devons définir un test pour notre calcul. En vous basant sur les
tests définis précédemment, écrivez une définition du champ d'application de test
`TestCalculImpôt`. Ensuite, ajustez les valeurs de test données pour vous assurer
que votre implémentation est correcte.

```catala
déclaration champ d'application TestCalculImpôt:
  résultat test_calcul_impôt contenu CalculImpôt

# Définissez votre champ d'application TestCalculImpôt ici

# champ d'application TestCalculImpôt:
#   ...
```
~~~
~~~~~~

***


~~~admonish tip title="Aide-mémoire de la syntaxe Catala"
Tout au long de cet exercice, n'hésitez pas à vous référer à l'[aide-mémoire de
la syntaxe Catala](https://catalalang.github.io/catala/syntax.pdf) !
En particulier si vous avez du mal avec les constructions syntaxiques du langage.
~~~

Dans cet exercice, nous voulons définir (encore un autre !) calcul d'impôt.
Cette fois, le montant de l'impôt qu'un foyer doit payer dépend de si les
individus sont toujours vivants ou non. Afin de modéliser un tel mécanisme, nous
introduisons les structures Catala suivantes représentant les individus.

Un individu est référencé en utilisant seulement deux informations : sa date de
naissance et sa **possible** date de décès. Si un individu est toujours vivant,
il n'a pas de date de décès. Exprimer cette possibilité peut se faire en
utilisant une énumération : si l'individu est toujours vivant, son entrée
`date_décès` sera `ToujoursVivant` sinon ce sera `Décédé` qui doit être
accompagné d'une valeur de date comme spécifié dans la déclaration suivante.

```catala-code-fr
déclaration structure Individu:
  donnée date_naissance contenu date
  donnée date_décès contenu DateDécès

déclaration énumération DateDécès:
  -- Décédé contenu date
  -- ToujoursVivant

# Déclaration et définition d'une valeur constante nommée test_personne1
déclaration test_personne1 contenu Individu égal à
  Individu {
    -- date_naissance: |1981-10-05|
      # Le format de date est |AAAA-MM-JJ|
    -- date_décès: Décédé contenu |2012-05-12|
  }
```

## Question 1

En vous basant sur la déclaration `test_personne1`, essayez de définir une
`test_personne2` née le 21 décembre 1977 qui est toujours vivante.

~~~admonish example title="Solution de la Question 1" collapsible=true

Réponse :

```catala-code-fr

déclaration test_personne2 contenu Individu égal à
  Individu {
    -- date_naissance: |1977-12-21|
    -- date_décès: ToujoursVivant
  }
```
~~~

***

Nous voulons maintenant un moyen de mettre à jour le statut d'une personne de
vivant à décédé. Nous le faisons via un champ d'application dédié `TuerPersonne`
dont la déclaration est :


```catala-code-fr
déclaration champ d'application TuerPersonne:
  entrée date_fatidique contenu date
  entrée victime contenu Individu
  résultat individu_tué contenu Individu
```

## Question 2

Étant donné la déclaration du champ d'application `TuerPersonne`, définissez une
variable de résultat `individu_tué` du champ d'application `TuerPersonne` qui
utilise les variables d'entrée `date_fatidique` et `victime` pour créer un nouvel
Individu qui est une copie de l'entrée `victime` mais avec sa `date_décès` mise
à jour. Par souci de simplicité, nous ne vérifierons pas si nous tuons un
individu déjà décédé.

Vous pouvez tester votre solution en utilisant le champ d'application
TestTuerPersonne suivant en invoquant cette commande dans une console :
```console
clerk run exercice-2-1-1.catala_fr --scope TestTuerPersonne
```

```catala-code-fr
déclaration champ d'application TestTuerPersonne:
  résultat calcul contenu TuerPersonne

champ d'application TestTuerPersonne:
  définition calcul égal à
    résultat de TuerPersonne avec {
      -- date_fatidique: |2025-01-20|
      -- victime: test_personne2
    }
```

~~~admonish example title="Solution de la Question 2" collapsible=true
```catala-code-fr
champ d'application TuerPersonne:
  définition individu_tué égal à
    Individu {
      -- date_naissance: victime.date_naissance
      -- date_décès: Décédé contenu date_fatidique
    }
```

***

Vous pouvez également utiliser la syntaxe `en remplaçant` pour modifier des
champs spécifiques d'une structure. Cela vous permet de ne modifier que des
champs spécifiques, ce qui peut être utile surtout lorsqu'une structure définit
beaucoup de champs !


```catala-code-fr
champ d'application TuerPersonne:
  définition individu_tué égal à
    victime mais en remplaçant { -- date_décès: Décédé contenu date_fatidique }
```
~~~

Nous définissons maintenant une structure `Couple` qui représente un foyer
simple. Cette structure a trois entrées différentes :
- Deux individus : `personne_1` et `personne_2` ;
- Et leur `revenu_annuel_foyer` combiné.

```catala-code-fr
déclaration structure Couple:
  donnée personne_1 contenu Individu
  donnée personne_2 contenu Individu
  donnée revenu_annuel_foyer contenu argent
```

## Question 3

Encore une fois, définissez une valeur de test nommée `test_couple` qui réutilise
les individus précédemment définis (à savoir `test_personne_1` et
`test_personne_2`) et fixe leur `revenu_annuel_foyer` à `80 000 €`.


~~~admonish example title="Solution de la Question 3" collapsible=true
```catala-code-fr
déclaration test_couple contenu Couple égal à
  Couple {
    -- revenu_annuel_foyer: 80 000 €
    -- personne_1: test_personne1
    -- personne_2: test_personne2
  }
```
~~~

***

Considérons maintenant un article de loi sur le calcul de l'impôt avec une
définition très simple :

```admonish quote title="Article : Calcul de l'Impôt"
L'impôt sur le revenu pour le foyer d'un couple est défini comme 15% de leur
revenu annuel, sauf si l'un (ou les deux) des individus est décédé avant la
date de traitement du dossier.
```

Cela se traduit par le code Catala suivant :

```catala-code-fr
déclaration champ d'application CalculImpôt:
  entrée date_traitement contenu date
  entrée couple contenu Couple

  interne personne1_décédée_avant_date_traitement contenu booléen
  interne personne2_décédée_avant_date_traitement contenu booléen

  résultat montant_impôt contenu argent

champ d'application CalculImpôt:
  définition montant_impôt égal à
    si
      personne1_décédée_avant_date_traitement
      ou personne2_décédée_avant_date_traitement
    alors 0 €
    sinon couple.revenu_annuel_foyer * 15%
```

Afin de banaliser la définition de `montant_impôt`, nous avons introduit deux
variables de champ d'application `interne` qui représentent des valeurs
booléennes (`vrai` ou `faux`). Cependant, même si nous avons fourni la définition
de la variable de résultat `montant_impôt`, ces variables internes restent à
définir sinon nous ne pourrons pas effectuer le calcul efficacement.

## Question 4

En Catala, les définitions de champ d'application peuvent être dispersées dans
tout le fichier. Ce faisant, cela permet d'implémenter localement la logique
définie par un article de loi sans introduire de code passe-partout qui gênerait
un processus de révision.

Définissez une autre définition de champ d'application `CalculImpôt` qui définit
les deux variables booléennes internes `personne1_décédée_avant_date_traitement`
et `personne2_décédée_avant_date_traitement`.

~~~admonish tip title="Décomposer les énumérations"
Afin de décomposer et de raisonner sur les valeurs d'énumération, on peut
utiliser la construction de _filtrage par motif_ (pattern matching). Par exemple,
le _filtrage par motif_ d'une énumération `DateDécès` ressemble à ceci :
```catala-code-fr
champ d'application CalculImpôt:
  définition âge_individu égal à
    selon individu.date_décès sous forme
    -- ToujoursVivant: date_courante - individu.date_naissance
    -- Décédé contenu date_décès: date_décès - individu.date_naissance
```
*Nota bene* : toutes les différentes branches d'un _filtrage par motif_ doivent
contenir des expressions du même type de données.
~~~

~~~admonish example title="Solution de la Question 4" collapsible=true
```catala-code-fr
champ d'application CalculImpôt:
  définition personne1_décédée_avant_date_traitement égal à
    selon couple.personne_1.date_décès sous forme
    -- ToujoursVivant: faux
    -- Décédé contenu d: d < date_traitement

  définition personne2_décédée_avant_date_traitement égal à
    # Une autre syntaxe possible pour tester les motifs
    couple.personne_2.date_décès sous forme
      Décédé contenu d et d < date_traitement
```
~~~

## Question 5

Enfin, nous devons définir un test pour notre calcul. En vous basant sur les
tests définis précédemment, écrivez une définition du champ d'application de test
`TestCalculImpôt`. Ensuite, ajustez les valeurs de test données pour vous assurer
que votre implémentation est correcte.

```catala-code-fr
déclaration champ d'application TestCalculImpôt:
  résultat test_calcul_impôt contenu CalculImpôt
```

Comme précédemment, vous pouvez utiliser une commande similaire pour exécuter
votre test :
```console
$ clerk run exercice-2-1-1.catala_fr --scope TestCalculImpôt
```

~~~admonish example title="Solution de la Question 5" collapsible=true
```catala-code-fr
champ d'application TestCalculImpôt:
  définition test_calcul_impôt égal à
    résultat de CalculImpôt avec {
      # La date de traitement est une semaine avant le décès de test_personne1 :
      -- date_traitement: |2012-05-01|
      # La date de traitement est une semaine avant le décès de test_personne2 :
      # -- date_traitement: |2012-05-20|
      -- couple: test_couple
    }
```
~~~
