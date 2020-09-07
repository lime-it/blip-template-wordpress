import {Command, flags} from '@oclif/command'
import { join, resolve } from 'path'
import { environment } from '../../environment'
import { createReadStream, readdir, ensureDir } from 'fs-extra'
import { WordpressCli } from '../../wordpress-cli'
import {CLIError} from '@oclif/errors'
import inquirer = require('inquirer');
import Listr = require('listr')
import { WorkspaceTaskContext, MachineListTaskContext } from '../../utils'
import { BlipConf } from '@lime.it/blip-core'

export default class TemplateWordpressLoad extends Command {
  static description = 'Load a saved state to a clean wordpress/mysql container instance.'

  static flags = {
    help: flags.help({char: 'h'}),
    'from-file': flags.string({required: false, description:'Import from a tarball at a given path'}),
    'from-commits': flags.boolean({required: false, default: false, description: 'Select a commit to load'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressLoad)    

    const commits = (await readdir(environment.repoPath)).map(p => /^(\d+)\-(.+)\.tar\.gz$/.exec(p)).filter(p=>!!p)
      .map(p=>({timestamp:parseInt(p![1]), title:p![2], fileName: p![0]}))
      .sort((a,b)=>b.timestamp - a.timestamp)

    if(!flags["from-commits"] && !flags["from-file"] && commits.length==0)
      throw new CLIError("No load source specified.");

    if(!!flags["from-commits"] && commits.length==0)
      throw new CLIError("No commit available.");

    let filePathName: string|null = null;
          
    await ensureDir(environment.repoPath);

    if(!flags["from-commits"] && !flags["from-file"])
      filePathName = join(environment.repoPath, commits[0].fileName);
    else if(!!flags["from-file"])
      filePathName = resolve(flags["from-file"]);
    else{
      const inputs = (await inquirer.prompt([{
          name: 'commit',
          message: 'Select a commit to load',
          type: 'list',
          choices: commits.map(p=>p.fileName),
          default: commits[0].fileName
        }
      ]));
      filePathName = join(environment.repoPath, inputs.commit);
    }

    const tasks = new Listr([
      {
        title: `Loading from '${filePathName}'`,
        task: async (ctx:WorkspaceTaskContext) => {

          const stream = createReadStream(filePathName!);
          
          await WordpressCli.importFromReadStream(stream, `https://${ctx.workspace.machines[ctx.workspace.defaultMachine].domains[0]}`);
          
          stream.close();
        }
      }
    ]);
    
    await tasks.run({workspace: await BlipConf.readWorkspace()});
  }
}
