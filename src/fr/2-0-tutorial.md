# Tutoriel : calculer vos impôts

Bienvenue dans ce tutoriel, dont l'objectif est de vous guider à travers les
fonctionnalités du langage Catala et de vous apprendre à annoter un texte
législatif simple en utilisant le langage, pour obtenir un programme exécutable
qui calcule vos impôts !

Ce tutoriel ne couvre pas l'installation de Catala. Pour plus d'informations à
ce sujet, veuillez vous référer à la [section d'installation](./1-0-getting_started.md).
Si vous souhaitez suivre ce tutoriel localement, lisez la [section sur la création de votre premier programme](./1-2-first.md)
et copiez-collez simplement les extraits de code du tutoriel dans votre fichier
de programme Catala.

~~~admonish info title="Besoin de plus d'informations ?"
À tout moment, n'hésitez pas à consulter [l'aide-mémoire de la syntaxe Catala](https://catalalang.github.io/catala/syntax.pdf)
ou le [guide de référence](./5-catala.md) pour une vue exhaustive de la syntaxe
et des fonctionnalités de Catala ; ce tutoriel est plutôt conçu pour vous
familiariser avec le langage et ses modèles d'utilisation courants.
~~~

Le tutoriel comporte quatre sections, conçues pour être complétées dans l'ordre
car elles couvrent des fonctionnalités de plus en plus difficiles et avancées du
langage :
* la [première section](./2-1-basic-blocks.md) concerne les éléments de base des
  programmes du langage avec un flux de données simple ;
* la [deuxième section](./2-2-conditionals-exceptions.md) porte sur ce qui
  rend Catala unique : sa gestion de premier ordre des définitions conditionnelles
  et des exceptions ;
* la [troisième section](./2-3-list-scopes.md) traite de la montée en charge
  de la base de code avec des listes d'éléments et de multiples champs d'application ;
* la [quatrième section](./2-4-states-dynamic.md) termine avec les états de
  variables et l'appel dynamique de champs d'application.

~~~admonish note title="Pratiquer le tutoriel"
Ce tutoriel est conçu pour être une expérience interactive. Tout en lisant le
texte des différentes sections, nous vous encourageons à créer un fichier texte
vide `tutoriel.catala_fr` et à le remplir en copiant-collant les extraits de
code présentés. Grâce à ce fichier compagnon, vous pourrez voir directement
comment le vérificateur de types et l'interpréteur Catala se comportent sur les
différents exemples, et même faire vos propres expériences en modifiant le code
vous-même.

De plus, après chaque section, des exercices pratiques vous permettront de
mettre à l'épreuve ce que vous avez appris. Nous vous encourageons à terminer
ces exercices avant de passer à la section suivante.
~~~

Vous devriez être prêt à commencer maintenant. Bonne chance !
