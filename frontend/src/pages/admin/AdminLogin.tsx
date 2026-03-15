import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/authSlice";
import { Button } from "../../components/admin/ui/Button";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app we would hit an endpoint in CodeIgniter, e.g. /api/auth/login
      // For now we will mock the login simulating the `.env` credentials since CI4 doesn't have a login controller yet.
      
      if (username === "admin" && password === "password123") {
        const fakeToken = "mock_jwt_token_" + Date.now();
        dispatch(loginSuccess(fakeToken));
        navigate("/admin");
      } else if (username === "stefania_admin" && password === "") {
         const fakeToken = "mock_jwt_token_prod_" + Date.now();
         dispatch(loginSuccess(fakeToken));
         navigate("/admin");
      } else {
        throw new Error("Credenziali non valide");
      }

    } catch (err: any) {
      setError(err.message || "Errore di login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary/5 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-primary/10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-brand-primary mb-2">Mastroianni Admin</h2>
          <p className="text-brand-contrast/60">Accedi per gestire il sito</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-contrast mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-brand-contrast/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-transparent"
              placeholder="Inserisci username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-contrast mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-brand-contrast/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-transparent"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </Button>
        </form>
      </div>
    </div>
  );
}
