# Guide pas à pas : configurer un projet Catala

Bien que le [tutoriel Catala](./2-0-tutorial.md) vous initie à la programmation en
Catala et aux spécificités de la traduction des exigences juridiques dans votre code, il
lui manque tous les aspects d'un projet informatique au-delà de la simple écriture du code.

Plus précisément, l'équipe Catala encourage les développeurs Catala à utiliser les standards
modernes de génie logiciel en ce qui concerne l'organisation et la gestion de projet.
Cette section agit comme un guide pas à pas qui montre principalement comment le système de construction Catala, `clerk`,
facilite les processus de structuration, de test et de déploiement d'un projet informatique utilisant Catala.

~~~admonish info title="Prérequis pour ce guide"
Ce guide suppose que le lecteur travaille sur un système de type Unix et
a un niveau minimum de pratique de la ligne de commande et des opérations système de base.
Les deuxième, troisième et quatrième sections supposent également une connaissance de base des travaux
de génie logiciel moderne, et une familiarité avec des plateformes comme Gitlab ou Github.
~~~

Ce guide est structuré séquentiellement pour imiter les différentes
étapes de la création d'un nouveau projet Catala et de l'organisation de sa base de code ainsi
que du travail autour de celle-ci :
* la [première section](./3-1-directory-config.md) explique comment
  organiser les fichiers sources Catala et configurer votre projet pour `clerk`,
  le système de construction de Catala ;
* la [deuxième section](./3-2-compilation-deployment.md) développe la précédente
  pour ajouter le déploiement automatisé des artefacts générés par Catala en utilisant les
  différents backends du compilateur ;
* la [troisième section](./3-3-test-ci.md) concerne la mise en place d'une pile de génie logiciel
  moderne autour de la base de code, complète avec gestion de versions, tests automatisés
  et intégration continue (CI) ;
<!-- * la [quatrième section](./3-4-external-plugins.md) est un guide étape par étape pour
  configurer un [module implémenté en externe](./5-6-modules.md#declaring-external-modules)
  et ses implémentations externes dans tous les backends cibles, tout cela
  intégré dans la chaîne d'outils de génie logiciel automatisée décrite dans les
  sections précédentes ; -->
* la [quatrième et dernière section](./3-5-lawyers-agile.md) est principalement non technique
  et orthogonale aux sections précédentes, elle concerne l'organisation humaine
  des projets Catala impliquant des juristes et des programmeurs, ainsi que les choix
  fondamentaux importants à faire au début du projet.

~~~admonish tip title="La dernière section va vous surprendre !"
Bien que les premières sections soient principalement destinées aux programmeurs, l'équipe
Catala recommande que tout le monde sur le projet, y compris les juristes, lise
la [dernière section](./3-5-lawyers-agile.md) avant de se lancer dans la production
du code Catala.
~~~

Bonne lecture !
