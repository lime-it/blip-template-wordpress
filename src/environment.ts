import { BlipConf } from '@lime.it/blip-core';
import { join } from 'path';

const packagePath = __dirname;

export const environment = {
    packagePath: packagePath,

    confPath: join(BlipConf.getWorkspaceRootPath(), ".wordpress"),
    assetsPath: join(packagePath,"../assets"),
    repoPath: join(BlipConf.getWorkspaceRootPath(), ".wordpress", "repo"),
    publishPath: join(BlipConf.getWorkspaceRootPath(), ".wordpress", "publish"),
    localExtWpPath: join(BlipConf.getWorkspaceRootPath(), 'wp-src'),
    machineWpPath: join('/home/docker/project', 'wp-src')
}