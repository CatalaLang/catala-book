# Support du JSON

<div id="tocw"></div>

Catala est capable d'accepter du [JSON](https://www.json.org/) en
entrée de programmes Catala. Cela permet de simplifier le prototypage
ou des tests simples.

~~~admonish warning title="Tests en JSON"
L'écriture de tests n'utilisant que des données JSON en entrée peut
sembler pratique mais nous décourageons cependant cette
pratique. L'écriture de tests en Catala apporte de meilleures
garanties en terme de maintenance (typage, test backends, etc.).
~~~

Pour illustrer comment intéragir avec un programme Catala avec des
entrées en JSON, considérons le champ d'application
`CalculImpôtRevenu` du [tutoriel](./2-0-tutorial.md):

```catala-code-fr
déclaration structure Individu:
  donnée revenu contenu argent
  donnée nombre_enfants contenu entier

déclaration champ d'application CalculImpôtRevenu:
  entrée date_courante contenu date
  entrée individu contenu Individu
  entrée territoires_outre_mer contenu booléen
  interne taux_imposition contenu décimal
  résultat impôt_revenu contenu argent
```

L'exécution de ce champ d'application nécessite de lui fournir des
valeurs concrètes en entrée, c'est-à-dire, une date courante, un
individu et un booléen. Ceci est possible en passant ces valeurs au
travers d'un objet JSON. Écrivons un fichier JSON (e.g.,
"entree-champ.json") contenant ces données:

```json
{ "date_courante": "2024-03-01",
  "individu": { "revenu": 20000.00, "nombre_enfants": 0 },
  "territoires_outre_mer": false }
```

Nous pouvons désormais directement exécuter ce champ d'application
grâce à l'option `--input`:

```console
$ clerk run tutoriel.catala_en --scope=CalculImpôtRevenu --input entree-champ.json
┌─[RESULT]─ CalculImpôtRevenu ─
│ impôt_revenu = 4 200,00 €
└─
```

~~~admonish note title="Formats acceptés par l'option `--input`"
L'option `--input` accepte en entrée un fichier ou directement une
chaîne de caractères JSON. Il est également possible de lire depuis
l'entrée standard en donnant `-` en argument (i.e., `--input=-`).
~~~

## Format JSON des entrées de champs d'application

L'exemple présenté ci-dessus est relativement simple à encoder en
JSON, cependant, pour des champs d'application plus complexe il est
très facile de commettre des erreurs. Dans notre exemple, si un champ
requis manque dans l'objet JSON fourni, disons le booléen, `clerk`
échouera et affichera une erreur contenant le format du JSON attendu:

```console
$ clerk run tutoriel.catala_en --scope=CalculImpôtRevenu --input mauvaise-entree.json
┌─[ERROR]─
│
│  Failed to validate JSON:
│    Missing object field territoires_outre_mer
│
│  Expected JSON object of the form:
│    { "date_courante": $date,
│      "individu": $Individu,
│      "territoires_outre_mer": boolean }
│    $Individu: { "revenu": integer ∈ [-2^53, 2^53] || number || string,
│                 "nombre_enfants": integer ∈ [-2^53, 2^53] || string }
│    $date:
│      /* Catala date */
│      string
│      /* Accepts strings with the following format: YYYY-MM-DD, e.g., "1970-01-31" */
│      || { /* Accepts date objects: {"year":<int>, "month":<int>, "day":<int>} */
│           "year": integer ∈ [0, 9999],
│           "month": integer ∈ [1, 12],
│           "day": integer ∈ [1, 31] }
│
└─
```

