import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sponsors from "./Sponsors";
import WhatsAppButton from "./WhatsAppButton";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAdminPage && (
        <>
          <Sponsors />
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}
