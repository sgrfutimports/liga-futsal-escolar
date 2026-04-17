import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Athletes from "./pages/Athletes";
import Gallery from "./pages/Gallery";
import TechnicalDepartment from "./pages/TechnicalDepartment";
import ChefesLogin from "./pages/ChefesLogin";
import Registration from "./pages/Registration";
import Admin from "./pages/Admin";
import EnviarElenco from "./pages/EnviarElenco";

export default function App() {
  useEffect(() => {
    const raw = localStorage.getItem('lfe_sponsorsOfficial');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        
        const filtered = parsed.filter((s: any) => {
          const name = s.name?.toUpperCase() || "";
          return !name.includes("BOTICÁRIO") && 
                 !name.includes("BOTICARIO") && 
                 !name.includes("PREFEITURA");
        });

        // Add missing local partners if they don't exist
        const newPartners = [
          { id: 11, name: "IAUPE", logo: "/logos/IAUPE LOGO.jfif" },
          { id: 12, name: "CMA", logo: "/logos/CMA LOGO.jpg" },
          { id: 13, name: "GRE", logo: "/logos/GRE  LOGO.png" }
        ];
        
        let needsUpdate = filtered.length !== parsed.length;
        newPartners.forEach(p => {
          if (!filtered.find((s: any) => s.id === p.id || s.name === p.name)) {
            filtered.push(p);
            needsUpdate = true;
          }
        });

        if (needsUpdate) {
          localStorage.setItem('lfe_sponsorsOfficial', JSON.stringify(filtered));
        }
      } catch (e) { console.error(e); }
    }

    const premium = localStorage.getItem('lfe_sponsorsPremium');
    if (premium) {
      try {
        const parsed = JSON.parse(premium);
        if (!Array.isArray(parsed)) return;

        const updated = parsed.map((s: any) => {
          const name = s.name?.toUpperCase() || "";
          if (name.includes("FERREIRA")) return { ...s, logo: "/logos/FERREIRA_COSTA_LOGO.png" };
          if (name.includes("UNICOMPRA")) return { ...s, logo: "/logos/UNICOMPRA_LOGO.jpg" };
          return s;
        });
        localStorage.setItem('lfe_sponsorsPremium', JSON.stringify(updated));
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
          <Route path="dep-tecnico" element={<TechnicalDepartment />} />
          <Route path="chefes-login" element={<ChefesLogin />} />
          <Route path="inscricao" element={<Registration />} />
          <Route path="enviar-elenco" element={<EnviarElenco />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
