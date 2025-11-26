# Questions générales

~~~admonish info
Certaines parties de ces réponses sont adaptées, avec permission, de Lawsky, [Coding
the Code: Catala and Computationally Accessible Tax
Law](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4291177), 75 SMU L.
Rev. 535 (2022).
~~~

<div id="tocw"></div>

## Qu'est-ce que la programmation en binôme pour coder la loi ?

Comme l'explique [l'introduction de ce livre](./0-intro.md), Catala est conçu pour
être utilisé par des équipes possédant à la fois une expertise juridique et
informatique. La programmation en binôme fait généralement référence à deux
programmeurs travaillant ensemble côte à côte sur le même ordinateur pour écrire
du code informatique. La programmation en binôme pour coder la loi n'implique pas
deux programmeurs ayant des compétences similaires, mais plutôt un programmeur et
un juriste, des personnes ayant des domaines d'expertise différents, travaillant
côte à côte pour écrire un code informatique qui capture aussi précisément que
possible le sens de la loi. La programmation en binôme avec un juriste et un
programmeur permet d'encoder la loi sans qu'une seule personne ait besoin d'être
experte à la fois en droit fiscal et en codage. La programmation en binôme
améliore également la qualité du code car elle exige que le juriste explique la
loi très clairement, si clairement qu'un programmeur puisse la comprendre, et
elle exige que le programmeur soit capable d'articuler exactement comment le code
informatique correspond à la loi, améliorant ainsi la précision et l'attention
aux détails tant pour la loi que pour le code.

## Qu'est-ce que la programmation littéraire pour coder la loi ?

La programmation littéraire est l'idée, avancée pour la première fois par Donald
Knuth, qu'un programme informatique ne communique pas seulement à un ordinateur
ce qu'il doit faire, mais communique aussi aux humains lisant le programme ce que
le programme veut que l'ordinateur fasse. Concrètement, les programmes qui
suivent l'approche de la programmation littéraire incluent beaucoup de
commentaires. La programmation littéraire est particulièrement importante pour
coder la loi, car elle augmente la transparence et montre clairement comment le
code correspond (ou ne correspond pas) à la loi. Comme expliqué dans [la première
section du tutoriel](./2-1-basic-blocks.md), la programmation littéraire pour la
loi en Catala signifie que le code Catala inclut non seulement le code qui dit à
l'ordinateur quoi faire, mais aussi le langage législatif ou réglementaire réel
qui se rapporte au code pour l'ordinateur. Cela facilite la mise à jour du code
informatique lorsque la loi change. Les commentaires incluent également le
raisonnement derrière les décisions de l'équipe de codage, y compris le support
statutaire extra-légal pour les décisions. Et les commentaires peuvent également
expliciter les ambiguïtés trouvées par l'équipe de codage, et comment et pourquoi
l'équipe a choisi de résoudre ces ambiguïtés.

## Pourquoi ne devrais-je pas utiliser n'importe quel langage de programmation que j'aime pour coder la loi ?

La question de savoir quel langage de programmation utiliser pour coder la loi
est, bien sûr, une question pragmatique. Le fait que Catala puisse être compilé
vers d'autres langages, tels que Python, démontre que l'on pourrait coder la loi
et capturer avec précision son sens, dans une certaine mesure, dans de nombreux
langages différents. Mais Catala présente plusieurs avantages pour coder la loi,
en particulier la loi qui est organisée comme des règles générales suivies
d'exceptions, comme le sont de nombreuses lois.

Premièrement, un programme en Catala imite la structure de la pensée juridique en
listant d'abord les parties, structures et variables pertinentes. Les éléments
sont nommés avant d'être utilisés, ce qui permet aux humains regardant le code
informatique d'identifier les concepts pertinents avant de les appliquer.
Deuxièmement, Catala permet au programmeur de définir facilement un champ
d'application sur lequel diverses règles et définitions s'appliquent, en accord
avec l'approche de la loi d'avoir des dispositions qui s'appliquent uniquement à
"ce chapitre", "cette section", et ainsi de suite.

De plus, et c'est le plus important, comme décrit dans [la deuxième section du
tutoriel](./2-2-conditionals-exceptions.md), la sémantique de Catala est basée
sur une logique de règles générales et d'exceptions ("logique par défaut
priorisée"). La structure des programmes Catala peut donc suivre de près la
structure de la loi elle-même, si la loi est organisée comme des règles générales
suivies d'exceptions. Cela rend plus facile le codage de la loi ; parce que la
logique sous-jacente suit le statut, la traduction en logique par défaut peut
simplement suivre le statut lui-même. Et si le statut change, il sera plus facile
de changer le code Catala qu'il ne le serait de changer un code qui ne suivrait
pas la structure du statut. Parce que Catala permet des exceptions qui l'emportent
sur des règles plus générales, la formalisation en Catala permet aux sections et
sous-sections distinctes de la loi de rester séparées. La rédaction est plus
modulaire et permet aux codeurs d'échanger plus facilement la nouvelle loi et
l'ancienne loi.

Enfin, les programmes Catala peuvent être formellement vérifiés car Catala a une
[sémantique formelle](https://dl.acm.org/doi/10.1145/3473582) bien définie.

## Peut-on utiliser de grands modèles de langage (LLM) pour traduire la loi en code ?

Savoir si les grands modèles de langage (LLM) peuvent être utilisés pour traduire
la loi en code est une question de recherche ouverte que diverses personnes ont
poursuivie, sans grand succès à ce stade. Le langage juridique est complexe et ne
ressemble pas au langage "ordinaire". Même au-delà de cela, coder la loi est plus
que simplement "traduire" directement le langage statutaire en code informatique.
La loi englobe plus que le simple langage d'un statut. Coder la loi peut, par
exemple, nécessiter de résoudre des ambiguïtés présentes dans le texte
statutaire, ou d'incorporer des règlements ou des pratiques en dehors du statut.
Traduire la loi en code nécessite également précision, exactitude et
responsabilité, qui sont toutes, au moment de cette rédaction, en tension avec
l'utilisation des LLM.

## Toute loi peut-elle être formalisée ?

Dans un certain sens pas particulièrement intéressant, toute loi peut être
formalisée. Mais au moins lorsqu'il s'agit de formaliser la loi avec Catala,
toute loi n'est pas *utilement* formalisée. Les lois où l'effort de formalisation
porte ses fruits concrètement ont tendance à être des lois lourdes en règles,
complexes, impliquant peut-être de nombreux calculs numériques, et, pour vraiment
profiter de tout ce que Catala a à offrir, structurées comme des règles générales
suivies d'exceptions.

Formaliser la loi a également un impact sur la façon dont elle est appliquée, et
sur l'État de droit en général. Voir les travaux du groupe de recherche
[COHUBICOL](https://www.cohubicol.com/) pour plus de détails.
