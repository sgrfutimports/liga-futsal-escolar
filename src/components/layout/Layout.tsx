import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sponsors from "./Sponsors";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Sponsors />
      <Footer />
    </div>
  );
}
