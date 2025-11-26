# Installer Catala sur votre machine

<div id="tocw"></div>

~~~admonish warning title="Avertissement"
Actuellement, Catala n'est disponible que via la compilation depuis les sources.
L'équipe Catala prévoit de distribuer Catala sous forme binaire à l'avenir, ce
qui facilitera grandement le processus d'installation.
~~~

Catala est un langage de programmation principalement conçu pour être installé
sur votre machine et exécuté localement dans votre environnement de
développement préféré. Concrètement, Catala est composé de plusieurs exécutables
qui forment ensemble l'outillage du langage de programmation :
* le compilateur Catala `catala`, accompagné du système de construction `clerk` ;
* le serveur de protocole de langage (LSP) Catala `catala-lsp` ;
* l'outil de formatage automatique Catala `catala-format` ;
* le plugin Catala pour votre éditeur de texte ou [IDE](https://fr.wikipedia.org/wiki/Environnement_de_d%C3%A9veloppement).

En coulisses, la plupart de ces exécutables sont produits à l'aide de la chaîne
d'outils logicielle [OCaml](https://www.ocaml.org), le processus d'installation
commence donc avec `opam`, le gestionnaire de paquets et système de construction
pour OCaml.

Les instructions d'installation supposent toutes une maîtrise de la ligne de
commande et des connaissances de base sur le système de fichiers et le processus
général de construction d'exécutables à partir des sources à l'aide d'un
gestionnaire de paquets.

~~~admonish bug title="L'installation a échoué, que faire ?"
Si votre installation a échoué alors que vous suiviez le guide d'installation,
veuillez [ouvrir un ticket](https://github.com/CatalaLang/catala/issues) ou
lancer une discussion sur le [chat en ligne de la communauté Catala](https://zulip.catala-lang.org/).

Dans votre ticket ou message, veuillez indiquer :
* votre plateforme et système d'exploitation ;
* un journal des commandes que vous avez exécutées avec leur sortie en ligne de commande.
~~~

Les instructions d'installation diffèrent selon que vous êtes sur un système
[compatible Unix](./1-1-1-linux-mac-wsl.md) (Linux, MacOS, sous-système Windows
pour Linux), ou sur [Windows](./1-1-2-windows.md) classique. Veuillez choisir le
guide approprié à votre situation.

~~~admonish info title="Information importante"
Pendant les étapes d'installation, plusieurs invites peuvent apparaître. Choisir
l'option par défaut (en appuyant sur Entrée à chaque fois) ou répondre oui (en
tapant `y` puis Entrée) est suffisant.
~~~
