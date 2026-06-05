'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ListTodo, LogOut, X } from 'lucide-react';
import { useAuth } from '@/lib/context';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  // Disable staff menu if user is student
  if (user?.role === 'student') {
    return null;
  }

  const menuItems = [
    { href: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { href: 'staff/issues', label: 'Issues', icon: ListTodo },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    onClose?.();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <div className="w-52 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 leading-tight">
              AAU Students Issue
            </h1>
            <p className="text-xs text-slate-600">Staff Portal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-600 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          MENU
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} onClick={handleNavClick}>
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
}
