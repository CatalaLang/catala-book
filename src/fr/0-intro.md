# Introduction

Bienvenue sur le livre d'introduction au *langage de programmation dédié Catala* !

~~~admonish abstract title="En bref"
Le langage dédié Catala vous permet d'annoter une spécification juridique avec
du code exécutable et déployable de manière efficace et fiable. Automatiser
l'application d'une loi ou d'un règlement par un programme informatique n'est
pas neutre pour l'État de droit ainsi que pour les droits des usagers. Veuillez
faire preuve de prudence lorsque vous envisagez d'automatiser autre chose que le
calcul d'impôts ou de prestations sociales.

Contrairement à un moteur de règles, Catala est un langage de programmation à
part entière doté d'abstractions modulaires inspirées de la programmation
fonctionnelle. Mais surtout, il permet une véritable collaboration entre
juristes et informaticiens en permettant la pratique de la *programmation en
binôme* via la *programmation littéraire* pour l'écriture et la mise à jour des
programmes et de leurs spécifications juridiques.
~~~

## À qui s'adresse Catala

~~~admonish warning title="Catala n'est pas un langage de programmation généraliste"
Catala est un langage de programmation dédié (DSL), son utilisation cible donc
une classe spécifique d'utilisateurs et d'organisations.
~~~

### Équipes pluridisciplinaires

Catala est conçu pour être utilisé par des équipes mêlant expertises juridique
et informatique. En effet, automatiser l'application d'une loi ou d'un règlement
nécessite de combler le fossé de l'ambiguïté entre le texte juridique et un
programme informatique qui doit savoir quoi faire dans toutes les situations
possibles. Combler cette ambiguïté est l'une des missions des juristes, formés à
l'interprétation des textes juridiques et à la recherche juridique pour aboutir
à une décision justifiée dans le cadre de l'État de droit.

Si les juristes doivent décider de ce que fait le programme, ils ne sont pas
formés aux concepts et abstractions de la programmation, ni à l'écriture de
milliers de lignes de code de manière propre et maintenable. Ainsi, le rôle de
l'informaticien est de s'assurer que le programme automatisant l'application
d'une loi ou d'un règlement est propre, concis, et doté d'abstractions
correctement définies qui évitent la duplication de code et facilitent la
maintenance et les changements futurs. De plus, l'informaticien est également
responsable du déploiement du programme dans un système informatique plus vaste
qui pourrait briser ses hypothèses ou mettre à l'épreuve ses performances.

En réutilisant les techniques et outils existants du génie logiciel, tout en
présentant des concepts accessibles aux juristes en surface, Catala permet aux
juristes et aux informaticiens de collaborer de manière véritablement *agile*,
dépassant la séparation entre les équipes de développement et d'assurance
qualité qui ne communiquent que via des cas de test et des documents de
spécification.

### Agences gouvernementales et organismes de service public

Automatiser l'application d'une loi ou d'un règlement par un programme
informatique n'est pas une mince affaire. Pour s'assurer que tous sont traités
équitablement en vertu de l'État de droit, votre programme doit prendre en
compte de manière exhaustive chaque situation décrite par la loi ou le
règlement. Bien qu'automatiser uniquement la situation la plus simple
correspondant à une majorité d'utilisateurs puisse être acceptable dans
certaines situations, cela ne peut constituer la base d'un service public prêt
pour la production. En effet, créer une différence entre un "parcours simple"
automatisé et un traitement non automatisé des situations complexes creuse la
fracture numérique et accroît la confusion tant pour les usagers que pour les
agents.

Catala brille lorsque l'objectif est d'automatiser de manière exhaustive et
fiable une loi ou un règlement donné, et de maintenir cette automatisation dans
le temps. Le langage et l'outillage vous aideront à gérer la complexité
croissante, la maintenance face aux changements juridiques, les cas limites et
le déploiement en production au sein d'un système informatique existant. Si vous
recherchez un outil pour créer un chatbot d'aide aux utilisateurs de premier
niveau qui ne répond qu'aux questions de base, ou un modèle simplifié d'une loi
pour une étude économique, vous devriez envisager d'utiliser d'autres outils. En
revanche, si vous faites partie d'une organisation responsable de l'exécution
d'un service public comme les impôts ou les prestations sociales, vous devriez
avoir les moyens de concevoir correctement le programme informatique responsable
de l'automatisation, et utiliser Catala pour vous y aider.

Parce que Catala se compile vers des langages de programmation grand public
comme Python ou C, il produit des bibliothèques de code source portables qui
sont intégrables dans pratiquement n'importe quel système informatique, ancien
ou moderne. Plus particulièrement, les programmes Catala peuvent être déployés
derrière une API Web ou embarqués dans une application de bureau, permettant
d'écrire une fois pour utiliser partout ("write once, use anywhere"). Ainsi,
Catala est particulièrement adapté aux agences gouvernementales historiques qui
exploitent leurs systèmes informatiques depuis des décennies et continueront de
le faire pour les décennies à venir.

### Étudiants et universitaires en informatique et/ou en droit

