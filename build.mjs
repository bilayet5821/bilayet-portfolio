import {cp, copyFile, mkdir, rm} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=dirname(fileURLToPath(import.meta.url));
const outputDirectory=join(projectRoot,'dist');
const staticFiles=['index.html','styles.css','script.js','.nojekyll'];

if(dirname(outputDirectory)!==projectRoot){
  throw new Error('Refusing to clean an output directory outside the project root.');
}

await rm(outputDirectory,{recursive:true,force:true});
await mkdir(outputDirectory,{recursive:true});
await Promise.all(staticFiles.map(file=>copyFile(join(projectRoot,file),join(outputDirectory,file))));
await cp(join(projectRoot,'assets'),join(outputDirectory,'assets'),{recursive:true});

console.log('Static site generated in dist/ from the root source files.');
