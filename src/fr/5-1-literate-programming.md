# Programmation littéraire et syntaxe de base

<div id="tocw"></div>

~~~admonish info title="Catala utilise le Markdown de Pandoc"
Les fichiers de code source Catala doivent être interprétables comme des fichiers Markdown.
Spécifiquement, la syntaxe Markdown de Catala est alignée sur la syntaxe Markdown de [Pandoc](https://pandoc.org/MANUAL.html#pandocs-markdown).
~~~

## Programmation littéraire

### Tissage et extraction

La [programmation littéraire](https://fr.wikipedia.org/wiki/Programmation_lettr%C3%A9e)
mélange le code source et sa documentation dans le même document. Un fichier source Catala
contient donc à la fois du code Catala et le texte de la spécification juridique
pour ce code.

Pour exécuter le code ou le compiler vers un langage de programmation cible, le compilateur Catala
ignore simplement tout le texte de spécification juridique du fichier source
et ne prend que le code source. C'est ce qu'on appelle l'_extraction_ (ou _tangling_).

Mais vous pourriez aussi vouloir produire un document complet lisible par un humain (ou même par un juriste)
sur le programme et sa spécification. Le compilateur Catala et le système de construction vous permettent également de le faire, voir la [référence du système de construction](./6-clerk.md)
pour plus d'informations. C'est ce qu'on appelle le _tissage_ (ou _weaving_).

### Texte libre et paragraphes

Si vous mettez simplement du texte dans votre fichier de code source Catala, il sera
interprété comme du texte libre et ignoré en tant que code source Catala. Ce mode texte libre
est conçu pour que vous puissiez copier-coller les spécifications juridiques de votre programme Catala.
Ces spécifications seront la base de votre programme, car vous les annoterez avec des [blocs de code
Catala](./5-1-literate-programming.md#catala-code-blocks).

Le texte libre suit la syntaxe Markdown classique : vous devez laisser une ligne vide pour
introduire un nouveau paragraphe.

~~~catala-fr
Ceci est un premier paragraphe de texte libre.
Cette phrase sera rendue sur la même ligne que la précédente.

Cette phrase commence un nouveau paragraphe après un saut de ligne.
~~~

### Titres

Un document Markdown est organisé grâce à une hiérarchie de titres, chacun
introduit par `#`. Plus un titre a de `#`, plus il est profond dans
le plan du document. Utilisez ces titres pour répliquer la structure hiérarchique
des documents juridiques (sections, articles, etc.) ; chaque paragraphe
de la spécification juridique devrait avoir un titre spécifiant son intitulé.

```catala-fr
# Titre du document

## Première section

### Article 1

...

## Deuxième section

### Article 2

...

### Article 3

...
```

En effet, le compilateur Catala gardera une trace de ces titres pour enrichir les
positions du code source utilisées dans les messages d'erreur, le débogage et les interfaces d'explications.

### Autres fonctionnalités Markdown

Pour le style (gras, italique), les tableaux, les liens, etc., vous pouvez utiliser toutes les fonctionnalités Markdown
supportées par [Pandoc](https://pandoc.org/MANUAL.html#pandocs-markdown).

### Extension de fichier Markdown

Il est possible de suffixer les fichiers Catala avec l'extension
`.md`: `foo.catala_en` sera équivalent à `foo.catala_en.md`. En
particulier, cela permet à des outils externes d'interpréter les
fichiers Catala comme des fichiers Markdown. Cela permet, par exemple,
d'afficher proprement les fichiers Catala dans des visualisateurs web.

## Principes de syntaxe de base

### Blocs de code Catala

Tout le code source Catala doit être contenu à l'intérieur d'un bloc de code Catala.
Un bloc de code Catala ressemble à ceci à l'intérieur de votre fichier source :

~~~catala-fr
```catala
<votre code va ici>
```
~~~

En général, le code source Catala ne se soucie pas des sauts de ligne, des tabulations et des espaces ;
vous pouvez organiser votre code comme vous le souhaitez. Cependant, cette syntaxe pour ouvrir et
fermer les blocs de code Catala est très stricte et doit être strictement respectée.

~~~admonish danger title="Attention à ces erreurs de syntaxe qui généreront des erreurs difficiles à déboguer"
* L'ouverture `` ```catala `` doit être au début d'une nouvelle ligne (pas d'espace avant `` ```catala ``).
* Ne mettez pas d'espace entre `` ``` `` et `catala`.
* Mettez toujours une nouvelle ligne après `` ```catala ``.
* Mettez toujours la fermeture `` ``` `` seule sur une nouvelle ligne.
* Mettez toujours une nouvelle ligne après la fermeture `` ``` ``.
* Vous ne pouvez pas imbriquer les blocs de code, *c'est-à-dire* qu'une ouverture `` ```catala `` doit
  toujours être fermée par une fermeture `` ``` `` sans ouvrir de nouveaux blocs de code
  entre les deux.
~~~

### Commentaires à l'intérieur des blocs de code Catala

À l'intérieur d'un bloc de code Catala, vous pouvez commenter votre code en préfixant les lignes par
`#`. Les commentaires seront ignorés par le compilateur à l'exécution mais tissés dans
la documentation comme des spécifications juridiques en mode texte libre.

### Mots-clés réservés

Certains mots sont réservés en Catala pour les mots-clés et ne peuvent donc pas être
utilisés comme noms de variables. Si vous essayez, vous obtiendrez une erreur de syntaxe confuse
car Catala croira que vous avez essayé d'utiliser le mot-clé au lieu du
nom de variable.

Les mots-clés réservés en Catala sont :

`champ d'application`
`conséquence`
`donnée`
`dépend de`
`déclaration`
`contexte`
`de`
`liste de`
`contient`
`énumération`
`entier`
`argent`
`décimal`
`date`
`durée`
`booléen`
`rempli`
`définition`
`état`
`étiquette`
`exception`
`égal à`
`selon`
`n'importe quel`
`sous forme`
`sous condition`
`si`
`alors`
`sinon`
`condition`
`contenu`
`structure`
`assertion`
`avec`
`pour`
`tout`
`on a`
`règle`
`soit`
`existe`
`dans`
`parmi`
`combine`
`transforme chaque`
`en`
`tel`
`que`
`et`
`ou`
`ou bien`
`non`
`maximum`
`minimum`
`est`
`ou si liste vide alors`
`mais en remplaçant`
`initialement`
`nombre`
`an`
`mois`
`jour`
`vrai`
`faux`
`entrée`
`résultat`
`interne`
`arrondi`


### Inclusion textuelle

Bien qu'un [module](./5-6-modules.md) Catala doive être contenu dans un seul fichier,
parfois les spécifications juridiques sont très volumineuses et il est impossible de
les décomposer en modules logiquement indépendants : la loi est une grosse boule
de code spaghetti. Dans ce cas, il serait injuste de vous forcer à
avoir des fichiers sources Catala gigantesques pour représenter un module.

Par conséquent, Catala dispose d'une fonctionnalité d'inclusion textuelle. Elle fonctionne comme ceci. Si, à l'intérieur de
`foo.catala_fr`, vous mettez (en mode texte libre, pas à l'intérieur d'un bloc de code Catala) :

```catala-fr
> Inclusion: bar.catala_fr
```

Alors, le tissage et l'extraction fonctionneront comme si vous aviez copié-collé le contenu
de `bar.catala_fr` à l'intérieur de `foo.catala_fr` à l'endroit où se trouve le `> Inclusion`.

~~~admonish tip title="Comment diviser un gros module en plusieurs fichiers inclus"
Typiquement, vous voulez implémenter toutes les dispositions pour le calcul
d'une taxe. Ces dispositions sont réparties entre une loi, un règlement et
une jurisprudence. Chacun de ces éléments spécifie une partie du calcul, donc ils
doivent être à l'intérieur du même module Catala. Cependant, vous pouvez utiliser le mécanisme d'inclusion
textuelle pour diviser votre implémentation en quatre fichiers différents
reflétant les différentes sources de la spécification : `taxe.catala_fr`,
`loi.catala_fr`, `reglement.catala_fr` et `jurisprudence.catala_fr`.

`taxe.catala_fr` sera le fichier maître listant les autres :

```catala-fr
# Calcul de la taxe

> Inclusion: loi.catala_fr
> Inclusion: reglement.catala_fr
> Inclusion: jurisprudence.catala_fr
```

Ensuite, vous pouvez copier-coller la spécification juridique dans `loi.catala_fr`,
`reglement.catala_fr` et `jurisprudence.catala_fr`, en commençant par des titres `##`
dans chacun de ces fichiers car `taxe.catala_fr` comporte déjà le titre de niveau supérieur `#`.
~~~
