const admZip = require('adm-zip');

const zip = new admZip();

const folderToZip = './extension-code';
const destZipPath = './zip/search-tabs-title.zip';

console.log(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              CREATE ZIP
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`);

console.log(`ZIP the folder: '${folderToZip}'...`);
console.log(`to: '${destZipPath}'...`);

zip.addLocalFolder(folderToZip);

zip.writeZip(destZipPath, () => console.log(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  DONE!
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`));