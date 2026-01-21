'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, TrendingUp, Shield, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/',
      activeColor: 'text-teal-600',
      inactiveColor: 'text-gray-400',
    },
    {
      id: 'trends',
      icon: TrendingUp,
      label: 'Trends',
      path: '/trends',
      activeColor: 'text-purple-600',
      inactiveColor: 'text-gray-400',
    },
    {
      id: 'medical',
      icon: Shield,
      label: 'Medical',
      path: '/sync',
      activeColor: 'text-pink-600',
      inactiveColor: 'text-gray-400',
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/profile',
      activeColor: 'text-yellow-600',
      inactiveColor: 'text-gray-400',
    },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-4 border-teal-300 shadow-2xl z-50">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-teal-100 to-purple-100 scale-110'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? item.activeColor : item.inactiveColor
                  } transition-colors`}
                />
                <span
                  className={`text-xs font-bold ${
                    isActive ? item.activeColor : item.inactiveColor
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-teal-500 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
