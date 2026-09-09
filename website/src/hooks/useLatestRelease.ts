import { useState, useEffect } from 'react';
import { fetchLatestRelease } from '@/services/releaseService';
import { STATIC_RELEASE, ReleaseData } from '@/data/release';

interface UseLatestReleaseResult {
  release: ReleaseData;
  loading: boolean;
}

/**
 * React hook that fetches the latest TubeMerger release from the GitHub API.
 * Falls back to static metadata if the API is unavailable.
 * Result is cached in sessionStorage for 15 minutes.
 */
export function useLatestRelease(): UseLatestReleaseResult {
  const [release, setRelease] = useState<ReleaseData>(STATIC_RELEASE);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    fetchLatestRelease()
      .then((data) => {
        if (!cancelled) setRelease(data);
      })
      .catch(() => {
        // Stays on STATIC_RELEASE
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { release, loading };
}
