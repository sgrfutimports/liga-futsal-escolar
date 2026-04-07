const fs = require('fs');

const funcContent = `  const generateSumulaPDF = async (sumulaData?: any) => {
    try {
      const data = sumulaData || sumulaState;
      const gameId = sumulaData ? sumulaData.selectedGameId : sumulaState.selectedGameId;
      const game = games.find((g: any) => String(g.id) === String(gameId)) || selectedGame;
      
      if (!game) {
        alert("Erro: Jogo não encontrado no sistema. Selecione novamente.");
        return;
      }

      const hId = game.homeTeamId || game.home_team_id;
      const aId = game.awayTeamId || game.away_team_id;

      const homeTeam: any = teams.find((t: any) => String(t.id) === String(hId)) || { name: 'Equipe A' };
      const awayTeam: any = teams.find((t: any) => String(t.id) === String(aId)) || { name: 'Equipe B' };
      
      const homeAths = athletes.filter((a: any) => String(a.teamId || a.team_id) === String(hId) && (!game.category || a.category === game.category));
      const awayAths = athletes.filter((a: any) => String(a.teamId || a.team_id) === String(aId) && (!game.category || a.category === game.category));
      
      const evH: any[] = data.homeEvents || [];
      const evA: any[] = data.awayEvents || [];

      let doc;
      try {
        doc = new window.jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
      } catch (e) {
        doc = new jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
      }

      const loadImg = (url: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!url) { resolve(null); return; }
          const img = new window.Image();
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

      const PW = 297, PH = 210, ML = 5, MR = 5, MT = 5, MB = 5;
      const wD = PW - ML - MR;
      
      const B = (x: number, y: number, w: number, h: number) => doc.rect(x, y, w, h, 'S');
      const F = (x: number, y: number, w: number, h: number, c: [number,number,number]) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'F'); };
      const FB = (x: number, y: number, w: number, h: number, c: [number,number,number]) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'FD'); };
      const T = (s: string, x: number, y: number, size = 6, bold = false, align: 'left'|'center'|'right' = 'left', c: [number,number,number] = [0,0,0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setTextColor(...c); doc.text(String(s || ''), x, y, { align });
      };
      const VL = (x: number, y: number, h: number) => doc.line(x, y, x, y + h);

      doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);

      // Main Outer Border
      B(ML, MT, wD, PH - MT - MB);

      let Y = MT, hH = 14;
      let w1 = wD * 0.55, w2 = wD * 0.25, w3 = wD * 0.20;

      // ROW 1
      B(ML, Y, wD, hH); VL(ML + w1, Y, hH); VL(ML + w1 + w2, Y, hH);
      T('LIGA DE FUTSAL ESCOLAR', ML + w1/2, Y + 9, 14, true, 'center');
      T('Súmula de FUTSAL', ML + w1 + w2/2, Y + 9, 11, true, 'center');
      if (leagueLogo) {
        try { doc.addImage(leagueLogo, "AUTO", ML + w1 + w2 + w3/2 - 5, Y + 1, 10, hH - 2); } catch(e){}
      } else {
        T('LOGO', ML + w1 + w2 + w3/2, Y + 9, 9, true, 'center');
      }
      Y += hH; hH = 5;

      // ROW 2
      B(ML, Y, wD, hH); VL(ML + w1, Y, hH); VL(ML + w1 + w2, Y, hH);
      T('CAMPEONATO:', ML + 1, Y + 3.5, 6, true);
      T('Jogo Nº: ' + (game.id||'____'), ML + w1 + 1, Y + 3.5, 6, true);
      T('Horário: ' + (game.time||'__:__'), ML + w1 + w2 + 1, Y + 3.5, 6, true);
      Y += hH;

      // ROW 3
      B(ML, Y, wD, hH);
      let cw = w1 / 4;
      VL(ML + cw, Y, hH); VL(ML + cw*3, Y, hH); VL(ML + w1, Y, hH);
      T('Etapa:', ML + 1, Y + 3.5, 5); T('LOCAL: ' + (game.location||''), ML + cw + 1, Y + 3.5, 5, true);
      T('Divisão:', ML + cw*3 + 1, Y + 3.5, 5); T('Fase: ' + (game.category||''), ML + w1 - 20, Y + 3.5, 5, true);
      VL(ML + w1 + w2, Y, hH); T('Data: ' + (game.date||'__/__/__'), ML + w1 + 1, Y + 3.5, 5, true);
      T('Naipe: Futsal Escolar', ML + w1 + w2 + 1, Y + 3.5, 5, true);
      Y += hH;

      // ROW 4
      B(ML, Y, wD, hH); VL(ML + cw, Y, hH); VL(ML + cw*3, Y, hH); VL(ML + w1, Y, hH);
      T('Futsal', ML + 1, Y + 3.5, 5, true); T('CHAVE: ' + (game.category||''), ML + cw*3 + 1, Y + 3.5, 5, true);
      T('Estado:', ML + w1 + 1, Y + 3.5, 5, true); T('PERNAMBUCO', ML + w1 + w2 + w3/2, Y + 3.5, 6, true, 'center');
      Y += hH;

      // ROW 5 Teams
      hH = 8; B(ML, Y, wD, hH);
      let midW = 15; let tW = (wD - midW) / 2;
      VL(ML + tW, Y, hH); VL(PW - MR - tW, Y, hH);
      T('Equipe [A]', ML + 1, Y + 3, 5, true);
      if (homeLogoImg) try { doc.addImage(homeLogoImg, "AUTO", ML + 20, Y + 1, 6, 6); } catch(e){}
      T(homeTeam.name, ML + 30, Y + 5.5, 8, true);
      T('Saída O', ML + 1, Y + 7, 5);
      
      doc.setFillColor(255,255,255); doc.ellipse(ML + tW + midW/2, Y + 4, 6, 3, 'F');
      T('X', ML + tW + midW/2, Y + 6, 12, true, 'center');
      
      T('Equipe [B]', PW - MR - tW + 1, Y + 3, 5, true);
      if (awayLogoImg) try { doc.addImage(awayLogoImg, "AUTO", PW - MR - tW + 20, Y + 1, 6, 6); } catch(e){}
      T(awayTeam.name, PW - MR - tW + 30, Y + 5.5, 8, true);
      T('Saída O', PW - MR - tW + 1, Y + 7, 5);
      Y += hH;

      // ROW 6 Timeouts
      hH = 10;
      const drawTO = (sx: number, lbl: string) => {
        B(sx, Y, tW * 0.35, hH); B(sx, Y, tW * 0.35, 4);
        T('Pedidos de Tempo Equipe ' + lbl, sx + 1, Y + 3, 4, true);
        T('1º Período', sx + 1, Y + 6, 4); B(sx + 15, Y + 4.5, 12, 2.5);
        T('2º Período', sx + 1, Y + 9, 4); B(sx + 15, Y + 7.5, 12, 2.5);
        
        B(sx + tW * 0.35, Y, tW * 0.25, hH);
        if (sponsorLogoImg) try { doc.addImage(sponsorLogoImg, "AUTO", sx + tW*0.35 + 2, Y + 1, tW*0.25 - 4, hH - 2); } catch(e){}
        
        B(sx + tW * 0.6, Y, tW * 0.4 + midW/2, hH); B(sx + tW * 0.6, Y, tW * 0.4 + midW/2, 4);
        T('Faltas Acumulativas', sx + tW * 0.6 + (tW*0.4+midW/2)/2, Y + 3, 4, true, 'center');
        T('1º Período', sx + tW * 0.6 + 1, Y + 6, 4);
        for(let i=0; i<5; i++) B(sx + tW * 0.6 + 15 + i*5.5, Y + 4.5, 5, 2.5);
        T('2º Período', sx + tW * 0.6 + 1, Y + 9, 4);
        for(let i=0; i<5; i++) B(sx + tW * 0.6 + 15 + i*5.5, Y + 7.5, 5, 2.5);
      };
      drawTO(ML, '[A]'); drawTO(PW - MR - tW - midW/2, '[B]');
      Y += hH;

      // ROW 7 Capitão
      hH = 5;
      B(ML, Y, tW + midW/2, hH); B(PW - MR - tW - midW/2, Y, tW + midW/2, hH);
      T('Técnico:________________________ Capitão:___________________', ML + 1, Y + 3.5, 5, true);
      T('Técnico:________________________ Capitão:___________________', PW - MR - tW - midW/2 + 1, Y + 3.5, 5, true);
      Y += hH;

      // Tables
      let thH = 6;
      let offLeft = ML, offRight = PW - MR - tW - midW/2;
      let wT = tW + midW/2; // width of each table side = 135
      // Columns: registro (15), ATLETAS (60), n (8), Am (5), Vm (5), GOLS (12), SUBST (30) => total 135
      let cwCol = { r: 15, a: 52, n: 8, am: 5, vm: 5, g: 12, s: 38 }; // Sum = 135
      
      const drawTh = (sx: number) => {
        let x = sx;
        B(x, Y, cwCol.r, thH); T('registro', x + cwCol.r/2, Y + 4, 5, false, 'center'); x += cwCol.r;
        B(x, Y, cwCol.a, thH); T('ATLETAS', x + cwCol.a/2, Y + 4, 5, true, 'center'); x += cwCol.a;
        B(x, Y, cwCol.n, thH); T('nº', x + cwCol.n/2, Y + 4, 5, true, 'center'); x += cwCol.n;
        B(x, Y, cwCol.am, thH); T('Am', x + cwCol.am/2, Y + 4, 4, false, 'center'); x += cwCol.am;
        B(x, Y, cwCol.vm, thH); T('Vm', x + cwCol.vm/2, Y + 4, 4, false, 'center'); x += cwCol.vm;
        B(x, Y, cwCol.g, thH/2); T('GOLS', x + cwCol.g/2, Y + 2.5, 4, true, 'center'); 
        VL(x + cwCol.g/2, Y + thH/2, thH/2); x += cwCol.g;
        B(x, Y, cwCol.s, thH/2); T('SUBSTITUIÇÕES', x + cwCol.s/2, Y + 2.5, 4, true, 'center');
        let nSub = Math.floor(cwCol.s / 3.8); // about 10 sub cols
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y + thH/2, thH/2);
      };
      drawTh(offLeft); drawTh(offRight);
      Y += thH;

      let rH = 6.4;
      let goalIndex = 0;
      
      const drawRow = (sx: number, ath: any, evts: any[]) => {
        let x = sx;
        B(x, Y, cwCol.r, rH); x += cwCol.r;
        B(x, Y, cwCol.a, rH); if(ath) T(ath.name.substring(0, 30), x + 1, Y + 4, 5); x += cwCol.a;
        B(x, Y, cwCol.n, rH); if(ath) T(String(ath.number||''), x + cwCol.n/2, Y + 4, 6, true, 'center'); x += cwCol.n;
        
        let amC = ath ? evts.filter(e=>e.type==='amarelo'&&String(e.playerId)===String(ath.id)).length : 0;
        let vmC = ath ? evts.filter(e=>e.type==='vermelho'&&String(e.playerId)===String(ath.id)).length : 0;
        B(x, Y, cwCol.am, rH); if(amC>0) { FB(x,Y,cwCol.am,rH,[255,200,0]); T(String(amC), x+cwCol.am/2, Y+4, 5, true, 'center'); } x += cwCol.am;
        B(x, Y, cwCol.vm, rH); if(vmC>0) { FB(x,Y,cwCol.vm,rH,[230,0,0]); T('V', x+cwCol.vm/2, Y+4, 5, true, 'center',[255,255,255]); } x += cwCol.vm;
        
        B(x, Y, cwCol.g, rH); VL(x + cwCol.g/2, Y, rH); doc.line(x, Y + rH/2, x + cwCol.g, Y + rH/2);
        T(String(goalIndex+1), x + cwCol.g/4, Y + 2.5, 4, false, 'center');
        T(String(goalIndex+2), x + cwCol.g*0.75, Y + 2.5, 4, false, 'center');
        T(':', x + cwCol.g/4, Y + rH - 1, 4, false, 'center'); T(':', x + cwCol.g*0.75, Y + rH - 1, 4, false, 'center');
        x += cwCol.g;
        
        B(x, Y, cwCol.s, rH); doc.line(x, Y + rH/2, x + cwCol.s, Y + rH/2);
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y, rH);
      };

      for(let r=0; r<14; r++) {
        let sY = Y, giOrig = goalIndex;
        drawRow(offLeft, homeAths[r]||null, evH);
        goalIndex = giOrig; // Left and Right share the same numbered layout (1 to x down both sides)
        drawRow(offRight, awayAths[r]||null, evA);
        goalIndex += 2;
        Y += rH;
      }

      // Staff rows (6)
      rH = 5.2;
      const drawStaffRow = (sx: number, label: string) => {
        let x = sx;
        B(x, Y, cwCol.r, rH); x += cwCol.r;
        B(x, Y, cwCol.a, rH); T(label, x + 1, Y + 3.5, 4.5); x += cwCol.a;
        B(x, Y, cwCol.n, rH); x += cwCol.n;
        B(x, Y, cwCol.am, rH); x += cwCol.am;
        B(x, Y, cwCol.vm, rH); x += cwCol.vm;
        B(x, Y, cwCol.g, rH); VL(x + cwCol.g/2, Y, rH); doc.line(x, Y + rH/2, x + cwCol.g, Y + rH/2);
        T(String(goalIndex+1), x + cwCol.g/4, Y + 2, 4, false, 'center');
        T(String(goalIndex+2), x + cwCol.g*0.75, Y + 2, 4, false, 'center');
        T(':', x + cwCol.g/4, Y + rH - 0.5, 4, false, 'center'); T(':', x + cwCol.g*0.75, Y + rH - 0.5, 4, false, 'center');
        x += cwCol.g;
        B(x, Y, cwCol.s, rH); doc.line(x, Y + rH/2, x + cwCol.s, Y + rH/2);
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y, rH);
      };

      const staffs = ['Técnico:', 'Aux. Técnico:', 'Prep. Físico:', 'Atendente:', 'Fisioterapeuta:', 'SUPERVISOR:'];
      for(let r=0; r<6; r++) {
        let sY = Y, giOrig = goalIndex;
        drawStaffRow(offLeft, staffs[r]);
        goalIndex = giOrig;
        drawStaffRow(offRight, staffs[r]);
        goalIndex += 2;
        Y += rH;
      }

      // Arbitragem
      B(ML, Y, wD, PH - MB - Y);
      let fH = (PH - MB - Y) / 6;
      T('Equipe de Arbitragem:', ML + 20, Y + 3, 5, true, 'center');
      let arbW = 80;
      VL(ML + arbW, Y, PH - MB - Y);
      const arb = [['ÁRBITRO 1:', data.referee], ['ÁRBITRO 2:', data.assistant1], ['ANOTADOR:', data.assistant2], ['CRONOMETRISTA:', ''], ['REPRESENTANTE:', '']];
      let aY = Y + fH;
      arb.forEach(([l, v], i) => {
        B(ML, aY, arbW, fH); T(l, ML + 1, aY + 3.5, 4.5, true); T(v||'______________________________', ML + 28, aY + 3.5, 5);
        aY += fH;
      });

      let hW = 100;
      VL(ML + arbW + hW, Y, PH - MB - Y);
      
      let cy = Y;
      B(ML + arbW, cy, hW, fH);
      let s2 = hW / 3;
      VL(ML + arbW + s2, cy, fH); VL(ML + arbW + s2*2, cy, fH);
      T('HORÁRIO', ML + arbW + s2/2, cy + 3.5, 4.5, true, 'center'); T('INÍCIO', ML + arbW + s2 + s2/2, cy + 3.5, 4.5, true, 'center'); T('TÉRMINO', ML + arbW + s2*2 + s2/2, cy + 3.5, 4.5, true, 'center');
      cy += fH;
      ['1º Período', '2º Período', 'Período Extra', '', 'VENCEDOR:'].forEach((p, i) => {
        B(ML + arbW, cy, hW, fH);
        if (i < 3) {
          VL(ML + arbW + s2, cy, fH); VL(ML + arbW + s2*2, cy, fH);
        }
        if (p) T(p, ML + arbW + 1, cy + 3.5, 4.5, true);
        if (p === 'VENCEDOR:') {
          let wn = (data.homeScore!==''&&data.awayScore!=='') ? (Number(data.homeScore)>Number(data.awayScore)?homeTeam.name:Number(data.awayScore)>Number(data.homeScore)?awayTeam.name:'EMPATE') : '';
          T(wn, ML + arbW + 20, cy + 3.5, 6, true);
        }
        cy += fH;
      });

      let cW = wD - arbW - hW;
      let oC = ML + arbW + hW;
      cy = Y;
      B(oC, cy, cW, fH);
      T('CONTAGENS', oC + cW/2, cy + 3.5, 4.5, true, 'center');
      cy += fH;
      ['1º Período', '2º Período', 'Período Extra', 'Penalidades', 'FINAL'].forEach((p, i) => {
        B(oC, cy, cW, fH);
        let s2c = cW * 0.7;
        VL(oC + s2c, cy, fH);
        T(p, oC + 1, cy + 3.5, 4.5, true);
        if (i === 4) {
          let fs = (data.homeScore!==''&&data.awayScore!=='') ? data.homeScore + ' X ' + data.awayScore : 'X';
          T(fs, oC + s2c + (cW-s2c)/2, cy + 4, 6, true, 'center');
        } else {
          T('X', oC + s2c + (cW-s2c)/2, cy + 3.5, 4.5, true, 'center');
        }
        cy += fH;
      });

      doc.setFontSize(4); doc.setTextColor(160,160,160);
      doc.text('Liga de Futsal Escolar — ' + new Date().toLocaleDateString('pt-BR'), half, PH-1, {align:'center'});
      const fileName = \`sumula_\${(game.category||'jogo').replace(/\\s+/g,'_')}_\${(homeTeam.name||'A').split(' ')[0]}_vs_\${(awayTeam.name||'B').split(' ')[0]}.pdf\`;
      doc.save(fileName);
      console.log("PDF finalizado!");
    } catch (err: any) {
      console.error("ERRO GERAL:", err);
      alert("ERRO CRÍTICO AO GERAR: " + (err.message || 'Desconhecido') + "\\nVeja o console (F12).");
    }
  };`;

const path = 'c:\\Users\\Educação\\Downloads\\liga-futsal-escolar-main\\liga-futsal-escolar-main\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('  const generateSumulaPDF = async (sumulaData?: any) => {');
const nextDataLine = content.indexOf('  const DataTable = ({ title, data, columns, onAdd, onEdit, onDelete, onMoveUp, onMoveDown, extraActions }: any) => (');

if (startIdx !== -1 && nextDataLine !== -1) {
  content = content.substring(0, startIdx) + funcContent + '\n\n' + content.substring(nextDataLine);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Admin.tsx function REPLACED via direct substring. Refresh your browser!');
} else {
  console.log('Start index:', startIdx, 'End index:', nextDataLine);
}
