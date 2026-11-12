import { createClient } from '@supabase/supabase-js';
import { Listing, NewListingInput } from '@/types/listing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-supabase')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const INITIAL_MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-1',
    title: 'Szarvasi Retro Kávéfőző',
    price: 3500,
    room: '312',
    description: 'Hibátlanul működik, vizsgaidőszak megmentője. Tiszta, azonnal vihető.',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    is_sold: false,
    created_at: '2026-11-12T20:30:00.000Z',
  },
  {
    id: 'mock-2',
    title: 'IKEA forgószék (fekete, karfás)',
    price: 5000,
    room: 'B204',
    description: 'Kényelmes, magassága állítható, kis kopás a szélén, de teljesen egyben van.',
    image_url: 'https://images.unsplash.com/photo-1580481077195-c3a82da91883?w=600&auto=format&fit=crop&q=80',
    is_sold: false,
    created_at: '2026-11-12T18:00:00.000Z',
  },
  {
    id: 'mock-3',
    title: 'Analízis 1 + Fizika 1 jegyzetcsomag',
    price: 0,
    room: '419',
    description: 'Kidolgozott vizsgatételek, kézzel írt tiszta jegyzetek és feladatmegoldások. Ingyen elvihető a héten!',
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    is_sold: false,
    created_at: '2026-11-12T10:00:00.000Z',
  },
  {
    id: 'mock-4',
    title: 'Teflonos melegszendvics sütő',
    price: 2500,
    room: '108',
    description: 'Két szeletes, háromszög mintás. Frissen kitakarítva, működő jelzőfénnyel.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    is_sold: true,
    created_at: '2026-11-11T16:00:00.000Z',
  },
];

const LOCAL_STORAGE_KEY = 'koli_piac_listings';

function getLocalListings(): Listing[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_LISTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LISTINGS));
      return INITIAL_MOCK_LISTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_LISTINGS;
  }
}

function saveLocalListings(listings: Listing[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listings));
  } catch (err) {
    console.error('LocalStorage mentési hiba:', err);
  }
}

export async function fetchListings(): Promise<{ listings: Listing[]; isLive: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase lekérdezési hiba, helyi adatok használata:', error.message);
        return { listings: getLocalListings(), isLive: false };
      }
      return { listings: (data as Listing[]) || [], isLive: true };
    } catch (e) {
      console.warn('Supabase hálózati hiba:', e);
      return { listings: getLocalListings(), isLive: false };
    }
  }

  return { listings: getLocalListings(), isLive: false };
}

export async function createListing(input: NewListingInput): Promise<Listing> {
  const newListing: Listing = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
    title: input.title.trim(),
    price: Number(input.price) || 0,
    room: input.room.trim(),
    description: (input.description || '').trim(),
    image_url: input.image_url || '',
    is_sold: false,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select()
        .single();

      if (!error && data) {
        return data as Listing;
      }
      console.warn('Supabase insert hiba:', error?.message);
    } catch (e) {
      console.warn('Supabase insert kivétel:', e);
    }
  }

  // Fallback helyi tárolóba
  const current = getLocalListings();
  const updated = [newListing, ...current];
  saveLocalListings(updated);
  return newListing;
}

export async function toggleSoldStatus(id: string, newSoldState: boolean): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_sold: newSoldState })
        .eq('id', id);

      if (!error) return true;
      console.warn('Supabase update hiba:', error.message);
    } catch (e) {
      console.warn('Supabase update kivétel:', e);
    }
  }

  // Fallback helyi tárolóba
  const current = getLocalListings();
  const updated = current.map((item) =>
    item.id === id ? { ...item, is_sold: newSoldState } : item
  );
  saveLocalListings(updated);
  return true;
}

export async function deleteListing(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (!error) return true;
      console.warn('Supabase delete hiba:', error.message);
    } catch (e) {
      console.warn('Supabase delete kivétel:', e);
    }
  }

  // Fallback helyi tárolóba
  const current = getLocalListings();
  const updated = current.filter((item) => item.id !== id);
  saveLocalListings(updated);
  return true;
}
