import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Leaf,
  ShieldCheck,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (account: UserAccount) => void;
}

const STORAGE_USERS_KEY = 'greenspace_user_accounts';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing accounts from localStorage
  const getStoredAccounts = (): Record<string, UserAccount> => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.warn('Could not read user accounts:', err);
    }
    return {};
  };

  const saveStoredAccounts = (accounts: Record<string, UserAccount>) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
    } catch (err) {
      console.warn('Could not save user accounts:', err);
    }
  };

  // Pre-seed sample accounts if storage is empty so user can test immediately
  useEffect(() => {
    const accounts = getStoredAccounts();
    if (Object.keys(accounts).length === 0) {
      const seed: Record<string, UserAccount> = {
        gardener: {
          username: 'gardener',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
      };
      saveStoredAccounts(seed);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError('Please enter your username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    const accounts = getStoredAccounts();
    const userKey = cleanUsername.toLowerCase();

    if (isRegister) {
      // Registration flow
      if (accounts[userKey]) {
        setError('This username is already taken. Please choose another or sign in.');
        return;
      }

      if (confirmPassword && confirmPassword !== password) {
        setError('Passwords do not match. Please re-type your password.');
        return;
      }

      const newAccount: UserAccount = {
        username: cleanUsername,
        password: password,
        createdAt: new Date().toISOString(),
      };

      accounts[userKey] = newAccount;
      saveStoredAccounts(accounts);
      setSuccessMsg('Account created successfully! Logging you in...');

      setTimeout(() => {
        onLoginSuccess(newAccount);
      }, 500);
    } else {
      // Login flow
      const existing = accounts[userKey];
      if (!existing) {
        setError(
          `No account found for "${cleanUsername}". Click "Create Account" below to register this username.`
        );
        return;
      }

      if (existing.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      setSuccessMsg(`Welcome back, ${existing.username}!`);
      setTimeout(() => {
        onLoginSuccess(existing);
      }, 400);
    }
  };

  const handleQuickDemoLogin = (demoUsername: string) => {
    const accounts = getStoredAccounts();
    let account = accounts[demoUsername.toLowerCase()];
    if (!account) {
      account = {
        username: demoUsername,
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      accounts[demoUsername.toLowerCase()] = account;
      saveStoredAccounts(accounts);
    }
    setUsername(account.username);
    setPassword(account.password);
    onLoginSuccess(account);
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="login-modal-card"
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all"
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-6 text-white text-center relative">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-3 shadow-inner">
            <Leaf className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Welcome to GreenSpace
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-xs mx-auto">
            {isRegister
              ? 'Create a new account to unlock your personalized plant saved tab & microclimate history'
              : 'Sign in to access your personal botanical sanctuary and isolated saved remedies'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <button
            type="button"
            id="tab-btn-signin"
            onClick={() => {
              setIsRegister(false);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              !isRegister
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            id="tab-btn-register"
            onClick={() => {
              setIsRegister(true);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isRegister
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              id="login-error-alert"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="login-success-alert"
              className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="auth-username-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-username-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. green_thumb or botanical_jane"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="auth-password-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register mode only) */}
          {isRegister && (
            <div className="space-y-1.5 animate-fadeIn">
              <label
                htmlFor="auth-confirm-password-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Open My Space</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to GreenSpace</span>
              </>
            )}
          </button>

          {/* Help Note on Per-User Saved Tab */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              Each account has its own completely private <strong>Saved tab</strong>. Any remedies, care recipes, or plant notes you bookmark remain uniquely tied to your username.
            </p>
          </div>

          {/* Quick Demo Accounts for effortless testing */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 text-center">
              Quick Switch / Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('gardener')}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer text-center"
              >
                👤 User: <strong>gardener</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('botanist')}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer text-center"
              >
                🌿 User: <strong>botanist</strong>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
