import { TemplateConfig } from './../../utils';
import { environment } from './../../environment';
import {Command, flags} from '@oclif/command'
import { readFile, mkdirp, writeFile } from 'fs-extra'
import Mustache = require('mustache');
import cli from 'cli-ux'
import inquirer = require('inquirer');
import { join } from 'path';
import { BlipConf } from '@lime.it/blip-core';
import { getDockerImageTags } from '../../utils';
import execa = require('execa');

export default class TemplateWordpressSetup extends Command {
  static description = 'Set up a blip-wordpress template workspace'

  static flags = {
    help: flags.help({char: 'h'}),
    wordpress: flags.string({description: 'Wordpress docker image tag', required: false}),
    'wordpress-cli': flags.string({description: 'Wordpress cli docker image tag', required: false}),
    mysql: flags.string({description: 'Mysql docker image tag', required: false})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressSetup)

    cli.action.start('Fetching compatible images tags...');
    
    const wordpressTags = await getDockerImageTags('wordpress', /^\d+\.\d+\.\d+\-php\d\.\d\-apache$/);    
    const mysqlTags = await getDockerImageTags('mysql', /^\d+\.\d+\.\d+$/);
    const wordpressCliTags = await getDockerImageTags('wordpress', /^cli-\d+\.\d+\.\d+\-php\d\.\d$/);

    cli.action.stop()

    const inputs = (await inquirer.prompt([
      !!flags.wordpress ? null :
      {
        name: 'wordpressTag',
        message: 'Select a "fpm" wordpress image version',
        type: 'list',
        choices: wordpressTags,
        default: wordpressTags[0],
        
      },
      !!flags.mysql ? null :
      {
        name: 'mysqlTag',
        message: 'Select a mysql image version',
        type: 'list',
        choices: mysqlTags,
        default: mysqlTags[0]
      },
      !!flags['wordpress-cli'] ? null :
      {
        name: 'wordpressCliTag',
        message: 'Select a wordpress cli image version',
        type: 'list',
        choices: wordpressCliTags,
        default: wordpressCliTags[0]
      }
    ].filter(p=>!!p)));

    const workspace = await BlipConf.readWorkspace();

    const templateConfig:TemplateConfig = {
      images:{
        nginx:{tag:'latest'},
        wordpress:{tag:flags.wordpress || inputs.wordpressTag},
        'wordpress-cli':{tag:flags["wordpress-cli"] || inputs.wordpressCliTag},
        mysql:{tag:flags.mysql || inputs.mysqlTag, above5: parseInt(/^(\d+)\./.exec(inputs.mysqlTag)![1])>5}
      },
      domain: workspace.machines[workspace.defaultMachine]?.domains?.find(p => !!p),
      database:{
        randomPassword: Math.random().toString(36).slice(-8)
      }
    };

    await mkdirp(environment.confPath);

    await writeFile(
      join(environment.confPath, "docker-compose.yml"), 
      Mustache.render(
        await readFile(join(environment.assetsPath, "docker-compose.yml.template"), 'utf-8'), templateConfig)
    );

    await mkdirp(join(environment.confPath, "nginx"));

    await writeFile(
      join(environment.confPath, "nginx", "default.conf"), 
      Mustache.render(
        await readFile(join(environment.assetsPath, "default.conf.template"), 'utf-8'), templateConfig)
    );

    await execa("git", ['lfs', 'track', '.wordpress/repo/*.tar.gz']);
    await execa("git", ['add', '.gitattributes']);

    return templateConfig;
  }
}
