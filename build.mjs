import {access} from 'node:fs/promises';
for(const f of ['index.html','styles.css','script.js','assets/MD_Bilayet_Hossain_CV.pdf']) await access('dist/'+f);
console.log('Static site ready in dist/');
