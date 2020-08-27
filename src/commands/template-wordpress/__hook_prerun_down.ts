import { MachineListTaskContext } from './../../utils';
import {Command, flags} from '@oclif/command'
import { join } from 'path'
import { environment } from '../../environment'
import Listr = require('listr')
import { WorkspaceTaskContext } from '../../utils'
import { DockerCompose, DockerMachine, BlipConf, isMachineStarty } from '@lime.it/blip-core'

export default class TemplateWordpressHookPrerunDown extends Command {
  static description = 'Executes pre-down scritps for a wordpress template workspace'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressHookPrerunDown)


    const composePath = join(environment.confPath, "docker-compose.yml");

    const tasks = new Listr([
      {
        skip: (ctx:WorkspaceTaskContext&MachineListTaskContext) => {
          return !ctx.machineList.find(p => p.name == ctx.workspace.defaultMachine && isMachineStarty(p.state!));
        },
        title: 'Stopping docker-compose services',
        task: async (ctx:WorkspaceTaskContext&MachineListTaskContext) => {
          await DockerCompose.stop(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace(), machineList: await DockerMachine.ls()});
  }
}
