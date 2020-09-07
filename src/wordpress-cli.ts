import { BlipConf, DockerCompose, DockerMachine } from '@lime.it/blip-core';
import { TemplateConfig } from './utils';
import { join } from 'path';
import { environment } from './environment';
import execa = require('execa');
import { WriteStream, ReadStream } from 'fs-extra';

export interface WordpressCliTool {
  getSiteUrl():Promise<string>;
  exportToWritestream(stream:WriteStream, contentOnly:boolean):Promise<void>;
  importFromReadStream(stream:ReadStream, siteUrl: string):Promise<void>;
  extractPathToHostPath(containerPath:string, hostPath:string):Promise<void>;
}

const composePath = join(environment.confPath, "docker-compose.yml");

const exportSiteUrl = 'BLIP_EXPORT_SITE_URL';
const exportSiteUrlSchemaless = 'BLIP_EXPORT_SITE_URL_SCHEMALESS';
const exportSiteUrlDomain = 'BLIP_EXPORT_SITE_URL_DOMAIN';

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
        'run', '-i','--rm', '-u', '33',
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

  async exportToWritestream(stream:WriteStream, contentOnly:boolean):Promise<void>{
    await this.initialize();

    const siteUrl = await this.getSiteUrl();
    const SiteUrlSchemaless = siteUrl.replace(/^https?:/,'');
    const siteUrlDomain = siteUrl.replace(/^https?:\/\//,'');

    const pathToExport = contentOnly ? 'wp-content' : '';

    const pr = execa('docker', [...this.dockerArgs!, 
      `
      rm -rf blip-export && 
      mkdir blip-export && 
      cp -r ./${pathToExport} ./blip-export/${pathToExport} &&
      cd blip-export && 
      wp db export bkp.sql > /dev/null && 
      find ./ -type f -print0 | xargs -0 sed -i 's|${siteUrl}|${exportSiteUrl}|g' && 
      find ./ -type f -print0 | xargs -0 sed -i 's|${SiteUrlSchemaless}|${exportSiteUrlSchemaless}|g' && 
      find ./ -type f -print0 | xargs -0 sed -i 's|${siteUrlDomain}|${exportSiteUrlDomain}|g' && 
      tar -czf tmp wp-content bkp.sql > /dev/null && 
      cat tmp`
      .replace('\n','').replace('\r','')],
      { env: this.machineEnvironment as any });
    
    pr.stdout.pipe(stream);

    await pr;
  }

  async importFromReadStream(stream:ReadStream, siteUrl: string):Promise<void>{
    await this.initialize();

    if(!/^(https?:\/\/[^\/]+)/.test(siteUrl))
      throw new Error(`Invalid site ulr format '${siteUrl}'`);

    siteUrl = /^(https?:\/\/[^\/]+)/.exec(siteUrl)![0];

    const SiteUrlSchemaless = siteUrl.replace(/^https?:/,'');
    const siteUrlDomain = siteUrl.replace(/^https?:\/\//,'');

    const pr = execa('docker', 
      [...this.dockerArgs!, 
      `
      rm -rf wp-content && 
      tar -xzf - &&  
      find ./ -type f -print0 | xargs -0 sed -i 's|${exportSiteUrlDomain}|${siteUrlDomain}|g' && 
      find ./ -type f -print0 | xargs -0 sed -i 's|${exportSiteUrlSchemaless}|${SiteUrlSchemaless}|g' &&
      find ./ -type f -print0 | xargs -0 sed -i 's|${exportSiteUrl}|${siteUrl}|g' && 
      wp db import bkp.sql && 
      rm bkp.sql`
      .replace('\n','').replace('\r','')],
      { env: this.machineEnvironment as any, input: stream, stdin: 'pipe'});

    await pr;
  }

  async extractPathToHostPath(containerPath:string, hostPath:string):Promise<void>{
    await this.initialize();

    const tmpFolder = `/tmp-copy-${Math.round(Math.random()*10000)}`;

    const dockerArgs = [...this.dockerArgs!];
    dockerArgs.splice(dockerArgs.indexOf('--volumes-from'), 0, '-v', `${hostPath}:${tmpFolder}`);
    dockerArgs[dockerArgs.indexOf('-u')+1] = '0';

    const pr = execa('docker', 
      [...dockerArgs, 
      `
      rm -rf blip-export && 
      cp -r ${containerPath}/* ${tmpFolder}`
      .replace('\n','').replace('\r','')],
      { env: this.machineEnvironment as any});

    await pr;
  }
}

export const WordpressCli:WordpressCliTool = new WordpressCliToolImpl();