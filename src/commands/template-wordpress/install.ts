import { CLIError } from '@oclif/errors';
import {Command, flags} from '@oclif/command'
import Listr = require('listr')
import { join } from 'path';
import { ensureDir, ensureFile, copy, copyFile, createReadStream, existsSync, remove } from 'fs-extra';
import * as tar from 'tar';
import { DockerCompose, DockerMachine, DockerMachineEnv } from '@lime.it/blip-core';
import { WordpressCli } from '../../wordpress-cli';

export default class TemplateWordpressInstall extends Command {
  static description = 'Installs an exported wordpress instance tarball.'

  static flags = {
    help: flags.help({char: 'h'}),
    machine: flags.string({required: false, description: 'Docker machine on which execute commands'}),
    container: flags.string({required: false, description: 'Existing wordpress container id'}),
    destination: flags.string({required: true, description: 'Destination path of the docker-compose file', default: './'})
  }

  static args = [
    {name: 'file', description: 'Path to the file to be installed or imported', required: true, default: './release.tar.gz'},
    {name: 'domain', description: 'Site exposing domain', required: true}
  ]

  async run() {
    const {args, flags} = this.parse(TemplateWordpressInstall)

    if(/^https?:\/\/[^\/]+$/.test(args.domain) == false)
      throw new CLIError(`Invalid domain provided '${args.domain}'`);

    if(existsSync(args.file) == false)
      throw new CLIError(`File '${args.file}' not found`);

    const tempPath = join(process.cwd(), `blip-tmp-${Math.random().toString(36).slice(-8)}`);

    const machineEnv: DockerMachineEnv = !flags.machine ? process.env as any : await DockerMachine.env(flags.machine, 'bash');

    const tasks = new Listr([
      {
        title: 'Extracting files',
        task: async (ctx:{composePath?:string})=>{
          await ensureDir(tempPath);
          await tar.extract({
            file: args.file,
            cwd: tempPath
          });

          ctx.composePath = join(flags.destination, 'docker-compose.yml');

          if(!flags.container){
            await ensureFile(ctx.composePath);
            await copyFile(join(tempPath, "docker-compose.yml"), ctx.composePath!);
          }
        }
      },
      {
        title: 'Starting docker-compose services',
        skip: (ctx:any)=>!!flags.container,
        task: async (ctx:{composePath?:string}) => {
          const containers = await DockerCompose.ps(machineEnv, ctx.composePath!);
          if(containers.length == 0)
            await DockerCompose.up(machineEnv, ctx.composePath!);
          else if(containers.filter(p => p.status!='running').length > 0)
            await DockerCompose.start(machineEnv, ctx.composePath!); 

          await new Promise((r,_)=>setTimeout(()=>r(), 5000));
        }
      },
      {
        title: `Importing status`,
        task: async (ctx:any) => {
          
          const stream = createReadStream(join(tempPath, "wp-status.tar.gz"));
          
          await WordpressCli.importFromReadStream(stream, args.domain);
          
          stream.close();
        }
      },
      {
        title: 'Cleaning up',
        task: async (ctx:any)=>{
          await remove(tempPath);
        }
      }
    ]);
    
    await tasks.run();
  }
}
