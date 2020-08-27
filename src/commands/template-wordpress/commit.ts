import { WordpressCli } from './../../wordpress-cli';
import {Command, flags} from '@oclif/command'
import { BlipConf, DockerMachine } from '@lime.it/blip-core'
import Listr = require('listr')
import { join } from 'path'
import { environment } from '../../environment'
import { WorkspaceTaskContext, MachineListTaskContext } from '../../utils'
import { mkdirp, createWriteStream } from 'fs-extra';

export default class TemplateWordpressCommit extends Command {
  static description = 'Commits the current wordpress instance state to a loadable package'

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'Commit name', required: false, default: 'commit'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressCommit)

    const composePath = join(environment.confPath, "docker-compose.yml");
    const commitName = `${new Date().getTime()}-${flags.name}`;
    const commitFilePath = join(environment.confPath, "repo", `${commitName}.tar.gz`);

    const tasks = new Listr([
      {
        title: `Commiting status to ${commitName}`,
        task: async (ctx:WorkspaceTaskContext&MachineListTaskContext) => {
          
          await mkdirp(join(environment.confPath, "repo"));

          const stream = createWriteStream(commitFilePath);
          
          await WordpressCli.exportToWritestream(stream);
          
          stream.close();
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace(), machineList: await DockerMachine.ls()});
  }
}
