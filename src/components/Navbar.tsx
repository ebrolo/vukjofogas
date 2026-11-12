'use client';

import React from 'react';
import { Plus, Building2, Sparkles, Database } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  isLive: boolean;
  totalListings: number;
}

export function Navbar({ onOpenCreateModal, isLive, totalListings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                Koli Piac
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {totalListings} hirdetés
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Add el és vedd meg a koliban • Nulla regisztráció
            </p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center gap-2.5">
          {/* Cloud vs Local indicator */}
          <div
            title={isLive ? 'Supabase felhő adatbázis aktív' : 'Helyi tároló (állítsd be a Supabase adatokat a .env-ben a megosztáshoz)'}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isLive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <Database className="w-3.5 h-3.5" />
            <span>{isLive ? 'Élő felhő' : 'Helyi demó'}</span>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Hirdetés feladása</span>
            <span className="xs:hidden">Feladás</span>
          </button>
        </div>
      </div>
    </header>
  );
}

