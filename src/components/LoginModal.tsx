import { useState } from 'react';
import { X, Mail, Lock, User, Github, Chrome } from 'lucide-react';
import { loginUser, registerUser } from '../services/auth';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;  // <-- important for navbar state
};

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // 🚀 Handles Login + Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await loginUser({ email, password });
      } else {
        await registerUser({
          username: name,
          email,
          password,
          role: "voter",
        });

        // auto-login user after sign up
        await loginUser({ email, password });
      }

      onSuccess(); // tells navbar user is logged in
      onClose();   // close modal
    } catch (err: any) {
      console.log(err);
      setError("Invalid credentials or server error.");
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login coming soon! (Demo)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-400 text-sm">
                {mode === 'login'
                  ? 'Sign in to access your polls'
                  : 'Join us and start creating polls'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* ERRORS */}
          {error && (
            <p className="text-red-400 bg-red-400/10 border border-red-400/20 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === "signup" && (
              <div>
                <label className="block text-slate-300 mb-2 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl"
            >
              {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">{mode === "login" ? "Don't have an account?" : "Already have an account?"}</span>{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-400"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
