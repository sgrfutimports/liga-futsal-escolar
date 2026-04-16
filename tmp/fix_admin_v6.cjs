
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use regex with whitespace sensitivity
content = content.replace(/img\.onerror\s*\=\s*\(\)\s*\=\>\s*\{[\s\S]+?resolve\(null\)\;\s+\}\;/g, 
  'img.onerror = () => { if(!resolved){ resolved=true; resolve(null); } };\n          setTimeout(() => { if(!resolved){ resolved=true; resolve(null); } }, 4500);');

content = content.replace(/if\s*\(leagueLogo\)\s*\{[\s\S]+?doc\.addImage[\s\S]+?else\s*\{/g, 
  'if (leagueLogo) {\n        try {\n          doc.addImage(leagueLogo, "AUTO", ML+2, Y+1, 18, hH-2);\n          doc.addImage(leagueLogo, "AUTO", PW-MR-17, Y+1, 15, hH-2);\n        } catch(e) { console.warn("Erro ao adicionar logo da liga"); }\n      } else {');

fs.writeFileSync(path, content, 'utf8');
console.log('Final script (v6) finished');
