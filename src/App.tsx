import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Athletes from "./pages/Athletes";
import Registration from "./pages/Registration";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classificacao" element={<Standings />} />
          <Route path="equipes" element={<Teams />} />
          <Route path="equipes/:id" element={<TeamDetails />} />
          <Route path="atletas" element={<Athletes />} />
          <Route path="inscricao" element={<Registration />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
