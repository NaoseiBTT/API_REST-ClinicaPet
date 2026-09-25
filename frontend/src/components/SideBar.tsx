'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  href: string;
  label: string;
  icon: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { href: '/', label: 'Visão Geral', icon: '📊' },
    { href: '/pacientes', label: 'Pacientes', icon: '🐾' },
    { href: '/tutores', label: 'Tutores', icon: '👤' },
    { href: '/veterinarios', label: 'Veterinários', icon: '🩺' },
    { href: '/clinicas', label: 'Clínicas', icon: '🏥' },
  ];

  return (
    <aside className="relative w-64 text-slate-300 min-h-screen p-4 flex flex-col justify-between shadow-xl select-none shrink-0 border-r border-slate-800 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-90"
        style={{ 
          backgroundImage: "url('https://wallpapers.com/images/hd/total-black-3d-stack-of-blocks-0npbzh8lrt8p1cy2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="absolute inset-0 bg-slate-900/80 z-0" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="bg-teal-500 text-slate-950 px-3 py-2 rounded-sm font-black text-lg shadow-sm">
            HP
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-wide leading-tight">HealPetSystem</h1>
            <p className="text-xs text-teal-400 font-semibold tracking-wider uppercase mt-0.5">Gestão Integrada</p>
          </div>
        </div>

        <nav className="space-y-1" aria-label="Navegação Principal">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border-l-4 border-teal-500 pl-2.5 shadow-sm'
                    : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}