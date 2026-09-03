export interface VideoClip {
  id: string;
  title: string;
  url: string;
  duration_seconds: number;
  duration_formatted: string;
  thumbnail_url?: string;
  thumbnail?: string;
  width: number;
  height: number;
  fps: number;
  resolution_label: string;
}

export interface Playlist {
  playlist_id: string;
  title: string;
  channel: string;
  webpage_url: string;
  total_duration_seconds: number;
  total_duration_formatted: string;
  thumbnail?: string;
  video_count: number;
  entries: VideoClip[];
}

export type PipelineStatus =
  | 'idle'
  | 'fetching'
  | 'downloading'
  | 'normalizing'
  | 'stitching'
  | 'embedding_chapters'
  | 'done'
  | 'error'
  | 'cancelled';

export interface ProgressEvent {
  status: PipelineStatus;
  current_item: number;
  total_items: number;
  current_video_title: string;
  overall_percent: number;
  message: string;
  output_file?: string;
  error?: string;
}

export interface BinaryItem {
  status: 'ok' | 'missing';
  path?: string;
  version?: string;
}

export interface HealthStatus {
  ffmpeg: BinaryItem;
  ytdlp: BinaryItem;
}

export type LicensePlanTier = 'FREE' | 'PRO' | 'STUDIO';

export interface UserProfile {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  handle: string;
  avatar_url?: string;
  tier?: string;
  created_at: string;
}

export interface ActiveDevice {
  hardware_id: string;
  device_name: string;
  activated_at: string;
  is_current: boolean;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  plan_tier: string;
  max_devices: number;
  active_devices: ActiveDevice[];
}

export interface LicenseInfo {
  status: 'active' | 'expired' | 'unlicensed';
  plan_tier: LicensePlanTier;
  license_key: string | null;
  expires_at: string | null;
  hardware_id: string;
  max_devices: number;
  active_devices: number;
}

export interface UsageMetrics {
  requests_today: number;
  daily_quota: number;
  total_lifetime_merges: number;
  total_minutes_processed: number;
  quota_reset_in_hours: number;
}

export interface HistoryItem {
  id: number;
  job_id: string;
  playlist_title: string;
  playlist_url: string;
  channel_name: string;
  video_count: number;
  duration_seconds: number;
  duration_formatted: string;
  resolution: string;
  output_path: string;
  file_size_bytes: number;
  file_size_formatted: string;
  status: string;
  created_at: string;
  file_exists: boolean;
}

export interface QueueItem {
  id: number;
  playlist_url: string;
  playlist_title: string;
  channel_name: string;
  video_count: number;
  canvas_preset: string;
  crf: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}
