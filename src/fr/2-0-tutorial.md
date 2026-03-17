# Tutoriel : calculer vos impôts

Ce tutoriel va vous guider à travers les fonctionnalités du langage Catala et
vous montrer comment, en ajoutant des annotations à un texte législatif simple,
vous pouvez obtenir un programme qui calcule vos impôts. Bienvenue !

L'installation de Catala n'est pas couverte par ce tutoriel: réferrez-vous à la
section [Installation](./1-0-getting_started.md) si nécessaire. Pour faire ce
tutoriel directement sur votre machine, consultez la section [Créer votre
premier programme](./1-2-first.md), et copiez-collez les fragments de code dans
vos fichiers Catala. Il vous est aussi possible de faire les exercices
directement en ligne en utilisant le bouton «Essayer le tutoriel» ci-contre.

~~~admonish info title="Pour plus d'information"
N'hésitez pas à consulter [l'aide-mémoire bilingue
Catala](https://catalalang.github.io/catala/syntax.pdf) ainsi que le [Guide de
référence](./5-catala.md) à tout moment: la syntaxe et tous les traits du
langages y sont documentés plus en détail. Ce tutoriel a vocation à être une
entrée en matière plus douce, et vous orientera quant à lui vers les motifs les
plus courants.
~~~

Ce tutoriel est en quatre parties de complexité croissante, à suivre dans
l'ordre:
* la [première partie](./2-1-basic-blocks.md) couvre les structures générales
  d'un programme suivant une ligne d'exécution directe
* la [deuxième section](./2-2-conditionals-exceptions.md) s'attarde sur une
  caractéristique unique de Catala: la gestion des définitions conditionnelles
  et des exceptions
* la [troisième section](./2-3-list-scopes.md) explique comment utiliser les
  listes et les champs d'application multiples, pour gérer les programmes qui
  commencent à gagner en taille
* et la [quatrième section](./2-4-states-dynamic.md) présente des fonctions plus
  avancées: les variables à états, l'appel dynamique de champs
  d'application.

~ ~~admonish note title="Apprendre par la pratique"

Le tutoriel est conçu pour être interactif: vous êtes encouragé à créer un
fichier texte `tutoriel.catala_fr` et à y reporter les fragments de code donnés.
Cela vous permettra d'expérimenter l'utilisation du type-checker et de
l'interpréteur et leurs réactions à vos changements.

Chaque partie se termine en outre par des exercices pratiques qui devraient vous
aider à confirmer ce que vous y avez appris. Il est recommandé de s'y atteler
avant d'attaquer la partie suivante!
~~~

Vous pouvez commencer. Bonne chance!