La formalisation du droit, terme plus général pour désigner la traduction du
droit en code informatique exécutable, fait l'objet d'une attention académique
depuis très longtemps. Le domaine "IA & Droit" a historiquement été la
communauté faîtière pour cette ligne de travail, avec trois tendances
séquentielles : la programmation logique, les ontologies, et maintenant
l'apprentissage automatique et en particulier le traitement du langage naturel.
Bien que ces tendances aient mis au jour des résultats importants pour la
formalisation du droit, de grandes questions de recherche demeurent. Comment
modéliser des dispositions juridiques complexes couvrant de vastes corpus ? La
formalisation du droit peut-elle être automatisée ? La rédaction juridique
peut-elle être augmentée technologiquement ? Comment détecter les incohérences
ou les failles par analyse statique ou dynamique ?

Avec de fortes racines dans la communauté de recherche, son engagement envers
l'open source, sa sémantique formalisée et son compilateur extensible, Catala en
tant que langage de programmation est une opportunité pour l'apprentissage des
étudiants et les projets de recherche. Alors que les enseignants et les
étudiants peuvent utiliser Catala pour explorer de manière pratique le droit
fiscal et social, les chercheurs peuvent utiliser les programmes Catala comme
jeux de données ou programmer une nouvelle analyse qui peut être facilement
déployée auprès des utilisateurs de Catala.

Si vous êtes étudiant, professeur, ou qui que ce soit d'autre d'ailleurs, vous
êtes invité à utiliser Catala gratuitement et à y contribuer en signalant des
problèmes, en proposant des "pull requests", ou en développant des plugins et
des outils autour du langage.

## À qui s'adresse ce livre

Ce livre s'adresse principalement aux programmeurs qui souhaitent apprendre
Catala, mettre en place un projet l'utilisant pour traduire un texte juridique
en code exécutable, et être guidés tout au long du processus. Le livre suppose
une connaissance de base des idiomes de la programmation fonctionnelle et, plus
généralement, une expérience en génie logiciel avec un autre langage de
programmation grand public.

Si vous, programmeur, travaillez dans une équipe pluridisciplinaire avec un ou
plusieurs juristes, c'est à vous de leur expliquer ce qu'est Catala et comment
travailler avec. Ce guide couvrira donc également divers sujets autour de la
collaboration entre juristes et programmeurs.

Si vous êtes juriste et tombez sur ce livre, vous êtes également invité à le
lire, bien que certaines parties ne soient pas pertinentes pour vous. Vous
pourriez consulter à la place des articles introductifs qui posent le contexte
autour du code informatique, de la traduction du droit en code informatique et
présentent les spécificités de Catala :

~~~admonish example title="Publications sur Catala et le codage du droit accessibles aux juristes" collapsible=true
* James Grimmelmann. 2023. "[The Structure and Legal Interpretation of
 Computer Programs](https://journalcrcl.org/crcl/article/view/19/13)". *Journal
 of Cross-Disciplinary Research in Computational Law* 1 (3).
* Liane Huttner, Denis Merigoux. 2022. "[Catala: Moving Towards the Future of
Legal Expert Systems](https://inria.hal.science/hal-02936606v3/document)".
*Artificial Intelligence and Law*.
* Sarah B. Lawsky. 2022. "[Coding the Code: Catala and Computationally
  Accessible Tax
  Law](https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID4291177_code337501.pdf?abstractid=4291177&mirid=1)". 75 *SMU
  Law Review* 535.
~~~

## Comment utiliser ce livre

Le livre est organisé en deux parties : le guide utilisateur et le guide de
référence. Alors que le guide utilisateur est destiné à être lu de manière
linéaire et vise les nouveaux utilisateurs, le guide de référence est le point
de chute pour vérifier des éléments concernant le langage et l'outillage Catala
au fur et à mesure de votre utilisation, que vous soyez un utilisateur débutant
ou expérimenté.

Le guide utilisateur commence par le [Chapitre 1](./1-0-getting_started.md) et
l'équivalent Catala du programme "*Hello, world!*". Le [Chapitre
2](./2-0-tutorial.md) explique les concepts fondamentaux de Catala avec un
tutoriel pratique centré sur l'automatisation d'un système fiscal fictif de
base. Passant aux choses sérieuses, le [Chapitre 3](./3-project.md) plonge dans
la mise en place d'un projet Catala réel avec contrôle de version, suivi des
évolutions juridiques, tests, intégration continue, déploiement automatisé, etc.
Enfin, le [Chapitre 4](./4-0-howto.md) accélère votre apprentissage en répondant
à (presque) toutes les questions sur lesquelles vous tomberez normalement en
codant la loi avec Catala.

Dans le guide de référence, le [Chapitre 5](./5-catala.md) détaille toutes les
fonctionnalités disponibles dans le langage Catala, tandis que le [Chapitre
6](./6-clerk.md) se concentre sur les interfaces en ligne de commande et les
fonctionnalités de l'outil avec lequel vous travaillerez : `clerk`.

~~~admonish note title="Code source"
Les fichiers sources à partir desquels ce livre est généré se trouvent sur
[GitHub](https://github.com/CatalaLang/catala-book). Bien que le contenu de ce
livre soit censé correspondre à la dernière version de Catala, certaines
incohérences peuvent apparaître. Si vous en repérez une, ou si vous avez des
commentaires ou des suggestions sur le livre, n'hésitez pas à [ouvrir un
ticket](https://github.com/CatalaLang/catala-book/issues) !
~~~
