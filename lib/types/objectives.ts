export interface Objective {
  id: string;
  title: string;
  goal: number;
  progression: number;
  status: 'completed' | 'in_progress' | 'failed';
  start_date: string;
  end_date: string;
  assignee_id: string;
  created_at: string;
}

export interface ObjectiveResponse {
  data: Objective[] | null;
  error: Error | null;
}
