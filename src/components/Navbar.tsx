import { Plus, Home, LogIn, LogOut, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoginModal } from './LoginModal';
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(
    !!localStorage.getItem("access")
  );

  // Sync login state on mount and when storage changes (multi-tab)
  useEffect(() => {
    const updateLoginState = () => {
      setLoggedIn(!!localStorage.getItem("access"));
    };

    updateLoginState();
    window.addEventListener("storage", updateLoginState);

    return () => window.removeEventListener("storage", updateLoginState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false);
    navigate("/"); // go home after logout
  };

  return (
    <>
      <nav className="w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-white font-semibold tracking-tight">
              Pollify
            </span>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-6">

            {/* Home */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Create Poll */}
            {loggedIn && (
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:scale-105"
                onClick={() => navigate("/create")}
              >
                <Plus className="w-4 h-4" />
                <span>Create Poll</span>
              </button>
            )}

            {/* Login / Logout */}
            {!loggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setLoggedIn(true);
          setShowLoginModal(false);
          navigate("/");
        }}
      />
    </>
  );
}
