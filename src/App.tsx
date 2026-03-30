import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Athletes from "./pages/Athletes";
import Registration from "./pages/Registration";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";

export default function App() {
  useEffect(() => {
    const raw = localStorage.getItem('lfe_sponsorsOfficial');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const filtered = parsed.filter((s: any) => 
          !s.name?.toUpperCase().includes("BOTICÁRIO") && 
          !s.name?.toUpperCase().includes("BOTICARIO") && 
          !s.name?.toUpperCase().includes("PREFEITURA")
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem('lfe_sponsorsOfficial', JSON.stringify(filtered));
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classificacao" element={<Standings />} />
          <Route path="equipes" element={<Teams />} />
          <Route path="equipes/:id" element={<TeamDetails />} />
          <Route path="atletas" element={<Athletes />} />
          <Route path="galeria" element={<Gallery />} />
          <Route path="inscricao" element={<Registration />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
