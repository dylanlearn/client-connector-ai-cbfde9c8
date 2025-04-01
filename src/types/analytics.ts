
export type DesignAnalytics = {
  id: string;
  category: string;
  design_option_id: string;
  title: string;
  average_rank: number;
  selection_count: number;
  updated_at: string;
}

export type UserPreference = {
  id: string;
  user_id: string;
  category: string;
  design_option_id: string;
  title: string;
  rank: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
