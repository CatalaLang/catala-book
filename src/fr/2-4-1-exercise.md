# Exercice

~~~admonish danger title="Travaux en cours"
Cette section du livre Catala n'a pas encore été écrite, restez à l'écoute pour
les futures mises à jour !
~~~

En guise d'exercice, vous pouvez essayer d'implémenter un nouvel article qui
complexifie encore plus le calcul :

~~~admonish quote title="Article 9"
La déduction accordée à l'article 8 est plafonnée à 8 500 € pour l'ensemble du foyer.
~~~

~~~admonish example title="Solution d'implémentation pour les articles 7, 8 et 9" collapsible=true
```catala-code-fr
déclaration champ d'application CalculImpôtFoyer:
  entrée personnes contenu liste de Personne
  entrée territoires_outre_mer contenu booléen
  entrée date_courante contenu date

  interne parts_impôt_foyer
    # Il est possible de stocker la structure résultant d'un appel de champ d'application
    # (avec toutes ses variables de résultat) dans un seul type. Le nom de ce
    # type de structure est le nom du champ d'application, d'où la ligne ci-dessous.
    contenu liste de CalculImpôtFoyerIndividuel
  interne déduction_totale contenu argent
    état base
    état plafonnée

  résultat impôt_foyer contenu argent
    état base
    état déduction

déclaration champ d'application CalculImpôtFoyerIndividuel:
  entrée personne contenu Personne
  entrée territoires_outre_mer contenu booléen
  entrée date_courante contenu date

  calcul_impôt_revenu champ d'application CalculImpôtRevenu

  résultat impôt_foyer contenu argent
  résultat déduction contenu argent
```

#### Article 7

Lorsque plusieurs personnes vivent ensemble, ils sont collectivement soumis à
l'impôt sur le foyer. L'impôt sur le foyer dû est de 10 000 € par personne du foyer,
et la moitié de ce montant par enfant.


```catala-code-fr
champ d'application CalculImpôtFoyerIndividuel:
  définition impôt_foyer égal à
    10 000 € * (1,0 + personne.nombre_enfants / 2)

champ d'application CalculImpôtFoyer:
  définition parts_impôt_foyer égal à
    transforme chaque personne parmi personnes en
      résultat de CalculImpôtFoyerIndividuel avec {
        -- personne: personne
        -- territoires_outre_mer: territoires_outre_mer
        -- date_courante: date_courante
      }


  définition impôt_foyer
    état base
  égal à
    Argent.somme de
      transforme chaque part_impôt_foyer parmi parts_impôt_foyer
      en part_impôt_foyer.impôt_foyer
```

#### Article 8

Le montant de l'impôt sur le revenu payé par chaque personne peut être déduit de la
part de l'impôt sur le foyer due par cet personne.

```catala-code-fr
champ d'application CalculImpôtFoyerIndividuel:
  définition calcul_impôt_revenu.personne égal à
    personne
  définition calcul_impôt_revenu.territoires_outre_mer égal à
    territoires_outre_mer
  définition calcul_impôt_revenu.date_courante égal à
    date_courante

  définition déduction égal à
    si calcul_impôt_revenu.impôt_revenu > impôt_foyer alors impôt_foyer
    sinon calcul_impôt_revenu.impôt_revenu

champ d'application CalculImpôtFoyer:
  définition déduction_totale
    état base
  égal à
    Argent.somme de
      transforme chaque part_impôt_foyer parmi parts_impôt_foyer en
        part_impôt_foyer.déduction

  définition impôt_foyer
    état déduction
  égal à
    si déduction_totale > impôt_foyer alors 0 €
    sinon impôt_foyer - déduction_totale
```

#### Article 9

La déduction accordée à l'article 8 est plafonnée à 8 500 € pour l'ensemble du foyer.

```catala-code-fr
champ d'application CalculImpôtFoyer:
  définition déduction_totale
    état plafonnée
  égal à
    si déduction_totale > 8 500 € alors 8 500 € sinon déduction_totale
```
~~~
