# Construction et déploiement du projet

<div id="tocw"></div>

Dans la section précédente, nous avons défini un répertoire contenant un projet Catala avec
un fichier de configuration `clerk.toml` qui contenait deux cibles principales (`code-impots-us`
et `aides-logement`) que nous visons à construire et exporter en tant que bibliothèques sources
dans différents langages.

~~~~~~admonish info collapsible=true title="Récapitulatif de la section précédente : fichier de configuration `clerk.toml` et hiérarchie du projet"
Voici le fichier de configuration `clerk.toml` de notre projet fictif :
```toml
[project]
include_dirs = [ "src/commun",              # Quels répertoires inclure
                 "src/code_impots",         # lors de la recherche de modules Catala
                 "src/aides_logement" ]     # et de dépendances.
build_dir    = "_build"    # Définit où sortir les fichiers compilés générés.
target_dir   = "_target"   # Définit où sortir les fichiers finaux des cibles.

# Chaque section [[target]] décrit une cible de construction pour le projet

[[target]]
name     = "code-impots-us"                       # Le nom de la cible
modules  = [ "Article_121", "Article_132", ... ]  # Composants modules
tests    = [ "tests/test_impot_revenu.catala_fr" ] # Test(s) associé(s)
backends = [ "c", "java" ]                        # Backends de langage de sortie

[[target]]
name     = "aides-logement"
modules  = [ "Article_8", ... ]
tests    = [ "tests/test_aides_logement.catala_fr" ]
backends = [ "ocaml", "c", "java" ]
```
Hiérarchie des fichiers du projet :
```
mon-projet/
│   clerk.toml
├───src/
│   ├───code_impots/
│   │   │   article_121.catala_fr
│   │   │   article_132.catala_fr
│   │   │   ...
│   │
│   ├───aides_logement/
│   │   │   article_8.catala_fr
│   │   │   ...
│   │
│   └───commun/
│       │   prorata.catala_fr
│       │   foyer.catala_fr
│       │   ...
│
└───tests/
    │   test_impot_revenu.catala_fr
    │   test_aides_logement.catala_fr
```
~~~~~~


## Construire le projet

Maintenant que vous avez tout configuré, vous pouvez construire le projet, ce qui signifie
compiler les fichiers de code source Catala dans les différents langages de programmation cibles.
C'est le travail de la commande `clerk build` :

~~~admonish question title="Où exécuter `clerk` ?"
`clerk` peut être exécuté de n'importe où dans la hiérarchie de votre projet, mais les
fichiers générés seront toujours placés dans les répertoires de construction et de cible à la
racine du projet.

Vous ne devez pas faire référence à des répertoires frères (`../bar`) pointant en dehors du
projet : cela causerait des échecs de résolution de chemin dans l'outillage Catala.
~~~

```console
$ clerk build
┌─[RESULT]─
│ Build successful. The targets can be found in the following files:
│     [code-impots-us] → _targets/code-impots-us
│     [aides-logement] → _targets/aides-logement
└─
```

La sortie de la commande vous montre où trouver les résultats. Chaque section `[[target]]`
produit un sous-répertoire dans le répertoire `_targets/`, avec les artefacts de compilation
à l'intérieur. Dans notre exemple, cela pourrait ressembler à ceci :

<!-- TODO: package into static libraries and document it -->

```
_targets/
├───code-impots-us/
│   ├───c/
│   │   │   Article_121.c
│   │   │   Article_121.h
│   │   │   Article_121.o
│   │   │   ...
│   │
│   ├───java/
│   │   │   Article_121.java
│   │   │   Article_121.class
│   │   │   ...
│   aides-logement/
│   │   ...
```

## Déployer le code généré

Maintenant que tout est correctement construit dans les différents backends, il est temps de
les intégrer ! Le but de Catala est de fournir des bibliothèques sources prêtes à l'emploi
dans un langage de programmation cible ; Catala ne crée pas une application complète pour vous.
Par conséquent, vous prenez généralement ce que Catala construit et l'intégrez
dans un autre projet existant.

À partir de ce point, le déploiement nécessite un peu de travail manuel car il dépend des
spécificités de vos cas d'utilisation. Fondamentalement, c'est à vous de copier les
artefacts dans `_targets` vers votre autre projet, de les compiler et de les lier à
votre base de code existante.

Par exemple, si vous souhaitez intégrer le programme Catala dans le cadre d'une application
Java, vous devrez copier les fichiers sources Java générés depuis le
répertoire `_target/<nom_cible>/java/` vers un sous-répertoire de votre projet Java,
et mettre à jour votre configuration Maven `pom.xml` en conséquence afin que Maven puisse
construire les fichiers sources générés par Catala.

