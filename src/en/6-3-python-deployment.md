# Python deployment

<div id="tocw"></div>

## Requirements

The Catala Python runtime requires **Python ≥ 3.12**. No external Python
packages are needed: the runtime and its dependencies are bundled directly
inside the package produced by `clerk build`.

## Building the Python package

The Python deployment artifact is a self-contained Python package produced by
building an `.exe` target:

```console
$ clerk build python/MyModule.exe
```

This creates `_build/python/MyModule/`, a directory that can be used directly
as a Python package. It contains the generated module code, all its
dependencies, and the Catala runtime files. No `PYTHONPATH` configuration is
needed to import it.

~~~admonish info title="Why `.exe`?"
The `.exe` extension designates a *linked* artifact: all dependencies are
bundled together into a single self-contained directory. This is the artifact
intended for deployment, as opposed to the intermediate `.py` file produced by
`clerk build python/MyModule.py`, which is not self-contained.
~~~

## Using the package

Copy `_build/python/MyModule/` into your project and import from it directly:

```python
from MyModule.MyModule import my_scope, MyScopeIn
```

All Catala runtime types (`Money`, `Date`, `Duration`, ...) are re-exported
from the module, so you can import them from the same place:

```python
from MyModule.MyModule import my_scope, MyScopeIn, Money, Date
```

### Example

Given this Catala module:

~~~catala-en
> Module IncomeTax

```catala
declaration scope IncomeTax:
  input  income     content money
  input  birth_date content date
  output tax        content money

scope IncomeTax:
  definition tax equals
    if birth_date < |1980-01-01| then income *$ 20%
    else income *$ 10%
```
~~~

After `clerk build python/IncomeTax.exe`, the following Python code calls it:

```python
from IncomeTax.IncomeTax import income_tax, IncomeTaxIn, Money, Date

result = income_tax(IncomeTaxIn(
    income_in=Money('50000.00'),
    birth_date_in=Date(1975, 3, 12),
))
print(result.tax)  # 10000.00€
```

~~~admonish warning title="Two Catala packages in the same project"
Each linked package embeds its own copy of the Catala runtime. Types defined
by two different packages (e.g. `Money` from `PackageA` vs. `Money` from
`PackageB`) are distinct Python classes and cannot be mixed. Composing multiple
Catala packages in a single Python program is not currently supported.
~~~
