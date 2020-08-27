import fetch = require('node-fetch');
import { DockerPsResult, BlipWorkspace, DockerMachineListResult } from '@lime.it/blip-core';

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