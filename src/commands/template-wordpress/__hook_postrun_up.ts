import {Command, flags} from '@oclif/command'
import { join } from 'path'
import { environment } from '../../environment'
import Listr = require('listr')
import { WorkspaceTaskContext, DockerComposeTaskContext } from '../../utils'
import { BlipConf, DockerCompose, DockerMachine } from '@lime.it/blip-core'

export default class TemplateWordpressHookPostrunUp extends Command {
  static description = 'Executes post-up scritps for a wordpress template workspace'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressHookPostrunUp)

    const composePath = join(environment.confPath, "docker-compose.yml");

    const tasks = new Listr([
      {
        title: 'Starting docker-compose services',
        task: async (ctx:WorkspaceTaskContext) => {
          const containers = await DockerCompose.ps(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
          if(containers.length == 0)
            await DockerCompose.up(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
          else if(containers.filter(p => p.status!='running').length > 0)
            await DockerCompose.start(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);          
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace()});
  }
}
