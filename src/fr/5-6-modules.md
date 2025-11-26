# Modules

<div id="tocw"></div>

Après les [champs d'application et les déclarations de haut niveau](./5-3-scopes-toplevel.md), les modules sont
le deuxième niveau d'abstraction en Catala. Précisément, les modules sont simplement un groupe de
champs d'application et de déclarations de haut niveau qui forment une unité de compilation séparée pour le
compilateur Catala. En tant que tels, ils présentent une interface publique ou API, dont les éléments
peuvent être référencés ou appelés à l'exécution par un autre module.

## Déclarations de module

Un fichier source Catala peut être transformé en module en insérant en haut une
déclaration de module. Par exemple, si le fichier est nommé `foo.catala_fr`,
la déclaration de module est simplement :

~~~catala-fr
> Module Foo
~~~

Le nom du fichier et le nom du module dans la déclaration de module
doivent correspondre, mais des différences de casse sont autorisées car les noms de modules doivent être
en CamlCase et les noms de fichiers sont généralement en snake_case.

~~~admonish danger title="N'oubliez pas la déclaration de module !"
Si vous oubliez de mettre `> Module Foo` en haut de votre fichier, le fichier ne
sera pas considéré comme un module par le système de construction `clerk`. En particulier,
vous ne pourrez pas appeler les fonctions de ce fichier depuis d'autres modules.
~~~

## Imports

Les modules peuvent "utiliser" d'autres modules pour importer leurs types, champs d'application et
constantes publics. Si vous voulez utiliser le module `Bar` à l'intérieur du module `Foo`, le haut de
`foo.catala_fr` devrait ressembler à :

```catala-fr
> Module Foo

> Usage de Bar
```

Vous pouvez alors faire référence aux types, champs d'application et constantes de `Bar` comme `Fizz` avec
`Bar.Fizz` à l'intérieur de `Foo`. Si vous ne voulez pas taper `Bar.` à chaque fois, vous pouvez
donner à `Bar` un alias à l'intérieur de `Foo` avec :

```catala-fr
> Module Foo

> Usage de Bar en tant que B
```

Alors, `B.Fizz` fera référence à `Bar.Fizz`.

## Inclusions

Parfois, le texte juridique et le code Catala qui doivent tenir dans un seul
module sont trop volumineux pour un seul fichier. C'est généralement le cas lorsque la
spécification juridique pour un champ d'application donné s'étend sur plusieurs sources juridiques qui ont
des références mutuelles entre elles. Dans ces cas, vous voulez que chaque source juridique
ait son propre fichier `.catala_fr`, tandis que l'implémentation du champ d'application et le module englobant
s'étendent sur tous ces fichiers.

Pour accommoder cette pratique, Catala a un mécanisme d'inclusion textuelle qui
vous permet d'inclure le contenu d'un fichier dans un autre. Par exemple, imaginez
que le module dans le fichier `prestation.catala_fr` tire son implémentation des
fichiers `prestation_loi.catala_fr`, `prestation_reglement.catala_fr`, et `prestation_instructions.catala_fr`.

Alors, le contenu de `prestation.catala_fr` devrait ressembler à ceci pour inclure
tous les autres fichiers :

```catala-fr
> Module Prestation

> Inclusion: prestation_loi.catala_fr
> Inclusion: prestation_reglement.catala_fr
> Inclusion: prestation_instructions.catala_fr
```

L'ordre des instructions `> Inclusion` dans `prestation.catala_fr` déterminera
l'ordre dans lequel le contenu du fichier est copié. Bien que cet ordre
n'ait aucune influence sur la sémantique du calcul, il changera la façon dont les choses
sont imprimées dans les backends de [programmation littéraire](./5-1-literate-programming.md).

Ce qui vient après `Inclusion:` est en fait un chemin de fichier de style Unix, qui peut
faire référence à des sous-répertoires ou au répertoire parent (`../`).

## Interface publique et visibilité

L'équipe Catala pense que les programmeurs devraient contrôler précisément quelle interface ils
rendent publiquement disponible pour leurs modules. En effet, ne pas exposer les fonctions internes
est la clé pour préserver la capacité de refactoriser le code plus tard
sans casser les points de terminaison utilisés par les clients du module.

C'est la raison pour laquelle en Catala, toutes les déclarations de type, de champ d'application et de constante
à l'intérieur des blocs `` ```catala `` sont privées : elles ne seront pas accessibles par d'autres
modules. Pour rendre une déclaration de type, de champ d'application ou de constante publique et donc
accessible par d'autres modules, vous devez transformer le bloc `` ```catala ``
contenant en un bloc `` ```catala-metadata ``. C'est tout !
