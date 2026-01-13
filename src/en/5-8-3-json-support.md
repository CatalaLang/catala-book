# JSON support

<div id="tocw"></div>

Catala accepts [JSON](https://www.json.org/) data as input of Catala
programs. This can be useful for quick testing or prototyping.

~~~admonish warning title="JSON Tests"
Writing tests using JSON input may be handy but we do not recommend
it as a durable solution. Writing Catala tests provides an overall
better maintainability (type checking, backend-testing, etc.).
~~~

To illustrate how to interact with a Catala program using JSON data,
let us consider the `IncomeTaxComputation` scope from the
[tutorial](./2-0-tutorial.md):

```catala-code-en
declaration structure Individual:
  data income content money
  data number_of_children content integer

declaration scope IncomeTaxComputation:
   input current_date content date
   input individual content Individual
   input overseas_territories content boolean
   internal tax_rate content decimal
   output income_tax content money
```

Executing this scope requires to provide concrete values as inputs,
that is, a current date, an individual and a boolean. This is directly
possible by providing the values in a JSON object. Let's write a JSON
file (e.g., `scope-input.json`) containing such data:

```json
{ "current_date": "2024-03-01",
  "individual": { "income": 20000.00, "number_of_children": 0 },
  "overseas_territories": false }
```

We can now directly execute the scope using the `--input` option:

```console
$ clerk run tutorial.catala_en --scope=IncomeTaxComputation --input scope-input.json
┌─[RESULT]─ IncomeTaxComputation ─
│ income_tax = $4,200.00
└─
```

~~~admonish note title="Accepted formats of the `--input` option"
The `--input` option can be specified using a file or a direct JSON
string. It is also able to read from the standard input using `-` as
input (i.e., `--input=-`).
~~~

## JSON schemas of scope inputs

While the shown example is pretty simple to encode as JSON, more
complex scope inputs will be error-prone. For example, if the JSON is
missing a required field, let's say the boolean, `clerk` will complain
about it and provide a template of the JSON data it was expecting:

```console
$ clerk run tutorial.catala_en --scope=IncomeTaxComputation --input faulty-input.json
┌─[ERROR]─
│
│  Failed to validate JSON:
│    Missing object field overseas_territories
│
│  Expected JSON object of the form:
│    { "current_date": $date,
│      "individual": $Individual,
│      "overseas_territories": boolean }
│    $Individual: { "income": integer ∈ [-2^53, 2^53] || number || string,
│                   "number_of_children": integer ∈ [-2^53, 2^53] || string }
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

While this is handier for humans to understand, the more standard
approach is to consider the [JSON Schema](https://json-schema.org/).
In order to obtain the JSON Schema of a scope, one can use the `clerk
json-schema` command:

```console
$ clerk json-schema tutorial.catala_en --scope IncomeTaxComputation
[
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Scope IncomeTaxComputation input",
    "description": "Input structure of scope IncomeTaxComputation",
    "$ref": "#/definitions/IncomeTaxComputation_in",
    "definitions": {
      "IncomeTaxComputation_in": {
        "type": "object",
        "properties": {
          "current_date": { "$ref": "#/definitions/date" },
          "individual": { "$ref": "#/definitions/Individual" },
          "overseas_territories": { "type": "boolean" }
        },
        "required": [ "overseas_territories", "individual", "current_date" ],
        "additionalProperties": false
      },
     ...
  },
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Scope IncomeTaxComputation output",
    "description": "Output structure of scope IncomeTaxComputation",
    "$ref": "#/definitions/IncomeTaxComputation",
    "definitions": {
      "IncomeTaxComputation": {
        "type": "object",
        "properties": {
          "income_tax": { "oneOf": [ { "type": "integer", "minimum": -9007199254740992.0, "maximum": 9007199254740992.0 }, { "type": "number" }, { "type": "string" } ] }
        },
        "required": [ "income_tax" ],
        "additionalProperties": false
      }
    }
  }
]
```

The previous command output being quite long, for clarity sake, we
skip most of it. The important part to remember is that this command
yieds a JSON array of two elements. The first element in this array is
the JSON Schema for the scope **inputs**, the second element is the
scope **outputs** JSON Schema. Using the first schema, it is possible
to use external tools to ease the creation and pre-validation of JSON
data.

## JSON as scope outputs

It is also possible to obtain the result of a scope execution as a
JSON object. To do so, add the `--output-format json` option (or `-F json`
for short) to your `clerk run` command:

```console
$ clerk run tutorial.catala_en --output-format json --scope=IncomeTaxComputation --input scope-input.json
{ "income_tax": 4200.0 }
```

This will yield the result as a JSON object following the scope output
JSON schema obtained using the `clerk json-schema` command described
in the previous section.

~~~admonish note title="`--quiet` option"
Often, the `clerk run` or `clerk json-schema` commands will also
display compilation informations on the standard output which would
prevent the output to be treated as pure JSON. To prevent this, you
may add the `--quiet` option to your command line which will allow
you, for example, to redirect your cleaned out output to JSON
accepting tools or to a `.json` file.
~~~

## Correspondence between Catala values and JSON

The following table gives a correspondence between values as written
in Catala programs to their corresponding JSON format. Note that some
values can be encoded in several ways. For instance, integers can be
either represented as direct JSON integers (accepting values up to
2^53) or a string for an arbitrary precision.

| Catala type | JSON data type | Catala Value Example    | Converted value in JSON  |
|-------------|----------------|-------------------------|--------------------------|
| boolean     | boolean        | `true`                  | `true`                   |
| integer     | integer        | `1`                     | `1`                      |
| integer     | string         | `123`                   | `123`                    |
| decimal     | integer        | `1.0`                   | `1`                      |
| decimal     | number         | `1.5`                   | `1.5`                    |
| decimal     | string         | `1/3`                   | `"1/3"`                  |
| money       | integer        | `$1`                    | `1`                      |
| money       | number         | `$1.23`                 | `1.23`                   |
| money       | string         | `$1.23`                 | `"1.23"`                 |
| date        | string         | `\|2026-01-31\|`        | `"2026-01-31"`           |
| duration    | object         | `1 year + 2 month`      | `{"years":1,"months":2}` |
| list        | array          | `[ 1 ; 2 ; 3 ]`         | `[ 1, 2, 3 ]`            |
| tuple       | array          | `(1, 3.0, false)`       | `[ 1, 3.0, false ]`      |
| enumeration | string         | `A`                     | `"A"`                    |
| enumeration | object         | `B content 3`           | `{ "B": 3 }`             |
| structure   | object         | `{--x:1 --y:true}`      | `{ "x": 1, "y": true }`  |

~~~admonish note title="JSON support in backends"
Currently, JSON inputs and outputs are only supported in the Catala
interpreter backend. However, we plan to add support to it in the
other existing backends or, at least some of it.
~~~
