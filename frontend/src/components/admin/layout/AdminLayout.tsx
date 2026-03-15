import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, LayoutList, Image as ImageIcon, MessageSquare, Star, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import { logout } from "../../../store/slices/authSlice";
import { useEffect } from "react";
import { Navbar } from "../../layout/Navbar";

export function AdminLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-20 bg-brand-primary/5">
        {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-primary/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-brand-primary/10">
          <h2 className="font-serif text-2xl text-brand-primary">Mastroianni Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/services" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <LayoutList size={20} />
            <span className="font-medium">Servizi</span>
          </Link>
          <Link to="/admin/events" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <Calendar size={20} />
            <span className="font-medium">Eventi</span>
          </Link>
          <Link to="/admin/gallery" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <ImageIcon size={20} />
            <span className="font-medium">Galleria</span>
          </Link>
          <Link to="/admin/reviews" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <Star size={20} />
            <span className="font-medium">Recensioni</span>
          </Link>
          <Link to="/admin/blog" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <LayoutList size={20} />
            <span className="font-medium">Blog</span>
          </Link>
          <Link to="/admin/comments" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <MessageSquare size={20} />
            <span className="font-medium">Commenti Blog</span>
          </Link>
          <Link to="/admin/contacts" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <MessageSquare size={20} />
            <span className="font-medium">Messaggi</span>
          </Link>
          <Link to="/admin/newsletter" className="flex items-center gap-3 p-3 text-brand-contrast/80 hover:bg-brand-primary/5 hover:text-brand-primary rounded-md transition-colors">
            <Users size={20} />
            <span className="font-medium">Newsletter</span>
          </Link>
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
        <header className="md:hidden bg-white border-b border-brand-primary/10 p-4 flex justify-between items-center">
          <h2 className="font-serif text-xl text-brand-primary">Mastroianni Admin</h2>
          <button onClick={handleLogout} className="text-brand-contrast/50">Esci</button>
        </header>
        
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  );
}
