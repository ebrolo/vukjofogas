'use client';

import React, { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-4">
        {/* Demonstration Notice Banner */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300">
          <span className="font-medium">
            Ez a weboldal bemutató célú mintaweboldal, amelyet az E-Brolo fejlesztett.
          </span>
          <span className="hidden sm:inline text-zinc-400">•</span>
          <span className="text-[11px] text-zinc-400">
            This is a preview demonstration website developed by E-Brolo.
          </span>
        </div>

        {/* Copyright and Quick Info */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span>
            © {currentYear}{' '}
            <a
              href="https://ebrolo.hu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              E-Brolo
            </a>
            . Minden jog fenntartva.
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
          <span>Koli Piac • Belső kollégiumi piactér</span>
        </div>
      </div>
    </footer>
  );
}
