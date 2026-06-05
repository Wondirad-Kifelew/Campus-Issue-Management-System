'use client';

import { User, Menu } from 'lucide-react';
import { useAuth } from '@/lib/context';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex-1 lg:flex-none" />
      
      <div className="flex items-center gap-4 sm:gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name || 'Staff'}</p>
          </div>
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
