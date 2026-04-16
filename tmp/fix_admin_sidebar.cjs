const fs = require('fs');

const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchStr = `          <h2 className="font-display text-2xl text-white">ADMIN</h2>
        </div>
        <nav className="p-4 space-y-2">`;
        
const replaceStr = `          <h2 className="font-display text-2xl text-white">ADMIN</h2>
        </div>
        
        {/* User Profile Area */}
        <div className="px-6 py-4 border-b border-dark-border bg-dark/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)]">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Administrador LFE</p>
              <p className="text-xs text-gray-400">Acesso Master</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest mt-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
          </div>
        </div>

        <nav className="p-4 space-y-2">`;

if (content.indexOf(searchStr) !== -1) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Admin.tsx sidebar profile injected!');
} else {
  console.log('Search string not found. Maybe it is already there?');
}
