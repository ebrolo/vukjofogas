export interface Listing {
  id: string;
  title: string;
  price: number; // 0 = Ingyen elvihető
  room: string;
  description: string;
  image_url?: string;
  is_sold: boolean;
  created_at: string;
}

export type NewListingInput = Omit<Listing, 'id' | 'created_at' | 'is_sold'>;

