import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="antialiased font-sans min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-brand-base relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
