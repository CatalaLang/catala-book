# Développement agile avec juristes et programmeurs

<div id="tocw"></div>

À ce stade du guide, vous devriez avoir configuré l'environnement technique du projet
et être prêt à commencer à développer en Catala. Mais même si ce n'est pas
le cas, et avant de commencer à traduire votre premier texte juridique en code, vous
devriez également mettre en place une organisation et une méthodologie appropriées pour vous assurer que vos
efforts de traduction sont aussi productifs que possible, et conduisent au code avec le
moins de bugs possible du premier coup. Cette section fournit des conseils et
des justifications pour certaines des décisions de projet les plus importantes que vous aurez
à prendre. De plus, elle donne des indications pratiques sur la façon d'
adapter la [méthodologie agile](https://agilemanifesto.org/) de programmation à la
tâche de traduire la loi en code, ce qui nécessite une culture de sécurité avant tout et
un environnement organisationnel.

## Pourquoi vous devriez éviter d'écrire des documents de spécification intermédiaires

Un trope courant des grandes organisations chargées d'automatiser la prise de décision
basée sur des spécifications juridiques est de produire divers documents textuels servant de
"spécifications" qui se situent entre les textes juridiques sources et le code exécutable
automatisant les décisions.

~~~admonish danger title="Un processus typique en V pour traduire la loi en code (non recommandé)"
Imaginez que vous êtes dans une agence gouvernementale chargée de distribuer une prestation.
La base légale de la prestation est écrite dans une loi ; cette loi est interprétée
par le ministère qui sort un décret (ou arrêté), décrivant plus en détail
les règles de calcul de la prestation. Au sein de votre agence, le
département juridique prend généralement la loi et le décret, et rédige des instructions
officielles résumant comment l'agence interprète la loi et le décret.
Ensuite, ces instructions sont envoyées au département des opérations qui rédige
un ensemble de spécifications détaillant toutes les règles de calcul de la prestation
pour automatiser le calcul. Enfin, le département informatique prend les
spécifications et écrit le code exécutable, ou délègue la programmation
à un prestataire. En tout, voici les
différents documents coexistant dans le processus :
1. la loi (promulguée par le Parlement) ;
2. le décret (promulgué par le ministère) ;
3. les instructions (rédigées par le département juridique de l'agence) ;
4. les spécifications (rédigées par le département opérationnel de l'agence) ;
5. le code exécutable (écrit par le département informatique de l'agence).
~~~

Maintenant, chaque document s'appuie sur le précédent en allant plus en détail et
en prenant de plus en plus de micro-décisions sur la façon dont la prestation doit être calculée.
Ces micro-décisions sont cruciales et elles doivent être prises à chaque niveau avec
le bon niveau de responsabilité quant aux effets de ces décisions sur les
futurs bénéficiaires de la prestation.

Mais chaque étape de production d'un nouveau document à partir du précédent, et son envoi
à une nouvelle équipe de personnes, augmente le risque d'erreurs et de
malentendus, dans un véritable jeu de téléphone arabe administratif.
Généralement, ces erreurs et malentendus sont constamment résolus par
de longs appels téléphoniques entre les différentes équipes de votre agence au sujet des
documents qu'ils viennent d'envoyer. Ces appels téléphoniques conduisent à beaucoup de
prises de décision qui ne laissent souvent aucune trace écrite. Accumulée au fil du temps, cette
méthodologie de travail conduit à des spécifications dont les règles ne peuvent pas être retracées à une
base légale dans la loi et le décret, et qui risquent de diverger ou même de contredire
les instructions du département juridique de votre propre agence. Cela nuit à l'efficacité interne
et rend impossible la satisfaction du cadre juridique pour la prise de décision automatisée
qui impose des normes de transparence strictes.

Plus globalement, la complexité des processus requis pour traduire les exigences
légales en code exécutable pour la prise de décision automatisée est la cible du
mouvement "Rules as Code" [promu par l'
OCDE](https://oecd-opsi.org/publications/cracking-the-code/). Le but ultime
de "Rules as Code" est de réduire toutes les étapes du processus décrit ci-dessus et
de publier directement la loi et les décrets sous forme de code exécutable. Bien que l'on puisse penser
que Catala permet directement cet objectif ultime, l'équipe Catala ne pense pas que
ce soit souhaitable, étant donné les impacts considérables que cela aurait sur l'[État de
Droit](https://publications.cohubicol.com/research-studies/computational-law/).

Au lieu de cela, l'équipe Catala recommande d'utiliser Catala pour fusionner les deux dernières étapes
du processus et fusionner dans le fichier de code source Catala à la fois le code exécutable,
et tous les textes qui fournissent la base légale pour votre agence. Le reste
de cette page expliquera plus concrètement comment y parvenir.


~~~admonish info title="Lectures complémentaires" collapsible=true
La description ci-dessus est un résumé d'une ligne de recherche socio-technique
menée par l'équipe Catala. Vous pouvez trouver des comptes rendus détaillés avec analyse juridique
et études de terrain corroborant les résultats dans les publications suivantes :

* Liane Huttner, Denis Merigoux. *Catala: Moving Towards the Future of Legal Expert Systems*. Artificial Intelligence and Law, 2022, ⟨10.1007/s10506-022-09328-5⟩. [⟨hal-02936606⟩](https://inria.hal.science/hal-02936606/).
* Denis Merigoux, Marie Alauzen, Lilya Slimani. *Rules, Computation and Politics. Scrutinizing Unnoticed Programming Choices in French Housing Benefits*. Journal of Cross-disciplinary Research in Computational Law, 2023, 2 (1), pp.23. [⟨hal-03712130v3⟩](https://inria.hal.science/hal-03712130)
* Denis Merigoux, Marie Alauzen, Justine Banuls, Louis Gesbert, Émile Rolley. *De la transparence à l’explicabilité automatisée des algorithmes : comprendre les obstacles informatiques, juridiques et organisationnels*. RR-9535, INRIA Paris. 2024, pp.68. [⟨hal-04391612⟩](https://inria.hal.science/hal-04391612)
~~~

## Pourquoi vous devriez choisir les textes juridiques pour la programmation littéraire en Catala

Comme expliqué ci-dessus, généralement les programmeurs ne se réfèrent qu'aux spécifications
lorsqu'ils écrivent leur code, et non aux textes juridiques dont les
spécifications ont été dérivées. Par conséquent, il serait logique à première
vue d'utiliser simplement les spécifications comme point de départ de la programmation littéraire.
Bien que ce soit techniquement possible, l'équipe Catala ne le recommanderait pas
car cela empêche l'effort de réécriture vers Catala de reconstruire la
*chaîne de justifications des micro-choix du texte juridique au
code exécutable*.

En effet, tout l'intérêt de la [programmation
littéraire](https://fr.wikipedia.org/wiki/Programmation_lettr%C3%A9e) est de fusionner dans
un *seul document* à la fois le code et l'explication de pourquoi le code fonctionne
de cette façon. Appliqué à Catala, la programmation littéraire signifie que l'explication
de pourquoi le code fonctionne de cette façon doit contenir la base légale de son comportement,
donc les textes juridiques.

De plus, utiliser les textes juridiques dans la programmation littéraire au lieu des
spécifications accélère considérablement la maintenance du code. En effet, chaque fois qu'il
y a une mise à jour dans les textes juridiques, il suffit de propager la mise à jour à la copie
du texte juridique dans le fichier Catala (un processus qui peut être automatisatisé), et ensuite
de mettre à jour (manuellement) les extraits de code qui se trouvent juste en dessous des textes juridiques mis à jour.
La connaissance de quel morceau de code correspond à quelle partie du
texte juridique est *explicite*, ce qui le rend plus robuste au changement de personnel ou à la perte de
mémoire institutionnelle. Comparez cela avec le processus traditionnel de mise à jour de la
spécification, puis de mise à jour du code : le rédacteur de la spécification et le rédacteur du code
(généralement deux personnes différentes) doivent se rappeler quelle partie du
document qu'ils écrivent correspond aux parties mises à jour du document qu'ils
reçoivent.

**Globalement, utiliser les textes juridiques pour la programmation littéraire Catala assure la
cohérence de la documentation pour les choix interprétatifs, ainsi que la
robustesse et l'efficacité des futures mises à jour du code.**

~~~~~~admonish success title="Documenter les micro-choix internes dans le code"
Une fois que vous avez choisi de commencer avec les textes juridiques comme base pour votre
programmation littéraire en Catala, un problème survient rapidement : où mettre toutes les informations
qui documentent la désambiguïsation des textes juridiques dans le code exécutable ?

Ces informations sont généralement en partie stockées dans les instructions officielles publiées
par votre agence, ou dispersées dans des mémos internes et des e-mails envoyés le long des
chaînes hiérarchiques. Ces instructions, mémos et e-mails paraphrasent souvent les
textes juridiques, tout en ajoutant un petit bout d'information supplémentaire qui contient la désambiguïsation
que vous recherchez.

Une solution pourrait être de copier-coller le texte des instructions, mémos et
e-mails et de les mettre à côté du texte juridique dans le fichier source Catala. Mais faire cela
encombrera rapidement votre base de code et vous forcera à un choix maladroit : où mettre
les extraits de code Catala ? Sous le morceau de texte juridique ou sous le morceau
de mémos qui paraphrase le texte juridique ? Il n'y a pas de bonne réponse à cela ;
de plus, copier-coller les instructions et mémos systématiquement dans votre
base de code revient à faire de la programmation littéraire avec les spécifications
au lieu des textes juridiques, ce qui, nous l'avons montré, n'est pas souhaitable.

Au lieu de cela, l'équipe Catala vous conseille de **ne pas** copier-coller le texte des instructions,
mémos et e-mails à l'intérieur de votre base de code de programmation littéraire aux côtés des
textes juridiques, mais plutôt de les **référencer** à l'intérieur des commentaires de code. En effet, les commentaires de code
sont précisément là pour documenter les choix dans le code, ce qui en fait l'endroit parfait
pour insérer des justifications pour la désambiguïsation des textes juridiques référençant
des instructions, mémos ou e-mails. Par exemple, voici à quoi pourrait ressembler un fichier de code source Catala
typique pour un exemple juridique fictif impliquant
un calcul de déduction de revenu :

---

#### Article 364

La déduction de revenu mentionnée à l'article 234 est plafonnée à 10 000 €.

```catala-code-fr
champ d'application RevenuBrutVersNetIndividuel:
  # Une lecture littérale de l'article 364 impliquerait de mettre 10 000 € ici. Mais
  # en fait, l'instruction de l'agence N°1045-58 publiée le 28/04/2023 précise
  # que le plafond est estimé au niveau du foyer et non au niveau individuel.
  # Pour concilier avec la vue individuelle de l'article 364, le plafond ici devrait
  # être un prorata du plafond du foyer par rapport au revenu de chaque
  # individu. Nous supposons que ce prorata est fourni comme variable d'entrée
  # "plafond_deduction_prorata" du champ d'application "RevenuBrutVersNetIndividuel".
  définition deduction_revenu état plafonnement égal à
    plafond_deduction_prorata

# Maintenant nous devons calculer "plafond_deduction_prorata" du champ d'application
# "RevenuBrutVersNetIndividuel", au niveau du foyer. Mais en fait, un mémo interne
# envoyé par le département juridique au département informatique le 05/09/2023 précise
# en outre que le plafond au niveau du foyer ne devrait être proratisé que si la somme
# des revenus des individus dans le foyer est supérieure au plafond.
# Sinon, chaque individu devrait voir comme son plafond individuel le plafond de
# tout le foyer. C'est équivalent car si la somme des revenus est inférieure au
# plafond, alors l'opération de plafonnement n'aura aucun effet.
champ d'application RevenuBrutVersNetFoyer:
  # ...
```

---

Comme vous pouvez le voir, en plus du texte juridique, la quantité de commentaires à l'intérieur du
code Catala peut être conséquente. Plus le texte juridique est concis et ambigu,
plus de commentaires de code et de références à la documentation de l'agence seront nécessaires
pour expliquer comment il a été désambiguïsé ! Ces commentaires de code doivent être très soigneusement
rédigés avec contexte, informations spécifiques et références afin qu'ils soient
suffisants pour qu'un nouveau venu sur le projet reconstruise l'argument expliquant
pourquoi le code ressemble à ce qu'il est. Écrire de bons commentaires prend du temps au début
mais garder une telle pratique cohérente vous évitera des maux de tête à l'avenir
et assurera la maintenabilité à long terme de la base de code.
~~~~~~

## Recruter une équipe mêlant programmation et connaissances du domaine

~~~admonish info title="Écrire du code Catala implique en fait principalement de découvrir ce que signifie la loi"
Au cours de ses expériences et efforts de recherche, l'équipe Catala a remarqué
que la grande majorité du temps (70% à 90%) passé sur les projets pour
traduire la loi en code Catala était passé non pas à écrire du code, mais à **comprendre
ce que la loi signifiait et comment l'interpréter correctement par rapport
aux directives de l'agence**.

Cela signifie que le goulot d'étranglement pour la progression du projet n'est pas
la vitesse de codage mais plutôt la vitesse à laquelle l'équipe est collectivement capable de découvrir ce que
la loi signifie et comment l'interpréter. Et les ingénieurs logiciels n'ont pas
le meilleur ensemble de compétences pour cette tâche.

Si vous voulez en savoir plus sur l'interaction juriste-programmeur dans la production
de logiciels automatisant la loi, veuillez vous référer à :
* Nel Escher, Jeffrey Bilik, Nikola Banovic, and Ben Green. 2024. *Code-ifying the Law: How Disciplinary Divides Afflict the Development of Legal Software*. Proc. ACM Hum.-Comput. Interact. 8, CSCW2, Article 398 (November 2024), 37 pages. [https://doi.org/10.1145/3686937](https://dl.acm.org/doi/10.1145/3686937)
~~~

Pour cette raison, l'équipe Catala conseille d'avoir un **mélange équilibré**
entre des personnes qui peuvent écrire du bon code (généralement des ingénieurs logiciels) et des personnes
qui peuvent comprendre ce que la loi signifie et l'interpréter (généralement des juristes mais pas
toujours, comme nous le verrons) au sein de votre équipe pluridisciplinaire. Ce mélange égal
implique que vous pouvez organiser l'équipe en paires de personnes : un juriste et un
programmeur. Vous pouvez augmenter l'effort de développement en augmentant le nombre de
paires dans votre équipe qui peuvent être affectées à des parties indépendantes du calcul.

Nous verrons ci-dessous comment les programmeurs et les juristes passent leur temps au cours d'une
semaine typique. Mais d'abord, parlons de quel type de "juristes" nous parlons
dans nos équipes pluridisciplinaires. Le mot "juristes" fait généralement référence aux
avocats, c'est-à-dire aux personnes défendant des individus et des entreprises devant les tribunaux lors d'un
procès. Mais les agences administratives emploient très peu de ce type de juristes,
et ces personnes ne sont dévouées qu'à la gestion des procès dans lesquels l'agence
est impliquée. Au lieu de cela, les agences administratives emploient généralement un bon nombre de
personnes formellement formées en Droit à l'université dans leur département juridique
central, chargées d'identifier et de surveiller tous les textes juridiques auxquels l'
agence doit se conformer. Ces "juristes" rédigent ensuite généralement les instructions
officielles de l'agence qui paraphrasent le texte juridique, tout en prenant en compte les décisions de justice passées
et la doctrine officielle de l'agence. Cela
correspond à l'étape 3. du processus en V décrit plus haut dans cette page.

Ensuite, l'étape 4. du processus implique encore d'autres interprétations de la loi.
Mais cette fois, c'est souvent fait par des personnes qui n'ont pas de formation universitaire
formelle en droit, et qui ne s'appellent pas "juristes". Cependant, ces personnes
ont une connaissance étendue et spécialisée du contenu juridique en question, basée
sur des décennies d'expérience antérieure dans leurs postes, ou en tant que travailleurs sociaux de terrain
au sein de l'agence. Parfois, ces personnes n'ont jamais vu les textes juridiques pour
la prestation ou l'impôt dans lequel elles sont spécialisées, elles n'ont jamais lu que les
instructions officielles de l'agence rédigées par le département juridique interne.
L'équipe Catala appelle ces personnes les "experts du domaine", et ils sont aussi cruciaux
que les "juristes" pour s'assurer que la chaîne entre la base légale et le
code exécutable est pleinement justifiée dans un fichier de code source Catala.

Par conséquent, l'équipe Catala recommande d'inclure un mélange d'"experts du domaine"
et de "juristes" de type département juridique au sein de votre équipe aux côtés des ingénieurs logiciels.
C'est la combinaison du point de vue de la théorie juridique avec l'expérience de la pratique
de cette loi dans l'agence qui est la clé pour atteindre
la cohérence du logiciel écrit en Catala avec à la fois les systèmes existants
qu'il est censé remplacer et la doctrine juridique officielle de l'agence à laquelle il est censé
se conformer.

~~~admonish question title="Les experts juridiques/du domaine sont indisponibles, comment faire ?"
Parce que la rotation du personnel est élevée dans les organisations, en particulier aux postes exigeants,
il est souvent difficile de trouver des experts avec une expérience suffisante
de la loi en question au sein de l'agence, et le plus souvent ces personnes
sont déjà surchargées par la maintenance des projets informatiques actuels de
l'agence sans temps à investir dans un effort de modernisation Catala.

Par conséquent, il sera difficile de doter votre équipe d'une liste de stars d'
experts juridiques/du domaine. L'équipe Catala conseille de voir cela comme une opportunité
de recruter et de former de nouveaux experts juridiques/du domaine qui développeront une nouvelle expertise
au fur et à mesure que le projet utilisant Catala avancera. En effet, l'équipe Catala a empiriquement
constaté lors des premières expériences utilisant des juristes fraîchement diplômés que la tâche
de produire une implémentation Catala d'un morceau de loi est un moyen très efficace
pour les juristes de se spécialiser rapidement et de maîtriser ce morceau de loi.

Cependant, ce processus de formation n'est efficace que si le juriste en formation
a accès (une heure chaque semaine ou deux semaines par exemple) à un expert du domaine vraiment expérimenté
qui peut vider de sa mémoire toutes les questions restantes que le
juriste en formation n'a pas pu résoudre par lui-même.
~~~


## Emploi du temps hebdomadaire : sessions de programmation en binôme et devoirs

Une fois que vous avez assemblé votre équipe selon les principes énoncés ci-dessus,
vous devrez définir des tâches pour chacune de vos paires juriste-programmeur. Pour
chaque morceau de travail (que ce soit l'implémentation d'une certaine section d'un statut ou
d'un certain champ d'application prédéterminé comme important dans le calcul), le travail
doit suivre une boucle itérative composée des étapes suivantes :

1. Identifier les sources juridiques et les instructions et mémos de l'agence justifiant le
  morceau de calcul ;
2. Les copier-coller dans un fichier de code source Catala et échafauder la structure de données
  et les déclarations de champ d'application ;
3. Travailler linéairement à travers les sources juridiques, en s'assurant de mettre le
  code Catala aussi près que possible de la source juridique qui le justifie ;
4. Pendant le travail d'implémentation, des tâches de refactorisation de code et des questions de recherche juridique
  surviendront inévitablement ;
5. Les traiter en itérant vers les étapes précédentes de cette boucle ;
6. Vous avez terminé quand plus aucune nouvelle tâche de refactorisation ou question de recherche juridique ne survient !

En suivant les boucles précédentes, le programmeur et le juriste de la
paire seront occupés à temps plein pendant une semaine typique. L'organisation de la
semaine pour les deux devrait être centrée autour d'une session hebdomadaire de programmation en binôme
de 2 à 3 heures, avec le schéma suivant :
* avant la session de programmation en binôme, le juriste doit envoyer au
  programmeur les listes de textes juridiques à prendre en compte pour le morceau de travail
  actuel ;
* sur cette base, le programmeur doit écrire un échafaudage initial de structure de données
  et de déclarations de champ d'application à utiliser pendant la session de programmation en binôme ;
* le juriste doit également rechercher préventivement les décisions de justice pertinentes et les documents de doctrine
  de l'agence avant la session de programmation en binôme ;
* un ordre du jour est communément fixé par le juriste et le programmeur pour la session de programmation en binôme
  à venir, priorisant les tâches à accomplir ;
* pendant la session de programmation en binôme, le juriste et le programmeur doivent discuter
  du texte de loi et essayer d'esquisser ou d'implémenter entièrement des extraits de code Catala
  (généralement des [définitions de variables de champ d'application](./5-4-definitions-exceptions.md#definitions-and-exceptions)) ;
* ils doivent également noter dûment toute tâche de refactorisation ou question de recherche juridique
  qui survient pendant la session comme tâches à faire ;
* ces tâches à faire doivent occuper à la fois le juriste et le programmeur après
  la session de programmation en binôme et avant la suivante ;
* de plus, le juriste doit préparer de manière asynchrone des cas de test que le
  programmeur (ou le juriste) peut implémenter et ajouter à la base de tests pour
  l'intégration continue ;
* une fois terminé, le morceau de travail est matérialisé sous forme de proposition de fusion (merge request)
  complète avec implémentation et tests, à examiner à la fois juridiquement et
  informatiquement par une autre paire juriste-programmeur.

Si tout cela ne remplit pas la semaine de travail, le programmeur peut travailler en plus
sur des tâches de programmation liées au déploiement du projet tandis que le juriste peut
travailler à la rédaction de mémos internes documentant l'avancement du projet et
comment les décisions qu'ils ont prises en programmant sont conformes à la doctrine de l'
agence.

## Suivi des progrès et planification du travail

Globalement, vous savez que vous réimplémenterez un certain calcul d'impôt ou de prestation,
mais comment diviser le travail en tâches et les distribuer aux
paires ?

~~~admonish note title="Dois-je suivre l'ordre de la loi ou celui du calcul ?"
Il existe deux stratégies pour diviser le travail d'implémentation en morceaux.

La première qui correspondrait le plus à la méthodologie de programmation littéraire
est de rassembler d'abord tous les textes juridiques et références aux instructions et
mémos internes, de tous les disposer dans des fichiers texte Catala structurés par source
juridique, puis de procéder à l'implémentation de chaque morceau de loi dans l'ordre dans lequel
il est écrit dans la source juridique. L'équipe Catala a déjà essayé cette
stratégie. Son principal avantage est qu'elle conduit à être très exhaustif par
rapport au code, et suivre le chemin du texte juridique aide à le comprendre
plus rapidement (s'il est bien écrit !). Cependant, cette stratégie ne garantit pas
que des parties du calcul seront prêtes de manière incrémentale à tester et déployer
de manière continue pendant le projet, et elle conduit à beaucoup de refactorisation
pour prendre en compte les nouvelles dispositions légales au fur et à mesure qu'elles apparaissent dans le texte.

Globalement, l'équipe Catala ne recommanderait cette première stratégie que si la prestation
ou l'impôt en question *n'a jamais été automatisé auparavant dans l'agence* et/ou si le niveau interne
d'expertise à ce sujet est faible. Dans tous les autres cas, l'équipe Catala recommande
de suivre la deuxième stratégie.

La deuxième stratégie est de diviser le calcul de l'impôt ou de la prestation sociale
en utilisant un plan de division déjà connu qui correspond à la division fonctionnelle
du contenu informatique. Par exemple, vous savez déjà que la prestation est
divisée entre l'éligibilité et le calcul du montant, que le calcul de l'éligibilité
est divisé entre les conditions de revenu et d'autres conditions, etc.
À partir de ce plan de division connu, vous pouvez déjà écrire dans votre fichier Catala "prologue"
les déclarations initiales pour les structures de données, les champs d'application et les modules de votre
future implémentation. Ensuite, vous pouvez implémenter de manière incrémentale chaque module ou
champ d'application en extrayant toutes les sources juridiques dont vous avez besoin pour justifier le
calcul actuel, et en les copiant-collant dans le fichier source Catala à la demande.
À la fin, les fichiers sources devraient toujours être organisés grossièrement par source juridique
comme dans la première méthode, mais les chemins pour remplir les fichiers seront complètement
différents.
~~~

Pour la gestion de projet au jour le jour, l'équipe Catala vous conseille de faire plein usage
des plateformes de génie logiciel comme Github, Gitlab ou Jira. Non seulement
les tâches de codage peuvent être modélisées et suivies comme des tickets et des pull requests sur ces
plateformes, mais les tâches juridiques peuvent également être modélisées et suivies comme des tickets.
En particulier, l'équipe Catala a noté qu'il est très utile de mettre toutes
les tâches à faire collectées à la fin d'une session de programmation en binôme sous
la forme de tickets dans la plateforme. Ensuite, l'avancement du projet peut être suivi avec
des tableaux de tickets, des listes et une estimation du temps comme un projet logiciel standard.

Vous pouvez également utiliser des étiquettes de tickets pour marquer les questions juridiques qui ont été recherchées
ou validées par le département juridique de l'agence. Étiqueter les tickets facilite
la planification de l'ordre du jour de la prochaine session de programmation en binôme et le tri entre
les tâches qui nécessitent encore des recherches ou une validation supplémentaires, et celles qui peuvent
être implémentées en code Catala tout de suite.