Ce format est plus compréhensible par les humains cependant l'approche
standardisé est d'utiliser les [JSON
Schema](https://json-schema.org/). Pour obtenir le JSON schema d'un champ d'application, vous pouvez utiliser la commande `clerk json-schema`:

```console
$ clerk json-schema tutoriel.catala_en --scope CalculImpôtRevenu
[
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Scope CalculImpôtRevenu input",
    "description": "Input structure of scope CalculImpôtRevenu",
    "$ref": "#/definitions/CalculImpôtRevenu_in",
    "definitions": {
      "CalculImpôtRevenu_in": {
        "type": "object",
        "properties": {
          "date_courante": { "$ref": "#/definitions/date" },
          "individu": { "$ref": "#/definitions/Individu" },
          "territoires_outre_mer": { "type": "boolean" }
        },
        "required": [ "territoires_outre_mer", "individu", "date_courante" ],
        "additionalProperties": false
      },
      ...
  },
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Scope CalculImpôtRevenu output",
    "description": "Output structure of scope CalculImpôtRevenu",
    "$ref": "#/definitions/CalculImpôtRevenu",
    "definitions": {
      "CalculImpôtRevenu": {
        "type": "object",
        "properties": {
          "impôt_revenu": {
            "oneOf": [ { "type": "integer", "minimum": -9007199254740992.0, "maximum": 9007199254740992.0 }, { "type": "number" }, { "type": "string" } ]
          }
        },
        "required": [ "impôt_revenu" ],
        "additionalProperties": false
      }
    }
  }
]
```

La sortie de la commande précédente étant très verbeuse, nous l'avons
raccourci pour clarifier. L'important à retenir est que cette commande
retourne un tableau JSON de deux éléments. Le premier élément est le
JSON schema décrivant le format de l'objet attendu pour l'**entrée**
du champ d'application tandis que le deuxième décrit le format de
l'objet attendu pour sa **sortie**. À l'aide d'outils externes, il
est, par exemple, possible de faciliter la création et la
prévalidation de données JSON.

## Sortie JSON de champs d'application

Il est également possible d'obtenir le résultat d'un champ
d'application sous la forme d'un objet JSON. Pour ce faire, il faut
ajouter l'option `--output-format json` (ou, plus succintement, `-F json`) à
votre ligne de commande `clerk run`:

```console
$ clerk run tutoriel.catala_en --output-format json --scope=CalculImpôtRevenu --input entree-champ.json
{ "impôt_revenu": 4200.0 }
```

Cette commande affichera le résultat en JSON selon le JSON schema
retourné par la commande `clerk json-schema` décrit dans la section
précédente.

~~~admonish note title="Option `--quiet`"
Souvent, les commandes `clerk run` ou `clerk json-schema` vont
également afficher des messages liés à la compilation sur la sortie
standard ce qui peut empêcher de traiter la sortie en tant qu'objet
JSON pur. Pour faire disparaître ces informations, vous pouvez
rajouter l'option `--quiet` à votre ligne de commande ce qui
permettra, par exemple, de rediriger la sortie de votre exécution vers
des outils acceptant du JSON en entrée ou vers un fichier `.json`.
~~~

## Correspondance des valeurs Catala avec le JSON

La table ci-dessous donne une correspondance entre les valeurs pouvant
être écrites dans des programmes Catala et leur équivalence en JSON.
Notez que certains types de valeurs peuvent être exprimés de plusieurs
façon. Par exemple, les entiers peuvent être représentés en JSON par
des entiers JSON (jusqu'à 2^53) ou, pour une précision arbitraire, par
une chaîne de caractère.

| Type Catala | Type JSON      | Example de valeur Catala| Valeur convertie en JSON |
|-------------|----------------|-------------------------|--------------------------|
| booléen     | boolean        | `vrai`                  | `true`                   |
| entier      | integer        | `1`                     | `1`                      |
| entier      | string         | `123`                   | `123`                    |
| décimal     | integer        | `1,0`                   | `1`                      |
| décimal     | number         | `1,5`                   | `1.5`                    |
| décimal     | string         | `1/3`                   | `"1/3"`                  |
| argent      | integer        | `1€`                    | `1`                      |
| argent      | number         | `1,23€`                 | `1.23`                   |
| argent      | string         | `1,23€`                 | `"1.23"`                 |
| date        | string         | `\|2026-01-31\|`        | `"2026-01-31"`           |
| durée       | string         | `1 an + 2 mois`         | `{"years":1,"months":2}` |
| liste       | array          | `[ 1 ; 2 ; 3 ]`         | `[ 1, 2, 3 ]`            |
| tuple       | array          | `(1, 3,0, faux)`        | `[ 1, 3.0, false ]`      |
| énumeration | string         | `A`                     | `"A"`                    |
| énumeration | object         | `B contenu 3`           | `{ "B": 3 }`             |
| structure   | object         | `{--x:1 --y:vrai}`      | `{ "x": 1, "y": true }`  |

~~~admonish note title="Support du JSON dans les backends"
Pour le moment, les entrées et sorties en JSON ne sont supportés que
par l'interprète Catala. Cependant, nous prévoyons d'ajouter son
support dans les backends existants, ou au moins une partie.
~~~
