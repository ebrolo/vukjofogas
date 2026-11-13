'use client';

import React, { useState, useEffect } from 'react';
import { DoorClosed, CheckCircle2, RotateCcw, Trash2, Eye, Clock } from 'lucide-react';
import { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  onToggleSold: (id: string, newStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onOpenImage: (imageUrl: string, title: string) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Épp most';
    if (diffMin < 60) return `${diffMin} perce`;
    if (diffHour < 24) return `${diffHour} órája`;
    if (diffDay === 1) return 'Tegnap';
    if (diffDay < 7) return `${diffDay} napja`;
    return new Date(dateString).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
  } catch {
    return 'Nemrég';
  }
}

export function ListingCard({ listing, onToggleSold, onDelete, onOpenImage }: ListingCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [timeLabel, setTimeLabel] = useState<string>('Nemrég');

  useEffect(() => {
    setTimeLabel(formatRelativeTime(listing.created_at));
  }, [listing.created_at]);

  async function handleToggle() {
    try {
      setIsUpdating(true);
      await onToggleSold(listing.id, !listing.is_sold);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(listing.id);
    } finally {
      setIsDeleting(false);
    }
  }

  const isNegotiable = listing.price === -1;
  const isFree = listing.price === 0;

  return (
    <article
      className={`group relative flex flex-col rounded-3xl border transition-all duration-200 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md ${
        listing.is_sold
          ? 'border-zinc-200 dark:border-zinc-800 opacity-70 bg-zinc-50/50 dark:bg-zinc-900/50'
          : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Kép vagy Kép nélküli fejléc */}
      {listing.image_url ? (
        <div
          onClick={() => onOpenImage(listing.image_url!, listing.title)}
          className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              listing.is_sold ? 'grayscale' : ''
            }`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
              <Eye className="w-3.5 h-3.5" /> Nagyítás
            </span>
          </div>

          {/* Elkelt overlay badge ha elkelt */}
          {listing.is_sold && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-zinc-900/90 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
              Elkelt
            </div>
          )}
        </div>
      ) : (
        <div className="px-5 pt-5 pb-1 flex items-center justify-between">
          {listing.is_sold ? (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
              Elkelt
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeLabel}
            </span>
          )}
        </div>
      )}

      {/* Tartalom */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Ár és Szobaszám jelvények */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Ár */}
            {isNegotiable ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold tracking-tight bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
                Megbeszélés alapján
              </span>
            ) : isFree ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                INGYENES
              </span>
            ) : (
              <span className={`text-lg font-black tracking-tight ${listing.is_sold ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {listing.price.toLocaleString('hu-HU')} Ft
              </span>
            )}

            {/* Szobaszám */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <DoorClosed className="w-3.5 h-3.5" />
              {listing.room}-es szoba
            </span>
          </div>

          {/* Cím */}
          <h3
            className={`font-bold text-base sm:text-lg leading-snug tracking-tight ${
              listing.is_sold
                ? 'text-zinc-400 dark:text-zinc-500 line-through'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {listing.title}
          </h3>

          {/* Leírás */}
          {listing.description && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
              {listing.description}
            </p>
          )}
        </div>

        {/* Lábléc / Kezelőgombok */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          {/* Időbélyeg (ha van kép, itt jelenik meg) */}
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeLabel}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Státusz váltó gomb (Elkelt / Visszaállítás) */}
            <button
              onClick={handleToggle}
              disabled={isUpdating}
              title={listing.is_sold ? 'Újra elérhetővé tétel' : 'Megjelölés elkeltként'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                listing.is_sold
                  ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {listing.is_sold ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Visszaállítás</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Elkelt</span>
                </>
              )}
            </button>

            {/* Törlés gomb */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title={confirmDelete ? 'Biztosan törlöd? Kattints újra!' : 'Hirdetés törlése'}
              className={`p-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                confirmDelete
                  ? 'bg-red-500 text-white px-2.5 animate-pulse'
                  : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              {confirmDelete ? (
                <span>Törlés?</span>
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
