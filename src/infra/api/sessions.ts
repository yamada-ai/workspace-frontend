import { ActiveSessionsResponse } from '../../domain/api/SessionInfo';

/**
 * Fetch all currently active sessions from the backend
 * @returns Promise with active sessions data
 */
export async function fetchActiveSessions(): Promise<ActiveSessionsResponse> {
  // Use relative URL by default (works through Nginx), or override with env var for direct access
  const apiUrl = import.meta.env.VITE_API_URL || '';

  try {
    const response = await fetch(`${apiUrl}/api/sessions/active`);

    if (!response.ok) {
      throw new Error(`Failed to fetch active sessions: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    throw error;
  }
}
