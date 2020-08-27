import { BlipConf, DockerCompose, DockerMachine } from '@lime.it/blip-core';
import { TemplateConfig } from './utils';
import { join } from 'path';
import { environment } from './environment';
import execa = require('execa');
import { WriteStream } from 'fs-extra';

export interface WordpressCliTool {
  getSiteUrl():Promise<string>;
  exportToWritestream(stream:WriteStream):Promise<void>;
}

const composePath = join(environment.confPath, "docker-compose.yml");

class WordpressCliToolImpl implements WordpressCliTool{

  private dockerArgs:string[]|null=null;
  private machineEnvironment:{[key:string]:string}|null = null;

  private async initialize(force:boolean = false):Promise<void>{
    if(!this.dockerArgs || !this.machineEnvironment || force){
      const workspace = await BlipConf.readWorkspace();
      const env = await DockerMachine.env(workspace.defaultMachine, 'bash');
      const templateConfig = workspace.template?.configuration as TemplateConfig;
      const containers = await DockerCompose.ps(env, composePath);
      const wordpressContainerId = containers.find(p => p.image?.includes('wordpress'))!.id!;

      this.dockerArgs = [
        'run', '--rm',
        '--volumes-from', `${wordpressContainerId}`,
        '--network', `container:${wordpressContainerId}`,
        '--entrypoint', 'bash', `wordpress:${templateConfig.images["wordpress-cli"].tag}`,
        '-c'];
      this.machineEnvironment = env as any || process.env;
    }
  }

  async getSiteUrl(): Promise<string> {
    await this.initialize();

    return (await execa('docker', [...this.dockerArgs!, 'wp option get siteurl'], { env: this.machineEnvironment as any })).stdout;
  }

  async exportToWritestream(stream:WriteStream):Promise<void>{
    const pr = execa('docker', [...this.dockerArgs!, 'wp db export bkp.sql > /dev/null && tar -czf tmp wp-content bkp.sql > /dev/null && cat tmp'],
      { env: this.machineEnvironment as any });
    
    pr.stdout.pipe(stream);

    await pr;
  }
}

export const WordpressCli:WordpressCliTool = new WordpressCliToolImpl();