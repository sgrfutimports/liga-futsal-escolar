
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Robust replace for loadImg
const newLoadImg = `      const loadImg = (url: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!url) { resolve(null); return; }
          const img = new Image();
          img.crossOrigin = "anonymous";
          let resolved = false;
          img.onload = () => { if(!resolved){ resolved=true; resolve(img); } };
          img.onerror = () => { if(!resolved){ resolved=true; resolve(null); } };
          setTimeout(() => { if(!resolved){ resolved=true; resolve(null); } }, 4000);
          img.src = url;
        });
      };`;

content = content.replace(/const loadImg = \(url: string\) \=\> \{[\s\S]+?return new Promise\(\(resolve\) \=\> \{[\s\S]+?\}\)\;\s+\}\;/g, newLoadImg);

// Fix addImage formats
content = content.replace(/doc\.addImage\(\s*leagueLogo\s*,\s*['"]JPEG['"]\s*/g, 'doc.addImage(leagueLogo, "AUTO"');
content = content.replace(/doc\.addImage\(\s*homeLogoImg\s*,\s*['"]PNG['"]\s*/g, 'doc.addImage(homeLogoImg, "AUTO"');
content = content.replace(/doc\.addImage\(\s*awayLogoImg\s*,\s*['"]PNG['"]\s*/g, 'doc.addImage(awayLogoImg, "AUTO"');
content = content.replace(/doc\.addImage\(\s*sponsorLogoImg\s*,\s*['"]PNG['"]\s*/g, 'doc.addImage(sponsorLogoImg, "AUTO"');

// Error reporting
content = content.replace(/\} catch \(error\) \{(\s*)console\.error\("Erro crítico ao gerar PDF:"/g, '} catch (error: any) {$1console.error("Erro crítico ao gerar PDF:", error);\n      alert("Erro ao gerar PDF: " + (error.message || "Erro desconhecido"));');

fs.writeFileSync(path, content, 'utf8');
console.log('Admin.tsx recovery script (v3) finished');
