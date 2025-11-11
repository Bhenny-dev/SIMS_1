
import { useState, useEffect, useCallback } from 'react';

const STORAGE_EVENT_KEY = 'storage-update';

/**
 * A custom React hook to fetch data and keep it synchronized with localStorage updates.
 * It prevents state updates on unmounted components to avoid common React errors.
 *
 * @param fetcher A function that returns a promise resolving to the data.
 * @param watchKeys An array of localStorage keys to watch for changes.
 * @returns An object with the fetched data, loading state, and a refetch function.
 */
export function useSyncedData<T>(
    fetcher: () => Promise<T>, 
    watchKeys: string[]
): { data: T | null; loading: boolean; refetch: () => void } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => setTrigger(t => t + 1), []);

    const keysDependency = watchKeys.join(',');

    useEffect(() => {
        let isMounted = true;

        const doFetch = async () => {
            if (!isMounted) return;
            // Only show a full loading state on the very first fetch.
            // Subsequent fetches are background refreshes and should not trigger a full loading screen.
            if (data === null) {
                setLoading(true);
            }
            try {
                const result = await fetcher();
                if (isMounted) {
                    setData(result);
                }
            } catch (error) {
                 if (isMounted) {
                    console.error("Failed to fetch data in useSyncedData", error);
                 }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        doFetch();

        const handleStorageUpdate = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (watchKeys.includes(detail?.key)) {
                doFetch();
            }
        };

        const handleExternalStorageUpdate = (e: StorageEvent) => {
             if (e.key && watchKeys.includes(e.key)) {
                doFetch();
            }
        }

        window.addEventListener(STORAGE_EVENT_KEY, handleStorageUpdate);
        window.addEventListener('storage', handleExternalStorageUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener(STORAGE_EVENT_KEY, handleStorageUpdate);
            window.removeEventListener('storage', handleExternalStorageUpdate);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keysDependency, trigger]);

    return { data, loading, refetch };
}