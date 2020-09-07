@lime.it/blip-template-wordpress
=======================

Commands to setup and use a blip project for wordpress site development

[![Version](https://img.shields.io/npm/v/@lime.it/blip-template-wordpress.svg)](https://npmjs.org/package/@lime.it/blip-template-wordpress)
[![CircleCI](https://circleci.com/gh/lime-it/blip-template-wordpress/tree/master.svg?style=shield)](https://circleci.com/gh/lime-it/blip-template-wordpress/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@lime.it/blip-template-wordpress.svg)](https://npmjs.org/package/@lime.it/blip-template-wordpress)
[![License](https://img.shields.io/npm/l/@lime.it/blip-template-wordpress.svg)](https://github.com/lime-it/blip-template-wordpress/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
```sh-session
$ npm install -g @lime.it/blip
$ blip plugins:install @lime.it/blip-template-wordpress
$ blip tpl:use wordpress
...
```
# Commands
<!-- commands -->
* [`@lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up`](#limeitblip-template-wordpress-template-wordpress__hook_postrun_up)
* [`@lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down`](#limeitblip-template-wordpress-template-wordpress__hook_prerun_down)
* [`@lime.it/blip-template-wordpress template-wordpress:__setup`](#limeitblip-template-wordpress-template-wordpress__setup)
* [`@lime.it/blip-template-wordpress template-wordpress:__teardown`](#limeitblip-template-wordpress-template-wordpress__teardown)
* [`@lime.it/blip-template-wordpress template-wordpress:clean`](#limeitblip-template-wordpress-template-wordpressclean)
* [`@lime.it/blip-template-wordpress template-wordpress:extract`](#limeitblip-template-wordpress-template-wordpressextract)
* [`@lime.it/blip-template-wordpress template-wordpress:install FILE DOMAIN`](#limeitblip-template-wordpress-template-wordpressinstall-file-domain)
* [`@lime.it/blip-template-wordpress template-wordpress:load`](#limeitblip-template-wordpress-template-wordpressload)
* [`@lime.it/blip-template-wordpress template-wordpress:publish`](#limeitblip-template-wordpress-template-wordpresspublish)
* [`@lime.it/blip-template-wordpress template-wordpress:save`](#limeitblip-template-wordpress-template-wordpresssave)

## `@lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up`

Executes post-up scritps for a wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__hook_postrun_up

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__hook_postrun_up.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/__hook_postrun_up.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down`

Executes pre-down scritps for a wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__hook_prerun_down

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__hook_prerun_down.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/__hook_prerun_down.ts)_

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

_See code: [src/commands/template-wordpress/__setup.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/__setup.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:__teardown`

Tear down a blip-wordpress template workspace

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:__teardown

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/__teardown.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/__teardown.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:clean`

Clear the local saved commits repo.

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:clean

OPTIONS
  -h, --help  show CLI help
  -y, --yes   If set no confirmation prompt will be asked.
```

_See code: [src/commands/template-wordpress/clean.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/clean.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:extract`

Extracts wordpress wwwroot in order to directly modify its sources

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:extract

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/extract.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/extract.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:install FILE DOMAIN`

Installs an exported wordpress instance tarball.

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:install FILE DOMAIN

ARGUMENTS
  FILE    [default: ./release.tar.gz] Path to the file to be installed or imported
  DOMAIN  Site exposing domain

OPTIONS
  -h, --help                 show CLI help
  --container=container      Existing wordpress container id
  --destination=destination  (required) [default: ./] Destination path of the docker-compose file
  --machine=machine          Docker machine on which execute commands
```

_See code: [src/commands/template-wordpress/install.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/install.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:load`

Load a saved state to a clean wordpress/mysql container instance.

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:load

OPTIONS
  -h, --help             show CLI help
  --from-commits         Select a commit to load
  --from-file=from-file  Import from a tarball at a given path
```

_See code: [src/commands/template-wordpress/load.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/load.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:publish`

Creates an installable tarball for the wordpress instance

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:publish

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/template-wordpress/publish.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/publish.ts)_

## `@lime.it/blip-template-wordpress template-wordpress:save`

Saves the current wordpress instance state to a loadable package

```
USAGE
  $ @lime.it/blip-template-wordpress template-wordpress:save

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  [default: commit] Commit name
```

_See code: [src/commands/template-wordpress/save.ts](https://github.com/lime-it/blip-template-wordpress/blob/v0.0.0-development/src/commands/template-wordpress/save.ts)_
<!-- commandsstop -->
