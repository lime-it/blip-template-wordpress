import { DockerCompose, BlipConf, DockerMachine } from '@lime.it/blip-core';
import { WordpressCli } from './../../wordpress-cli';
import {Command, flags} from '@oclif/command'
import { ensureDir, remove, readFile, writeFile } from 'fs-extra'
import { environment } from '../../environment'
import { isExtWordpressSrcAvailable, WorkspaceTaskContext, isWorkingAsExtracted } from '../../utils';
import * as YAML from 'yaml';
import { join, resolve } from 'path';
import Listr = require('listr');

export default class TemplateWordpressExtract extends Command {
  static description = 'Extracts wordpress wwwroot in order to directly modify its sources'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressExtract)

    if(await isWorkingAsExtracted()) {
      this.log("Nothing to do. The wordpress instance is already working as extracted.")
      return;
    }

    const tasks = new Listr([
      {
        title: `Extracting /var/www/html => ${resolve(environment.localExtWpPath)}`,
        task: async (ctx:WorkspaceTaskContext) => {
          
          await remove(environment.localExtWpPath);
          await ensureDir(environment.localExtWpPath);

          await WordpressCli.extractPathToHostPath("/var/www/html", environment.machineWpPath);
        }
      },
      {
        title: `Updating docker-compose setup`,
        task: async (ctx:WorkspaceTaskContext) => {

          const composePath = join(environment.confPath, "docker-compose.yml");
          const bindVolumeConf = `${environment.machineWpPath}:/var/www/html`;

          const dockerCompose = YAML.parse(await readFile(composePath, 'utf8'));
      
          const volumes:string[] = dockerCompose.services.wordpress.volumes = dockerCompose.services.wordpress.volumes || [];
          if(!volumes.includes(bindVolumeConf))
            volumes.push(bindVolumeConf);

          await writeFile(composePath, YAML.stringify(dockerCompose, { version:'1.1' }));
          await DockerCompose.up(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace()});
  }
}
