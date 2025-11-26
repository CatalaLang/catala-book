# Modules externes

<div id="tocw"></div>

Les modules externes sont un moyen d'intégrer une logique externe dans un projet
Catala. Par exemple, si un programme Catala nécessite une logique qui est trop
lourde (ou tout simplement impossible) à exprimer en Catala, on peut se rabattre
sur des modules externes pour les implémenter dans le langage cible du backend
souhaité -- par exemple, C, Java, OCaml. Les utilisateurs sont tenus de remplir
l'implémentation du module externe pour chaque cible backend souhaitée. Par
exemple, si un projet ne cible que la compilation vers Java, seule une
implémentation de module externe Java doit être présente.

~~~admonish warning
Cependant, pour interpréter un programme Catala (`clerk run` ou `clerk test`
sans spécifier l'option `--backend`), l'implémentation du module externe OCaml
est requise.
~~~

## Déclarer des modules externes

Certains modules contiennent une logique qui ne peut pas être implémentée en
Catala. C'est normal, puisque Catala est un langage dédié (DSL) et non un
langage de programmation généraliste. Cela signifie que les fonctionnalités de
Catala sont intentionnellement limitées ; par exemple, vous ne pouvez pas écrire
de fonctions récursives ou [manipuler des chaînes de caractères](./4-2-catala-specific.md#why-are-there-no-strings)
en Catala. Mais parfois, vous avez besoin d'appeler depuis un module Catala
régulier une fonction contenant ce morceau de logique non implémentable. C'est le
but du module externe. Un module externe en Catala est un fichier de code source
Catala contenant un module avec l'annotation `externe`, comme ceci :

~~~catala-fr
> Module Foo externe

```catala-metadata
déclaration structure Période:
  donnée date_début contenu date
  donnée date_fin contenu date

déclaration mois_dans_période contenu liste de date
  dépend de période contenu Période
```
~~~

Ce module `externe` déclare un type (`Période`), ainsi qu'une fonction de haut
niveau (`mois_dans_période`), mais cette dernière n'a pas d'implémentation !
C'est voulu car les modules externes ne doivent pas contenir de code Catala,
mais simplement des déclarations de types, des déclarations de champs
d'application et des déclarations de constantes et de fonctions de haut niveau.
Ces déclarations (à l'intérieur des blocs `` ```catala-metadata ``) exposent une
interface publique pour le module externe, qui peut être utilisée par d'autres
modules.

Cependant, pour faire fonctionner tout cela en pratique, vous devrez toujours
implémenter le module externe en OCaml (pour l'interpréteur) et dans votre
langage cible. Voir la [section de référence pertinente](./5-8-2-external-modules.md).

## Implémenter des modules externes

Les modules externes doivent correspondre précisément à l'interface attendue par
le code Catala.

~~~admonish danger title="Fonctionnalité de bas niveau"
Les modules externes sont très dépendants des détails des backends implémentés
par Catala. Vous pouvez vous attendre à ce que des mises à jour du code externe
soient nécessaires avec les prochaines versions du compilateur.
~~~

Pour aider à cela, la commande `catala` supporte un drapeau `--gen-external` qui
générera une implémentation modèle dans le backend donné :

```console
$ catala ocaml --gen-external foo.catala_fr
┌─[RESULT]─
│ Generated template external implementations:
│   "foo.template.ml"
│   "foo.template.mli"
└─
```

Renommez les fichiers (en supprimant la partie `.template`), et éditez-les pour
remplacer les espaces réservés d'erreur `Impossible` par votre implémentation.

- Les définitions de types, l'interface et les parties d'enregistrement du
  module doivent être laissées inchangées
- Procédez de la même manière pour chaque backend vers lequel votre projet sera
  compilé. Une implémentation OCaml est requise pour exécuter l'interpréteur
  Catala sur le projet, et fortement recommandée.

~~~admonish danger title="Gardez-le fonctionnel"
Le runtime Catala s'attend à ce que les appels de fonction soient "purs" : un
appel à une fonction donnée ne doit dépendre d'aucun contexte. En d'autres
termes, appeler la même fonction avec les mêmes arguments devrait toujours
donner le même résultat, et il est déconseillé de stocker un état persistant
dans un module externe.
~~~

Lors de la compilation, le système de construction Clerk récupérera
automatiquement l'implémentation fournie.

En cas de changements dans l'interface Catala (ou lors de la mise à jour du
compilateur Catala), vous devez réexécuter la commande `--gen-external` et
résoudre les divergences entre votre implémentation et le nouveau fichier
`.template`.
