# Project configuration file

<div id="tocw"></div>

This section fully describes the manifest format for project
configuration files. The `clerk.toml` file contains metadata that
describe how to build and package Catala programs in a project. It is
written in the [TOML format](https://toml.io/en/).

An `clerk.toml` configuration example is available in [section
3.1](3-1-directory-config.md#the-clerktoml-configuration-file).


## Manifest format

- [`[project]`](#project-options) -- Table that defines the global project options.
  - [`name`](#name) -- The name of the project.
  - [`include_dirs`](#include_dirs) -- Directories to recursively scan for sources.
  - [`exclude_dirs`](#exclude_dirs) -- Directories that should not be scanned.
  - [`build_dir`](#build_dir) -- The build artifact output directory.
  - [`target_dir`](#target_dir) -- The targets output directory.
  - [`default_targets`](#default_targets) -- The default targets to build.
  - [`catala_opts`](#catala_opts) -- Catala options override.
  - [`catala_exe`](#catala_exe) -- Catala binary path override.
- [`[[target]]`](#target-options) -- Multi-table that defines a project's target.
  - [`name`](#name-1) -- Name of the target (*Required*).
  - [`modules`](#modules) -- Modules linked to the target (*Required*).
  - [`tests`](#tests) -- List of directories containing tests related to the target.
  - [`backends`](#backends) -- List of backends that this target will build to.
  <!-- - [`include_sources`](#include_sources) -- Flag to include source files in the compiled target.
   !-- - [`include_objects`](#include_objects) -- Flag to include object files in the compiled target. -->
  - [`dependencies`](#dependencies) -- List of other target names that this target depends on.
- [`[variables]`](#variables) -- Table to override compilation-related variables.

### `[project]` options

#### name

This will be used to refer to the project in multi-project setups.

#### include_dirs

Defines the directories `clerk` should search for Catala source files. The
search is recursive, meaning that any sub-directories are also included.

Example: `include_dirs = ["src", "libs/catala"]`

Defaults to `["."]`, meaning the project root: if unspecified, everything is
scanned but what is listed in [exclude_dirs](#exclude_dirs).

#### exclude_dirs

Withdraws the specified directories from what `clerk` should scan. Useful to
avoid scanning unwanted files, while keeping the default behaviour to include
everything.

Example: `exclude_dirs = ["doc", "libs/non-catala"]`

#### build_dir

Specifies which directory should be used to ouput the generated build
artifact files.

Example: `build_dir = "catala_build/"`

Defaults to `"_build/"`.

#### target_dir

Specifies which directory should be used to ouput the resulting
targets generated libraries. The directory will contains the
exportable backend files.

Example: `target_dir = "generated_targets/"`

Defaults to `"_target/"`.

#### default_targets

Defines which targets will be build if none is specified when invoking
`clerk build` with no arguments.

Example: `default_targets = ["tax_computation", "social_benefits"]`

#### catala_opts

Defines which options will be passed to the Catala compiler when
building Catala programs. *Warning*: use with caution.

Example: `catala_opts = ["--trace", "--whole-program"]`

#### catala_exe

Override which Catala compiler will be used to build source
files.

Example: `catala_exe = "path/to/custom_catala.exe"`

### `[[target]]` options

Targets regroup a consistent set of modules together in order to generate a
library or package in the target languages.

As result of the `clerk build` command, the selected targets will be built into
`_target/` (or what `target_dir` was set to), sorted by backend.

#### name

Name given to the target. This will create an alias that can be used
by clerk to build the specific target or launch dedicated tests.

Example: `name = "tax_computation"`

Invoking `$ clerk build tax_computation` will only build the
`tax_computation` target.

#### modules

Modules that will be included in the `[[target]]`. They will be available in the
output backends.

Example: `modules = ["Section_121", "Section_132"]`

Any modules that these depend on will also be automatically included (unless
present in the targets specified as [dependencies](#dependencies)).

#### tests

Specifies the list of directories that contain Catala tests that are
related to the target. Running `clerk test <target_name>` will run
tests found in the given directories (and sub-directories
recursively).

Example: `tests = ["tests/tax_tests/unit/", "tests/tax_tests/"]`

#### backends

Specifies the list of backends that will be generated for this
targets. The list of currently supported backends is: `"ocaml"`,
`"java"`, `"c"`, `"python"`

Example: `backends = ["ocaml", "c", "java"]`

Defaults to all backends if omitted.

#### dependencies

This is a list of other target names. This gives an indication that, in the
target language, the targets will be used to generate packages with a dependency
relationship (rather than stand-alone).

~~~admonish info title="Default target inclusion behaviour"
By default, when `dependencies` is not specified, `clerk` will include all
required modules in a given target (_i.e._ the specified modules **and** all
their dependencies), so that the target dir can be used stand-alone in the
output language.

When building a "package" in the output language from a Catala target, this
means it can be used independently. However, when using multiple such Catala
packages in the same project in the output language, one can hit a problem where
the same module would get included multiple times.

For example, if a module is called `Common` and is used by modules present in
both targets `a` and `b`, these two targets will include two copies of the
module `Common`. Linking both `a` and `b` in a single target application would
result in a clash between these two copies.
~~~

If two targets `A` and `B` depend on a shared module `Common` and you want to
use them both in an application, you should use a `dependencies` specification:
- either create a separate target `C` that includes module `Common`, and make
  both `A` and `B` depend on `C`. This way, the backend language will properly
  share the implementation of `Common`.
- another possibility is to make `A` depend on `B`: `Common` will automatically
  be included in `B` as before, but `A` will know that it can use it through `B`
  and refrain from pulling in another copy.

~~~admonish note
all targets implicitely depend on the `libcatala` target that includes
the base Catala runtime and standard library, and should be linked just once
into the end application.
~~~

Example: `dependencies = [ "common", "tax_computation" ]`

<!-- #### include_sources
 !--
 !-- Specifies whether to copy the original source files (e.g. `.catala_en`) into the
 !-- `_target` directory, in addition to the sources generated in the target language
 !-- (e.g. `.c` or `.java`).
 !--
 !-- Example: `include_sources = true`
 !--
 !-- Defaults to `false`.
 !--
 !-- #### include_objects
 !--
 !-- Specifies whether to copy over the backend generated compiled files (e.g.,
 !-- the `.o` or `.class`) in the `_target` directory.
 !--
 !-- Example: `include_objects = true`
 !--
 !-- Defaults to `false`. -->

### `[variables]`

Global table used to override clerk build variables. The full list of
variables can be accessed using `clerk list-vars`.

Example:
```toml
[variables]
CATALA_FLAGS_C = "-O"
CC = "clang"
JAVAC = "/usr/bin/javac"
```
