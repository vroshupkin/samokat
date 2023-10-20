import { rm, writeFile, readdir, rmdir } from 'node:fs/promises';



const is_file_ext = (name: string, ext: string)  => 
    new RegExp(`.*\.${ext}$`).test(name);



const main =  async () => 
{
    const excludes = ['Constants.ts', 'Tools.ts', 'Triggers.ts'];

    (await readdir('./src', {withFileTypes: true}))
     .filter(d => !excludes.includes(d.name))
     .forEach(d => rm(`./src/${d.name}`, {recursive: true, force: true}));

     await rm('./test', {force: true, recursive: true});

}

main();

