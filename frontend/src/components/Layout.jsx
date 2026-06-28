import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User,
  PackageCheck
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Boxes },
    { name: 'Add Product', path: '/products/new', icon: PlusCircle },
  ];

  const isActive = (path) => {
    if (path === '/products') {
      return location.pathname === '/products' || (location.pathname.startsWith('/products/') && location.pathname !== '/products/new');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between md:hidden shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 text-brand-600 font-semibold">
          <PackageCheck className="h-6 w-6" />
          <span className="text-slate-900 tracking-tight">Syntecxhub</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-500 hover:text-slate-700 focus:outline-none p-1.5 rounded-lg border border-slate-200"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-64 max-w-xs bg-white h-full p-6 flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-brand-600 font-semibold mb-8">
              <PackageCheck className="h-6 w-6" />
              <span className="text-slate-900 tracking-tight">Syntecxhub</span>
            </div>
            
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-brand-50 text-brand-600 border-r-2 border-brand-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-brand-600' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center gap-3 px-3 py-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">{user?.username}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col shrink-0 shadow-subtle">
        <Link to="/dashboard" className="flex items-center gap-2 text-brand-600 font-semibold mb-8">
          <PackageCheck className="h-6.5 w-6.5" />
          <span className="text-slate-900 tracking-tight text-lg">Syntecxhub</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-brand-50 text-brand-600 border-r-2 border-brand-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-150 pt-4 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-700 truncate">{user?.username}</span>
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-5 w-5 text-rose-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header (for user details / title alignment) */}
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 px-8 items-center justify-end shadow-subtle shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded border border-brand-100 font-medium uppercase tracking-wider">
              Internship Workspace
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-sm text-slate-500 font-medium">Logged in as {user?.username}</span>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <React.Suspense fallback={<div className="p-8"><CardSkeleton /></div>}>
              <Outlet />
            </React.Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
