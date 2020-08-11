import { environment } from './../../environment';
import {Command, flags} from '@oclif/command'
import { readFile } from 'fs-extra'
import Mustache = require('mustache');
import fetch = require('node-fetch');
import cli from 'cli-ux'

export default class TemplateWordpressSetup extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'})
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(TemplateWordpressSetup)

    // const txt = await readFile(`${environment.packagePath}/../assets/development/docker-compose.yml.template`, 'utf-8')
    // process.stdout.write(Mustache.render(txt, {images:{nginx:'1', mysql:'2',wordpress:'3'}}))

    const teardown = 
      (await cli.prompt(`Do you want to perform its teardown command (Yn)?`)).toLowerCase().charAt(0) == 'y';

    process.stdout.write(JSON.stringify((await (await fetch.default('https://registry.hub.docker.com/v1/repositories/wordpress/tags')).json() as {name:string}[])
      .filter(p=>/^\d+\.\d+\.\d+\-php\d\.\d\-fpm$/.test(p.name))
      .map(p=>p.name)
      .reverse())
    );

    return {value: 3}
  }
}
