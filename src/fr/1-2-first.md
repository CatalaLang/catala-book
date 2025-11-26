# Créer votre premier programme Catala

<div id="tocw"></div>

Maintenant que vous avez installé l'outillage Catala, vous pouvez tester sa
bonne exécution avec l'équivalent d'un programme `Hello, world!`.

Les programmes Catala sont de simples fichiers texte qui peuvent être manipulés
par n'importe quel éditeur de texte ou IDE. Ainsi, pour démarrer votre
développement Catala, l'équipe Catala vous recommande d'ouvrir votre éditeur de
texte favori.

~~~admonish info title="Support des éditeurs de texte/IDE"
L'équipe de développement de Catala ne fournit actuellement un support complet que
pour l'éditeur de texte [VSCode](https://code.visualstudio.com/) (coloration
syntaxique, serveur de langage, outil de mise en forme).

Cependant, la communauté Catala a écrit un [certain nombre de plugins pour
d'autres éditeurs de texte et IDE](https://github.com/CatalaLang/catala/tree/master/syntax_highlighting),
dont la maintenance est assurée au mieux des efforts possibles. N'hésitez pas à
contribuer si vous ajoutez le support pour votre éditeur de texte préféré !
~~~

Dans votre éditeur de texte/IDE, créez un nouveau dossier pour vos développements
Catala (par exemple nommé `catala`) et à l'intérieur, un fichier texte vide (par
exemple nommé `bonjour_monde.catala_fr`).

## Écrire des spécifications dans un fichier Catala

Copiez-collez le texte suivant dans votre fichier :

```catala-fr
# Tutoriel Catala

## Bonjour tout le monde !

Votre premier programme Catala devrait afficher l'entier `42` comme
Réponse à la Grande Question sur la Vie, l'Univers et le Reste.
```

À ce stade, votre fichier ressemble à un fichier Markdown classique et ne
contient aucun code source Catala *per se*. En effet, comme Catala utilise la
[programmation littéraire](https://fr.wikipedia.org/wiki/Programmation_lettr%C3%A9e),
tout texte à l'intérieur de votre fichier est considéré par défaut comme une
spécification Markdown. Voyons maintenant comment écrire réellement du code !

## Écrire votre premier bloc de code Catala

Sous le paragraphe `## Bonjour, monde !`, ouvrez un bloc de code Markdown
indiquant le langage `catala` :

~~~catala-fr
```catala
# <Insérez votre code Catala ici !>
```
~~~

Ces blocs de code Catala peuvent être placés n'importe où au milieu du Markdown
classique de votre fichier source. En fait, si vous suivez la méthodologie
Catala pour traduire la loi en code, votre fichier source ressemblera
principalement à un gros document Markdown parsemé de nombreux petits blocs de
code Catala.

~~~admonish danger title="Comment s'assurer que votre code n'est pas ignoré"
Votre code source Catala doit **toujours** être placé à l'intérieur d'un bloc de
code Catala introduit par une ligne avec `` ```catala `` et terminé par une
ligne avec `` ``` ``. Sinon, le compilateur Catala ignorera simplement votre
code.
~~~

Maintenant, à l'intérieur du bloc de code Catala, copiez-collez ce qui suit :

```catala-code-fr
déclaration champ d'application BonjourMonde:
  résultat réponse_univers contenu entier

champ d'application BonjourMonde:
  définition réponse_univers égal à 42
```

Il n'est pas important de comprendre ce que fait ce code pour l'instant. Vous
l'apprendrez plus tard dans le [tutoriel](./2-0-tutorial.md).

## Vérification des types et exécution du programme Catala

Puisque Catala est un langage fortement typé, vous pouvez *vérifier les types*
de votre programme sans l'exécuter pour voir s'il y a des erreurs de syntaxe ou
de typage. Cela se fait via la commande `clerk typecheck` :

```console
$ clerk typecheck bonjour_monde.catala_fr
```

Le résultat de cette commande devrait être :

```console
┌─[RESULT]─
│ Typechecking successful!
└─
```

Si le programme passe la vérification des types, nous pouvons l'exécuter via
l'interpréteur contenu dans le compilateur `catala`. Cela se fait avec la
commande suivante, en indiquant que nous voulons exécuter le champ d'application
(`--scope`) nommé `BonjourMonde` à l'intérieur du fichier `bonjour_monde.catala_fr` :

```console
$ clerk run bonjour_monde.catala_fr --scope=BonjourMonde
```

Le résultat de cette commande devrait être, [comme il est de coutume](https://fr.wikipedia.org/wiki/La_Grande_Question_sur_la_vie,_l%27Univers_et_le_reste) :

```text
┌─[RESULT]─
│ réponse_univers = 42
└─
```

Vous devriez maintenant être prêt à poursuivre votre voyage Catala à travers le
[tutoriel](./2-0-tutorial.md) !
