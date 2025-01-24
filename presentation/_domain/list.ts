interface List {
  readonly id?: number;
  title: string;
  description?: string;
  emoji: string;
  write_date: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  //locations?: Location[];
}

export { List };
