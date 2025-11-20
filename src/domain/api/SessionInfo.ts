// API response types for active sessions

export interface SessionInfo {
  session_id: number;
  user_id: number;
  user_name: string;
  work_name: string;
  tier: number;
  icon_id?: number | null;
  start_time: string;
  planned_end: string;
}

export interface ActiveSessionsResponse {
  sessions: SessionInfo[];
}
