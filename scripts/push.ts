import { spawn } from 'node:child_process';
import { rm, writeFile } from 'node:fs/promises';
import { argv } from 'node:process';
    
const main = async () => 
{
  const rootDir = './src';
  let scriptId = '';

  switch (argv[2]) 
  {
  case 'prod':
  {
    console.log('Push production');
    scriptId = '1zmQlgHC_WrKotSoCmIAPFXM5R2R9PFUAMoBswzZTLqL4wbJknkvyxAYd';
    break;
  }

  case 'dev':
  {
    console.log('Push development');
    scriptId = '1zmQlgHC_WrKotSoCmIAPFXM5R2R9PFUAMoBswzZTLqL4wbJknkvyxAYd';
    break;
  }
      
  default:
  {
    throw Error('argument 1 must be "dev" or "prod"');
  }
  }
  
  await writeFile('.clasp.json', JSON.stringify({ scriptId, rootDir }));

  const npx = /^win/.test(process.platform) ? 'npx.cmd' : 'npx';
  const stream = spawn(npx, [ 'clasp', 'push' ]);

  if(stream.stdout)
  {
    stream.stdout.on('data', d => console.log(d + ''));
    stream.stdout.on('error', e => console.error(e + ''));
    // stream.stdout.on('end', () => rm('.clasp.json'));
  }

};

main();