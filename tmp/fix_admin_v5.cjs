
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replacement 1
const search1 = 'img.onerror = () => {\n            console.warn("Falha ao carregar imagem:", url);\n            resolve(null);\n          };';
const replace1 = 'img.onerror = () => { if(!resolved){ resolved=true; resolve(null); } };\n          setTimeout(() => { if(!resolved){ resolved=true; resolve(null); } }, 4500);';
if (content.indexOf(search1) !== -1) {
  content = content.replace(search1, replace1);
} else {
  console.log("Search 1 not found");
}

// Replacement 2
const search2 = 'if (leagueLogo) {\n        doc.addImage(leagueLogo, "AUTO", ML+2, Y+1, 18, hH-2);\n        doc.addImage(leagueLogo, "AUTO", PW-MR-17, Y+1, 15, hH-2);\n      } else {';
const replace2 = 'if (leagueLogo) {\n        try {\n          doc.addImage(leagueLogo, "AUTO", ML+2, Y+1, 18, hH-2);\n          doc.addImage(leagueLogo, "AUTO", PW-MR-17, Y+1, 15, hH-2);\n        } catch(e) { console.warn("Erro ao adicionar logo da liga"); }\n      } else {';
if (content.indexOf(search2) !== -1) {
  content = content.replace(search2, replace2);
} else {
  console.log("Search 2 not found");
}

fs.writeFileSync(path, content, 'utf8');
console.log('Final script (v5) finished');
