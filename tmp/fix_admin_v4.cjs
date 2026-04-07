
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Final cleanup: Remove redundant alert
content = content.replace(/alert\("Houve um erro ao gerar o PDF\. Verifique os dados do jogo e tente novamente\."\)\;/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Admin.tsx clean (v4) finished');
