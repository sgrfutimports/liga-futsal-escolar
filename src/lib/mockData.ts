export const mockTeams = [
  { id: 1, name: "Colégio Santa Sofia", city: "Garanhuns", categories: "Feminino, Masculino Série Ouro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Bras%C3%A3o_Col%C3%A9gio_Santa_Sofia.jpg/200px-Bras%C3%A3o_Col%C3%A9gio_Santa_Sofia.jpg" },
  { id: 2, name: "Escola SESC", city: "Garanhuns", categories: "Masculino Série Ouro", logo: "https://upload.wikimedia.org/wikipedia/pt/b/b8/Logo_sesc.png" },
  { id: 3, name: "Colégio XV de Novembro", city: "Garanhuns", categories: "Masculino Série Prata", logo: "https://via.placeholder.com/150/ff4500/ffffff?text=XV" },
  { id: 4, name: "CMA - Colégio Monsenhor Adelmar", city: "Garanhuns", categories: "Feminino, Masculino Série Prata", logo: "https://via.placeholder.com/150/4169e1/ffffff?text=CMA" },
  { id: 5, name: "Colégio Diocesano", city: "Correntes", categories: "Masculino Série Ouro", logo: "https://via.placeholder.com/150/228b22/ffffff?text=CD" }
];

export const mockAthletes = [
  { id: 1, name: "João Pedro Silva", teamId: 1, team_id: 1, number: "10", category: "Masculino Série Ouro", goals: 5, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Gabriel Santos", teamId: 1, team_id: 1, number: "7", category: "Masculino Série Ouro", goals: 3, photo: "https://randomuser.me/api/portraits/men/44.jpg" },
  { id: 3, name: "Lucas Almeida", teamId: 2, team_id: 2, number: "9", category: "Masculino Série Ouro", goals: 6, photo: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 4, name: "Marcos Vinicius", teamId: 3, team_id: 3, number: "1", category: "Masculino Série Prata", goals: 0, photo: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: 5, name: "Maria Clara", teamId: 4, team_id: 4, number: "10", category: "Feminino", goals: 2, photo: "https://randomuser.me/api/portraits/women/32.jpg" },
  { id: 6, name: "Ana Beatriz", teamId: 1, team_id: 1, number: "9", category: "Feminino", goals: 4, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 7, name: "Matheus Costa", teamId: 5, team_id: 5, number: "5", category: "Masculino Série Ouro", goals: 1, photo: "https://randomuser.me/api/portraits/men/55.jpg" },
];

export const mockGames = [
  { id: 1, date: "2026-05-10", time: "14:00", location: "Ginásio do SESC", homeTeamId: 1, awayTeamId: 2, homeScore: 3, awayScore: 2, status: "Finalizado", category: "Masculino Série Ouro" },
  { id: 2, date: "2026-05-10", time: "15:00", location: "Ginásio do SESC", homeTeamId: 3, awayTeamId: 4, homeScore: 1, awayScore: 1, status: "Finalizado", category: "Masculino Série Prata" },
  { id: 3, date: "2026-05-11", time: "09:00", location: "Ginásio do SESC", homeTeamId: 4, awayTeamId: 1, homeScore: 0, awayScore: 2, status: "Finalizado", category: "Feminino" },
  { id: 4, date: "2026-05-15", time: "14:00", location: "Colégio Diocesano", homeTeamId: 5, awayTeamId: 1, status: "Agendado", category: "Masculino Série Ouro" },
  { id: 5, date: "2026-05-15", time: "16:00", location: "Colégio Diocesano", homeTeamId: 2, awayTeamId: 5, status: "Agendado", category: "Masculino Série Ouro" }
];

export const mockGallery = [
  { id: 1, title: "Final Masculino 2025", url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1920&auto=format&fit=crop" },
  { id: 2, title: "Premiação Destaques", url: "https://images.unsplash.com/photo-1574629810360-7efbb1925536?q=80&w=1920&auto=format&fit=crop" },
  { id: 3, title: "Torcida Vibrante", url: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1920&auto=format&fit=crop" }
];

export const mockRegistrations = [
  { id: 1, school: "Escola Exemplo A", city: "Garanhuns", email: "contato@escolaA.com.br", resp: "Carlos Diretor", status: "Pendente", categories: "Masculino Série Ouro" },
  { id: 2, school: "Colégio Modelo B", city: "Brejão", email: "secretaria@modeloB.edu", resp: "Marta Coord", status: "Pendente", categories: "Feminino" }
];

export const mockTechnicalDocs = [
  { id: 1, title: "Regulamento Oficial 2026", category: "Regulamentos", date: "2026-01-10", size: "1.2 MB", url: "#" },
  { id: 2, title: "Tabela Completa de Jogos", category: "Tabelas", date: "2026-04-01", size: "500 KB", url: "#" },
  { id: 3, title: "Código Disciplinar", category: "Regulamentos", date: "2026-01-15", size: "800 KB", url: "#" }
];
