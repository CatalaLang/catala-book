# Project configuration file

This section fully describes the manifest format for project
configuration files. The `clerk.toml` file contains metadata that
describe how to build and package Catala programs in a project. It is
written in the [TOML format](https://toml.io/en/).

An `clerk.toml` configuration example is available in [section
3.1](3-1-directory-config.md#the-clerktoml-configuration-file).


## Manifest format

- `[project]` --- Table that defines the global project options.
  - [`include_dirs`](#include_dirs) --- The sources location directories.
  - [`build_dir`](#build_dir) --- The build artifact output directory.
  - [`target_dir`](#target_dir) --- The targets output directory.
  - [`default_targets`](#default_targets) --- The default targets to build.
  - [`catala_opts`](#catala_opts) --- Catala options override.
  - [`catala_exe`](#catala_exe) --- Catala binary path override.
- `[[target]]` --- Multi-table that defines a project's target.
  - [`name`](#name) --- Name of the target (*Required*).
  - [`modules`](#modules) --- Modules linked to the target (*Required*).
  - [`tests`](#tests) --- List of directories containing tests related to the target.
  - [`backends`](#backends) --- List of backends that this target will build to.
  - [`include_sources`](#include_sources) --- Flag to include source files in the compiled target.
  - [`include_objects`](#include_objects) --- Flag to include object files in the compiled target.
- [`[variables]`](#variables) --- Table to override compilation-related variables.

### `[project]` options

#### include_dirs

Defines which directories `clerk` looks for Catala source files.

Example: `include_dirs = ["src", "src/utils"]`

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

#### name

Name given to the target. This will create an alias that can be used
by clerk to build the specific target or launch dedicated tests.

Example: `name = "tax_computation"`

Invoking `$ clerk build tax_computation` will only build the
`tax_computation` target.

#### modules

Modules that will be used to compile the `[[target]]` to the specified
backends.

Example: `modules = ["Section_121", "Section_132"]`

#### tests

Specifies the list of directories that contains Catala tests that are
related to the target. Running `clerk test <target_name>` will run
tests found in the given directories (and sub-directories
recursively).

Example: `tests = ["tests/tax_tests/unit/", "tests/tax_tests/"]`

#### backends

Specifies the list of backends that will be generated for this
targets. The list of currently supported backends is: `"ocaml"`,
`"java"`, `"c"`, `"python"`

Example: `backends = ["ocaml", "c", "java"]`

Defaults to `["ocaml"]` if omitted.

#### include_sources

Specifies whether to copy over the backend generated source files (e.g.,
the `.c` or `.java`) in the `target` directory.

Example: `include_sources = true`

Defaults to `false`.

#### include_objects

Specifies whether to copy over the backend generated compiled files (e.g.,
the `.o` or `.class`) in the `target` directory.

Example: `include_objects = true`

Defaults to `false`.

### `[variables]`

Global table used to override clerk build variables. The full list of
variables can be accessed using `clerk list-vars`.

Example:
```
[variables]
CATALA_FLAGS_C = "-O"
CC = "clang"
JAVAC = "/usr/bin/javac"
```
