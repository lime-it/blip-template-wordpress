import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import { ensureDir, remove } from 'fs-extra'
import { environment } from '../../environment'

export default class TemplateWordpressClean extends Command {
  static description = 'Clear the local saved commits repo.'

  static flags = {
    help: flags.help({char: 'h'}),
    yes: flags.boolean({char:'y', required: false, default: false, description:'If set no confirmation prompt will be asked.' })
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressClean)

    const clean = 
      flags.yes || (await cli.prompt(`Are you sure you want to clean the local commits repo' (Yn)?`)).toLowerCase().charAt(0) == 'y';

    if(clean){
      await ensureDir(environment.repoPath);
      await remove(environment.repoPath);
      await ensureDir(environment.repoPath);
    }
  }
}
