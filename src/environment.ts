import { BlipConf } from '@lime.it/blip-core';
import { join } from 'path';

const packagePath = __dirname;

export const environment = {
    packagePath: packagePath,

    confPath: join(BlipConf.getWorkspaceRootPath(), ".wordpress"),
    assetsPath: join(packagePath,"../assets")
}