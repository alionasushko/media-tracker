import { storage } from '@services/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

export const useStorageDownloadUrl = (pathOrUrl?: string | null) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!pathOrUrl) {
        setUrl(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const u = await getDownloadURL(ref(storage, pathOrUrl));
        if (alive) setUrl(u);
      } catch (e) {
        if (alive) setError(e);
        if (alive) setUrl(null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [pathOrUrl]);

  return { url, loading, error };
};