~~~admonish danger title="Puis-je modifier les fichiers générés pour les adapter à mon processus de développement ?"
L'équipe Catala ne recommande pas de modifier les fichiers générés par le compilateur
Catala, pour deux raisons :
1. chaque fois que vous mettrez à jour les fichiers sources Catala, le compilateur
  re-générera un nouveau fichier dans votre langage de programmation cible que vous devrez
  re-modifier à la main ;
2. même si vous automatisez la modification, chaque modification du fichier généré
  pourrait introduire une différence de comportement avec la façon dont le fichier source Catala
  original se comporte avec l'interpréteur Catala.

En effet, le compilateur Catala garantit que le fichier généré dans votre langage de programmation
cible se comporte exactement comme le fichier source Catala exécuté avec l'interpréteur
Catala. Toute modification du fichier généré pourrait briser cette garantie.

Pour adapter les fichiers générés à votre processus de développement, nous recommandons plutôt que vous construisiez
du code "glu" dans votre langage de programmation cible au-dessus des fichiers générés.
Ce code "glu" est susceptible de contenir des utilitaires pour convertir vos structures de données
existantes en structures de données attendues par les fichiers générés, et
vice versa.
~~~

## Appeler les fonctions générées dans les langages de programmation cibles

Illustrons avec un exemple. Considérez ce programme Catala très simple :

~~~catala-fr
> Module ImpotSimple

```catala
déclaration champ d'application CalculImpotRevenu:
  entrée revenu contenu argent
  résultat impot_revenu contenu argent

champ d'application CalculImpotRevenu:
  définition impot_revenu égal à revenu * 10%
```
~~~

Avec sa version compilée en Java :

~~~~~~admonish info collapsible=true title="Fichier 'ImpotSimple.java' généré"
```Java
/* This file has been generated by the Catala compiler, do not edit! */

import catala.runtime.*;
import catala.runtime.exception.*;

public class Test {

    public static class CalculImpotRevenu implements CatalaValue {

        final CatalaMoney impot_revenu;

        CalculImpotRevenu (final CatalaMoney revenu_in) {
            final CatalaMoney revenu = revenu_in;
            final CatalaMoney
                impotRevenu = revenu.multiply
                             (new CatalaDecimal(new CatalaInteger("1"),
                                                new CatalaInteger("5")));
            this.impot_revenu = impotRevenu;
        }

        static class CalculImpotRevenuOut {
            final CatalaMoney impot_revenu;
            CalculImpotRevenuOut (final CatalaMoney impot_revenu) {
                this.impot_revenu = impot_revenu;
            }
        }

        CalculImpotRevenu (CalculImpotRevenuOut result) {
            this.impot_revenu = result.impot_revenu;
        }

        @Override
        public CatalaBool equalsTo(CatalaValue other) {
          if (other instanceof CalculImpotRevenu v) {
              return this.impot_revenu.equalsTo(v.impot_revenu);
          } else { return CatalaBool.FALSE; }
        }

        @Override
        public String toString() {
            return "impot_revenu = " + this.impot_revenu.toString();
        }
    }

}
```
~~~~~~

Si vous inspectez le fichier généré, vous remarquerez que les champs d'application
Catala seront traduits en classe Java (et en fonctions en C ou
Python). Les calculs de champ d'application sont effectués dans le constructeur de la classe. Par conséquent,
pour exécuter le champ d'application, nous devons instancier cette classe et récupérer
le résultat.

De plus, pour chaque backend, il existe une version dédiée du runtime Catala.
Ce composant est nécessaire pour la compilation et l'exécution des
programmes Catala générés. Les runtimes décriront les types et
structures de données Catala, les erreurs spécifiques ainsi qu'une API pour les manipuler depuis les
langages ciblés. Les fichiers pour le runtime devraient être inclus dans le
`_targets/<nom-cible>` ; vous pouvez également les copier dans votre projet et
référencer leurs types et fonctions depuis votre application.

En mettant tout cela ensemble, voici par exemple un programme Java simple qui
exécute notre champ d'application :

```java
import catala.runtime.CatalaMoney;

class Main {
    public static void main(String[] args){
        CatalaMoney revenu_entree = CatalaMoney.ofCents(50000*100);
        CalculImpotRevenu resultat = new CalculImpotRevenu(revenu_entree);
        CatalaMoney impot_resultat = resultat.impot_revenu;
        System.out.println("Impôt sur le revenu : " + impot_resultat);
    }
}
```

Comme mentionné, les runtimes Catala offrent une API pour construire les
valeurs spécifiques à Catala, par exemple, la méthode statique java `CatalaMoney.ofCents`
qui construit une valeur `CatalaMoney` équivalente à une valeur de type argent.
Seul le ciel est la limite ensuite quant à ce que vous pouvez construire !

Dans cette section, nous avons vu comment construire un projet, l'exporter et
l'intégrer dans une application existante. Dans la section suivante, nous
plongerons dans les tests de Catala et la mise en place de l'intégration continue.
