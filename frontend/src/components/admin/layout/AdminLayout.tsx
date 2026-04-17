import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, LayoutList, Image as ImageIcon, MessageSquare, Star, Users, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import { logout } from "../../../store/slices/authSlice";
import { useEffect, useState } from "react";
import { Navbar } from "../../layout/Navbar";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { path: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/admin/services", label: "Servizi", Icon: LayoutList },
  { path: "/admin/events", label: "Eventi", Icon: Calendar },
  { path: "/admin/gallery", label: "Galleria", Icon: ImageIcon },
  { path: "/admin/reviews", label: "Recensioni", Icon: Star },
  { path: "/admin/blog", label: "Blog", Icon: LayoutList },
  { path: "/admin/comments", label: "Commenti Blog", Icon: MessageSquare },
  { path: "/admin/contacts", label: "Messaggi", Icon: MessageSquare },
  { path: "/admin/newsletter", label: "Newsletter", Icon: Users },
  { path: "/admin/bookings", label: "Prenotazioni", Icon: Calendar },
];

export function AdminLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex min-h-screen md:pt-20 bg-brand-primary/5">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-brand-primary/10 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-brand-primary/10">
            <h2 className="font-serif text-2xl text-brand-primary">Mastroianni Admin</h2>
          </div>
          
          <nav className="flex-1 p-4 flex flex-col gap-2">
            {ADMIN_LINKS.map(({ path, label, Icon }) => (
              <Link 
                key={path} 
                to={path} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md transition-colors font-medium",
                  location.pathname === path 
                    ? "bg-brand-primary text-white" 
                    : "text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary"
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-brand-primary/10">
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-brand-contrast/50 hover:text-red-500 rounded-md transition-colors w-full text-left">
              <LogOut size={20} />
              <span className="font-medium">Esci</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <header className="md:hidden bg-white border-b border-brand-primary/10 p-4 flex justify-between items-center sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-brand-primary"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="font-serif text-xl text-brand-primary">Mastroianni Admin</h2>
            </div>
          </header>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-30 bg-white pt-20">
              <nav className="p-6 flex flex-col gap-4">
                {ADMIN_LINKS.map(({ path, label, Icon }) => (
                  <Link 
                    key={path} 
                    to={path} 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl text-lg font-medium transition-colors",
                      location.pathname === path 
                        ? "bg-brand-primary text-white" 
                        : "bg-brand-primary/5 text-brand-primary"
                    )}
                  >
                    <Icon size={24} />
                    <span>{label}</span>
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-xl text-lg font-medium text-red-500 bg-red-50 mt-4"
                >
                  <LogOut size={24} />
                  <span>Esci</span>
                </button>
              </nav>
            </div>
          )}
          
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
