
// This hook has been temporarily disabled as the conflicts table doesn't exist
// If scheduling conflicts functionality is needed, please create the conflicts table first

export interface Conflict {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  created_at: string;
}

export const useConflicts = () => {
  // Returning empty data until conflicts table is created
  return {
    conflicts: [] as Conflict[],
    loading: false,
    addConflict: async () => { throw new Error('Conflicts table not implemented'); },
    updateConflict: async () => { throw new Error('Conflicts table not implemented'); },
    deleteConflict: async () => { throw new Error('Conflicts table not implemented'); },
    refetch: async () => { throw new Error('Conflicts table not implemented'); }
  };
};
