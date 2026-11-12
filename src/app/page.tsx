'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Info,
  Check,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Listing, NewListingInput } from '@/types/listing';
import {
  fetchListings,
  createListing,
  toggleSoldStatus,
  deleteListing,
  isSupabaseConfigured,
  INITIAL_MOCK_LISTINGS,
} from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { CreateListingModal } from '@/components/CreateListingModal';
import { ImageModal } from '@/components/ImageModal';
import { Footer } from '@/components/Footer';

type FilterType = 'all' | 'active' | 'sold' | 'free';
type SortType = 'newest' | 'price-asc' | 'price-desc';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>(INITIAL_MOCK_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('active');
  const [sort, setSort] = useState<SortType>('newest');

  // Modals & UI
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<{ url: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial listings
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchListings();
      setListings(res.listings);
      setIsLive(res.isLive);
      setLoading(false);
    }
    load();
  }, []);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  // Handlers
  async function handleCreateListing(input: NewListingInput) {
    const created = await createListing(input);
    setListings((prev) => [created, ...prev]);
    showToast('Hirdetés sikeresen közzétéve! 🎉');
  }

  async function handleToggleSold(id: string, newStatus: boolean) {
    await toggleSoldStatus(id, newStatus);
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_sold: newStatus } : item))
    );
    showToast(newStatus ? 'Hirdetés megjelölve elkeltként!' : 'Hirdetés újra aktív!');
  }

  async function handleDeleteListing(id: string) {
    await deleteListing(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
    showToast('Hirdetés törölve.');
  }

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.room.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filter === 'active') {
      result = result.filter((item) => !item.is_sold);
    } else if (filter === 'sold') {
      result = result.filter((item) => item.is_sold);
    } else if (filter === 'free') {
      result = result.filter((item) => item.price === 0 && !item.is_sold);
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      // Default: newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [listings, searchQuery, filter, sort]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: listings.length,
      active: listings.filter((i) => !i.is_sold).length,
      sold: listings.filter((i) => i.is_sold).length,
      free: listings.filter((i) => i.price === 0 && !i.is_sold).length,
    };
  }, [listings]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenCreateModal={() => setIsCreateOpen(true)}
        isLive={isLive}
        totalListings={listings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner if in local demo mode */}
        {!isLive && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs sm:text-sm">
            <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                Helyi demó mód aktív (a módosítások a böngésződben tárolódnak)
              </p>
              <p className="text-amber-700/80 dark:text-amber-400/80 text-xs">
                Ha szeretnéd, hogy a kolis csoportban mindenki ugyanazokat a hirdetéseket lássa a Vercelen,
                add meg a <code className="px-1.5 py-0.5 bg-amber-500/15 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> és{' '}
                <code className="px-1.5 py-0.5 bg-amber-500/15 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> értékeket!
                A tábla sémát megtalálod a README-ben.
              </p>
            </div>
          </div>
        )}

        {/* Hero Headline & Quick Pitch */}
        <section className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            VUK Kollégiumi Apróhirdetések
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Feleslegessé vált bútor, konyhai gép, jegyzet vagy kaja a VUK-ban? Add el a folyosón, vagy szerezd be olcsón közvetlenül a szomszéd szobából.
          </p>
        </section>

        {/* Filters, Search & Controls */}
        <section className="space-y-3">
          {/* Top Control Bar: Search + Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés termék, szobaszám vagy leírás szerint..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 shadow-sm transition-all placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Törlés
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 shadow-sm cursor-pointer"
                >
                  <option value="newest">Legújabb elöl</option>
                  <option value="price-asc">Ár szerint: Olcsóbb elöl</option>
                  <option value="price-desc">Ár szerint: Drágább elöl</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilter('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'active'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Elérhető ({counts.active})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Összes ({counts.all})
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'free'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Ingyen elvihető ({counts.free})
            </button>
            <button
              onClick={() => setFilter('sold')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'sold'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Elkelt ({counts.sold})
            </button>
          </div>
        </section>

        {/* Listings Grid */}
        <section>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Hirdetések betöltése...</p>
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onToggleSold={handleToggleSold}
                  onDelete={handleDeleteListing}
                  onOpenImage={(url, title) => setActiveImage({ url, title })}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 px-4 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                  Nincs találat a megadott szűrőkkel
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                  {searchQuery
                    ? `A(z) "${searchQuery}" keresésre nem találtunk hirdetést.`
                    : 'Ebben a kategóriában jelenleg nincs aktív hirdetés.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Szűrők visszaállítása
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <CreateListingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateListing}
      />

      <ImageModal
        isOpen={Boolean(activeImage)}
        imageUrl={activeImage?.url || ''}
        title={activeImage?.title || ''}
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
}
