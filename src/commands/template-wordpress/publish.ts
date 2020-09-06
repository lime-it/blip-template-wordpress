import {Command, flags} from '@oclif/command'
import { join } from 'path'
import { environment } from '../../environment'
import { readdir, createWriteStream, ensureDir, remove, copy, writeFile, readFile } from 'fs-extra'
import * as tar from 'tar';
import inquirer = require('inquirer');
import Listr = require('listr');
import { WordpressCli } from '../../wordpress-cli';
import { isWorkingAsExtracted, TemplateConfig } from '../../utils';
import Mustache = require('mustache');
import { BlipConf } from '@lime.it/blip-core';

export default class TemplateWordpressPublish extends Command {
  static description = 'Creates an installable tarball for the wordpress instance'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressPublish)
    
    const commits = (await readdir(environment.repoPath)).map(p => /^(\d+)\-(.+)\.tar\.gz$/.exec(p)).filter(p=>!!p)
      .map(p=>({timestamp:parseInt(p![1]), title:p![2], fileName: p![0]}))
      .sort((a,b)=>b.timestamp - a.timestamp)

    const currentInstanceStatus = 'latest';

    const inputs = (await inquirer.prompt([{
      name: 'commit',
      message: 'Select a commit to publish',
      type: 'list',
      choices: [currentInstanceStatus, ...commits.map(p=>p.fileName)],
      default: currentInstanceStatus
      }
    ]));

    const dataFilePath = join(environment.publishPath, "wp-status.tar.gz");

    const tasks = new Listr([
      {
        title: `Publishing '${inputs.commit}'`,
        task: async (ctx:any) => {
          
          await remove(environment.publishPath);
          await ensureDir(environment.publishPath);
          
          if(inputs.commit == currentInstanceStatus){
            const stream = createWriteStream(dataFilePath);
            
            await WordpressCli.exportToWritestream(stream, await isWorkingAsExtracted() == false);
            
            stream.close();
          }
          else{
            await copy(join(environment.repoPath, inputs.commit), dataFilePath);
          }

          const workspace = await BlipConf.readWorkspace();
          const templateConfig = workspace.template!.configuration as TemplateConfig;

          templateConfig.database.randomPassword = Math.random().toString(36).slice(-8);

          await writeFile(
            join(environment.publishPath, "docker-compose.yml"), 
            Mustache.render(
              await readFile(join(environment.assetsPath, "docker-compose.publish.yml.template"), 'utf-8'), templateConfig)
          );
        }
      },
      {
        title: 'Packing resources',
        task: async (ctx:any)=>{
          await tar.create({
            cwd: environment.publishPath,
            gzip: true,
            file: join(environment.publishPath, 'realease.tar.gz')
          }, ["wp-status.tar.gz", "docker-compose.yml"]);

          await remove(dataFilePath);
          await remove(join(environment.publishPath, "docker-compose.yml"));
        }
      }
    ]);
    
    await tasks.run();
  }
}
