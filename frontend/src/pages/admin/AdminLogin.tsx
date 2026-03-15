import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/authSlice";
import { Button } from "../../components/admin/ui/Button";
import { apiFetch } from "../../lib/api";

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
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: { username, password } as any
      });

      if (response && response.token) {
        dispatch(loginSuccess(response.token));
        navigate("/admin");
      } else {
         throw new Error("Risposta del server non valida");
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
