import { WordpressCli } from '../../wordpress-cli';
import {Command, flags} from '@oclif/command'
import { BlipConf, DockerMachine } from '@lime.it/blip-core'
import Listr = require('listr')
import { join } from 'path'
import { environment } from '../../environment'
import { WorkspaceTaskContext, MachineListTaskContext } from '../../utils'
import { mkdirp, createWriteStream, ensureDir } from 'fs-extra';

export default class TemplateWordpressSave extends Command {
  static description = 'Saves the current wordpress instance state to a loadable package'

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'Commit name', required: false, default: 'commit'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressSave)

    const commitName = `${new Date().getTime()}-${flags.name}`;
    const commitFilePath = join(environment.repoPath, `${commitName}.tar.gz`);

    const tasks = new Listr([
      {
        title: `Commiting status to ${commitName}`,
        task: async (ctx:any) => {
          
          await ensureDir(environment.repoPath);

          const stream = createWriteStream(commitFilePath);
          
          await WordpressCli.exportToWritestream(stream);
          
          stream.close();
        }
      }
    ]);
    
    await tasks.run();
  }
}
