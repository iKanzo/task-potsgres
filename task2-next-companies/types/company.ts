export interface Company {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  rating: number | null;
  reviews_count: number;
  site: string | null;
  phone: string | null;
}