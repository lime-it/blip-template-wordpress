import { WorkspaceTaskContext, DockerComposeTaskContext, MachineListTaskContext } from './../../utils';
import { environment } from './../../environment';
import {Command, flags} from '@oclif/command'
import { join } from 'path';
import Listr = require('listr');
import { DockerCompose, BlipWorkspace, DockerMachine, DockerPsResult, BlipConf, isMachineStoppy, isMachineStarty } from '@lime.it/blip-core';
import { remove } from 'fs-extra';

export default class TemplateWordpressTeardown extends Command {
  static description = 'Tear down a blip-wordpress template workspace'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressTeardown)

    const composePath = join(environment.confPath, "docker-compose.yml");

    const tasks = new Listr([
      {
        skip: (ctx:WorkspaceTaskContext&DockerComposeTaskContext&MachineListTaskContext) => 
          !!ctx.machineList.find(p => p.name == ctx.workspace.defaultMachine && !isMachineStarty(p.state!)),
        title: 'Checking running docker-compose services',
        task: async (ctx:WorkspaceTaskContext&DockerComposeTaskContext&MachineListTaskContext) => {
          const containers = await DockerCompose.ps(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
          ctx.containers = containers;
        }
      },
      {
        title: 'Destroying docker-compose services',
        skip: (ctx:WorkspaceTaskContext&DockerComposeTaskContext) => ctx.containers.length == 0,
        task: async (ctx:WorkspaceTaskContext&DockerComposeTaskContext) => {
          await DockerCompose.down(await DockerMachine.env(ctx.workspace.defaultMachine, 'bash'), composePath);
        }
      },
      {
        title: 'Removing wordpress template workspace files',
        task: (ctx:any) => {
          remove(environment.confPath);
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace(), containers: [], machineList: await DockerMachine.ls()});
  }
}
