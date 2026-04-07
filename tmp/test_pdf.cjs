const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
const PW = 297, PH = 210, ML = 5, MR = 5, MT = 5, MB = 5;
const half = PW / 2;

// Helpers
const B = (x, y, w, h) => doc.rect(x, y, w, h, 'S');
const F = (x, y, w, h, c) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'F'); };
const FB = (x, y, w, h, c) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'FD'); };
const T = (s, x, y, size = 6, bold = false, align = 'left', c = [0,0,0]) => {
  doc.setFontSize(size); 
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setTextColor(...c); 
  doc.text(String(s || ''), x, y, { align });
};
const VL = (x, y, h) => doc.line(x, y, x, y + h);

doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);

// BIG BORDER
B(ML, MT, PW - ML - MR, PH - MT - MB);

let Y = MT;

// ROW 1: Header
let hH = 12;
B(ML, Y, PW-ML-MR, hH);
let hw1 = (PW - ML - MR) * 0.55;
let hw2 = (PW - ML - MR) * 0.25;
let hw3 = (PW - ML - MR) * 0.20;

VL(ML + hw1, Y, hH);
VL(ML + hw1 + hw2, Y, hH);

T('LIGA DE FUTSAL ESCOLAR', ML + hw1/2, Y + 8, 14, true, 'center');
T('Súmula de FUTSAL', ML + hw1 + hw2/2, Y + 8, 10, true, 'center');
// Logo space
FB(ML + hw1 + hw2 + 5, Y + 1, hw3 - 10, hH - 2, [230,230,230]);
T('LOGO LIGA', ML + hw1 + hw2 + hw3/2, Y + 7, 6, true, 'center');

Y += hH;

// ROW 2: Info (Campeonato, Jogo, Horario)
hH = 5;
B(ML, Y, PW-ML-MR, hH);
VL(ML + hw1, Y, hH);
VL(ML + hw1 + hw2, Y, hH);
T('CAMPEONATO:', ML + 1, Y + 3.5, 6, true);
T('Jogo Nº:', ML + hw1 + 1, Y + 3.5, 6, true);
T('Horário:', ML + hw1 + hw2 + 1, Y + 3.5, 6, true);

Y += hH;

// ROW 3: Etapa, Local, Divisao, Fase, Data, Naipe
hH = 5;
B(ML, Y, PW-ML-MR, hH);
let cw = hw1 / 4;
VL(ML + cw, Y, hH);
VL(ML + cw*3, Y, hH);
VL(ML + hw1, Y, hH);
T('Etapa', ML + 1, Y + 3.5, 5, false);
T('LOCAL', ML + cw + 1, Y + 3.5, 5, true);
T('Divisão', ML + cw*3 + 1, Y + 3.5, 5, false);
T('Fase:', ML + hw1 - 15, Y + 3.5, 5, true);

VL(ML + hw1 + hw2, Y, hH);
T('Data:', ML + hw1 + 1, Y + 3.5, 5, true);
T('Naipe:', ML + hw1 + hw2 + 1, Y + 3.5, 5, true);

Y += hH;

// ROW 4: Futsal, Chave, Estado, SC
hH = 5;
B(ML, Y, PW-ML-MR, hH);
VL(ML + cw, Y, hH);
VL(ML + cw*3, Y, hH);
VL(ML + hw1, Y, hH);
T('Futsal', ML + 1, Y + 3.5, 5, true);
T('CHAVE:', ML + cw*3 + 1, Y + 3.5, 5, true);
T('Estado:', ML + hw1 + 1, Y + 3.5, 5, true);
T('PERNAMBUCO', ML + hw1 + hw2 + hw3/2, Y + 3.5, 6, true, 'center');

Y += hH;

// ROW 5: Teams and VS
hH = 9;
B(ML, Y, PW-ML-MR, hH);
// half is middle
let midW = 40; // width of the middle VS block
let teamW = (PW - ML - MR - midW) / 2;
VL(ML + teamW, Y, hH);
VL(PW - MR - teamW, Y, hH);

T('Equipe [A]', ML + 1, Y + 3, 6, true);
T('Saída', ML + 1, Y + 7.5, 5); doc.circle(ML + 10, Y + 6.5, 1);

T('X', half, Y + 6.5, 14, true, 'center');

T('Equipe [B]', PW - MR - teamW + 1, Y + 3, 6, true);
T('Saída', PW - MR - teamW + 1, Y + 7.5, 5); doc.circle(PW - MR - teamW + 10, Y + 6.5, 1);

Y += hH;

// ROW 6: Timeouts
hH = 12;
const drawTO = (sx, teamLbl) => {
  let w = teamW;
  // Box 1: Pedidos de tempo
  B(sx, Y, w * 0.35, hH);
  B(sx, Y, w * 0.35, 4);
  T('Pedidos de Tempo Equipe ' + teamLbl, sx + 1, Y + 3, 5, true);
  T('1º Período', sx + 1, Y + 7, 5); B(sx + 15, Y + 4.5, 18, 3.5);
  T('2º Período', sx + 1, Y + 11, 5); B(sx + 15, Y + 8.5, 18, 3.5);
  
  // Box 2: Kagiva
  B(sx + w * 0.35, Y, w * 0.25, hH);
  T('KAGIVA', sx + w * 0.35 + (w*0.25)/2, Y + 7, 7, true, 'center');

  // Box 3: Faltas
  B(sx + w * 0.6, Y, w * 0.4 + midW/2, hH);
  B(sx + w * 0.6, Y, w * 0.4 + midW/2, 4);
  T('Faltas Acumulativas', sx + w * 0.6 + (w*0.4+midW/2)/2, Y + 3, 5, true, 'center');
  T('1º Período', sx + w * 0.6 + 1, Y + 7, 5);
  for(let i=0; i<5; i++) B(sx + w * 0.6 + 15 + i*7, Y + 4.5, 6, 3.5);
  T('2º Período', sx + w * 0.6 + 1, Y + 11, 5);
  for(let i=0; i<5; i++) B(sx + w * 0.6 + 15 + i*7, Y + 8.5, 6, 3.5);
};

drawTO(ML, '[A]');
drawTO(PW - MR - teamW - midW/2, '[B]');

Y += hH;

const fsData = doc.output();
fs.writeFileSync('layout_test.pdf', fsData, 'binary');
console.log('PDF gen done');
