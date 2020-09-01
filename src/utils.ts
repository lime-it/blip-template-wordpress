import { environment } from './environment';
import fetch = require('node-fetch');
import { DockerPsResult, BlipWorkspace, DockerMachineListResult } from '@lime.it/blip-core';
import { pathExists, mkdirp, readFile } from 'fs-extra';
import { join } from 'path';
import * as YAML from 'yaml';

export async function getDockerImageTags(imageName:string, filter?:RegExp):Promise<string[]>{
  let names = ((await fetch.default(`https://registry.hub.docker.com/v1/repositories/${imageName}/tags`)
    .then(r=>r.json())) as {name: string}[]);
  if(!!filter)
    names = names.filter(p => filter.test(p.name));
  return names
    .map(p => p.name)
    .reverse();
}

export interface WorkspaceTaskContext {
  workspace:BlipWorkspace
}

export interface MachineListTaskContext {
  machineList:DockerMachineListResult[]
}

export interface DockerComposeTaskContext {
  containers:DockerPsResult[]
}

export interface TemplateConfig{
  images:{
    nginx:{tag:string},
    wordpress:{tag:string},
    'wordpress-cli':{tag:string},
    mysql:{tag:string, above5:boolean},
  }
  domain?: string;
  database:{randomPassword:string}
}

export async function isExtWordpressSrcAvailable(): Promise<boolean> {
  return await pathExists(environment.localExtWpPath) &&
    await pathExists(join(environment.localExtWpPath, "index.php")) &&
    await pathExists(join(environment.localExtWpPath, "wp-config.php")) &&
    await pathExists(join(environment.localExtWpPath, "wp-includes")) &&
    await pathExists(join(environment.localExtWpPath, "wp-content")) &&
    await pathExists(join(environment.localExtWpPath, "wp-admin"));
}

export async function isWorkingAsExtracted():Promise<boolean> {
  const composePath = join(environment.confPath, "docker-compose.yml");
  const dockerCompose = YAML.parse(await readFile(composePath, 'utf8'));
      
  const volumes:string[] = dockerCompose.services.wordpress.volumes = dockerCompose.services.wordpress.volumes || [];

  return !!volumes.find(p => p.includes(':/var/www/html'));
}