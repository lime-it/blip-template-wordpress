@lime.it/blip-wordpress
=======================

Commands to setup and use a blip project for wordpress site development

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lime.it/blip-wordpress.svg)](https://npmjs.org/package/@lime.it/blip-wordpress)
[![CircleCI](https://circleci.com/gh/lime-it/blip-wordpress/tree/master.svg?style=shield)](https://circleci.com/gh/lime-it/blip-wordpress/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@lime.it/blip-wordpress.svg)](https://npmjs.org/package/@lime.it/blip-wordpress)
[![License](https://img.shields.io/npm/l/@lime.it/blip-wordpress.svg)](https://github.com/lime-it/blip-wordpress/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @lime.it/blip-template-wordpress
$ @lime.it/blip-template-wordpress COMMAND
running command...
$ @lime.it/blip-template-wordpress (-v|--version|version)
@lime.it/blip-template-wordpress/0.1.0 linux-x64 node-v12.18.3
$ @lime.it/blip-template-wordpress --help [COMMAND]
USAGE
  $ @lime.it/blip-template-wordpress COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up`](#limeitblip-template-wordpress-template-wordpress__hook_postrun_up)
* [`@lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down`](#limeitblip-template-wordpress-template-wordpress__hook_prerun_down)
* [`@lime.it/blip-template-wordpress template-wordpress:__setup`](#limeitblip-template-wordpress-template-wordpress__setup)
* [`@lime.it/blip-template-wordpress template-wordpress:__teardown`](#limeitblip-template-wordpress-template-wordpress__teardown)
* [`@lime.it/blip-template-wordpress template-wordpress:extract`](#limeitblip-template-wordpress-template-wordpressextract)
* [`@lime.it/blip-template-wordpress template-wordpress:install [FILE]`](#limeitblip-template-wordpress-template-wordpressinstall-file)
* [`@lime.it/blip-template-wordpress template-wordpress:load`](#limeitblip-template-wordpress-template-wordpressload)
* [`@lime.it/blip-template-wordpress template-wordpress:publish [FILE]`](#limeitblip-template-wordpress-template-wordpresspublish-file)
* [`@lime.it/blip-template-wordpress template-wordpress:save`](#limeitblip-template-wordpress-template-wordpresssave)

## `@lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up`

Executes post-up scritps for a wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__hook_postrun_up.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/__hook_postrun_up.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down`

Executes pre-down scritps for a wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__hook_prerun_down.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/__hook_prerun_down.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:__setup`

Set up a blip-wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__setup

OPTIONS
  -h, --help                     show CLI help
  --mysql=mysql                  Mysql docker image tag
  --wordpress=wordpress          Wordpress docker image tag
  --wordpress-cli=wordpress-cli  Wordpress cli docker image tag
```

_See code: [src/commands/template-wordpress/__setup.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/__setup.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:__teardown`

Tear down a blip-wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__teardown

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__teardown.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/__teardown.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:extract`

Extracts wordpress wwwroot in order to directly modify its sources

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:extract

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/extract.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/extract.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:install [FILE]`

describe the command here

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:install [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/template-wordpress/install.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/install.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:load`

describe the command here

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:load

OPTIONS
  -h, --help             show CLI help
  --from-commits
  --from-file=from-file
```

_See code: [src/commands/template-wordpress/load.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/load.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:publish [FILE]`

describe the command here

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:publish [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/template-wordpress/publish.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/publish.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:save`

Saves the current wordpress instance state to a loadable package

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:save

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  [default: commit] Commit name
```

_See code: [src/commands/template-wordpress/save.ts](https://github.com/lime-it/blip-wordpress/blob/v0.1.0/src/commands/template-wordpress/save.ts)_
<!-- commandsstop -->
