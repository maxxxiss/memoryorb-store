import {mkdir,cp} from 'node:fs/promises';
await mkdir('public',{recursive:true});
for(const file of ['index.html','logic.js','runtime.js','robots.txt','styles.css','app.js','success.html','assets','contact','privacy','terms','shipping-returns'])await cp(file,'public/'+file,{recursive:true});
