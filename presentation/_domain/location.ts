interface Location {
  readonly id?: number;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  emoji: string;
  color: string;
  is_cover_empty: boolean;
  country: string;
  country_code: string;
  local_address: string;
  write_date: string;
  photo_ids?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  //notes?: Note[];
  //lists?: List[];
}

export { Location };
