
const fs = require('fs');
const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// The new function definition - bulletproof, with error reporting and updated import
const newFunc = `  const generateSumulaPDF = async (sumulaData?: any) => {
    console.log("PDF generation triggered");
    try {
      const data = sumulaData || sumulaState;
      const gameId = sumulaData ? sumulaData.selectedGameId : sumulaState.selectedGameId;
      const game = games.find((g: any) => String(g.id) === String(gameId)) || selectedGame;
      
      if (!game) {
        alert("Erro: Jogo não encontrado no sistema. Selecione novamente.");
        return;
      }

      console.log("Iniciando geração de PDF para o jogo:", game.id);

      const hId = game.homeTeamId || game.home_team_id;
      const aId = game.awayTeamId || game.away_team_id;

      const homeTeam: any = teams.find((t: any) => String(t.id) === String(hId)) || { name: 'Equipe A' };
      const awayTeam: any = teams.find((t: any) => String(t.id) === String(aId)) || { name: 'Equipe B' };
      
      const homeAths = athletes.filter((a: any) =>
        String(a.teamId || a.team_id) === String(hId) && (!game.category || a.category === game.category));
      const awayAths = athletes.filter((a: any) =>
        String(a.teamId || a.team_id) === String(aId) && (!game.category || a.category === game.category));
      
      const evH: any[] = data.homeEvents || [];
      const evA: any[] = data.awayEvents || [];

      let doc;
      try {
        doc = new jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
      } catch (jspdfErr: any) {
        console.error("Falha ao instanciar jsPDF:", jspdfErr);
        alert("Erro crítico no jsPDF: " + jspdfErr.message);
        return;
      }

      const PW = 297, PH = 210, ML = 3, MR = 3, MT = 2, half = PW / 2;

      const loadImg = (url: string): Promise<HTMLImageElement | null> => {
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
      };

      const leagueLogo = await loadImg('/logos/logo.jpg') || (settings.leagueLogo ? await loadImg(settings.leagueLogo) : null);
      const homeLogoImg = homeTeam.logo ? await loadImg(homeTeam.logo) : null;
      const awayLogoImg = awayTeam.logo ? await loadImg(awayTeam.logo) : null;
      const sponsorLogoImg = await loadImg('/logos/logo-sesc.png');

      const cReg = 6, cName = 37, cNum = 5, cAm = 4, cVm = 4;
      const cFixed = cReg + cName + cNum + cAm + cVm; 
      const cSubs = 4, cSubW = 3.8, cSubsTotal = cSubs * cSubW; 
      const teamW = half - ML; 
      const cSepW = 1.2, numSeps = 2, numGols = 34;
      const cGolsArea = teamW - cFixed - cSubsTotal;
      const cGol = (cGolsArea - numSeps * cSepW) / numGols;

      const golNums: (number | '|')[] = [
        1,2,3,4,5,6,7,8,9,10,'|',
        11,12,13,14,15,16,17,18,19,20,'|',
        21,22,23,24,25,26,27,28,29,30,
        31,32,33,34
      ];

      const B = (x: number, y: number, w: number, h: number) => doc.rect(x, y, w, h, 'S');
      const F = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
        doc.setFillColor(r, g, b); doc.rect(x, y, w, h, 'F');
      };
      const FB = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
        doc.setFillColor(r, g, b); doc.rect(x, y, w, h, 'FD');
      };
      const T = (s: string, x: number, y: number, size = 6, bold = false,
                 align: 'left'|'center'|'right' = 'left', col: [number,number,number] = [0,0,0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(col[0], col[1], col[2]); doc.text(String(s || ''), x, y, { align });
      };
      const VL = (x: number, y: number, h: number) => doc.line(x, y, x, y + h);

      doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);

      let Y = MT, hH = 10;
      FB(ML, Y, PW-ML-MR, hH, 15, 15, 15);
      T('LIGA DE FUTSAL ESCOLAR — GARANHUNS/PE', ML+25, Y+6.5, 12, true, 'left', [204,255,0]);
      T('Súmula de Futsal', half+45, Y+6.5, 12, true, 'left', [255,255,255]);
      
      if (leagueLogo) {
        try {
          doc.addImage(leagueLogo, "AUTO", ML+2, Y+1, 18, hH-2);
          doc.addImage(leagueLogo, "AUTO", PW-MR-17, Y+1, 15, hH-2);
        } catch(e) { console.warn("Erro ao renderizar logo liga"); }
      } else {
        FB(PW-MR-17, Y+1, 15, hH-2, 180, 0, 0); T('LOGO', PW-MR-9.5, Y+6, 5, true, 'center', [255,255,255]);
      }
      Y += hH;

      const iH = 4.2;
      B(ML, Y, PW-ML-MR, iH); VL(half, Y, iH); VL(PW-MR-55, Y, iH);
      T('CAMPEONATO: Liga de Futsal Escolar 2026', ML+1, Y+3, 5.5);
      T('Jogo Nº: '+(game.id||'___'), half+1, Y+3, 5.5);
      T('Horário: '+(game.time||'__:__'), PW-MR-54, Y+3, 5.5);
      Y += iH;
      B(ML, Y, PW-ML-MR, iH);
      VL(ML+18, Y, iH); VL(ML+82, Y, iH); VL(ML+98, Y, iH); VL(ML+112, Y, iH); VL(half+1, Y, iH); VL(half+58, Y, iH);
      T('Etapa:', ML+1, Y+3, 5); T('LOCAL: '+(game.location||'____'), ML+19, Y+3, 5);
      T('Divisão', ML+83, Y+3, 5); T('Fase: '+(game.category||'__'), ML+99, Y+3, 5);
      T('Data: '+(game.date||'__/__/__'), half+2, Y+3, 5); T('Naipe: Futsal Escolar', half+59, Y+3, 5);
      Y += iH;
      B(ML, Y, PW-ML-MR, iH); VL(ML+38, Y, iH); VL(half-10, Y, iH); VL(half+1, Y, iH);
      T('Futsal', ML+1, Y+3, 5); T('CHAVE: '+(game.category||'__'), ML+39, Y+3, 5);
      T('Estado: PE', half-9, Y+3, 5); T('Município: Garanhuns/PE', half+2, Y+3, 5);
      Y += iH;

      const tbH = 16; FB(ML, Y, teamW, tbH, 245,245,245); FB(half, Y, teamW, tbH, 245,245,245);
      doc.setFillColor(255,255,255); doc.ellipse(half, Y+8, 8, 5, 'FD'); T('X', half, Y+10, 14, true, 'center');
      T('Equipe [A]', ML+1, Y+4, 6, true);
      if (homeLogoImg) try { doc.addImage(homeLogoImg, "AUTO", ML+2, Y+5, 10, 10); } catch(e){}
      T(homeTeam.name, ML+13, Y+10, 9, true, 'left', [0,0,120]);
      T('Saída', ML+1, Y+15, 4.5); doc.setDrawColor(80,80,80); doc.circle(ML+12, Y+14.2, 1.3, 'S'); doc.setDrawColor(0,0,0);
      T('Equipe [B]', PW-MR-1, Y+4, 6, true, 'right');
      if (awayLogoImg) try { doc.addImage(awayLogoImg, "AUTO", PW-MR-12, Y+5, 10, 10); } catch(e){}
      T(awayTeam.name, PW-MR-14, Y+10, 9, true, 'right', [120,0,0]);
      T('Saída', PW-MR-14, Y+15, 4.5, false, 'right'); doc.setDrawColor(80,80,80); doc.circle(PW-MR-16, Y+14.2, 1.3, 'S'); doc.setDrawColor(0,0,0);
      Y += tbH;

      const toH = 8;
      const drawTO = (sx: number, lbl: string) => {
        B(sx, Y, teamW, toH); T('Pedidos de Tempo '+lbl, sx+1, Y+2.5, 4.5, true);
        B(sx, Y+3, 22, 5); T('1º Período', sx+1, Y+6.5, 4); B(sx+22, Y+3, 22, 5); T('2º Período', sx+23, Y+6.5, 4);
        if (sponsorLogoImg) try { doc.addImage(sponsorLogoImg, "AUTO", sx+47, Y+0.5, 22, toH-1); } catch(e){}
        T('Faltas Acumulativas', sx+73, Y+2, 4.5, true); T('1º Per.:', sx+73, Y+5, 4); for(let i=0;i<5;i++) B(sx+90+i*5, Y+3, 4.5, 2.5);
        T('2º Per.:', sx+73, Y+7.3, 4); for(let i=0;i<5;i++) B(sx+90+i*5, Y+5.8, 4.5, 2);
      };
      drawTO(ML, '[A]'); drawTO(half, '[B]');
      Y += toH;
      const tlH = 4; B(ML, Y, teamW, tlH); B(half, Y, teamW, tlH); T('Técnico:', ML+1, Y+3, 5, true); T('Técnico:', half+1, Y+3, 5, true);
      Y += tlH;

      const chH = 6, DK: [number,number,number] = [30,30,30];
      const drawHdrs = (sx: number) => {
        let x = sx; const cy = Y;
        const hc = (w: number, tx: string, col: [number,number,number]=[255,255,255]) => {
          FB(x, cy, w, chH, DK[0], DK[1], DK[2]); T(tx, x+0.5, cy+chH/2+1.5, 3.5, true, 'left', col); x += w;
        };
        hc(cReg,'Reg'); hc(cName,'ATLETAS'); hc(cNum,'nº'); hc(cAm,'Am',[255,200,0]); hc(cVm,'Vm',[255,70,70]);
        const gX0 = x, totGW = cGolsArea; FB(gX0, cy, totGW, chH/2, DK[0], DK[1], DK[2]); T('GOLS', gX0+totGW/2, cy+chH/4+1, 4, true, 'center', [255,255,255]);
        let gx = gX0; const ny = cy+chH/2, nh = chH/2;
        for (const gn of golNums) {
          if (gn=== '|') { FB(gx,ny,cSepW,nh,50,50,50); gx+=cSepW; }
          else { const bg: [number,number,number] = (Number(gn)%2===0?[230,230,230]:[255,255,255]); FB(gx, ny, cGol, nh, bg[0], bg[1], bg[2]); T(String(gn), gx+cGol/2, ny+nh-0.5, 3, false, 'center'); gx += cGol; }
        }
        x = gx; FB(x, cy, cSubsTotal, chH, DK[0], DK[1], DK[2]); T('SUBST.', x+cSubsTotal/2, cy+chH/2+1.5, 3.5, true, 'center', [255,255,255]);
      };
      drawHdrs(ML); drawHdrs(half);
      Y += chH;

      const rH = 4.3, maxR = 18;
      const drawRow = (sx: number, ath: any, evts: any[], idx: number) => {
        const rb: [number,number,number] = idx%2===0 ? [255,255,255] : [246,246,246];
        let x = sx; FB(x, Y, cReg, rH, rb[0], rb[1], rb[2]); x += cReg; FB(x, Y, cName, rH, rb[0], rb[1], rb[2]);
        if(ath) T(ath.name, x+0.5, Y+rH/2+1.2, 4.3); x += cName; FB(x, Y, cNum, rH, rb[0], rb[1], rb[2]);
        if(ath) T(String(ath.number||''), x+cNum/2, Y+rH/2+1.2, 4.8, true, 'center'); x += cNum;
        FB(x, Y, cAm, rH, rb[0], rb[1], rb[2]); if(ath){ const n=evts.filter(e=>e.type==='amarelo'&&String(e.playerId)===String(ath.id)).length; if(n>0){FB(x+0.3,Y+0.3,cAm-0.6,rH-0.6,255,200,0);T(String(n),x+cAm/2,Y+rH/2+1.2,4.8,true,'center');} } x += cAm;
        FB(x, Y, cVm, rH, rb[0], rb[1], rb[2]); if(ath){ const n=evts.filter(e=>e.type==='vermelho'&&String(e.playerId)===String(ath.id)).length; if(n>0){FB(x+0.3,Y+0.3,cVm-0.6,rH-0.6,210,20,20);T('V',x+cVm/2,Y+rH/2+1.2,4.8,true,'center',[255,255,255]);} } x += cVm;
        const tg = ath ? evts.filter(e=>e.type==='gol'&&String(e.playerId)===String(ath.id)).length : 0;
        let gi = 0; for(const gn of golNums) { if(gn==='|'){ FB(x,Y,cSepW,rH,200,200,200); x+=cSepW; } else { gi++; const mk = tg>=gi; if(mk) FB(x, Y, cGol, rH, 20, 160, 20); else FB(x, Y, cGol, rH, rb[0], rb[1], rb[2]); if(mk) T('●', x+cGol/2, Y+rH/2+1.2, 2.8, false, 'center', [255,255,255]); x += cGol; } }
        for(let s=0;s<cSubs;s++){ FB(x,Y,cSubW,rH,rb[0],rb[1],rb[2]); x+=cSubW; }
      };
      for(let r=0;r<maxR;r++) { drawRow(ML, homeAths[r]||null, evH, r); drawRow(half, awayAths[r]||null, evA, r); Y += rH; }

      const stH = 3.6;
      ['Técnico:','Aux. Técnico:','Prep. Físico:','Atendente:','Fisioterapeuta:','Supervisor:'].forEach((label, i) => {
        [ML, half].forEach(sx => { let x = sx; FB(x,Y,cReg,stH,250,250,250); x+=cReg; FB(x,Y,cName,stH,250,250,250); T(label,x+0.5,Y+stH/2+1,4); x+=cName; FB(x,Y,cNum,stH,250,250,250); x+=cNum; FB(x,Y,cAm,stH,250,250,250); x+=cAm; FB(x,Y,cVm,stH,250,250,250); x+=cVm; for(const gn of golNums){ if(gn==='|'){FB(x,Y,cSepW,stH,200,200,200);x+=cSepW;} else{FB(x,Y,cGol,stH,250,250,250);x+=cGol;} } for(let s=0;s<cSubs;s++){FB(x,Y,cSubW,stH,250,250,250);x+=cSubW;} });
        Y += stH;
      });

      const fY = Y, fH = PH - 2 - fY; FB(ML, fY, PW-ML-MR, fH, 240,240,240);
      const arb = [['ÁRBITRO 1:', data.referee],['ÁRBITRO 2:', data.assistant1],['ANOTADOR:', data.assistant2]];
      let aY = fY+5; arb.forEach(([l, v]) => { B(ML,aY,82,4.2); T(l,ML+1,aY+3,5,true); T(v||'__________________',ML+34,aY+3,5); aY+=4.2; });
      const hX = ML+83, hW = 72, hCW = hW/3; T('HORÁRIO', hX+hW/2, fY+3.5, 5.5, true, 'center');
      const wn = (data.homeScore!==''&&data.awayScore!=='') ? (Number(data.homeScore)>Number(data.awayScore)?homeTeam.name:Number(data.awayScore)>Number(data.homeScore)?awayTeam.name:'EMPATE') : '';
      FB(hX,fY+10,hW,5,20,20,20); T('VENCEDOR: '+wn,hX+1,fY+13.5,5,true,'left', [204, 255, 0]);
      
      doc.setFontSize(4); doc.setTextColor(160,160,160);
      doc.text('Liga de Futsal Escolar — '+new Date().toLocaleDateString('pt-BR'), half, PH-1, {align:'center'});
      doc.save("sumula.pdf");
      console.log("PDF finalizado!");
    } catch (err: any) {
      console.error("ERRO GERAL:", err);
      alert("ERRO CRÍTICO AO GERAR: " + err.message + "\\nVeja o console (F12).");
    }
  };`;

const startPattern = /  const generateSumulaPDF = async \(sumulaData\?\: any\) \=\> \{/;
const endLine = '  };'; // We assume the function ends here based on view_file

// Use index-based replacement to avoid greedy regex
const startIdx = content.indexOf('  const generateSumulaPDF = async (sumulaData?: any) => {');
const nextDataLine = content.indexOf('  const DataTable = ({ title, data, columns, onAdd, onEdit, onDelete, onMoveUp, onMoveDown, extraActions }: any) => (');

if (startIdx !== -1 && nextDataLine !== -1) {
  content = content.substring(0, startIdx) + newFunc + '\n\n' + content.substring(nextDataLine);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Admin.tsx function REPLACED via direct substring. Refresh your browser!');
} else {
  console.log('Start index:', startIdx, 'End index:', nextDataLine);
}
