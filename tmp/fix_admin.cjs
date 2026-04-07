
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Separate merged lines (fix )) boundary)
content = content.replace(/\}\)\)\;\s+const generateSumulaPDF/g, '}));\n  };\n\n  const generateSumulaPDF');

// Fix 2: Remove corrupted fragment at line 652
content = content.replace(/\s+core\!\=\=\'\'\?data\.homeScore\:\'\-\'\} x \$\{data\.awayScore\!\=\=\'\'\?data\.awayScore\:\'\-\'\}\;/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed syntax errors in Admin.tsx (v2)');
