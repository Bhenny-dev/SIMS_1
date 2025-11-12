
import { useState, useEffect, useCallback } from 'react';
import { useSync } from '../contexts/SyncContext';

/**
 * A custom React hook to fetch data and keep it synchronized with updates.
 * It prevents state updates on unmounted components to avoid common React errors.
 * Now integrates with SyncContext for enhanced cross-tab and future cross-device sync.
 *
 * @param fetcher A function that returns a promise resolving to the data.
 * @param watchKeys An array of storage keys to watch for changes. Use ['*'] to watch all changes.
 * @returns An object with the fetched data, loading state, and a refetch function.
 */
export function useSyncedData<T>(
    fetcher: () => Promise<T>, 
    watchKeys: string[]
): { data: T | null; loading: boolean; refetch: () => void } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);
    const { syncTransport } = useSync();

    const refetch = useCallback(() => setTrigger(t => t + 1), []);

    const keysDependency = watchKeys.join(',');

    useEffect(() => {
        let isMounted = true;

        const doFetch = async () => {
            if (!isMounted) return;
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

        const unsubscribers = watchKeys.map(key => 
            syncTransport.subscribe(key, doFetch)
        );

        return () => {
            isMounted = false;
            unsubscribers.forEach(unsub => unsub());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keysDependency, trigger, syncTransport]);

    return { data, loading, refetch };
}