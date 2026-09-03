import { HealthStatus, Playlist, ProgressEvent, LicenseInfo, UserProfile, UsageMetrics } from '../types';

export class ApiClient {
  private baseUrl = '';

  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${this.baseUrl}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }

  async fetchPlaylist(url: string): Promise<Playlist> {
    const res = await fetch(`${this.baseUrl}/api/fetch-playlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = (data.detail && (data.detail.error || data.detail)) || data.error || data.message || 'Failed to fetch playlist';
      throw new Error(errMsg);
    }
    return data;
  }

  async startMerge(payload: {
    url: string;
    selected_indices: number[];
    output_filename?: string;
  }): Promise<{ status: string; job_id: string }> {
    const res = await fetch(`${this.baseUrl}/api/start-merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = (data.detail && (data.detail.error || data.detail)) || data.error || 'Failed to start merge';
      throw new Error(errMsg);
    }
    return data;
  }

  async cancelMerge(): Promise<void> {
    await fetch(`${this.baseUrl}/api/cancel`, { method: 'POST' });
  }

  async openFile(path: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/open-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) throw new Error('Could not open file in media player');
  }

  async openFolder(path: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/open-folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) throw new Error('Could not open folder in system file manager');
  }

  async getLicenseStatus(): Promise<LicenseInfo> {
    const res = await fetch(`${this.baseUrl}/api/license/status`);
    if (!res.ok) throw new Error('Failed to fetch license status');
    return res.json();
  }

  async activateLicense(license_key: string): Promise<LicenseInfo> {
    const res = await fetch(`${this.baseUrl}/api/license/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.detail || 'License activation failed';
      throw new Error(msg);
    }
    return data;
  }

  async deactivateLicense(): Promise<LicenseInfo> {
    const res = await fetch(`${this.baseUrl}/api/license/deactivate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to deactivate license');
    return res.json();
  }

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch(`${this.baseUrl}/api/account/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }

  async getAccountUsage(): Promise<UsageMetrics> {
    const res = await fetch(`${this.baseUrl}/api/account/usage`);
    if (!res.ok) throw new Error('Failed to fetch usage metrics');
    return res.json();
  }

  connectProgress(
    onMessage: (event: ProgressEvent) => void,
    onError?: (err: any) => void
  ): () => void {
    const eventSource = new EventSource(`${this.baseUrl}/api/progress`);

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        onMessage(parsed);
      } catch (err) {
        console.error('Failed to parse SSE JSON payload:', err);
      }
    };

    eventSource.onerror = (e) => {
      if (onError) onError(e);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }
}

export const api = new ApiClient();
