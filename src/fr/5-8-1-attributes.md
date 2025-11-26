# Attributs

<div id="tocw"></div>


Le langage peut être étendu avec des attributs, permettant une variété d'extensions.
Un attribut est de la forme `#[clé.de.extension]` ou `#[clé.de.extension = VALEUR]`,
où `VALEUR` peut être de la forme `"CHAÎNE"`, ou une expression en syntaxe Catala.
Un attribut est toujours lié à l'élément qui le suit directement : une extension
pourrait par exemple les utiliser pour récupérer des étiquettes pour les champs d'entrée d'un
champ d'application afin de générer un formulaire web :

```catala-code-fr
déclaration champ d'application UnCalcul:
  #[formulaire.étiquette = "Entrez le nombre d'enfants satisfaisant la condition XXX"]
  entrée enfants_age contenu entier
```

## Attributs intégrés

Certains attributs affectent le compilateur Catala lui-même avec un support intégré.

## Impression de débogage

En ajoutant `#[debug.print]` devant une expression dans un programme Catala, la
valeur de cette expression sera imprimée lors du calcul par l'interpréteur,
lorsqu'il est exécuté avec l'option `--debug`. Il est autrement ignoré par les autres
backends.

Il est également possible d'imprimer la valeur avec une étiquette spécifique en utilisant
`#[debug.print = "une étiquette de débogage"]`.

Notez que, dans certains cas, en raison du fonctionnement du compilateur, les impressions de débogage pourraient
apparaître dupliquées ou pas du tout, surtout si les optimisations sont activées (avec
le drapeau `-O`). Si cela se produit, essayez de déplacer l'attribut à la racine de
la définition.
