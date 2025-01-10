interface Note {
  readonly id?: number;
  description: string;
  date: string;
  write_date: string;
  location_id: number;
  readonly created_at?: string;
  readonly updated_at?: string;
  //location?: Location;
}

export { Note };
