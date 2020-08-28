import {Command, flags} from '@oclif/command'
import { join } from 'path'
import { environment } from '../../environment'
import { createReadStream } from 'fs-extra'
import { WordpressCli } from '../../wordpress-cli'

export default class TemplateWordpressLoad extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressLoad)    

    const composePath = join(environment.confPath, "docker-compose.yml");
    const commitName = `1598640093844-commit`;
    const commitFilePath = join(environment.confPath, "repo", `${commitName}.tar.gz`);

    const stream = createReadStream(commitFilePath);
          
    await WordpressCli.importFromReadStream(stream, 'https://test.local');
    
    stream.close();
  }
}
